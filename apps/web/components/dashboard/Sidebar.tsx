'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@repo/ui';
import { Button } from '@repo/ui';
import {
  Menu,
  LayoutDashboard,
  CreditCard,
  Mic,
  ChevronRight,
  X
} from 'lucide-react';

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  // External links to subdomains - add these once the apps are deployed
  { name: "Laine AI", href: "https://laine.prereq.xyz/dashboard", icon: Mic, external: true },
  // { name: "Saige Chat", href: "https://saige.prereq.xyz/dashboard", icon: MessageSquareText, external: true },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
          <div className="flex-1 overflow-auto py-2 px-4">
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
                    if (!item.external) setIsMobileMenuOpen(false);
                  }}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.name}</span>
                  {item.external && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              ))}
            </nav>
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
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.name}</span>
                {item.external && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
} 