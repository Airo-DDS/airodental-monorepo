'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function subscribeToLainePlan(formData: FormData) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error("No organization found. Please create an organization to continue.");
  }
  
  const planId = formData.get('planId') as string;
  
  if (!planId) {
    throw new Error("Plan ID is required");
  }
  
  // In a real implementation, you would:
  // 1. Create Stripe checkout session
  // 2. Redirect user to checkout
  // 3. Handle webhook to confirm payment and update subscription status
  
  // For this mock implementation, we'll just update the org record directly
  try {
    await prisma.organization.update({
      where: { id: orgId },
      data: { activePlanId: planId } as { activePlanId: string },
    });
    
    revalidatePath('/dashboard/billing');
    revalidatePath('/dashboard');
    
    return { success: true, message: `Successfully subscribed to ${planId === 'laine_pro' ? 'Laine Pro' : 'Laine Lite'}` };
  } catch (error) {
    console.error('Error updating organization plan:', error);
    return { success: false, message: 'Failed to update subscription' };
  }
} 