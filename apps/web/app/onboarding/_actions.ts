'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export async function completeUserOnboarding(
  // formData?: FormData // Add if you have form fields
) {
  const { userId } = await auth(); // Use auth() on server with await

  if (!userId) {
    return { error: 'User not authenticated.' };
  }

  // const displayName = formData?.get('displayName') as string | undefined;

  try {
    const client = await clerkClient(); // Need to await here
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        // ...(displayName && { practiceDisplayName: displayName }), // Example of storing collected data
      },
    });
    return { success: true, message: 'Onboarding completed successfully.' };
  } catch (err: unknown) {
    console.error("Error in completeUserOnboarding action:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { error: errorMessage || 'There was an error updating user metadata.' };
  }
} 