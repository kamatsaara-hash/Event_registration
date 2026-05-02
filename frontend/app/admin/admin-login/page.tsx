'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/auth-card';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { adminLogin } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addToast({ type: 'error', title: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(email, password);

      addToast({ type: 'success', title: 'Admin login successful!' });

      // After successful login, redirect to admin dashboard
      router.push('/admin');

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login failed',
        description: 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">

      {/* Background (non-click blocking) */}
      <div className="pointer-events-none">
        <ParticlesBackground />
        <GlowingOrbs />
      </div>

      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
        footer={
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {"Don't have an account?"}{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>

            {/* ✅ REGULAR LOGIN LINK */}
            <p className="text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link
                href="/login"
                className="text-neon-cyan hover:underline"
              >
                Participant Login
              </Link>
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </motion.div>

        </form>
      </AuthCard>
    </main>
  );
}