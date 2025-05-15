import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protects all routes starting with /dashboard
  '/onboarding(.*)', // Protects the onboarding route
  // Add other routes you want to protect
]);

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/', // Example: landing page
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Add other public routes like /pricing, /about, etc.
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // If the route is not public and not protected, it's implicitly public.
  // You can add more specific logic if needed.
}, {
  // Primary app configuration
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  
  // Add organization synchronization options for proper organization switching
  organizationSyncOptions: {
    // Define organization-specific URL patterns to ensure organization switching works
    organizationPatterns: [
      '/dashboard/:slug',
      '/dashboard/:slug/(.*)',
      '/dashboard/organization/(.*)'
    ],
    // Define personal account URL patterns
    personalAccountPatterns: [
      '/dashboard/user/(.*)'
    ]
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
