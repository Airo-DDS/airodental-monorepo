'use client';

import { PricingTable } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Button } from '@repo/ui';
import { ExternalLink } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';

export default function BillingPage() {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (organization) {
      setIsLoading(false);
    }
  }, [organization]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Billing & Plans</h1>
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2" />
                  <div className="h-4 bg-gray-200 rounded col-span-1" />
                </div>
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Billing & Plans</h1>
      
      <div className="mb-8">
        <PricingTable forOrganizations={true} />
      </div>
      
      <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-medium text-blue-700 mb-2">Manage Your Organization</h2>
        <p className="text-blue-700 mb-4">
          Visit the Organization Settings page to manage your team members, billing details, and subscription settings.
        </p>
        <Button asChild variant="outline">
          <a href="/dashboard/organization" className="text-blue-700">
            Organization Settings
          </a>
        </Button>
      </div>
      
      <div className="mt-8">
        <Button asChild variant="outline">
          <a href="https://laine.prereq.xyz/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            Launch Laine <ExternalLink size={16} />
          </a>
        </Button>
      </div>
      
      <div className="mt-8 text-xs text-muted-foreground">
        <p>Note: Organization billing is managed through your Clerk account.</p>
      </div>
    </div>
  );
} 