import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId, orgId, has } = await auth();
    
    // If not authenticated or no organization, return 401
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check subscription status
    const subscriptionStatus = {
      // Check Plans
      plans: {
        laine_lite: has({ plan: 'laine_lite' }),
        laine_pro: has({ plan: 'laine_pro' })
      },
      // Check Features
      features: {
        data_export: has({ feature: 'data_export' }),
        laine_access: has({ feature: 'laine_access' }),
        premium_support: has({ feature: 'premium_support' })
      },
      // Check Permissions (if you have any)
      permissions: {
        manage_users: has({ permission: 'org:manage_users' })
      },
      // Basic info
      orgId,
      userId
    };
    
    return NextResponse.json(subscriptionStatus);
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
} 