import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // Import NextResponse

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protects all routes starting with /dashboard
  // '/onboarding(.*)', // Onboarding itself is a special case, not strictly "protected" in the same way
  // Add other routes you want to protect
]);

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/', // Example: landing page
  '/pricing(.*)', // Make pricing page public
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)', // Ensure webhook route is public and not CSRF protected by Clerk
  // Add other public routes like /pricing, /about, etc.
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, orgId } = await auth();

  // Allow webhook requests through
  if (req.nextUrl.pathname.startsWith('/api/webhooks/clerk')) {
    return NextResponse.next();
  }

  // If the user is on the onboarding route, let them proceed
  if (isOnboardingRoute(req)) {
    // If they are signed in but already completed onboarding, the layout will redirect them.
    // If not signed in and trying to access /onboarding, redirect to sign-in.
    if (!userId) {
      const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // If user is not signed in and trying to access a non-public route, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is signed in
  if (userId) {
    // If they haven't completed onboarding, redirect them to /onboarding
    // This check should come before general protected route checks for dashboard etc.
    if (sessionClaims?.metadata?.onboardingComplete !== true) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If onboarding is complete, and they are trying to access a protected route, allow
    if (isProtectedRoute(req)) {
      // If they are on a dashboard route but have no active org, redirect to /onboarding
      // (which might then show OrgSwitcher or CreateOrganization if user onboarding is done)
      // or directly to /dashboard which might handle org selection.
      // For now, if onboardingComplete is true, and they have no orgId,
      // let them go to /dashboard, which should then redirect to /onboarding page
      // if orgId is still missing (as per apps/web/app/dashboard/page.tsx logic).
      // A more direct redirect to an org selection step might be /onboarding if it handles org creation/selection.
      if (req.nextUrl.pathname.startsWith('/dashboard') && !orgId) {
        const orgSelectionUrl = new URL(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/onboarding', req.url);
        orgSelectionUrl.searchParams.set('reason', 'no_active_org');
        return NextResponse.redirect(orgSelectionUrl);
      }
      return NextResponse.next(); // Allow access to protected routes if onboarding is complete
    }
  }
  
  // For any other case (e.g. public routes for authenticated users), allow
  return NextResponse.next();

}, {
  // Primary app configuration
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  // afterSignInUrl and afterSignUpUrl are primarily for Clerk components, middleware handles redirects.
  // Set NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding in .env for new signups.
  
  // Add organization synchronization options for proper organization switching
  organizationSyncOptions: {
    // Define organization-specific URL patterns to ensure organization switching works
    organizationPatterns: ['/dashboard/(.*)'], // Simplified
    // Define personal account URL patterns
    personalAccountPatterns: [] // Assuming no personal accounts for dashboard for now
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
