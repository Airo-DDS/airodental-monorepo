import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prisma } from '@repo/db';

// Define our own webhook event type for flexibility
interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

// Define specific event data interfaces for better type safety
interface ClerkSubscriptionEventData {
  organization_id: string;
  plan_id: string;
  status: string;
  id: string; // subscription_clerk_id
}

interface ClerkOrganizationEventData {
  id: string;
  name: string;
  slug?: string;
  image_url?: string;
  public_metadata?: Record<string, unknown>;
}

interface ClerkUserEventData {
  id: string;
  email_addresses: Array<{
    id: string;
    email_address: string;
  }>;
  first_name?: string;
  last_name?: string;
  primary_email_address_id?: string;
}

interface ClerkOrganizationMembershipEventData {
  organization: {
    id: string;
  };
  public_user_data: {
    user_id: string;
  };
  role: string;
}

const WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

async function handler(req: Request) {
  if (!WEBHOOK_SIGNING_SECRET) {
    console.error('CLERK_WEBHOOK_SIGNING_SECRET is not set.');
    return NextResponse.json({ error: 'Internal Server Error: Webhook secret not configured.' }, { status: 500 });
  }

  // Get the raw body and headers for verification
  const payload = await req.text();
  const headersList = req.headers;
  const svixHeaders = {
    "svix-id": headersList.get("svix-id") ?? "",
    "svix-timestamp": headersList.get("svix-timestamp") ?? "",
    "svix-signature": headersList.get("svix-signature") ?? ""
  };

  let evt: WebhookEvent;
  try {
    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SIGNING_SECRET);
    
    // wh.verify returns the parsed & verified event object
    const verifiedSvixEvent = wh.verify(payload, svixHeaders) as { type: string; data: Record<string, unknown> };
    
    // Use the verified object directly instead of re-parsing
    evt = {
      type: verifiedSvixEvent.type,
      data: verifiedSvixEvent.data
    };
  } catch (err: unknown) {
    console.error('Error verifying webhook:', err instanceof Error ? err.message : err);
    return NextResponse.json({ 
      error: 'Webhook verification failed', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Received verified webhook event: ${eventType}`, JSON.stringify(evt.data, null, 2));

  const clerkSDK = await clerkClient();

  try {
    switch (eventType) {
      // ---- Organization Subscription Events ----
      case 'organizationSubscription.created':
      case 'organizationSubscription.updated': {
        const data = evt.data as unknown as ClerkSubscriptionEventData;
        const { organization_id, plan_id, status, id: subscription_clerk_id } = data;
        if (!organization_id) {
          console.warn(`Webhook ${eventType} missing organization_id.`);
          return NextResponse.json({ error: 'Missing organization_id' }, { status: 400 });
        }
        const newActivePlanId = (status === 'active' || status === 'trialing') ? plan_id : null;

        // 1. Update Prisma database
        await prisma.organization.update({
          where: { id: organization_id },
          data: { activePlanId: newActivePlanId },
        });
        console.log(`Prisma DB: Org ${organization_id} activePlanId updated to ${newActivePlanId}.`);

        // 2. Update Clerk organization metadata
        await clerkSDK.organizations.updateOrganizationMetadata(organization_id, {
          publicMetadata: {
            airodental_active_plan_id: newActivePlanId,
            airodental_subscription_status: status,
            airodental_clerk_subscription_id: subscription_clerk_id,
          },
        });
        console.log(`Clerk Meta: Org ${organization_id} metadata updated. Plan: ${newActivePlanId}, Status: ${status}.`);
        break;
      }
      case 'organizationSubscription.deleted': {
        const data = evt.data as unknown as ClerkSubscriptionEventData;
        const { organization_id, id: subscription_clerk_id } = data;
        if (!organization_id) {
          console.warn(`Webhook ${eventType} missing organization_id.`);
          return NextResponse.json({ error: 'Missing organization_id' }, { status: 400 });
        }
        
        // 1. Update Prisma database
        await prisma.organization.update({
          where: { id: organization_id },
          data: { activePlanId: null },
        });
        console.log(`Prisma DB: Org ${organization_id} activePlanId set to null.`);

        // 2. Update Clerk organization metadata
        await clerkSDK.organizations.updateOrganizationMetadata(organization_id, {
          publicMetadata: {
            airodental_active_plan_id: null,
            airodental_subscription_status: 'deleted',
            airodental_clerk_subscription_id: subscription_clerk_id,
          },
        });
        console.log(`Clerk Meta: Org ${organization_id} plan metadata nullified.`);
        break;
      }
      // ---- Organization Info Sync ----
      case 'organization.created':
      case 'organization.updated': {
        const data = evt.data as unknown as ClerkOrganizationEventData;
        const { id, name, slug, image_url, public_metadata } = data;
        const organizationId = id;
        if (!organizationId) {
          console.warn(`Webhook ${eventType} missing organization id.`);
          break;
        }

        const initialPlanId = public_metadata?.airodental_active_plan_id as string | undefined || null;
        await prisma.organization.upsert({
          where: { id: organizationId },
          update: { 
            name: name || `Org ${organizationId}`, 
            slug: slug || organizationId, 
            imageUrl: image_url || null 
          },
          create: { 
            id: organizationId, 
            name: name || `Org ${organizationId}`, 
            slug: slug || organizationId, 
            imageUrl: image_url || null, 
            activePlanId: initialPlanId 
          },
        });
        console.log(`Prisma DB: Org ${organizationId} upserted/updated.`);
        break;
      }
      // ---- User Info Sync ----
      case 'user.created':
      case 'user.updated': {
        const data = evt.data as unknown as ClerkUserEventData;
        const { id, email_addresses, first_name, last_name, primary_email_address_id } = data;
        const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
        if (!id || !primaryEmail) {
          console.warn(`Webhook ${eventType} missing user id or primary email.`);
          break;
        }

        await prisma.user.upsert({
          where: { id },
          update: { email: primaryEmail, firstName: first_name, lastName: last_name },
          create: { id, email: primaryEmail, firstName: first_name, lastName: last_name },
        });
        console.log(`Prisma DB: User ${id} upserted/updated.`);
        break;
      }
      // ---- Organization Membership Sync (Roles) ----
      case 'organizationMembership.created':
      case 'organizationMembership.updated': {
        const data = evt.data as unknown as ClerkOrganizationMembershipEventData;
        const { organization, public_user_data, role } = data;
        const organizationId = organization.id;
        const userId = public_user_data.user_id;
        if (!organizationId || !userId || !role) {
          console.warn(`Webhook ${eventType} missing required data: org id, user id, or role.`);
          break;
        }

        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        const orgExists = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (userExists && orgExists) {
          await prisma.organizationMember.upsert({
            where: { userId_organizationId: { userId, organizationId } },
            update: { role },
            create: { userId, organizationId, role },
          });
          console.log(`Prisma DB: Membership for user ${userId} in org ${organizationId} role set to ${role}.`);
        } else {
          console.warn(`Prisma DB: Skipping membership update for user ${userId} in org ${organizationId}: User or Org not found.`);
        }
        break;
      }
      default:
        console.log(`Webhook event type ${eventType} not explicitly handled.`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing webhook event ${eventType}:`, errorMessage);
    // Return 500 to signal Svix to retry if it's a server-side processing error
    return NextResponse.json({ error: `Failed to process event ${eventType}`, details: errorMessage }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventType: eventType }, { status: 200 });
}

export { handler as POST }; 