import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LogoIntroProps {
  onComplete: () => void;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReducedMotion(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Sequence timing: 1. Deep maroon & particles -> 2. Logo forms -> 3. Sparks & water ripples -> 4. Text -> 5. Fade out
    const t1 = setTimeout(() => setStep(1), 250); // sparks begin
    const t2 = setTimeout(() => setStep(2), 650); // logo path draws
    const t3 = setTimeout(() => setStep(3), 1200); // electric energy & water ripple
    const t4 = setTimeout(() => setStep(4), 1700); // text reveals
    const t5 = setTimeout(() => {
      setStep(5);
      setTimeout(onComplete, 450); // finish
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-50 bg-[#160307] flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif-lux text-3xl font-bold tracking-wider text-[#d4af37]">JD</div>
          <div className="text-xs uppercase tracking-widest text-[#fcf9f5] mt-2">JD Electrical &amp; Plumbing Services</div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {step < 5 && (
        <motion.div
          key="logo-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#160307] overflow-hidden select-none"
        >
          {/* Subtle Ambient Particle / Glow Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4a0d19]/40 rounded-full blur-[100px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: step >= 1 ? 0.35 : 0, scale: step >= 1 ? 1 : 0.8 }}
              transition={{ duration: 1.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#d4af37]/15 rounded-full blur-[80px]"
            />
          </div>

          {/* Central Logo Container */}
          <div className="relative flex flex-col items-center z-10">
            {/* Water Ripple Layer (Cyan Subtle Halo) */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.45, 1.8] }}
                transition={{ duration: 1.4, repeat: 1, ease: 'easeOut' }}
                className="absolute w-44 h-44 rounded-full border border-[#06b6d4]/40 pointer-events-none"
              />
            )}

            {/* Electrical Arc Halo (Electric Blue Subtle Pulse) */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                animate={{ opacity: [0, 0.8, 0.2], scale: 1.15, rotate: 180 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full border border-dashed border-[#38bdf8]/50 pointer-events-none"
              />
            )}

            {/* JD Monogram Badge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Hexagonal / Shield Geometric Ring */}
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <motion.polygon
                  points="50,4 92,26 92,74 50,96 8,74 8,26"
                  stroke="#d4af37"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  fill="rgba(59, 8, 19, 0.5)"
                />
                {/* Electric highlight on the right edge */}
                {step >= 3 && (
                  <motion.path
                    d="M 50,4 L 92,26 L 92,74"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    filter="drop-shadow(0 0 6px #38bdf8)"
                  />
                )}
                {/* Water blue highlight on bottom-left edge */}
                {step >= 3 && (
                  <motion.path
                    d="M 50,96 L 8,74 L 8,26"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    filter="drop-shadow(0 0 6px #06b6d4)"
                  />
                )}
              </svg>

              {/* JD Letters Monogram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.85 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="absolute flex items-center justify-center font-serif-lux font-bold text-3xl tracking-widest text-[#f3e5ab] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
              >
                <span>J</span>
                <span className="text-[#d4af37]">D</span>
              </motion.div>
            </div>

            {/* Typography Reveal */}
            <div className="mt-6 text-center overflow-hidden">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: step >= 4 ? 0 : 20, opacity: step >= 4 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-semibold text-lg md:text-xl tracking-tight text-[#fcf9f5]"
              >
                JD Electrical &amp; Plumbing Services
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 4 ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mt-1.5"
              >
                Since 2018 · Mansehra
              </motion.div>
            </div>
          </div>

          {/* Discreet Skip Button */}
          <button
            onClick={onComplete}
            className="absolute bottom-6 right-8 text-[11px] tracking-widest uppercase text-[#c4b5a5]/60 hover:text-[#d4af37] transition-colors py-1 px-2.5 rounded border border-white/5 hover:border-[#d4af37]/30"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
