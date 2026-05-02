'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Users, Trophy, QrCode, Mail, Shield, ArrowRight, Sparkles, Target, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParticlesBackground, GlowingOrbs } from '@/components/ui/particles';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';

const features = [
  {
    icon: Target,
    title: 'Solo Events',
    description: 'Compete individually in coding challenges, quizzes, and design competitions.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Users,
    title: 'Team Battles',
    description: 'Form teams of 2-6 members and dominate hackathons and group competitions.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Code,
    title: 'Instant Team Codes',
    description: 'Generate unique team codes instantly and share with your squadmates.',
    color: 'text-neon-cyan',
    bgColor: 'bg-neon-cyan/10',
  },
  {
    icon: QrCode,
    title: 'QR Entry Pass',
    description: 'Get your personalized QR code for quick and seamless event check-in.',
    color: 'text-neon-pink',
    bgColor: 'bg-neon-pink/10',
  },
  {
    icon: Mail,
    title: 'Email Verification',
    description: 'Secure your account with email verification for authenticated access.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Shield,
    title: 'Admin Control',
    description: 'Powerful admin dashboard for event management and analytics.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <GlowingOrbs />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/30 mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                The Future of Event Registration
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">Neon</span>{' '}
              <span className="text-primary text-glow-purple">Event</span>{' '}
              <span className="text-secondary text-glow-cyan">Arena</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Register. Compete. Build Teams.
            </p>

            <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
              The ultimate platform for hackathons, coding competitions, and team-based events.
              Join solo or create your dream team.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link href={isAdmin ? '/admin' : '/dashboard'}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple text-lg px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple text-lg px-8">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button size="lg" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 text-lg px-8">
                      Explore Events
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Powerful</span>{' '}
              <span className="text-primary text-glow-purple">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to run successful events and competitions
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-panel rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-2xl border border-primary/20 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '15+', label: 'Events', icon: Trophy },
                { value: '500+', label: 'Participants', icon: Users },
                { value: '100+', label: 'Teams', icon: Zap },
                { value: '24/7', label: 'Support', icon: Shield },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground text-glow-purple mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-primary text-glow-purple">Compete</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of participants and start your journey today.
              Solo events, team battles, and more await you.
            </p>
            {!isAuthenticated && (
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple text-lg px-8">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold">Neon Event Arena</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Neon Event Arena. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
