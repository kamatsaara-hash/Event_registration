'use client';

import { motion } from 'framer-motion';
import { Inbox, Search, Users, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type EmptyStateType = 'default' | 'search' | 'teams' | 'events' | 'error';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const icons = {
  default: Inbox,
  search: Search,
  teams: Users,
  events: Calendar,
  error: AlertCircle,
};

const defaults = {
  default: {
    title: 'No data found',
    description: 'There is nothing to display at the moment.',
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
  teams: {
    title: 'No teams yet',
    description: 'Create or join a team to get started.',
  },
  events: {
    title: 'No events available',
    description: 'Check back later for upcoming events.',
  },
  error: {
    title: 'Something went wrong',
    description: 'An error occurred while loading the data.',
  },
};

export function EmptyState({
  type = 'default',
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  const Icon = icons[type];
  const defaultContent = defaults[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center mb-6',
          type === 'error' ? 'bg-destructive/10' : 'bg-primary/10'
        )}
      >
        <Icon className={cn(
          'w-10 h-10',
          type === 'error' ? 'text-destructive' : 'text-primary'
        )} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        {title || defaultContent.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-sm mb-6"
      >
        {description || defaultContent.description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action.onClick}
            className="bg-primary hover:bg-primary/90 glow-purple"
          >
            {action.label}
          </Button>
        </motion.div>
      )}

      {children}
    </motion.div>
  );
}
