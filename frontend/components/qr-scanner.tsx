'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, CheckCircle, XCircle, Scan, Upload, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { adminAPI } from '@/lib/api';

interface ScanResult {
  success: boolean;
  message: string;
  data?: {
    userName?: string;
    eventName?: string;
    teamName?: string;
  };
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to access camera:', error);
      setResult({
        success: false,
        message: 'Failed to access camera. Please use manual entry.',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const processQRCode = async (qrData: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setResult(null);

    try {
      const response = await adminAPI.scanQR(qrData);
      setResult({
        success: true,
        message: 'Attendance marked successfully!',
        data: response.data,
      });
      stopCamera();
    } catch (error) {
      setResult({
        success: false,
        message: 'Invalid QR code or already scanned.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processQRCode(manualCode.trim());
    }
  };

  const resetScanner = () => {
    setResult(null);
    setManualCode('');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Controls */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={isScanning ? stopCamera : startCamera}
          className={isScanning ? 'bg-red-500 hover:bg-red-600' : 'cyber-button'}
        >
          {isScanning ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </>
          )}
        </Button>
      </div>

      {/* Camera View */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="cyber-card overflow-hidden">
              <CardContent className="p-0 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[400px] object-cover"
                />
                
                {/* Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-cyan" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neon-cyan" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-cyan" />
                    
                    {/* Scanning line */}
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                      style={{ boxShadow: '0 0 10px var(--neon-cyan)' }}
                    />
                  </div>
                </div>

                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader text="Processing..." />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Entry */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-neon-purple" />
            Manual QR Code Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="flex gap-3">
            <Input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code or participant ID..."
              className="flex-1 bg-background/50 border-border/50 focus:border-neon-purple"
            />
            <Button type="submit" disabled={isProcessing || !manualCode.trim()} className="cyber-button">
              {isProcessing ? <Loader size="sm" /> : <Scan className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`cyber-card overflow-hidden ${
              result.success 
                ? 'border-green-500/50' 
                : 'border-red-500/50'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    result.success 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {result.success ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <XCircle className="w-8 h-8" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      result.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.success ? 'Success!' : 'Error'}
                    </h3>
                    <p className="text-muted-foreground mt-1">{result.message}</p>
                    
                    {result.data && (
                      <div className="mt-4 p-4 rounded-lg bg-background/50 space-y-2">
                        {result.data.userName && (
                          <p><span className="text-muted-foreground">Name:</span> {result.data.userName}</p>
                        )}
                        {result.data.eventName && (
                          <p><span className="text-muted-foreground">Event:</span> {result.data.eventName}</p>
                        )}
                        {result.data.teamName && (
                          <p><span className="text-muted-foreground">Team:</span> {result.data.teamName}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetScanner}
                    className="hover:bg-foreground/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
