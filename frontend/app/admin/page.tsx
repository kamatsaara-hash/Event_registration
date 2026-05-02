'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, Trophy, BarChart3, TrendingUp, 
  ArrowRight, UserCheck, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Analytics {
  totalUsers: number;
  totalTeams: number;
  totalEvents: number;
  totalRegistrations: number;
  recentRegistrations: number;
  activeTeams: number;
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

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      // Demo data
      setAnalytics({
        totalUsers: 523,
        totalTeams: 87,
        totalEvents: 15,
        totalRegistrations: 412,
        recentRegistrations: 28,
        activeTeams: 65,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading analytics..." />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Participants',
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
    },
    {
      label: 'Total Teams',
      value: analytics?.totalTeams || 0,
      icon: Trophy,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+8%',
    },
    {
      label: 'Total Events',
      value: analytics?.totalEvents || 0,
      icon: Calendar,
      color: 'text-neon-pink',
      bgColor: 'bg-neon-pink/10',
      change: '+2',
    },
    {
      label: 'Registrations',
      value: analytics?.totalRegistrations || 0,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+24%',
    },
  ];

  const quickActions = [
    { label: 'View Participants', href: '/admin/participants', icon: Users },
    { label: 'Manage Events', href: '/admin/events', icon: Calendar },
    { label: 'View Teams', href: '/admin/teams', icon: Trophy },
    { label: 'Scan Attendance', href: '/admin/attendance', icon: UserCheck },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin <span className="text-destructive">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Manage events, participants, and track analytics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="glass-panel rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-xl p-4 border border-border hover:border-primary/50 cursor-pointer group"
              >
                <action.icon className="h-8 w-8 text-primary mb-3" />
                <p className="font-medium text-foreground">{action.label}</p>
                <ArrowRight className="h-4 w-4 text-primary mt-2 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="glass-panel rounded-xl border border-border p-6">
          <div className="space-y-4">
            {[
              { text: 'New registration for Hackathon Royale', time: '2 minutes ago', icon: UserCheck },
              { text: 'Team "Code Ninjas" reached full capacity', time: '15 minutes ago', icon: Users },
              { text: 'New participant signed up', time: '1 hour ago', icon: Activity },
              { text: 'Event "Speed Coding Solo" updated', time: '2 hours ago', icon: Calendar },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
