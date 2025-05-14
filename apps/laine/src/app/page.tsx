import Link from 'next/link';
import { Button } from '@repo/ui';

export default function LaineLandingPage() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-5xl font-bold font-heading mb-6 text-primary">Meet Laine AI</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        The revolutionary AI Voice Assistant designed to streamline your dental practice operations,
        handle calls, schedule appointments, and integrate seamlessly with your workflow.
      </p>
      <div className="space-x-4">
        <Link href="/dashboard"><Button size="lg">Access Your Laine Dashboard</Button></Link>
        <Link href="https://prereq.xyz#features">
          <Button size="lg" variant="outline">Learn More on AiroDental</Button>
        </Link>
      </div>
    </div>
  );
}
