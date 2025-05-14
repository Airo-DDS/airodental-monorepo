'use client';

import { PricingTable } from '@clerk/nextjs';
import { Button } from '@repo/ui';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that&apos;s right for your dental practice. All plans include access to our core features.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <PricingTable forOrganizations={true} />
      </div>
      
      <div className="text-center mt-12">
        <p className="mb-4 text-muted-foreground">
          Already have an account? Access your subscription settings in your dashboard.
        </p>
        <Button asChild>
          <Link href="/dashboard/billing">
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
} 