'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, User, Search, Filter, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/event-card';
import { Navbar } from '@/components/navbar';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import { EmptyState } from '@/components/empty-state';
import { Loader, SkeletonCard } from '@/components/ui/loader';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';
import { eventsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  name: string;
  type: 'solo' | 'group';
  description: string;
  maxTeamSize?: number;
  isRegistered?: boolean;
}

type FilterType = 'all' | 'solo' | 'group';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;

    // Filter by type
    if (filter !== 'all') {
      result = result.filter((event) => event.type === filter);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [events, filter, searchQuery]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.events || []);
    } catch (error) {
      // For demo, show sample events when API is not available
      setEvents(getSampleEvents());
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string, eventType: 'solo' | 'group') => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (eventType === 'group') {
      router.push(`/team-options/${eventId}`);
      return;
    }

    setRegisteringId(eventId);
    try {
      await eventsAPI.register(eventId);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, isRegistered: true } : event
        )
      );
      addToast({ type: 'success', title: 'Registered successfully!' });
    } catch (error) {
      addToast({ type: 'error', title: 'Registration failed', description: 'Please try again.' });
    } finally {
      setRegisteringId(null);
    }
  };

  const groupEvents = filteredEvents.filter((e) => e.type === 'group');
  const soloEvents = filteredEvents.filter((e) => e.type === 'solo');

  return (
    <main className="min-h-screen relative">
      <ParticlesBackground />
      <GlowingOrbs />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Event</span>{' '}
            <span className="text-primary text-glow-purple">Showcase</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of hackathons, competitions, and challenges.
            Register solo or build your dream team.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'solo', 'group'] as FilterType[]).map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                onClick={() => setFilter(type)}
                className={cn(
                  filter === type
                    ? 'bg-primary hover:bg-primary/90'
                    : 'border-border hover:bg-muted'
                )}
              >
                {type === 'all' && <Filter className="h-4 w-4 mr-2" />}
                {type === 'solo' && <User className="h-4 w-4 mr-2" />}
                {type === 'group' && <Users className="h-4 w-4 mr-2" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            type="events"
            title="No events found"
            description={searchQuery ? 'Try adjusting your search query' : 'Check back later for upcoming events'}
            action={searchQuery ? { label: 'Clear Search', onClick: () => setSearchQuery('') } : undefined}
          />
        ) : (
          <>
            {/* Group Events Section */}
            {(filter === 'all' || filter === 'group') && groupEvents.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Group Events
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({groupEvents.length} events)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EventCard
                        {...event}
                        onRegister={() => handleRegister(event.id, event.type)}
                        isLoading={registeringId === event.id}
                        requiresAuth={!isAuthenticated}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Solo Events Section */}
            {(filter === 'all' || filter === 'solo') && soloEvents.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Solo Events
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({soloEvents.length} events)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soloEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EventCard
                        {...event}
                        onRegister={() => handleRegister(event.id, event.type)}
                        isLoading={registeringId === event.id}
                        requiresAuth={!isAuthenticated}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// Sample events for demo
function getSampleEvents(): Event[] {
  return [
    // Group Events
    { id: '1', name: 'Hackathon Royale', type: 'group', description: 'Build innovative solutions in 24 hours. Compete with the best teams.', maxTeamSize: 6 },
    { id: '2', name: 'Robo Wars', type: 'group', description: 'Design and battle robots in the ultimate arena showdown.', maxTeamSize: 4 },
    { id: '3', name: 'Code Clash Arena', type: 'group', description: 'Team-based competitive programming challenges.', maxTeamSize: 3 },
    { id: '4', name: 'Startup Sprint', type: 'group', description: 'Launch a startup idea in 48 hours with your team.', maxTeamSize: 5 },
    { id: '5', name: 'Gaming Squad Battle', type: 'group', description: 'Esports tournament featuring popular competitive games.', maxTeamSize: 5 },
    { id: '6', name: 'Treasure Hunt X', type: 'group', description: 'Solve puzzles and find hidden treasures across campus.', maxTeamSize: 4 },
    { id: '7', name: 'Design Domination', type: 'group', description: 'UI/UX design competition for creative teams.', maxTeamSize: 3 },
    { id: '8', name: 'AI Innovation Cup', type: 'group', description: 'Build AI-powered solutions for real-world problems.', maxTeamSize: 4 },
    { id: '9', name: 'Debate Titans Team', type: 'group', description: 'Team debate competition on technology ethics.', maxTeamSize: 3 },
    { id: '10', name: 'Cyber Security Raid', type: 'group', description: 'Capture the flag cybersecurity challenge.', maxTeamSize: 4 },
    // Solo Events
    { id: '11', name: 'Speed Coding Solo', type: 'solo', description: 'Race against time to solve algorithmic challenges.' },
    { id: '12', name: 'Quiz Master Pro', type: 'solo', description: 'Test your knowledge across tech, science, and more.' },
    { id: '13', name: 'UI Design Challenge', type: 'solo', description: 'Create stunning UI designs in a limited time.' },
    { id: '14', name: 'Chess Blitz', type: 'solo', description: 'Fast-paced chess tournament for strategic minds.' },
    { id: '15', name: 'Idea Pitch Solo', type: 'solo', description: 'Pitch your innovative idea to a panel of judges.' },
  ];
}
