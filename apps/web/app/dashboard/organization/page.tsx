'use client';

import { OrganizationProfile } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';

export default function OrganizationPage() {
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
        <h1 className="text-3xl font-bold mb-8">Organization Settings</h1>
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
      <h1 className="text-3xl font-bold mb-8">Organization Settings</h1>
      
      <div className="mb-8">
        <OrganizationProfile />
      </div>
      
      <div className="mt-8 text-xs text-muted-foreground">
        <p>Note: Organization and subscription settings are managed through your Clerk account.</p>
      </div>
    </div>
  );
} 