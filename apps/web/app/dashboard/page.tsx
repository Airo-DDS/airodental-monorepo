import { currentUser, auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui';
import { prisma } from '@repo/db'; // Import Prisma client

// Helper to map plan IDs to display names and features
const PLAN_DETAILS: Record<string, { name: string; features: string[] }> = {
  'cplan_2x5a84PFmhsS4gkfXDqmisAApEn': { name: 'Laine Lite', features: ['Basic Laine AI access'] },
  'cplan_2x5aIIa7rgqhWD6iNsgwz3CyrgU': { name: 'Laine Pro', features: ['Advanced Laine AI access', 'Priority Support'] },
};

async function getOrganizationData(orgId: string) {
  if (!orgId) return null;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { activePlanId: true, name: true, slug: true },
    });
    return organization;
  } catch (error) {
    console.error("Error fetching organization data for dashboard:", error);
    return null;
  }
}

export default async function DashboardPage() {
  // Get auth data and check for authentication
  const { userId, orgId, orgSlug, has } = await auth();
  const user = await currentUser();

  if (!userId) return redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in');
  // Onboarding redirect should be handled by middleware or onboarding page itself if orgId is missing.
  if (!orgId) return redirect(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/onboarding');

  // First check Clerk's auth object for organization metadata
  // Then fallback to Prisma DB if needed
  let activePlanId = null;
  let organizationName = orgSlug || 'Your Practice';
  
  // Get data from database as a fallback
  const organizationData = await getOrganizationData(orgId);
  if (organizationData) {
    organizationName = organizationData.name || organizationName;
    activePlanId = organizationData.activePlanId;
  }
  
  const activePlanDetails = activePlanId ? PLAN_DETAILS[activePlanId] : null;

  // Use Clerk's `has` for Laine access check, based on the 'laine_access' feature
  // This is the most reliable check for determining access
  const hasLaineAccess = has({ feature: 'laine_access' });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
        Welcome to {organizationName}
      </h1>
      <p className="text-muted-foreground mb-6">
        Hello {user?.firstName || user?.emailAddresses[0]?.emailAddress}. Manage your AiroDental services here.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Laine AI Card */}
        <Card>
          <CardHeader>
            <CardTitle>Laine AI Voice Assistant</CardTitle>
            <CardDescription>
              Your HIPAA-compliant AI voice assistant for call flows, appointment scheduling, and insurance intake.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasLaineAccess && activePlanDetails ? (
              <div>
                <p className="text-sm font-semibold text-green-600">Active Plan: {activePlanDetails.name}</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                  {activePlanDetails.features.map(feature => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Streamline your practice with Laine. Choose a plan to get started.
              </p>
            )}
          </CardContent>
          <CardFooter>
            {hasLaineAccess ? (
              <Button asChild className="w-full">
                <a href={`${process.env.NEXT_PUBLIC_LAINE_APP_URL}/dashboard`} target="_blank" rel="noopener noreferrer">
                  Go to Laine Dashboard
                </a>
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/billing">View Laine Plans</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Saige RAG Chatbot Card */}
        <Card>
          <CardHeader>
            <CardTitle>Saige RAG Chatbot</CardTitle>
            <CardDescription>
              AI-powered chat for your practice documents and AiroDental knowledge base. (Non-PHI)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get instant answers and insights. Saige is coming soon!
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
