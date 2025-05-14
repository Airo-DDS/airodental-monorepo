import { Button } from '@repo/ui';
import Link from 'next/link';

export default function DocsPortalPage() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold font-heading mb-6 text-primary">Documentation Portal</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Access all AiroDental product documentation in one place.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border p-6 rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Database Management</h2>
          <p className="mb-4">Learn how to manage database changes, migrations, and deployments.</p>
          <Button asChild>
            <Link href="/db">View Documentation</Link>
          </Button>
        </div>
        <div className="border p-6 rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="mb-4">Additional documentation is being developed.</p>
          <Button disabled>Coming Soon</Button>
        </div>
      </div>
    </div>
  );
}
