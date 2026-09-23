import React from 'react';
import { motion } from 'motion/react';
import { Zap, Droplets } from 'lucide-react';

export const TopLogoBanner: React.FC = () => {
  // Repeating items for continuous seamless left-to-right marquee stream
  const bannerItems = [
    { text: 'JD ELECTRICAL & PLUMBING', highlight: 'CEO Junaid Farooq' },
    { text: 'EST. 2018 · MANSEHRA, KP', highlight: '24/7 Fast Dispatch' },
    { text: '100% PURE COPPER & ATS AUTOMATION', highlight: 'Certified MEP' },
    { text: 'HYDROSTATIC 12-BAR SANITARY TESTING', highlight: 'Leak-Free Guarantee' },
    { text: 'EMERGENCY DISPATCH: 0302-1822160', highlight: 'Direct WhatsApp' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#44101d] via-[#5c1626] to-[#44101d] border-b border-[#d4af37]/30 text-xs py-2 select-none z-50">
      {/* Golden accent glow lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      {/* 
        PRIMARY PROMINENT ANIMATED LOGO GLIDING FROM LEFT TO RIGHT
        Moving slowly and smoothly across the viewport
      */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center gap-2"
        initial={{ x: '-120px' }}
        animate={{ x: 'calc(100vw + 120px)' }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 38,
          ease: 'linear',
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#6e1d31] via-[#7d2238] to-[#6e1d31] border-2 border-[#d4af37] shadow-[0_0_24px_rgba(212,175,55,0.65)] backdrop-blur-md">
          {/* Glowing Animated JD Logo Crest with golden ring */}
          <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#5c1626] p-[1px] flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-full bg-[#4c1320] flex items-center justify-center font-serif-lux font-bold text-xs text-[#f3e5ab]">
              <span>JD</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-display font-bold tracking-wider uppercase text-[#fcf9f5] whitespace-nowrap">
            <span className="text-[#f3e5ab] font-extrabold drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]">JD</span>
            <span className="text-[#fcf9f5]">Services</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
            <span className="text-[#38bdf8] flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-[#f59e0b]" />
              <Droplets className="w-3 h-3 text-[#38bdf8]" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* 
        SECONDARY CONTINUOUS STREAM:
        Seamless infinite ticker moving calmly from LEFT to RIGHT
      */}
      <div className="flex w-[200%] overflow-hidden">
        <motion.div
          className="flex shrink-0 items-center gap-10 whitespace-nowrap"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 52,
            ease: 'linear',
          }}
        >
          {/* Double map to create seamless loop */}
          {[...bannerItems, ...bannerItems, ...bannerItems, ...bannerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-[#c4b5a5]">
              {/* JD Logo Badge moving left to right */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-[#d4af37]/30 text-[#f3e5ab] font-bold">
                <div className="w-4 h-4 rounded-sm bg-[#641b2c] border border-[#d4af37]/60 flex items-center justify-center font-serif-lux text-[9px] text-[#d4af37]">
                  JD
                </div>
                <span className="tracking-widest font-mono text-[10px] text-[#d4af37]">EST. 2018</span>
              </div>

              <span className="font-semibold text-[#fcf9f5]">{item.text}</span>
              <span className="text-[#d4af37] font-medium px-1.5 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/20 text-[10px]">
                {item.highlight}
              </span>

              <span className="text-[#d4af37]/40">◆</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
