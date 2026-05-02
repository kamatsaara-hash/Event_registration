'use client';

import { motion } from 'framer-motion';
import { Users, Crown, Copy, Share2, UserPlus, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  isLeader: boolean;
}

interface TeamCardProps {
  teamName: string;
  eventName: string;
  teamCode: string;
  members: TeamMember[];
  maxSize: number;
  currentUserId?: string;
  onLeave?: () => void;
  isLoading?: boolean;
}

export function TeamCard({
  teamName,
  eventName,
  teamCode,
  members,
  maxSize,
  currentUserId,
  onLeave,
  isLoading,
}: TeamCardProps) {
  const [copied, setCopied] = useState(false);
  const filledSlots = members.length;
  const remainingSlots = maxSize - filledSlots;
  const isTeamFull = filledSlots >= maxSize;
  const currentUserIsLeader = members.find(m => m.id === currentUserId)?.isLeader;

  const getStatus = () => {
    if (filledSlots < 2) return { label: 'Waiting for members', color: 'text-warning' };
    if (filledSlots < maxSize) return { label: 'In Progress', color: 'text-secondary' };
    return { label: 'Team Full', color: 'text-success' };
  };

  const status = getStatus();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Join ${teamName}`,
        text: `Join my team for ${eventName}! Use code: ${teamCode}`,
        url: window.location.origin + '/join-team?code=' + teamCode,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl border border-primary/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground text-glow-purple">
              {teamName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Event: {eventName}
            </p>
          </div>
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', status.color, 'bg-muted')}>
            <div className={cn('w-2 h-2 rounded-full animate-pulse', 
              status.label === 'Team Full' ? 'bg-success' : 
              status.label === 'In Progress' ? 'bg-secondary' : 'bg-warning'
            )} />
            {status.label}
          </div>
        </div>

        {/* Team Code */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
            <span className="text-xs text-muted-foreground">Code:</span>
            <span className="font-mono font-bold text-primary">{teamCode}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="border-primary/50 hover:bg-primary/10"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="border-secondary/50 hover:bg-secondary/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Members */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Team Members</h4>
          <span className="text-sm text-muted-foreground">
            {filledSlots}/{maxSize} slots filled
          </span>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                member.isLeader ? 'bg-primary/20' : 'bg-secondary/20'
              )}>
                {member.isLeader ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <Users className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {member.fullName}
                  {member.isLeader && (
                    <span className="ml-2 text-xs text-primary">(Leader)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </motion.div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: remainingSlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Waiting for member...</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!currentUserIsLeader && currentUserId && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onLeave}
              disabled={isLoading}
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Leave Team
            </Button>
          </div>
        )}

        {isTeamFull && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <Lock className="h-4 w-4 text-success" />
            <span className="text-sm text-success">Team is full - No more members can join</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
