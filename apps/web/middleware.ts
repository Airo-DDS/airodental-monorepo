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
  // Primary app configuration - doesn't need satellite settings
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up'
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
