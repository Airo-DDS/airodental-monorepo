import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // In development, bypass authentication check
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  
  const { userId, has } = await auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL(`https://prereq.xyz/sign-in?redirect_url=${encodeURIComponent(req.nextUrl.href)}`, req.url));
  }
  
  if (!has({permission: "system:docs:access"})) {
    return NextResponse.redirect(new URL('https://prereq.xyz/unauthorized', req.url));
  }
  
  // Allow access if has docs permission
}, {
  signInUrl: 'https://prereq.xyz/sign-in',
  signUpUrl: 'https://prereq.xyz/sign-up',
  isSatellite: true,
  domain: 'prereq.xyz'
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 