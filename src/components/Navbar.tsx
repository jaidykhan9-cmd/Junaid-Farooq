import React, { useState } from 'react';
import { Phone, MessageSquare, ShieldCheck, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (serviceTitle?: string, category?: string) => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenPortal, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full luxury-glass border-b border-[#d4af37]/30 shadow-[0_4px_24px_rgba(212,175,55,0.08)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a href="#hero" className="flex items-center gap-3 group text-left">
          <div className="relative overflow-hidden w-10 h-10 rounded-sm bg-gradient-to-br from-[#641b2c] to-[#4c1320] border-2 border-[#d4af37]/60 flex items-center justify-center font-serif-lux font-bold text-lg text-[#f3e5ab] shadow-[0_0_16px_rgba(212,175,55,0.35)] group-hover:border-[#d4af37] transition-all">
            <span>JD</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-ltr pointer-events-none" />
          </div>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-[#fcf9f5] group-hover:text-[#f3e5ab] transition-colors whitespace-nowrap">
            JD Electrical &amp; Plumbing
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#c4b5a5]">
          <a href="#services" className="hover:text-[#f3e5ab] transition-colors py-1">
            Services
          </a>
          <a href="#packages" className="hover:text-[#f3e5ab] transition-colors py-1">
            Packages
          </a>
          <a href="#gallery" className="hover:text-[#f3e5ab] transition-colors py-1">
            Projects
          </a>
          <a href="#about" className="hover:text-[#f3e5ab] transition-colors py-1">
            About
          </a>
          <a href="#reviews" className="hover:text-[#f3e5ab] transition-colors py-1">
            Reviews
          </a>
          <a href="#careers" className="hover:text-[#f3e5ab] transition-colors py-1">
            Careers
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#f3e5ab] border border-[#d4af37]/40 hover:border-[#d4af37] rounded bg-[#5c1626]/70 hover:bg-[#6e1e32] transition-all whitespace-nowrap cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Client Portal</span>
          </button>

          <button
            onClick={() => onOpenBooking()}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#3f0f1a] bg-gradient-to-r from-[#fbe28c] via-[#d4af37] to-[#aa820a] hover:brightness-110 border border-[#fbe28c]/60 rounded shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all whitespace-nowrap cursor-pointer"
          >
            Book a Service
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-3.5 py-1.5 text-xs font-bold text-[#3f0f1a] bg-gradient-to-r from-[#fbe28c] to-[#d4af37] rounded shadow-sm"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#c4b5a5] hover:text-[#d4af37] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#d4af37]/20 bg-[#4c1320]/98 backdrop-blur-xl px-5 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-[#c4b5a5]">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              Services
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              Packages
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              Projects
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              About
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              Reviews
            </a>
            <a
              href="#careers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-white/5 hover:text-[#d4af37]"
            >
              Careers
            </a>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-[#fcf9f5] border border-white/10 rounded bg-white/5"
            >
              Client Portal &amp; Booking Status
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-[#160307] bg-[#d4af37] rounded"
            >
              Book a Service Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
