'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, QrCode, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';
import { eventsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface EventPass {
  id: string;
  eventId: string;
  eventName: string;
  eventType: 'solo' | 'group';
  qrData: string;
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

export default function QRPassPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [passes, setPasses] = useState<EventPass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<EventPass | null>(null);

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    setIsLoading(true);
    try {
      const response = await eventsAPI.getRegisteredEvents();
      const registrations = Array.isArray(response.data) ? response.data : (response.data.events || []);
      const passData = registrations.map((reg: any) => ({
        id: reg.registrationId || reg.eventId,
        eventId: reg.eventId,
        eventName: reg.eventName,
        eventType: reg.eventType || (reg.teamId ? 'group' : 'solo'),
        qrData: JSON.stringify({
          registrationId: reg.registrationId,
          eventId: reg.eventId,
          eventName: reg.eventName,
          participantId: user?.id,
          participantName: user?.fullName,
          participantEmail: user?.email,
        }),
      }));
      setPasses(passData);
      if (passData.length > 0) {
        setSelectedPass(passData[0]);
      }
    } catch (error) {
      // Demo data
      const demoData: EventPass[] = [
        {
          id: '1',
          eventId: '1',
          eventName: 'Hackathon Royale',
          eventType: 'group',
          qrData: JSON.stringify({
            eventId: '1',
            eventName: 'Hackathon Royale',
            participantId: user?.id || 'demo',
            participantName: user?.fullName || 'Demo User',
            participantEmail: user?.email || 'demo@example.com',
          }),
        },
        {
          id: '2',
          eventId: '11',
          eventName: 'Speed Coding Solo',
          eventType: 'solo',
          qrData: JSON.stringify({
            eventId: '11',
            eventName: 'Speed Coding Solo',
            participantId: user?.id || 'demo',
            participantName: user?.fullName || 'Demo User',
            participantEmail: user?.email || 'demo@example.com',
          }),
        },
      ];
      setPasses(demoData);
      setSelectedPass(demoData[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!selectedPass) return;
    
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 500;
      if (ctx) {
        // Background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 20px Geist';
        ctx.textAlign = 'center';
        ctx.fillText(selectedPass.eventName, canvas.width / 2, 40);
        
        // Name
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Geist';
        ctx.fillText(user?.fullName || 'Participant', canvas.width / 2, 70);
        
        // QR Code
        ctx.drawImage(img, 100, 100, 200, 200);
        
        // Footer
        ctx.fillStyle = '#666666';
        ctx.font = '12px Geist';
        ctx.fillText('Neon Event Arena', canvas.width / 2, 340);
        
        // Download
        const link = document.createElement('a');
        link.download = `${selectedPass.eventName.replace(/\s+/g, '_')}_pass.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    addToast({ type: 'success', title: 'QR Pass downloaded!' });
  };

  const handleShare = async () => {
    if (!selectedPass) return;
    
    if (navigator.share) {
      await navigator.share({
        title: `${selectedPass.eventName} Pass`,
        text: `My entry pass for ${selectedPass.eventName} at Neon Event Arena`,
      });
    } else {
      addToast({ type: 'info', title: 'Sharing not supported on this device' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading passes..." />
      </div>
    );
  }

  if (passes.length === 0) {
    return (
      <EmptyState
        type="events"
        title="No Entry Passes"
        description="Register for events to get your QR entry passes"
        action={{ label: 'Browse Events', onClick: () => {} }}
      />
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground mb-2">QR Entry Passes</h1>
        <p className="text-muted-foreground">
          Show your QR code at the event entrance for quick check-in
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event List */}
        <motion.div variants={item} className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Events</h2>
          {passes.map((pass) => (
            <motion.button
              key={pass.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedPass(pass)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedPass?.id === pass.id
                  ? 'glass-panel border-primary/50 glow-purple'
                  : 'bg-muted/30 border-border hover:border-primary/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  pass.eventType === 'solo' ? 'bg-secondary/20' : 'bg-primary/20'
                )}>
                  <Trophy className={cn(
                    'h-5 w-5',
                    pass.eventType === 'solo' ? 'text-secondary' : 'text-primary'
                  )} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{pass.eventName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{pass.eventType} Event</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* QR Display */}
        <motion.div variants={item} className="lg:col-span-2">
          {selectedPass && (
            <div className="glass-panel rounded-xl border border-primary/20 overflow-hidden">
              <div className="h-1 gradient-border" />
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {selectedPass.eventName}
                  </h3>
                  <p className="text-muted-foreground">
                    {user?.fullName}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-white rounded-2xl">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={selectedPass.qrData}
                      size={200}
                      level="H"
                      includeMargin={false}
                      fgColor="#0a0a1a"
                      bgColor="#ffffff"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Present this QR code at the event entrance for verification
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-primary/50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Pass
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
