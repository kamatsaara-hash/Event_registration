'use client';

import { motion } from 'framer-motion';
import { Users, User, Trophy, Zap, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string;
  name: string;
  type: 'solo' | 'group';
  description: string;
  maxTeamSize?: number;
  isRegistered?: boolean;
  onRegister?: () => void;
  isLoading?: boolean;
  requiresAuth?: boolean;
}

export function EventCard({
  name,
  type,
  description,
  maxTeamSize,
  isRegistered,
  onRegister,
  isLoading,
  requiresAuth,
}: EventCardProps) {
  const isSolo = type === 'solo';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative group rounded-xl overflow-hidden',
        'glass-panel border border-primary/20',
        'hover:border-primary/50 hover:glow-purple transition-all duration-300'
      )}
    >
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-border" />
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2.5 rounded-lg',
              isSolo ? 'bg-secondary/20' : 'bg-primary/20'
            )}>
              {isSolo ? (
                <User className="h-5 w-5 text-secondary" />
              ) : (
                <Users className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-glow-purple transition-all">
                {name}
              </h3>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                isSolo 
                  ? 'bg-secondary/20 text-secondary' 
                  : 'bg-primary/20 text-primary'
              )}>
                {isSolo ? 'Solo Event' : 'Team Event'}
              </span>
            </div>
          </div>
          <Trophy className="h-5 w-5 text-warning opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Team Size (for group events) */}
        {!isSolo && maxTeamSize && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Team Size: 2-{maxTeamSize} members</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {isRegistered ? (
            <Button 
              disabled 
              className="w-full bg-success/20 text-success border border-success/30"
            >
              <Check className="h-4 w-4 mr-2" />
              Registered
            </Button>
          ) : requiresAuth ? (
            <Button 
              variant="outline" 
              className="w-full border-primary/50 text-primary hover:bg-primary/10"
            >
              <Lock className="h-4 w-4 mr-2" />
              Login to Register
            </Button>
          ) : (
            <Button
              onClick={onRegister}
              disabled={isLoading}
              className={cn(
                'w-full transition-all',
                isSolo 
                  ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground glow-cyan' 
                  : 'bg-primary hover:bg-primary/90 glow-purple'
              )}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  {isSolo ? 'Register Now' : 'Join Event'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      </div>
    </motion.div>
  );
}
