import React from 'react';
import { ShieldCheck, Check, ArrowRight, Star } from 'lucide-react';
import { MAINTENANCE_PACKAGES } from '../data/servicesData.ts';
import { MaintenancePackage } from '../types/index.ts';

interface MaintenancePackagesProps {
  onSelectPackage: (pkg: MaintenancePackage) => void;
}

export const MaintenancePackages: React.FC<MaintenancePackagesProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-24 bg-[#4c1320] relative border-t border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#d4af37] mb-2">
            <span>Preventive Engineering Protocols</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#fcf9f5] tracking-tight">
            Curated MEP Maintenance Packages
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c4b5a5] leading-relaxed">
            Eliminate sudden electrical outages, burst pipes, and water pump failures with scheduled preventative inspections and guaranteed priority emergency SLA.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MAINTENANCE_PACKAGES.map((pkg, idx) => {
            const isFeatured = idx === 1; // Executive Estate
            return (
              <div
                key={pkg.id}
                className={`relative rounded-xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-[#782235] via-[#641b2c] to-[#4c1320] border-2 border-[#d4af37] shadow-[0_12px_40px_rgba(212,175,55,0.2)] md:-translate-y-2'
                    : 'luxury-card'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa820a] text-[#3f0f1a] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Most Requested by Villa Owners
                  </div>
                )}

                <div>
                  <div className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                    {pkg.tier}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#fcf9f5] mt-1">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#c4b5a5] leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mt-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-extrabold text-3xl text-[#fcf9f5] tabular-nums">
                        {pkg.pricePKR}
                      </span>
                      <span className="text-xs text-[#c4b5a5]">/ {pkg.period}</span>
                    </div>
                    <div className="text-[11px] text-[#d4af37] font-medium mt-1">
                      Ideal for: {pkg.recommendedFor}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <ul className="mt-6 space-y-3">
                    {pkg.inclusions.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-3 text-xs text-[#e2d6c9] leading-normal">
                        <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFeatured
                        ? 'bg-[#d4af37] hover:bg-[#f3e5ab] text-[#160307] shadow-lg'
                        : 'bg-white/5 hover:bg-[#d4af37] hover:text-[#160307] text-[#fcf9f5] border border-white/10'
                    }`}
                  >
                    <span>Enroll in Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
