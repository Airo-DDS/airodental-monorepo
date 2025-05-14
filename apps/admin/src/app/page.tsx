import { Button } from '@repo/ui';

export default function AdminPortalPage() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold font-heading mb-6 text-primary">Admin Portal</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Administrative portal for AiroDental platform management.
      </p>
      <div className="border p-6 rounded-lg bg-card max-w-md mx-auto">
        <p className="mb-4">Admin Portal Placeholder</p>
        <Button disabled>Coming Soon</Button>
      </div>
    </div>
  );
}
