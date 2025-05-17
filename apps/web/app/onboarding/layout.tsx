import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'; // Use 'next/navigation'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth(); // Use auth() on server with await

  // If user has completed onboarding, redirect them from /onboarding to dashboard
  if (sessionClaims?.metadata?.onboardingComplete === true) {
    redirect(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard');
  }

  return <>{children}</>;
} 