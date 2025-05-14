import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId, orgId, orgRole, orgSlug } = await auth();
  const user = await currentUser();

  if (!userId) {
    // This should not happen if middleware is set up correctly,
    // but as a safeguard.
    redirect('/sign-in');
  }

  // In the next phase, we'll check if the user has an org or needs onboarding
  if (!orgId) {
    // If user is signed in but has no active organization,
    // redirect to onboarding or org selection/creation
    redirect('/onboarding');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
      <p>User ID: {userId}</p>
      {orgId && <p>Current Organization ID: {orgId}</p>}
      {orgSlug && <p>Current Organization Slug: {orgSlug}</p>}
      {orgRole && <p>Your Role: {orgRole}</p>}
      <p>This page is protected.</p>
      {/* We will add OrganizationSwitcher and CreateOrganization components here later */}
    </div>
  );
}
