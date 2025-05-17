import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(['/']); // Matches the root path only
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']); // Matches /dashboard and its subpaths

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, orgId, has } = await auth();

  if (isPublicRoute(req)) {
    return NextResponse.next(); // Allow access to public landing page
  }

  // For all other routes, user must be authenticated
  if (!userId) {
    const primarySignInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-in`);
    primarySignInUrl.searchParams.set('redirect_url', req.nextUrl.href);
    return NextResponse.redirect(primarySignInUrl);
  }

  // If authenticated but trying to access a protected route like /dashboard
  if (isDashboardRoute(req)) {
    if (!orgId) {
      // If user is authenticated but has no active organization, redirect them to the primary app's dashboard/onboarding.
      // This helps them select or create an organization.
      const primaryAppDashboardUrl = new URL(process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000');
      primaryAppDashboardUrl.pathname = '/dashboard'; // Or '/onboarding'
      primaryAppDashboardUrl.searchParams.set('redirect_reason', 'no_active_org_for_laine');
      return NextResponse.redirect(primaryAppDashboardUrl);
    }

    // User is authenticated and has an active organization, check for Laine access feature
    const hasLaineFeatureAccess = has({ feature: 'laine_access' });

    if (!hasLaineFeatureAccess) {
      // If no Laine access, redirect to the billing page on the primary app
      const billingUrl = new URL(process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000');
      billingUrl.pathname = '/dashboard/billing';
      billingUrl.searchParams.set('upgrade_for_laine', 'true');
      return NextResponse.redirect(billingUrl);
    }
    // If has access, allow through
    return NextResponse.next();
  }

  // For any other authenticated routes in Laine (if any in future) that are not /dashboard
  // and not public, allow by default if authenticated and has org.
  // Add specific checks if needed.
  if (orgId) {
    return NextResponse.next();
  }
  
  // Fallback: if authenticated, has no org, and not a public/dashboard route, redirect to primary app dashboard
  const primaryAppFallbackUrl = new URL(process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000');
  primaryAppFallbackUrl.pathname = '/dashboard';
  return NextResponse.redirect(primaryAppFallbackUrl);

}, {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-in`,
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-up`,
  isSatellite: true,
  domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN || 'localhost:3000'
});

export const config = {
  matcher: [
    // Standard matcher:
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 