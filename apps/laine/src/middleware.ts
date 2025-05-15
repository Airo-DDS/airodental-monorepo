import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Routes that can be accessed while signed in or signed out
  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route)
  );
  
  // Check if route is public
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Handle authenticated requests
  const { userId, orgId, has } = await auth();
  
  if (userId) {
    // If user doesn't have an organization selected but has organizations,
    // redirect to organization selection
    if (!orgId) {
      const orgSelection = new URL('/dashboard', req.url);
      return NextResponse.redirect(orgSelection);
    }
    
    // If user is in an organization context
    if (orgId) {
      // For dashboard paths, check if they have access to the required plan or feature
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        // Check if the organization has access to Laine plans
        const hasAccess = has({ plan: 'laine_lite' }) || 
                         has({ plan: 'laine_pro' }) ||
                         has({ feature: 'laine_access' });
        
        if (!hasAccess) {
          // Redirect to the web app billing page if they don't have access
          const billingUrl = new URL('https://app.airodental.com/dashboard/billing');
          return NextResponse.redirect(billingUrl);
        }
      }
    }
  } 
  // For non-public routes where the user isn't authenticated, redirect to sign-in
  else {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}, {
  signInUrl: 'https://prereq.xyz/sign-in',
  signUpUrl: 'https://prereq.xyz/sign-up',
  isSatellite: true,
  domain: 'prereq.xyz'
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 