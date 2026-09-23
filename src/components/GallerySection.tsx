import React, { useState } from 'react';
import { X, ZoomIn, ArrowLeftRight, Check, MapPin } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  category: 'Electrical' | 'Plumbing' | 'Commercial MEP' | 'Solar & ATS';
  location: string;
  year: string;
  image: string;
  beforeImage?: string;
  description: string;
  specs: string[];
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Ghazikot Executive Villa MEP Engineering',
    category: 'Electrical',
    location: 'Ghazikot Township, Mansehra',
    year: '2025',
    image: '/src/assets/images/hero_cinematic_service_1790130686955.jpg',
    beforeImage: '/src/assets/images/service_electrical_engineering_1790130701378.jpg',
    description: 'Turnkey architectural electrical wiring, concealed magnetic track lighting, and dedicated 3-phase load center with surge suppression.',
    specs: ['Pakistan Cables 100% Pure Copper', 'Schneider RCCB Electrocution Protection', 'Zero-Resistance Grounding Earthing Pit'],
  },
  {
    id: 'proj-2',
    title: 'Precision Modular Distribution & ATS Changeover',
    category: 'Solar & ATS',
    location: 'Karakoram Highway Commercial Plaza',
    year: '2025',
    image: '/src/assets/images/service_electrical_engineering_1790130701378.jpg',
    description: 'Engineered automatic transfer switch connecting 15kVA Solar Hybrid array with auxiliary diesel generator and national grid.',
    specs: ['Under 0.02s Switchover Time', 'Phase Imbalance Alarm System', 'Modular Din-Rail Breakers'],
  },
  {
    id: 'proj-3',
    title: 'Concealed Luxury Sanitary & Dual-Loop Pressure System',
    category: 'Plumbing',
    location: 'College Road Residence, Mansehra',
    year: '2026',
    image: '/src/assets/images/service_modern_plumbing_1790130714122.jpg',
    beforeImage: '/src/assets/images/showcase_industrial_mep_1790130726135.jpg',
    description: 'European in-wall concealed cisterns, brushed brass thermostatic valves, and dual inverter water booster distribution.',
    specs: ['Grohe Wall Rigging Framework', '12-Bar Hydrostatic Sealed Testing', 'Acoustic Silent Waste Lines'],
  },
  {
    id: 'proj-4',
    title: 'Commercial Complex Infrastructure & Pumping Station',
    category: 'Commercial MEP',
    location: 'Supply Area / Bypass Road, Mansehra',
    year: '2025',
    image: '/src/assets/images/showcase_industrial_mep_1790130726135.jpg',
    description: 'Comprehensive mechanical plumbing and power plant room engineering for 4-story commercial building.',
    specs: ['Dual Duty-Standby Booster Array', 'Rooftop Water Storage Manifold', 'Emergency Fire Riser Integration'],
  },
];

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showBefore, setShowBefore] = useState<boolean>(false);

  const categories = ['All', 'Electrical', 'Plumbing', 'Solar & ATS', 'Commercial MEP'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#44101d] relative border-t border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#d4af37] mb-2">
              Verified Project Showcase
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#fcf9f5] tracking-tight">
              Engineering Portfolios in Mansehra
            </h2>
            <p className="mt-3 text-sm text-[#c4b5a5] max-w-xl">
              Inspect real MEP infrastructure installed, certified, and maintained by JD Electrical &amp; Plumbing Services.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1 p-1 bg-[#380b15] rounded border border-[#d4af37]/25">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#641b2c] text-[#f3e5ab] shadow-sm border border-[#d4af37]/40'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setShowBefore(false);
              }}
              className="luxury-card rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:border-[#d4af37]/50"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#44101d] via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-[#4c1320]/80 backdrop-blur-md p-2 rounded border border-white/10 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[11px] text-[#d4af37] uppercase font-bold tracking-wider mb-1">
                    {project.category} · {project.year}
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#fcf9f5] group-hover:text-[#f3e5ab] transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-[#c4b5a5] mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{project.location}</span>
                </div>
                <p className="text-xs text-[#c4b5a5] line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#d4af37]">
                  <span>View Project Specs &amp; Lightbox &rarr;</span>
                  {project.beforeImage && (
                    <span className="text-[10px] text-[#f3e5ab] bg-[#641b2c] px-2 py-0.5 rounded border border-[#d4af37]/30">
                      Before/After Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <div className="relative w-full max-w-4xl bg-[#4c1320] border border-[#d4af37]/40 rounded-xl overflow-hidden shadow-2xl">
              
              {/* Header */}
              <div className="p-4 bg-[#5c1626] border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#d4af37] font-semibold uppercase tracking-wider">
                    {selectedProject.category} · {selectedProject.location}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 text-[#c4b5a5] hover:text-white rounded hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Media */}
              <div className="relative h-80 sm:h-96 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={showBefore && selectedProject.beforeImage ? selectedProject.beforeImage : selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />

                {/* Before / After toggle button if available */}
                {selectedProject.beforeImage && (
                  <button
                    onClick={() => setShowBefore(!showBefore)}
                    className="absolute bottom-4 right-4 bg-[#4c1320]/90 border border-[#d4af37] text-[#f3e5ab] text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-lg hover:bg-[#641b2c] transition-all cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{showBefore ? 'Viewing Pre-Execution Work' : 'Toggle Pre-Execution Work'}</span>
                  </button>
                )}
              </div>

              {/* Details & Specs */}
              <div className="p-6 bg-[#44101d]">
                <p className="text-xs sm:text-sm text-[#c4b5a5] leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                    Verified Technical Specifications
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedProject.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="p-2.5 rounded bg-white/5 border border-white/5 text-xs text-[#fcf9f5] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
