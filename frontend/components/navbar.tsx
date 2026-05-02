'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut, User, LayoutDashboard, Calendar, Users, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
];

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/my-teams', label: 'My Teams', icon: Users },
  { href: '/qr-pass', label: 'QR Pass', icon: QrCode },
];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/participants', label: 'Participants', icon: User },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/teams', label: 'Teams', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: QrCode },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const links = isAuthenticated 
    ? (isAdmin ? adminLinks : userLinks) 
    : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="text-xl font-bold text-glow-purple">
                Neon Event Arena
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary text-glow-purple'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-purple"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm text-foreground">
                      {user?.fullName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 glow-purple"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-primary/20 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {links.map((link) => {
                  const Icon = ('icon' in link ? link.icon : null) as React.ElementType | null;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        pathname === link.href
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      {link.label}
                    </Link>
                  );
                })}
                
                <div className="border-t border-border my-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        Signed in as {user?.fullName}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 w-full"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90 glow-purple">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
