'use client'; // This page needs to be a client component for form handling

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router
import { completeUserOnboarding } from './_actions'; // Server action
import { Button } from '@repo/ui'; // Assuming Button component from your UI package
import { CreateOrganization, OrganizationSwitcher } from '@clerk/nextjs';

export default function OnboardingPage() {
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Create FormData if your action expects it, or pass data directly
    // For a simple confirmation, FormData might be overkill.
    // const formData = new FormData(event.currentTarget); 

    try {
      const result = await completeUserOnboarding(); // Pass formData if needed
      if (result?.success) {
        await user?.reload(); // Reload user data to get updated session claims
        router.push(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard'); // Redirect to dashboard
      } else {
        setError(result?.error || 'An unknown error occurred.');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage || 'Failed to complete onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Welcome to AiroDental!</h1>
      <p>Please confirm a few details to complete your setup.</p>
      
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h2>Create or Select Your Practice</h2>
        <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
        <OrganizationSwitcher
          hidePersonal={false}
          afterCreateOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
        />
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        {/* Add any simple fields here if desired, e.g.:
        <div>
          <label htmlFor="displayName">Your Name/Role:</label>
          <input type="text" name="displayName" id="displayName" required />
        </div> 
        */}
        <p style={{marginBlock: "1rem"}}>Click below to finalize your account setup.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Complete Setup & Go to Dashboard'}
        </Button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}
      </form>
    </div>
  );
}
