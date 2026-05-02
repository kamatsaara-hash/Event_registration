'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, UserPlus, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import Link from 'next/link';

export default function TeamOptionsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  return (
    <main className="min-h-screen relative">
      <ParticlesBackground />
      <GlowingOrbs />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back Button */}
          <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <Users className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Join the Competition
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose how you want to participate in this team event
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Team */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel rounded-xl border border-primary/20 hover:border-primary/50 p-6 cursor-pointer group"
              onClick={() => router.push(`/create-team/${eventId}`)}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Create Team
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start a new team and become the Team Leader. Invite others with your unique team code.
                </p>
                <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)] border-0">
                  Create New Team
                </Button>
              </div>
            </motion.div>

            {/* Join Team */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel rounded-xl border border-secondary/20 hover:border-secondary/50 p-6 cursor-pointer group"
              onClick={() => router.push(`/join-team/${eventId}`)}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserPlus className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Join Team
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have a team code? Join an existing team and compete together.
                </p>
                <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)] border-0">
                  Join Existing Team
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 rounded-lg bg-muted/30 border border-border text-center"
          >
            <p className="text-sm text-muted-foreground">
              Teams require 2-6 members. A team becomes active once it has at least 2 members.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
