'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { Loader } from '@/components/ui/loader';

export default function EmailVerificationPage() {
  const { user } = useAuth();

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // ⏱ countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 🔥 TEMP resend (no backend yet)
  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      // ⚠️ No backend yet → simulate success
      await new Promise((res) => setTimeout(res, 1000));

      setResendSuccess(true);
      setCountdown(60);
    } catch (err) {
      setError('Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  // 🔥 fallback if auth not ready
  const isVerified = user?.emailVerified ?? false;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="cyber-card relative overflow-hidden">

          <CardHeader className="text-center">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                isVerified
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-purple-500/20 border border-purple-500'
              }`}
            >
              {isVerified ? (
                <CheckCircle className="w-10 h-10 text-green-400" />
              ) : (
                <Mail className="w-10 h-10 text-purple-400" />
              )}
            </div>

            <CardTitle>
              {isVerified ? 'Email Verified' : 'Verify Your Email'}
            </CardTitle>

            <CardDescription>
              {isVerified
                ? 'Your email has been verified successfully.'
                : 'Check your inbox and verify your email.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {isVerified ? (
              <div className="text-center text-green-400">
                <Shield className="mx-auto mb-2" />
                <p>{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You now have full access to the platform.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center text-muted-foreground">
                  <Clock className="mx-auto mb-2 animate-pulse" />
                  <p>Verification pending</p>
                  <p className="text-xs mt-1">{user?.email}</p>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                {resendSuccess && (
                  <p className="text-green-400 text-sm text-center">
                    Email sent successfully!
                  </p>
                )}

                <Button
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="w-full"
                >
                  {isResending ? (
                    <Loader size="sm" />
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Email
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Check spam folder if you don’t see the email.
                </p>
              </>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}