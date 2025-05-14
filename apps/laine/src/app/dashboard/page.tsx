import { auth, currentUser } from '@clerk/nextjs/server';

export default async function LaineDashboard() {
  const { orgId, orgSlug } = await auth();
  const user = await currentUser();
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Laine AI Dashboard</h1>
      <p className="mt-2 text-lg">Welcome, {user?.firstName} from {orgSlug || 'your practice'} (Org ID: {orgId})</p>
      <p className="mt-4">Laine-specific features and controls will be here.</p>
    </div>
  );
} 