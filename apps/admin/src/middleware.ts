import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, has } = await auth();
  
  if (!userId) {
    const webAppSignIn = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-in`, req.url);
    webAppSignIn.searchParams.set('redirect_url', req.nextUrl.href);
    return NextResponse.redirect(webAppSignIn);
  }
  
  if (!has({permission: "system:admin:access"})) {
    const unauthorizedUrl = new URL(
      process.env.NEXT_PUBLIC_WEB_APP_URL 
        ? `${process.env.NEXT_PUBLIC_WEB_APP_URL}/unauthorized` 
        : 'http://localhost:3000/unauthorized', 
      req.url
    );
    return NextResponse.redirect(unauthorizedUrl);
  }
  
  // Allow access if admin
}, {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-in`,
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || `${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-up`,
  isSatellite: true,
  domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN || 'localhost:3000'
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 