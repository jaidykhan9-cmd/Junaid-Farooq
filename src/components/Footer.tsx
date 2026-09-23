import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenPayment: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenPayment,
  onOpenPortal,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#3f0f1b] border-t border-[#d4af37]/20 text-xs text-[#c4b5a5]">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#5c1626] border border-[#d4af37] flex items-center justify-center font-serif-lux font-bold text-lg text-[#d4af37]">
                JD
              </div>
              <div>
                <span className="font-display font-bold text-lg text-[#fcf9f5] block">
                  JD Electrical &amp; Plumbing Services
                </span>
                <span className="text-[11px] text-[#d4af37] tracking-wider uppercase">
                  CEO Junaid Farooq · Est. 2018 · Mansehra
                </span>
              </div>
            </div>

            <p className="text-xs text-[#c4b5a5] max-w-sm leading-relaxed">
              Mansehra’s premier MEP engineering contractor. Delivering certified electrical wiring, ATS automation, concealed luxury sanitary systems, and guaranteed emergency dispatch across Khyber Pakhtunkhwa.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[#38bdf8]">
                <span>⚡ Electrical Safety</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[#22d3ee]">
                <span>🚰 12-Bar Hydraulic</span>
              </span>
            </div>
          </div>

          {/* Col 3: Engineering Services */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#fcf9f5] uppercase tracking-wider">
              Engineering Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  Architectural Conduit Wiring
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  Smart ATS Generator Panels
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  Concealed European Cisterns
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  High-Pressure PPRC Infrastructure
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  Acoustic Leak Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Payment */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#fcf9f5] uppercase tracking-wider">
              Client &amp; Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#d4af37] transition-colors text-left cursor-pointer">
                  Book a Service Dispatch
                </button>
              </li>
              <li>
                <button onClick={onOpenPortal} className="hover:text-[#d4af37] transition-colors text-left cursor-pointer">
                  Client Portal &amp; Live Tracking
                </button>
              </li>
              <li>
                <button onClick={onOpenPayment} className="hover:text-[#d4af37] transition-colors text-left cursor-pointer">
                  JazzCash Manual Verification
                </button>
              </li>
              <li>
                <a href="#packages" className="hover:text-[#d4af37] transition-colors">
                  Preventive Maintenance Plans
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#d4af37]/80 hover:text-[#d4af37] font-semibold transition-colors text-left cursor-pointer">
                  Administrator Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Dispatch HQ */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#fcf9f5] uppercase tracking-wider">
              Mansehra Operations
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Mansehra, Khyber Pakhtunkhwa, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="tel:03021822160" className="hover:text-[#fcf9f5] font-mono">
                  0302-1822160
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25d366] shrink-0" />
                <a href="https://wa.me/923021822160" target="_blank" rel="noreferrer" className="hover:text-[#25d366] font-mono">
                  WhatsApp: 03021822160
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="mailto:jaidykhan9@gmail.com" className="hover:text-[#fcf9f5]">
                  jaidykhan9@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-Footer Legal & Attribution */}
      <div className="border-t border-white/5 bg-[#330c16] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e7467]">
          <div>
            &copy; 2018&ndash;{new Date().getFullYear()} JD Electrical &amp; Plumbing Services. All rights reserved. Registered in Pakistan.
          </div>
          <div className="flex items-center gap-4">
            <span>Direct Gmail Dispatch: jaidykhan9@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span>Cloud SQL Database (PostgreSQL)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
