import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, orgId, has } = await auth();
  const url = req.nextUrl;

  if (isDashboardRoute(req)) { // Protecting /dashboard and its sub-paths
    if (!userId) {
      return NextResponse.redirect(new URL(`https://prereq.xyz/sign-in?redirect_url=${encodeURIComponent(url.href)}`, req.url));
    }
    if (!orgId) {
      return NextResponse.redirect(new URL(`https://prereq.xyz/onboarding?redirect_url=${encodeURIComponent(url.href)}`, req.url));
    }
    const hasLaineAccess = has({ feature: 'laine_access_lite' }) || has({ feature: 'laine_access_pro' }) || has({ plan: 'laine_lite' }) || has({ plan: 'laine_pro' });
    if (!hasLaineAccess) {
      return NextResponse.redirect(new URL('https://prereq.xyz/dashboard/billing', req.url));
    }
  }
  // Other routes in Laine app (like '/') are public or handled by page-level checks if needed.
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 