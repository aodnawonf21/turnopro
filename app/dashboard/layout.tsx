'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/logout-button';
import { BusinessInitializer } from '@/components/business-initializer';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/dashboard/calendar', icon: '📅', label: 'Calendario' },
    { href: '/dashboard/appointments', icon: '📋', label: 'Citas' },
    { href: '/dashboard/services', icon: '🛠️', label: 'Servicios' },
    { href: '/dashboard/staff', icon: '👥', label: 'Personal' },
    { href: '/dashboard/horarios', icon: '🕐', label: 'Horarios' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Configuración' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
          TurnoPro
        </Link>
      </div>

      <nav className="p-6 space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="sm:hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );

  if (!isMounted) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <BusinessInitializer />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-black">
            TurnoPro
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
