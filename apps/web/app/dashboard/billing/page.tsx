'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui';
import { subscribeToLainePlan } from './actions';
import { Check, ExternalLink } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';

type PlanData = {
  id: string;
  title: string;
  price: string;
  isRecommended?: boolean;
  features: string[];
};

// Plan data for reuse
const plans: PlanData[] = [
  {
    id: 'laine_lite',
    title: 'Laine Lite',
    price: '$49',
    features: [
      'Basic AI Voice Assistant',
      'Up to 100 calls per month',
      'Basic scheduler integration'
    ]
  },
  {
    id: 'laine_pro',
    title: 'Laine Pro',
    price: '$149',
    isRecommended: true,
    features: [
      'Advanced AI Voice Assistant',
      'Unlimited calls',
      'Full PMS/EHR integration',
      'Priority support'
    ]
  }
];

// Function to fetch organization data from our database
async function fetchOrgData(orgId: string) {
  try {
    const response = await fetch(`/api/organizations/${orgId}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}

export default function BillingPage() {
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current subscription data
  useEffect(() => {
    if (organization?.id) {
      setIsLoading(true);
      fetchOrgData(organization.id)
        .then(data => {
          if (data?.activePlanId) {
            setActivePlan(data.activePlanId);
          }
        })
        .catch(err => {
          console.error("Failed to fetch organization data:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [organization?.id]);

  async function handleSubscribe(planId: string) {
    setIsSubmitting(planId);
    setResult(null);
    
    const formData = new FormData();
    formData.append('planId', planId);
    
    try {
      const response = await subscribeToLainePlan(formData);
      setResult(response);
      
      if (response.success) {
        // Update local state to reflect the new subscription
        setActivePlan(planId);
        
        // Give time for the success message to be seen
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setIsSubmitting(null);
    }
  }

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
      
      {result && (
        <div className={`p-4 mb-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {result.message}
        </div>
      )}
      
      {/* Active Subscription Section */}
      {activePlan && (
        <div className="mb-8 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-bold mb-4">Your Active Subscription</h2>
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium mb-1">
                {activePlan === 'laine_lite' ? 'Laine Lite' : 'Laine Pro'}
              </p>
              <p className="text-muted-foreground mb-4">
                {activePlan === 'laine_lite' ? '$49/month' : '$149/month'}
              </p>
              <p>Access your Laine Voice Assistant:</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <a href="https://laine.prereq.xyz/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Launch Laine <ExternalLink size={16} />
                </a>
              </Button>
              {activePlan === 'laine_lite' && (
                <Button onClick={() => handleSubscribe('laine_pro')}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`border rounded-lg p-6 bg-card ${
              plan.isRecommended ? 'border-primary' : ''
            } ${
              activePlan === plan.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
          >
            {plan.isRecommended && (
              <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full inline-block mb-2">RECOMMENDED</div>
            )}
            <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
            <p className="text-2xl font-bold mb-4">{plan.price}<span className="text-base font-normal text-gray-600">/month</span></p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={`${plan.id}-feature-${i}`} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {activePlan === plan.id ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button 
                className="w-full" 
                variant={plan.isRecommended ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isSubmitting !== null}
              >
                {isSubmitting === plan.id ? 'Processing...' : activePlan ? 'Switch Plan' : `Select ${plan.title}`}
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-xs text-muted-foreground">
        <p>Note: This is a mock implementation for demonstration purposes. No actual billing will occur.</p>
      </div>
    </div>
  );
} 