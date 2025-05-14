'use client';

import { 
  UserButton, 
  OrganizationSwitcher,
  useUser,
  useOrganization
} from '@clerk/nextjs';
import { Building, User } from 'lucide-react';

export function UserAccountNav() {
  const { user } = useUser();
  const { organization } = useOrganization();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border-t mt-auto pt-4 px-3">
      {/* Organization Section */}
      <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground">
        <Building className="h-4 w-4" />
        <div className="flex-1 truncate">
          <p className="font-medium text-foreground">
            {organization?.name || 'Personal Account'}
          </p>
        </div>
        <OrganizationSwitcher 
          hidePersonal={false}
          appearance={{
            elements: {
              rootBox: "flex",
              organizationSwitcherTrigger: "block p-0 m-0 h-8 w-8 rounded-md focus:outline-none",
            }
          }}
        />
      </div>
      
      {/* User Section */}
      <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <div className="flex-1 truncate">
          <p className="font-medium text-foreground">
            {user.fullName || user.username || user.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <UserButton 
          appearance={{
            elements: {
              rootBox: "flex",
              userButtonTrigger: "block p-0 m-0 h-8 w-8 rounded-md focus:outline-none",
            }
          }}
        />
      </div>
    </div>
  );
} 