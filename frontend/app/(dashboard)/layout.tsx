'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PageLoader } from '@/components/ui/loader';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Navbar } from '@/components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 safer route checks
  const isAuthPage =
    pathname.includes('/login') ||
    pathname.includes('/signup');

  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    if (isLoading) return;

    // 🚫 NEVER redirect auth pages
    if (isAuthPage) return;

    // 🚫 NEVER redirect admin pages
    if (isAdminPage) return;

    // 🔐 protect only dashboard
    if (!isAuthenticated) {
      router.push('/login');
    }

  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) return <PageLoader />;

  // 🚫 no layout for public/admin
  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 min-h-screen lg:pt-0 pt-16">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}