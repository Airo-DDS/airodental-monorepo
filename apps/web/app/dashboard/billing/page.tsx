'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { subscribeToLainePlan } from './actions';
import { Check } from 'lucide-react';

export default function BillingPage() {
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubscribe(planId: string) {
    setIsSubmitting(planId);
    setResult(null);
    
    const formData = new FormData();
    formData.append('planId', planId);
    
    try {
      const response = await subscribeToLainePlan(formData);
      setResult(response);
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setIsSubmitting(null);
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Billing & Plans</h1>
      
      {result && (
        <div className={`p-4 mb-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {result.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Laine Lite Plan */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-bold mb-2">Laine Lite</h2>
          <p className="text-2xl font-bold mb-4">$49<span className="text-sm text-muted-foreground">/month</span></p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Basic AI Voice Assistant</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Up to 100 calls per month</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Basic scheduler integration</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handleSubscribe('laine_lite')}
            disabled={isSubmitting !== null}
          >
            {isSubmitting === 'laine_lite' ? 'Processing...' : 'Select Laine Lite'}
          </Button>
        </div>
        
        {/* Laine Pro Plan */}
        <div className="border rounded-lg p-6 bg-card border-primary">
          <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full inline-block mb-2">RECOMMENDED</div>
          <h2 className="text-xl font-bold mb-2">Laine Pro</h2>
          <p className="text-2xl font-bold mb-4">$149<span className="text-sm text-muted-foreground">/month</span></p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Advanced AI Voice Assistant</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Unlimited calls</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Full PMS/EHR integration</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Priority support</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => handleSubscribe('laine_pro')}
            disabled={isSubmitting !== null}
          >
            {isSubmitting === 'laine_pro' ? 'Processing...' : 'Select Laine Pro'}
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-muted-foreground">
        <p>Note: This is a mock implementation for demonstration purposes. No actual billing will occur.</p>
      </div>
    </div>
  );
} 