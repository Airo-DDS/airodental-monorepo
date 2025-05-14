'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function subscribeToLainePlan(formData: FormData) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error("No organization found. Please create an organization to continue.");
  }
  
  const planId = formData.get('planId') as string;
  
  if (!planId) {
    throw new Error("Plan ID is required");
  }
  
  // In a real implementation, you would:
  // 1. Create Stripe checkout session
  // 2. Redirect user to checkout
  // 3. Handle webhook to confirm payment and update subscription status
  
  // For this mock implementation, we'll just update the org record directly
  try {
    // First check if the organization exists in our database
    const existingOrg = await prisma.organization.findUnique({
      where: { id: orgId }
    });
    
    if (!existingOrg) {
      // Create the organization if it doesn't exist
      await prisma.organization.create({
        data: {
          id: orgId,
          name: 'My Organization', // Default name
          slug: orgId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          activePlanId: planId,
        },
      });
    } else {
      // Update existing organization
      await prisma.organization.update({
        where: { id: orgId },
        data: { activePlanId: planId } as { activePlanId: string },
      });
    }
    
    // Note: We're skipping the Clerk metadata update as it requires additional setup
    // In a production environment, you would need to set up a proper webhook to sync this data
    // For demo purposes, we'll rely on the database state
    
    revalidatePath('/dashboard/billing');
    revalidatePath('/dashboard');
    
    return { success: true, message: `Successfully subscribed to ${planId === 'laine_pro' ? 'Laine Pro' : 'Laine Lite'}` };
  } catch (error) {
    console.error('Error updating organization plan:', error);
    return { success: false, message: 'Failed to update subscription' };
  }
} 