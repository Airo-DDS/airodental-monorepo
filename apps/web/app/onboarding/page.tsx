import { CreateOrganization, OrganizationSwitcher } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in'); // Should be caught by middleware, but good practice
  }

  if (orgId) {
    // If user already has an active organization, redirect to dashboard
    redirect('/dashboard');
  }

  // For now, we'll just show CreateOrganization.
  // Later, we can add logic to show OrganizationList if they have invitations.
  return (
    <div>
      <h1>Onboarding</h1>
      <p>Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
      <p>To continue, please create or select an organization.</p>

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h2>Create a New Practice (Organization)</h2>
        <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
      </div>

      {/*
        We might add <OrganizationList /> here later if the user
        has pending invitations or belongs to orgs but none are active.
        For now, focus on creation.
      */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Switch or Manage Organizations</h2>
        <p>If you&apos;ve been invited to an organization or want to switch, use the switcher below.</p>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
          afterLeaveOrganizationUrl="/onboarding" // Or a different page
        />
      </div>
    </div>
  );
}
