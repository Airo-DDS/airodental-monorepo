# Authentication System Documentation

## Overview

Our ecosystem consists of multiple applications that share a common authentication system using Clerk. The architecture follows a multi-domain satellite approach where one application serves as the primary domain, and other applications function as satellites that connect to the primary domain for authentication.

### Applications Structure

- **Primary Application**: `apps/web` (prereq.xyz)
- **Satellite Applications**:
  - `apps/admin` - Admin panel (admin.prereq.xyz)
  - `apps/laine` - Laine product (laine.prereq.xyz)
  - `apps/docs` - Documentation site (docs.prereq.xyz)

## How Authentication Works

### Multi-Domain Authentication with Clerk

Our system uses Clerk's multi-domain satellite architecture to share authentication across different domains. The primary domain (`apps/web` at prereq.xyz) hosts the authentication state, while satellite domains securely read that state, enabling seamless authentication across all applications.

#### Authentication Flow

1. **Sign-in/Sign-up**: Users must complete both sign-in and sign-up flows on the primary domain (prereq.xyz).
2. **Session Sharing**: Once authenticated on the primary domain, users can navigate to satellite domains without needing to sign in again.
3. **Satellite Authentication**: When a user first visits a satellite application, they are transparently redirected to the primary domain to authenticate, then redirected back to the satellite with an active session.

### Permission System

Our system utilizes Clerk's permissions system to control access to different applications:

- **Admin Access**: Requires the `system:admin:access` permission
- **Docs Access**: Requires the `system:docs:access` permission
- **Laine Access**: Requires one of the following:
  - `laine_lite` plan
  - `laine_pro` plan
  - `laine_access` feature

## Middleware Configuration

Each application has its own middleware configuration that controls authentication and route protection.

### Primary Application (apps/web)

The primary application defines protected and public routes, forcing authentication for protected routes:

```javascript
// apps/web/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
]);

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, {
  // Primary app configuration
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up'
});
```

### Satellite Applications

All satellite applications have similar middleware configurations with satellite-specific settings:

#### Admin Application (apps/admin)

```javascript
// apps/admin/src/middleware.ts
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, has } = await auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL(`https://prereq.xyz/sign-in?redirect_url=${encodeURIComponent(req.nextUrl.href)}`, req.url));
  }
  
  if (!has({permission: "system:admin:access"})) {
    return NextResponse.redirect(new URL('https://prereq.xyz/unauthorized', req.url));
  }
}, {
  signInUrl: 'https://prereq.xyz/sign-in',
  signUpUrl: 'https://prereq.xyz/sign-up',
  isSatellite: true,
  domain: 'prereq.xyz'
});
```

#### Laine Application (apps/laine)

```javascript
// apps/laine/src/middleware.ts
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Public routes logic
  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Permission and plan checks
  const { userId, orgId, has } = await auth();
  
  // Additional organization and permission checks...
}, {
  signInUrl: 'https://prereq.xyz/sign-in',
  signUpUrl: 'https://prereq.xyz/sign-up',
  isSatellite: true,
  domain: 'prereq.xyz'
});
```

#### Docs Application (apps/docs)

```javascript
// apps/docs/src/middleware.ts
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Development bypass
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
}, {
  signInUrl: 'https://prereq.xyz/sign-in',
  signUpUrl: 'https://prereq.xyz/sign-up',
  isSatellite: true,
  domain: 'prereq.xyz'
});
```

## Environment Variable Configuration

### Primary Application (apps/web)

#### Local Development (.env)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### Vercel (Production)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Satellite Applications

#### Local Development (.env)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_IS_SATELLITE=true
NEXT_PUBLIC_CLERK_DOMAIN=localhost:3001  # Adjust port for each satellite app
NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in  # Primary app URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL=http://localhost:3000/sign-up  # Primary app URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### Vercel (Production)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_CLERK_IS_SATELLITE=true
NEXT_PUBLIC_CLERK_DOMAIN=prereq.xyz  # Or appropriate satellite domain
NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://prereq.xyz/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://prereq.xyz/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Running in Development

To test the multi-domain setup locally, you'll need to run each application on a different port:

1. **Primary App (web)**: Usually runs on default port 3000
   ```
   cd apps/web && npm run dev
   ```

2. **Admin App**:
   ```
   cd apps/admin && npm run dev -- -p 3001
   ```

3. **Laine App**:
   ```
   cd apps/laine && npm run dev -- -p 3002
   ```

4. **Docs App**:
   ```
   cd apps/docs && npm run dev -- -p 3003
   ```

Make sure each application has its .env file configured with the correct ports for local development.

## Clerk Dashboard Configuration

To complete the satellite domain setup, you also need to configure the satellite domains in the Clerk Dashboard:

1. Log in to the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to the **Domains** page
3. Select the **Satellites** tab
4. Click **Add satellite domain** and add each satellite domain:
   - admin.prereq.xyz
   - laine.prereq.xyz
   - docs.prereq.xyz

For local development, you should also add your local development domains:
   - localhost:3001
   - localhost:3002
   - localhost:3003

## Root Domain Configuration

In your primary application (`apps/web`), you need to configure the `<ClerkProvider>` component to accept redirects from satellite domains:

```jsx
// apps/web/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider 
          allowedRedirectOrigins={[
            'https://admin.prereq.xyz',
            'https://laine.prereq.xyz',
            'https://docs.prereq.xyz',
            // Local development
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
          ]}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Troubleshooting

### Common Issues

1. **Satellite Application Error - Invalid signInUrl**:
   - Make sure the `signInUrl` is properly configured in both the middleware and environment variables
   - Verify that the `isSatellite` flag is set to `true`
   - Check if the domain is correctly set

2. **Unauthorized Access**:
   - Ensure the user has the required permissions set in Clerk
   - Verify that permission checks in middleware are correctly implemented

3. **Session Not Shared**:
   - Verify that the same Clerk instance (same Publishable and Secret keys) is used across all applications
   - Check if satellite domains are properly configured in Clerk Dashboard

### Debugging

To debug authentication issues, you can enable debug mode in the Clerk middleware:

```javascript
export default clerkMiddleware(
  async (auth, req) => {
    // Your middleware logic
  }, 
  { 
    debug: process.env.NODE_ENV === 'development',
    // Other options...
  }
);
```

## Security Considerations

1. **Cross-Origin Security**: 
   - The `allowedRedirectOrigins` setting in the primary domain's `<ClerkProvider>` is crucial for security, as it prevents redirect attacks.

2. **API Keys Protection**:
   - Always use environment variables to store your Clerk API keys
   - Never commit these keys to version control

3. **Permission Management**:
   - Regularly audit user permissions in Clerk Dashboard
   - Use the most restrictive permissions necessary for each application

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Clerk Multi-Domain Authentication](https://clerk.com/docs/deployments/shared-domain-auth) 