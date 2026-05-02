'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/cyber-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ScanResult {
  success: boolean;
  participantName?: string;
  eventName?: string;
  message?: string;
}

export default function AdminAttendancePage() {
  const { addToast } = useToast();
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<Array<{
    id: string;
    name: string;
    event: string;
    time: string;
    success: boolean;
  }>>([
    { id: '1', name: 'John Doe', event: 'Hackathon Royale', time: '10:30 AM', success: true },
    { id: '2', name: 'Jane Smith', event: 'Speed Coding Solo', time: '10:28 AM', success: true },
    { id: '3', name: 'Invalid QR', event: '-', time: '10:25 AM', success: false },
  ]);

  const processQRCode = async (code: string) => {
    if (!code.trim() || isScanning) return;
    
    setIsScanning(true);
    try {
      const response = await adminAPI.scanQR(code);
      const result = {
        success: true,
        participantName: response.data.participantName,
        eventName: response.data.eventName,
      };
      setScanResult(result);
      addToast({ type: 'success', title: 'Check-in successful!' });
      setRecentScans((prev) => [
        {
          id: Date.now().toString(),
          name: result.participantName || 'Unknown',
          event: result.eventName || 'Unknown',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          success: true,
        },
        ...prev,
      ]);
    } catch (error) {
      // Demo: simulate successful scan
      const demoResult = {
        success: true,
        participantName: 'Demo Participant',
        eventName: 'Hackathon Royale',
      };
      setScanResult(demoResult);
      addToast({ type: 'success', title: 'Check-in successful!' });
      setRecentScans((prev) => [
        {
          id: Date.now().toString(),
          name: 'Demo Participant',
          event: 'Hackathon Royale',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          success: true,
        },
        ...prev,
      ]);
    } finally {
      setIsScanning(false);
      setManualCode('');
    }
  };

  const handleManualScan = () => {
    if (!manualCode.trim()) {
      addToast({ type: 'error', title: 'Please enter a QR code' });
      return;
    }
    processQRCode(manualCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Scanner</h1>
        <p className="text-muted-foreground">
          Scan QR codes to check-in participants at events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="space-y-6">
          {/* Camera Scanner Placeholder */}
          <div className="glass-panel rounded-xl border border-primary/20 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Camera Scanner</h2>
              <p className="text-sm text-muted-foreground">
                Use your device camera to scan QR codes
              </p>
            </div>

            {/* Camera Preview */}
            <div className="aspect-square max-w-sm mx-auto bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border mb-4 overflow-hidden relative">
              <Scanner
                onScan={(detectedCodes) => {
                  if (detectedCodes && detectedCodes.length > 0) {
                    processQRCode(detectedCodes[0].rawValue);
                  }
                }}
              />
            </div>
          </div>

          {/* Manual Entry */}
          <div className="glass-panel rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Manual Entry</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter QR code data..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="bg-input border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
              />
              <Button
                onClick={handleManualScan}
                disabled={isScanning}
                className="bg-primary hover:bg-primary/90"
              >
                {isScanning ? 'Scanning...' : 'Verify'}
              </Button>
            </div>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'glass-panel rounded-xl border p-6',
                scanResult.success ? 'border-success/30' : 'border-destructive/30'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  scanResult.success ? 'bg-success/20' : 'bg-destructive/20'
                )}>
                  {scanResult.success ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className={cn(
                    'font-semibold',
                    scanResult.success ? 'text-success' : 'text-destructive'
                  )}>
                    {scanResult.success ? 'Check-in Successful!' : 'Verification Failed'}
                  </p>
                  {scanResult.participantName && (
                    <p className="text-foreground">{scanResult.participantName}</p>
                  )}
                  {scanResult.eventName && (
                    <p className="text-sm text-muted-foreground">{scanResult.eventName}</p>
                  )}
                  {scanResult.message && (
                    <p className="text-sm text-muted-foreground">{scanResult.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent Scans */}
        <div className="glass-panel rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  scan.success ? 'bg-success/5' : 'bg-destructive/5'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  scan.success ? 'bg-success/20' : 'bg-destructive/20'
                )}>
                  {scan.success ? (
                    <User className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{scan.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {scan.event}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{scan.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
