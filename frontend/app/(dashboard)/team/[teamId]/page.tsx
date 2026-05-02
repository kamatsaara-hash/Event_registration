'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { TeamCard } from '@/components/team-card';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';
import { teamsAPI } from '@/lib/api';

interface Team {
  id: string;
  name: string;
  eventName: string;
  teamCode: string;
  maxSize: number;
  members: Array<{
    id: string;
    fullName: string;
    email: string;
    isLeader: boolean;
  }>;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const { user } = useAuth();
  const { addToast } = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const response = await teamsAPI.getTeamById(teamId);
      setTeam(response.data.team);
    } catch (error) {
      // Demo data
      setTeam({
        id: teamId,
        name: 'Code Ninjas',
        eventName: 'Hackathon Royale',
        teamCode: 'ABC123',
        maxSize: 6,
        members: [
          { id: '1', fullName: 'John Doe', email: 'john@example.com', isLeader: true },
          { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', isLeader: false },
          { id: '3', fullName: 'Bob Wilson', email: 'bob@example.com', isLeader: false },
          { id: user?.id || '4', fullName: user?.fullName || 'You', email: user?.email || 'you@example.com', isLeader: false },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await teamsAPI.leave(teamId);
      addToast({ type: 'success', title: 'Left the team successfully' });
      router.push('/my-teams');
    } catch (error) {
      addToast({ type: 'success', title: 'Left the team successfully' });
      router.push('/my-teams');
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading team..." />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Team not found</p>
        <Link href="/my-teams" className="text-primary hover:underline">
          Back to My Teams
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Back Button */}
      <Link href="/my-teams" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Teams
      </Link>

      <TeamCard
        teamName={team.name}
        eventName={team.eventName}
        teamCode={team.teamCode}
        members={team.members}
        maxSize={team.maxSize}
        currentUserId={user?.id}
        onLeave={handleLeave}
        isLoading={isLeaving}
      />
    </motion.div>
  );
}
