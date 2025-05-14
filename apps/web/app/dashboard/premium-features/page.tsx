'use client';

import { Protect } from '@clerk/nextjs';
import { Button } from '@repo/ui';
import { useState } from 'react';
import Link from 'next/link';

export default function PremiumFeaturesPage() {
  const [demoResult, setDemoResult] = useState<string | null>(null);

  // Simulate a premium feature action
  const handlePremiumAction = () => {
    setDemoResult('Premium feature activated! This would typically perform an exclusive action.');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Premium Features</h1>
      
      {/* Using Clerk's Protect component to restrict access */}
      <Protect 
        plan="laine_pro"
        fallback={
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-amber-700 mb-2">Pro Plan Required</h2>
            <p className="text-amber-700 mb-4">
              This section requires a Pro subscription to access. Upgrade your plan to unlock premium features.
            </p>
            <Button asChild>
              <Link href="/dashboard/billing">Upgrade Now</Link>
            </Button>
          </div>
        }
      >
        <div className="bg-card p-6 border rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Pro Feature: Advanced Analytics</h2>
          <p className="mb-6">
            As a Pro subscriber, you have access to advanced analytics and reporting tools.
            This premium feature provides deeper insights into your dental practice performance.
          </p>
          <Button onClick={handlePremiumAction}>
            Run Advanced Analysis
          </Button>
          
          {demoResult && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              {demoResult}
            </div>
          )}
        </div>
      </Protect>
      
      {/* Feature that requires the 'data_export' feature */}
      <Protect 
        feature="data_export"
        fallback={
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Data Export Feature Required</h2>
            <p className="text-slate-700">
              The data export feature requires a specific subscription. Please contact support for more information.
            </p>
          </div>
        }
      >
        <div className="bg-card p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Export Patient Data</h2>
          <p className="mb-6">
            Export your patient data in various formats for integration with other systems.
          </p>
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </Protect>
    </div>
  );
} 