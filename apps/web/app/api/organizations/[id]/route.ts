import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { auth } from "@clerk/nextjs/server";

// Updated type for Next.js 15 API handler
type RouteContextParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContextParams
) {
  try {
    const { userId, orgId, has } = await auth();
    
    // If not authenticated, return 401
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if the requested org ID matches the current context
    if (orgId && context.params.id !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get the organization from our database
    const organization = await prisma.organization.findUnique({
      where: { id: context.params.id },
      select: {
        id: true,
        name: true,
        slug: true,
        activePlanId: true,
      }
    });
    
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    
    // Add subscription data from Clerk
    const subscriptionData = {
      hasLaineLite: has({ plan: 'laine_lite' }),
      hasLainePro: has({ plan: 'laine_pro' }),
      hasDataExport: has({ feature: 'data_export' }),
    };
    
    return NextResponse.json({
      ...organization,
      subscriptionData
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
} 