'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Crown, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/empty-state';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  isLeader: boolean;
}

interface Team {
  id: string;
  name: string;
  eventName: string;
  teamCode: string;
  maxSize: number;
  members: TeamMember[];
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAllTeams();
      setTeams(response.data.teams || []);
    } catch (error) {
      // Demo data
      setTeams([
        {
          id: '1',
          name: 'Code Ninjas',
          eventName: 'Hackathon Royale',
          teamCode: 'ABC123',
          maxSize: 6,
          members: [
            { id: '1', fullName: 'John Doe', email: 'john@example.com', isLeader: true },
            { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', isLeader: false },
            { id: '3', fullName: 'Bob Wilson', email: 'bob@example.com', isLeader: false },
            { id: '4', fullName: 'Alice Johnson', email: 'alice@example.com', isLeader: false },
          ],
        },
        {
          id: '2',
          name: 'Cyber Warriors',
          eventName: 'Cyber Security Raid',
          teamCode: 'XYZ789',
          maxSize: 4,
          members: [
            { id: '5', fullName: 'Charlie Brown', email: 'charlie@example.com', isLeader: true },
            { id: '6', fullName: 'Diana Prince', email: 'diana@example.com', isLeader: false },
          ],
        },
        {
          id: '3',
          name: 'AI Pioneers',
          eventName: 'AI Innovation Cup',
          teamCode: 'DEF456',
          maxSize: 4,
          members: [
            { id: '7', fullName: 'Eve Wilson', email: 'eve@example.com', isLeader: true },
            { id: '8', fullName: 'Frank Miller', email: 'frank@example.com', isLeader: false },
            { id: '9', fullName: 'Grace Lee', email: 'grace@example.com', isLeader: false },
            { id: '10', fullName: 'Henry Ford', email: 'henry@example.com', isLeader: false },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teamCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamStatus = (team: Team) => {
    const count = team.members.length;
    if (count < 2) return { label: 'Waiting', color: 'text-warning bg-warning/10' };
    if (count < team.maxSize) return { label: 'In Progress', color: 'text-secondary bg-secondary/10' };
    return { label: 'Full', color: 'text-success bg-success/10' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Teams</h1>
        <p className="text-muted-foreground">
          View all teams and their members ({teams.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by team name, event, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </div>

      {/* Teams List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          type="teams"
          title="No teams found"
          description={searchQuery ? 'Try adjusting your search' : 'No teams have been created yet'}
        />
      ) : (
        <div className="space-y-4">
          {filteredTeams.map((team) => {
            const status = getTeamStatus(team);
            const isExpanded = expandedTeam === team.id;

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{team.name}</p>
                      <p className="text-sm text-muted-foreground">{team.eventName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-primary">{team.teamCode}</span>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', status.color)}>
                      {status.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {team.members.length}/{team.maxSize}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Team Members</h4>
                        {team.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                          >
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              member.isLeader ? 'bg-primary/20' : 'bg-muted'
                            )}>
                              {member.isLeader ? (
                                <Crown className="h-4 w-4 text-primary" />
                              ) : (
                                <Users className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {member.fullName}
                                {member.isLeader && (
                                  <span className="ml-2 text-xs text-primary">(Leader)</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
