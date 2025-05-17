'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@repo/ui';
import { Button } from '@repo/ui';
import {
  Menu,
  LayoutDashboard,
  CreditCard,
  Mic,
  ChevronRight,
  X,
  Building,
  Star
} from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';
import type { LucideIcon } from 'lucide-react';
import { UserAccountNav } from './UserAccountNav';

// Define types for navigation items
type BaseNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type ExternalNavItem = BaseNavItem & {
  external: true;
  requiredPlans: string[];
};

type NavItem = BaseNavItem | ExternalNavItem;

// Define Laine plan IDs that grant access
const LAINE_PLAN_IDS = [
  'cplan_2x5a84PFmhsS4gkfXDqmisAApEn', // Laine Lite
  'cplan_2x5aIIa7rgqhWD6iNsgwz3CyrgU', // Laine Pro
];

// Base navigation items always shown
const baseNavigationItems: BaseNavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  { name: "Organization", href: "/dashboard/organization", icon: Building },
  { name: "Premium Features", href: "/dashboard/premium-features", icon: Star },
];

// Items that require subscription
const subscriptionItems: ExternalNavItem[] = [
  { 
    name: "Laine AI", 
    href: `${process.env.NEXT_PUBLIC_LAINE_APP_URL || 'https://laine.prereq.xyz'}/dashboard`,
    icon: Mic, 
    external: true,
    requiredPlans: LAINE_PLAN_IDS
  },
  // Add more subscription-based items as needed
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

// Helper function to check if an item is external
function isExternalItem(item: NavItem): item is ExternalNavItem {
  return 'external' in item && item.external === true;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { organization } = useOrganization();
  const [navigationItems, setNavigationItems] = useState<NavItem[]>(baseNavigationItems);
  
  // Fetch subscription data when the component mounts or org changes
  useEffect(() => {
    if (organization?.id) {
      fetchOrgData(organization.id).then(orgDbData => {
        const currentNavItems = [...baseNavigationItems];
        if (orgDbData?.activePlanId && LAINE_PLAN_IDS.includes(orgDbData.activePlanId)) {
          // Add Laine AI link if a Laine plan is active
          const laineNavItem = subscriptionItems.find(item => item.name === "Laine AI");
          if (laineNavItem) {
            currentNavItems.push(laineNavItem);
          }
        }
        setNavigationItems(currentNavItems);
      });
    } else {
      setNavigationItems(baseNavigationItems); // Reset if no org
    }
  }, [organization?.id]);
  
  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          className="block md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="font-semibold">AiroDental</div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2 px-4 flex flex-col">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5"
                  )}
                  onClick={() => {
                    if (!isExternalItem(item)) setIsMobileMenuOpen(false);
                  }}
                  target={isExternalItem(item) ? "_blank" : undefined}
                  rel={isExternalItem(item) ? "noopener noreferrer" : undefined}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.name}</span>
                  {isExternalItem(item) && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              ))}
            </nav>
            
            {/* Account navigation in mobile view */}
            <div className="mt-auto pt-4">
              <UserAccountNav />
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full w-64 flex-col border-r bg-background", className)}>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="text-xl font-bold">AiroDental</div>
          </div>
          <nav className="mt-5 flex-1 px-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5"
                )}
                target={isExternalItem(item) ? "_blank" : undefined}
                rel={isExternalItem(item) ? "noopener noreferrer" : undefined}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.name}</span>
                {isExternalItem(item) && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            ))}
          </nav>
          
          {/* User Account Navigation */}
          <UserAccountNav />
        </div>
      </div>
    </>
  );
} 