'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, UserCheck, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  totalUsers: number;
  totalTeams: number;
  totalEvents: number;
  totalRegistrations: number;
  usersGrowth: number;
  teamsGrowth: number;
  registrationsGrowth: number;
  topEvents: Array<{ name: string; registrations: number }>;
  recentRegistrations: Array<{ date: string; count: number }>;
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

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAnalytics();
      setData(response.data);
    } catch (error) {
      // Demo data
      setData({
        totalUsers: 523,
        totalTeams: 87,
        totalEvents: 15,
        totalRegistrations: 412,
        usersGrowth: 12.5,
        teamsGrowth: 8.2,
        registrationsGrowth: 24.1,
        topEvents: [
          { name: 'Hackathon Royale', registrations: 85 },
          { name: 'Speed Coding Solo', registrations: 72 },
          { name: 'AI Innovation Cup', registrations: 58 },
          { name: 'Quiz Master Pro', registrations: 45 },
          { name: 'Cyber Security Raid', registrations: 38 },
        ],
        recentRegistrations: [
          { date: 'Mon', count: 12 },
          { date: 'Tue', count: 19 },
          { date: 'Wed', count: 15 },
          { date: 'Thu', count: 28 },
          { date: 'Fri', count: 22 },
          { date: 'Sat', count: 35 },
          { date: 'Sun', count: 18 },
        ],
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

  if (!data) return null;

  const stats = [
    {
      label: 'Total Participants',
      value: data.totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      growth: data.usersGrowth,
    },
    {
      label: 'Total Teams',
      value: data.totalTeams,
      icon: Trophy,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      growth: data.teamsGrowth,
    },
    {
      label: 'Total Events',
      value: data.totalEvents,
      icon: Calendar,
      color: 'text-neon-pink',
      bgColor: 'bg-neon-pink/10',
      growth: 0,
    },
    {
      label: 'Total Registrations',
      value: data.totalRegistrations,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
      growth: data.registrationsGrowth,
    },
  ];

  const maxRegistrations = Math.max(...data.recentRegistrations.map((r) => r.count));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance metrics and insights
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
              {stat.growth !== 0 && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  stat.growth > 0 ? 'text-success' : 'text-destructive'
                )}>
                  {stat.growth > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(stat.growth)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <motion.div variants={item} className="glass-panel rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Registration Trend</h2>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              +{data.registrationsGrowth}%
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {data.recentRegistrations.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.count / maxRegistrations) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-md min-h-[4px]"
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Events */}
        <motion.div variants={item} className="glass-panel rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-6">Top Events</h2>

          <div className="space-y-4">
            {data.topEvents.map((event, index) => {
              const percentage = (event.registrations / data.topEvents[0].registrations) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{event.name}</span>
                    <span className="text-muted-foreground">{event.registrations} registrations</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={cn(
                        'h-full rounded-full',
                        index === 0 ? 'bg-primary' :
                        index === 1 ? 'bg-secondary' :
                        index === 2 ? 'bg-neon-pink' :
                        index === 3 ? 'bg-success' : 'bg-warning'
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
