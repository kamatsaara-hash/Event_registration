'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  '#a855f7', // neon purple
  '#06b6d4', // neon cyan
  '#3b82f6', // neon blue
  '#f472b6', // baby pink
  '#c4b5fd', // lavender
  '#22d3ee', // cyan bright
];

export function Confetti({ isActive, duration = 3000, particleCount = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, duration, particleCount]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                scale: piece.scale,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                x: `${piece.x + (Math.random() - 0.5) * 20}vw`,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: piece.delay,
                ease: 'linear',
              }}
              className="absolute"
            >
              <div
                className="w-3 h-3"
                style={{
                  backgroundColor: piece.color,
                  boxShadow: `0 0 10px ${piece.color}`,
                  clipPath: Math.random() > 0.5 
                    ? 'polygon(50% 0%, 100% 100%, 0% 100%)' 
                    : 'none',
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export function SuccessConfetti({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return <Confetti isActive={show} duration={3000} particleCount={60} />;
}
