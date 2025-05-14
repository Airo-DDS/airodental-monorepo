import { Button } from '@repo/ui';

export default function DocsPortalPage() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold font-heading mb-6 text-primary">Documentation Portal</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Access all AiroDental product documentation in one place.
      </p>
      <div className="border p-6 rounded-lg bg-card max-w-md mx-auto">
        <p className="mb-4">Documentation Portal Placeholder</p>
        <Button disabled>Coming Soon</Button>
      </div>
    </div>
  );
}
