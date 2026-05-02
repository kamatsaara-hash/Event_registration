'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { PageLoader } from '@/components/ui/loader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin/admin-login')) return;

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, isAdmin, router, pathname]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (pathname.startsWith('/admin/admin-login')) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:pt-0 pt-16">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
