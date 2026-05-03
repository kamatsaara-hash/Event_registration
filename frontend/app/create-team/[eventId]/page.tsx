'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Loader2, Copy, Share2, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/navbar';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import { useToast } from '@/components/ui/cyber-toast';
import { teamsAPI, eventsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function CreateTeamPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const { addToast } = useToast();

  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<{ name: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      addToast({ type: 'error', title: 'Please enter a team name' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await teamsAPI.create({ eventId, teamName, teamSize });
      
      // Automatically register for the event
      try {
        await eventsAPI.register(eventId);
      } catch (e: any) {
        if (e?.response?.status !== 400) {
          console.error("Auto-registration failed", e);
        }
      }

      setCreatedTeam({
        name: teamName,
        code: response.data.teamCode,
      });
      addToast({ type: 'success', title: 'Team created successfully!' });
    } catch (error: any) {
      addToast({ 
        type: 'error', 
        title: 'Failed to create team', 
        description: error.response?.data?.detail || 'Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (createdTeam) {
      await navigator.clipboard.writeText(createdTeam.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({ type: 'success', title: 'Team code copied!' });
    }
  };

  const handleShare = async () => {
    if (createdTeam && navigator.share) {
      await navigator.share({
        title: `Join ${createdTeam.name}`,
        text: `Join my team! Use code: ${createdTeam.code}`,
        url: window.location.origin + '/join-team?code=' + createdTeam.code,
      });
    } else {
      handleCopy();
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

          {!createdTeam ? (
            // Create Form
            <div className="glass-panel rounded-xl border border-primary/20 overflow-hidden">
              <div className="h-1 gradient-border" />
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Create Your Team
                  </h1>
                  <p className="text-muted-foreground">
                    You will become the Team Leader
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Team Name
                    </label>
                    <Input
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Team Size (2-6 members)
                    </label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          className={cn(
                            'flex-1 py-3 rounded-lg border transition-all',
                            teamSize === size
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 glow-purple"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Team...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Create Team
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            // Success Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-xl border border-success/30 overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-success via-primary to-success" />
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
                  Team Created!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Share this code with your teammates
                </p>

                {/* Team Info */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Team Name</p>
                  <p className="text-xl font-bold text-foreground mb-4">{createdTeam.name}</p>
                  
                  <p className="text-sm text-muted-foreground mb-1">Team Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-mono font-bold text-primary tracking-wider">
                      {createdTeam.code}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 border-primary/50"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link href="/my-teams">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Go to Team Dashboard
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
