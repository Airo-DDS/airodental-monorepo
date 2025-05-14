import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, has } = await auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL(`https://prereq.xyz/sign-in?redirect_url=${encodeURIComponent(req.nextUrl.href)}`, req.url));
  }
  
  if (!has({permission: "system:admin:access"})) {
    return NextResponse.redirect(new URL('https://prereq.xyz/unauthorized', req.url));
  }
  
  // Allow access if admin
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 