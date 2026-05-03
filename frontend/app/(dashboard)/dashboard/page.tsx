'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, Users, QrCode, Bell,
  CheckCircle, ArrowRight, Trophy,
  Mail, AlertCircle, ChevronRight
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { eventsAPI, teamsAPI } from '@/lib/api'; // ✅ FIXED (removed userAPI)
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';

interface DashboardData {
  registeredEvents: any[];
  teams: any[];
  notifications: any[];
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // 🔹 Get registrations
      const res = await eventsAPI.getRegisteredEvents();
      const registrations = res.data || [];

      // 🔹 Format events
      const registeredEvents = registrations.map((reg: any) => ({
        id: reg.eventId,
        name: reg.eventName,
        type: 'group',
      }));

      // 🔹 Get teams
      const teams: any[] = [];

      for (const reg of registrations) {
        try {
          const teamRes = await teamsAPI.getMyTeam(reg.eventId);

          if (teamRes.data?.teamId) {
            teams.push({
              id: teamRes.data.teamId,
              name: teamRes.data.teamName,
              eventName: reg.eventName,
              memberCount: teamRes.data.members?.length || 1,
              maxSize: 6,
            });
          }
        } catch {
          // ignore if no team
        }
      }

      setData({
        registeredEvents,
        teams,
        notifications: [],
      });

    } catch (err) {
      console.error("Dashboard error:", err);

      setData({
        registeredEvents: [],
        teams: [],
        notifications: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Loading UI
  if (authLoading || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // 🔹 Stats
  const stats = [
    {
      label: 'Registered Events',
      value: data?.registeredEvents.length || 0,
      icon: Calendar,
    },
    {
      label: 'Teams Joined',
      value: data?.teams.length || 0,
      icon: Users,
    },
    {
      label: 'Email Status',
      value: user?.emailVerified ? 'Verified' : 'Pending',
      icon: user?.emailVerified ? CheckCircle : AlertCircle,
    },
  ];

  return (
    <div className="space-y-10 relative z-10 pb-20">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#3b82f6] pb-1">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Connected to Matrix
          </p>
        </div>
      </motion.div>

      {/* Email warning */}
      <AnimatePresence>
        {!user?.emailVerified && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-xl flex items-center gap-3 text-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">Please verify your email address to unlock all features.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group p-6 rounded-2xl glass-panel border border-[#a855f7]/20 bg-black/40 backdrop-blur-xl overflow-hidden hover:border-[#a855f7]/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#a855f7]/10 text-[#a855f7] ring-1 ring-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Events */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3b82f6]" />
              Registered Events
            </h2>
            <Link href="/events">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {data?.registeredEvents.length ? (
              data.registeredEvents.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={event.id} 
                  className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex justify-between items-center group"
                >
                  <span className="font-medium text-white group-hover:text-[#3b82f6] transition-colors">{event.name}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                </motion.div>
              ))
            ) : (
              <EmptyState
                type="events"
                title="No active registrations"
                description="Explore and register for upcoming matrix events."
              />
            )}
          </div>
        </motion.div>

        {/* Teams */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a855f7]" />
              My Teams
            </h2>
            <Link href="/my-teams">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {data?.teams.length ? (
              data.teams.map((team, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={team.id} 
                  className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex justify-between items-center group"
                >
                  <div>
                    <span className="font-bold text-white block group-hover:text-[#a855f7] transition-colors">{team.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{team.eventName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-sm font-medium">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{team.memberCount}/{team.maxSize}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState
                type="teams"
                title="No team affiliations"
                description="Form a squad or join existing ones for team events."
              />
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}