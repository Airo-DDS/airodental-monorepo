import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = await params;
  if (orgId !== id) {
    return NextResponse.json({ error: "Forbidden: You can only access your active organization's data." }, { status: 403 });
  }
  
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        activePlanId: true,
      }
    });
    
    if (!organization) {
      return NextResponse.json({ error: "Organization not found in our records" }, { status: 404 });
    }
    
    return NextResponse.json(organization);

  } catch (error) {
    console.error("Error fetching organization for sidebar:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization data" },
      { status: 500 }
    );
  }
} 