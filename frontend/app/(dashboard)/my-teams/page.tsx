'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamCard } from '@/components/team-card';
import { EmptyState } from '@/components/empty-state';
import { Loader, SkeletonCard } from '@/components/ui/loader';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';
import { teamsAPI, eventsAPI } from '@/lib/api';

interface Team {
  id: string;
  name: string;
  eventName: string;
  eventId: string;
  teamCode: string;
  maxSize: number;
  members: Array<{
    id: string;
    fullName: string;
    email: string;
    isLeader: boolean;
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

export default function MyTeamsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leavingTeamId, setLeavingTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await eventsAPI.getRegisteredEvents();
      const registrations = res.data || [];
      const userTeams: Team[] = [];

      for (const reg of registrations) {
        try {
          const teamRes = await teamsAPI.getMyTeam(reg.eventId);

          if (teamRes.data?.teamId) {
            userTeams.push({
              id: teamRes.data.teamId,
              name: teamRes.data.teamName,
              eventName: reg.eventName,
              eventId: reg.eventId,
              teamCode: teamRes.data.teamCode,
              maxSize: 6,
              members: teamRes.data.members || []
            });
          }
        } catch {
          // ignore if no team for this event
        }
      }
      setTeams(userTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    setLeavingTeamId(teamId);
    try {
      await teamsAPI.leave(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      addToast({ type: 'success', title: 'Left the team successfully' });
    } catch (error) {
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      addToast({ type: 'success', title: 'Left the team successfully' });
    } finally {
      setLeavingTeamId(null);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Teams</h1>
          <p className="text-muted-foreground">
            Manage your team memberships and view team details
          </p>
        </div>
        <Link href="/events">
          <Button className="bg-primary hover:bg-primary/90 glow-purple">
            <Plus className="h-4 w-4 mr-2" />
            Join Event
          </Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          type="teams"
          title="No teams yet"
          description="Join a group event and create or join a team to compete"
          action={{
            label: 'Browse Events',
            onClick: () => {},
          }}
        >
          <Link href="/events" className="mt-4">
            <Button variant="outline" className="border-primary/50">
              <ArrowRight className="h-4 w-4 mr-2" />
              Explore Group Events
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <motion.div key={team.id} variants={item}>
              <TeamCard
                teamName={team.name}
                eventName={team.eventName}
                teamCode={team.teamCode}
                members={team.members}
                maxSize={team.maxSize}
                currentUserId={user?.id}
                onLeave={() => handleLeaveTeam(team.id)}
                isLoading={leavingTeamId === team.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
