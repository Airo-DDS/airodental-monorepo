import { currentUser, auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui';

export default async function DashboardPage() {
  const { orgId, orgSlug, has } = await auth();
  const organization = orgId ? { slug: orgSlug } : null;
  const user = await currentUser();

  if (!user) return redirect('/sign-in');
  if (!orgId) return redirect('/onboarding');

  const hasLainePlan = has({ feature: 'laine_access_lite' }) || has({ feature: 'laine_access_pro' }) || has({ plan: 'laine_lite' }) || has({ plan: 'laine_pro' });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
        Welcome to {organization?.slug || 'Your Practice'}
      </h1>
      <p className="text-muted-foreground mb-6">
        Hello {user.firstName || user.emailAddresses[0]?.emailAddress}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-lg font-medium mb-2">Laine AI Voice Assistant</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Access your AI-powered voice assistant.
          </p>
          {hasLainePlan ? (
            <a href="https://laine.prereq.xyz/dashboard" target="_blank" rel="noopener noreferrer">
              <Button className="w-full">Use Laine</Button>
            </a>
          ) : (
            <Link href="/dashboard/billing">
              <Button variant="outline" className="w-full">Subscribe to Access Laine</Button>
            </Link>
          )}
        </div>
        {/* Saige Card Placeholder */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 opacity-50">
          <h3 className="tracking-tight text-lg font-medium mb-2">Saige RAG Chatbot</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Coming soon.
          </p>
           <Button className="w-full" disabled>Coming Soon</Button>
        </div>
      </div>
    </div>
  );
}
