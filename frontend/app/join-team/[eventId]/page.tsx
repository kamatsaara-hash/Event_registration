'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/navbar';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import { useToast } from '@/components/ui/cyber-toast';
import { teamsAPI, eventsAPI } from '@/lib/api';

export default function JoinTeamPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.eventId as string;
  const prefillCode = searchParams.get('code') || '';
  
  const { addToast } = useToast();
  const [teamCode, setTeamCode] = useState(prefillCode);
  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamCode.trim()) {
      addToast({ type: 'error', title: 'Please enter a team code' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await teamsAPI.join({ eventId, teamCode: teamCode.toUpperCase() });
      
      // Automatically register for the event
      try {
        await eventsAPI.register(eventId);
      } catch (e: any) {
        if (e?.response?.status !== 400) {
          console.error("Auto-registration failed", e);
        }
      }

      setTeamName(response.data.teamName || "Your Team");
      setJoined(true);
      addToast({ type: 'success', title: 'Successfully joined the team!' });
    } catch (error: any) {
      addToast({ 
        type: 'error', 
        title: 'Failed to join team', 
        description: error.response?.data?.detail || 'Please check the code and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      <ParticlesBackground />
      <GlowingOrbs />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          {/* Back Button */}
          <Link href={`/team-options/${eventId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Link>

          {!joined ? (
            // Join Form
            <div className="glass-panel rounded-xl border border-secondary/20 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-secondary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Join a Team
                  </h1>
                  <p className="text-muted-foreground">
                    Enter the team code shared by your teammate
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Team Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Team Code
                    </label>
                    <Input
                      placeholder="Enter 6-character code"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                      className="bg-input border-border text-center text-2xl font-mono tracking-widest uppercase"
                      maxLength={6}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      The code is case-insensitive
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Joining Team...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Team
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    {"Don't have a code?"}{' '}
                    <Link href={`/create-team/${eventId}`} className="text-primary hover:underline">
                      Create your own team
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Success Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-xl border border-success/30 overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-success via-secondary to-success" />
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="h-10 w-10 text-success" />
                </motion.div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {"You're In!"}
                </h1>
                <p className="text-muted-foreground mb-6">
                  Successfully joined the team
                </p>

                {/* Team Info */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Team Name</p>
                  <p className="text-xl font-bold text-foreground">{teamName}</p>
                </div>

                <Link href="/my-teams">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Go to Team Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
