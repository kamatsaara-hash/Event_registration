'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, QrCode, Bell, CheckCircle, Clock, 
  ArrowRight, Trophy, Mail, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { userAPI, eventsAPI, teamsAPI } from '@/lib/api';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';

interface DashboardData {
  registeredEvents: Array<{
    id: string;
    name: string;
    type: 'solo' | 'group';
    date?: string;
  }>;
  teams: Array<{
    id: string;
    name: string;
    eventName: string;
    memberCount: number;
    maxSize: number;
  }>;
  notifications: Array<{
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, teamsRes] = await Promise.all([
        eventsAPI.getRegisteredEvents(),
        teamsAPI.getMyTeams(),
      ]);
      setData({
        registeredEvents: eventsRes.data.events || [],
        teams: teamsRes.data.teams || [],
        notifications: [],
      });
    } catch (error) {
      // Demo data
      setData({
        registeredEvents: [
          { id: '1', name: 'Hackathon Royale', type: 'group' },
          { id: '2', name: 'Speed Coding Solo', type: 'solo' },
        ],
        teams: [
          { id: '1', name: 'Code Ninjas', eventName: 'Hackathon Royale', memberCount: 4, maxSize: 6 },
        ],
        notifications: [
          { id: '1', message: 'Welcome to Neon Event Arena!', read: false, createdAt: new Date().toISOString() },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const stats = [
    {
      label: 'Registered Events',
      value: data?.registeredEvents.length || 0,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Teams Joined',
      value: data?.teams.length || 0,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Notifications',
      value: data?.notifications.filter(n => !n.read).length || 0,
      icon: Bell,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Email Status',
      value: user?.emailVerified ? 'Verified' : 'Pending',
      icon: user?.emailVerified ? CheckCircle : AlertCircle,
      color: user?.emailVerified ? 'text-success' : 'text-warning',
      bgColor: user?.emailVerified ? 'bg-success/10' : 'bg-warning/10',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-primary text-glow-purple">{user?.fullName?.split(' ')[0]}</span>
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your events and teams.
        </p>
      </motion.div>

      {/* Email Verification Banner */}
      {!user?.emailVerified && (
        <motion.div
          variants={item}
          className="glass-panel rounded-xl p-4 border border-warning/30 flex items-center gap-4"
        >
          <Mail className="h-6 w-6 text-warning" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Verify your email</p>
            <p className="text-sm text-muted-foreground">Please verify your email to access all features.</p>
          </div>
          <Button variant="outline" className="border-warning/50 text-warning hover:bg-warning/10">
            Resend Email
          </Button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="glass-panel rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/events">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-4 border border-primary/20 hover:border-primary/50 cursor-pointer group"
            >
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium text-foreground mb-1">Browse Events</h3>
              <p className="text-sm text-muted-foreground">Find and register for events</p>
              <ArrowRight className="h-4 w-4 text-primary mt-3 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>

          <Link href="/my-teams">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-4 border border-secondary/20 hover:border-secondary/50 cursor-pointer group"
            >
              <Users className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-medium text-foreground mb-1">My Teams</h3>
              <p className="text-sm text-muted-foreground">Manage your team memberships</p>
              <ArrowRight className="h-4 w-4 text-secondary mt-3 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>

          <Link href="/qr-pass">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-4 border border-neon-pink/20 hover:border-neon-pink/50 cursor-pointer group"
            >
              <QrCode className="h-8 w-8 text-neon-pink mb-3" />
              <h3 className="font-medium text-foreground mb-1">QR Pass</h3>
              <p className="text-sm text-muted-foreground">View your entry passes</p>
              <ArrowRight className="h-4 w-4 text-neon-pink mt-3 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Registered Events */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Registered Events</h2>
          <Link href="/events" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {data?.registeredEvents && data.registeredEvents.length > 0 ? (
          <div className="space-y-3">
            {data.registeredEvents.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ x: 4 }}
                className="glass-panel rounded-lg p-4 flex items-center gap-4"
              >
                <div className={cn(
                  'p-2 rounded-lg',
                  event.type === 'solo' ? 'bg-secondary/20' : 'bg-primary/20'
                )}>
                  <Trophy className={cn(
                    'h-5 w-5',
                    event.type === 'solo' ? 'text-secondary' : 'text-primary'
                  )} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{event.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{event.type} Event</p>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Registered</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="events"
            title="No registered events"
            description="Browse events and register to get started"
            action={{ label: 'Browse Events', onClick: () => {} }}
          />
        )}
      </motion.div>

      {/* Teams */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">My Teams</h2>
          <Link href="/my-teams" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {data?.teams && data.teams.length > 0 ? (
          <div className="space-y-3">
            {data.teams.slice(0, 3).map((team) => (
              <Link key={team.id} href={`/team/${team.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="glass-panel rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{team.name}</p>
                    <p className="text-sm text-muted-foreground">{team.eventName}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {team.memberCount}/{team.maxSize} members
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            type="teams"
            title="No teams yet"
            description="Create or join a team to compete in group events"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
