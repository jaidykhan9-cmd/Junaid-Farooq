import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Calendar, ArrowRight, ShieldCheck, Zap, Droplets, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* Background Media with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cinematic_service_1790130686955.jpg"
          alt="JD Electrical and Plumbing architectural installation in Mansehra"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.48] contrast-[1.05]"
        />
        {/* Lite mehroon gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4c1320]/80 via-[#5a1626]/70 to-[#4c1320]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#782235]/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Warm Golden Radiant Aura & Subtle Electric Accents */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {/* Golden Central Radiant Aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/20 via-[#d4af37]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#0284c7]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-[#0891b2]/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Trust Origin Marker with Rich Gold Frame */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5c1626] via-[#6e1e32] to-[#5c1626] border border-[#d4af37]/60 text-xs tracking-wider uppercase text-[#fbe28c] mb-8 shadow-[0_0_16px_rgba(212,175,55,0.25)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] animate-ping" />
          <span className="font-semibold">CEO Junaid Farooq · Est. 2018 · Mansehra</span>
          <span className="text-[#d4af37]/60">◆</span>
          <span className="text-[#f3e5ab] font-mono text-[11px]">Certified MEP</span>
        </motion.div>

        {/* Cinematic Headline with Rich Gold Accents */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#fcf9f5] leading-[1.08] tracking-tight max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          Powering Homes.{' '}
          <span className="bg-gradient-to-r from-[#ffe082] via-[#d4af37] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(212,175,55,0.35)]">
            Solving Problems.
          </span>{' '}
          <span className="text-[#fcf9f5]">Since 2018.</span>
        </motion.h1>

        {/* Supporting Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#c4b5a5] max-w-2xl font-normal leading-relaxed"
          style={{ textWrap: 'balance' }}
        >
          Professional electrical and plumbing engineering in Mansehra, built on <span className="text-[#f3e5ab] font-semibold border-b border-[#d4af37]/40 pb-0.5">8+ years of technical rigor</span>, absolute reliability and customer trust.
        </motion.p>

        {/* Primary Action Buttons with Golden Elevation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary: Book a Service */}
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#3f0f1a] bg-gradient-to-r from-[#fbe28c] via-[#d4af37] to-[#aa820a] hover:from-[#fff0b3] hover:to-[#b89122] border border-[#fbe28c]/70 rounded shadow-[0_0_24px_rgba(212,175,55,0.45)] hover:shadow-[0_0_32px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#3f0f1a]" />
            <span>Book a Service</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#3f0f1a]" />
          </button>

          {/* Secondary: WhatsApp Us */}
          <a
            href="https://wa.me/923021822160?text=Hello%20JD%20Electrical%20%26%20Plumbing%2C%20I%20would%20like%20to%20inquire%20about%20a%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-[#fcf9f5] bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/50 hover:border-[#25d366] rounded backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
            <span>WhatsApp Us</span>
          </a>

          {/* Third: Call Now */}
          <a
            href="tel:03021822160"
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-[#fcf9f5] bg-[#5c1626]/85 hover:bg-[#6e1e32] border border-[#d4af37]/50 hover:border-[#f3e5ab] rounded backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_14px_rgba(212,175,55,0.15)]"
          >
            <Phone className="w-4 h-4 text-[#f3e5ab]" />
            <span>Call 0302-1822160</span>
          </a>
        </motion.div>

        {/* Claim-to-Proof Metric Ribbon with Golden Framed Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 pt-8 border-t border-[#d4af37]/30 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl text-left"
        >
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#5c1626]/70 to-[#4c1320]/70 border border-[#d4af37]/35 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#d4af37]/70 transition-all">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#f3e5ab] tabular-nums drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]">
              8+ Years
            </div>
            <div className="text-xs text-[#c4b5a5] mt-1 font-medium">
              Established 2018 · CEO Junaid Farooq
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-b from-[#5c1626]/70 to-[#4c1320]/70 border border-[#d4af37]/35 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#d4af37]/70 transition-all">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#38bdf8] tabular-nums">
              100% Safety
            </div>
            <div className="text-xs text-[#c4b5a5] mt-1 font-medium">
              Pure Copper &amp; Hydrostatic Pressure Rated
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-b from-[#5c1626]/70 to-[#4c1320]/70 border border-[#d4af37]/35 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#d4af37]/70 transition-all">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#22d3ee] tabular-nums">
              24/7 Rapid
            </div>
            <div className="text-xs text-[#c4b5a5] mt-1 font-medium">
              Emergency MEP Dispatch in Mansehra
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-b from-[#5c1626]/70 to-[#4c1320]/70 border border-[#d4af37]/35 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#d4af37]/70 transition-all">
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#fbe28c] tabular-nums drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]">
              Mansehra Valley
            </div>
            <div className="text-xs text-[#c4b5a5] mt-1 font-medium">
              Local Engineering Authority &amp; Trust
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
