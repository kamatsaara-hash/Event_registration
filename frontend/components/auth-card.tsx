'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-10 w-10 text-primary" />
          </motion.div>
          <span className="text-2xl font-bold text-glow-purple">
            Neon Event Arena
          </span>
        </Link>

        {/* Card */}
        <div className="glass-panel rounded-2xl border border-primary/20 overflow-hidden">
          {/* Gradient Top */}
          <div className="h-1 gradient-border" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Content */}
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-8 py-4 bg-muted/30 border-t border-border text-center">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
