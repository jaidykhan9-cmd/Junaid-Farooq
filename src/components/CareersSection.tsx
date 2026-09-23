import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, AlertTriangle, X, Upload } from 'lucide-react';
import { CareerPosition } from '../types/index.ts';

export const CareersSection: React.FC = () => {
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<CareerPosition | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState('3-5 Years');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/careers');
      if (res.ok) {
        const data = await res.json();
        setPositions(data);
      }
    } catch (err) {
      console.error('Error fetching careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !phone || !email || !skills || !selectedJob) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob.id,
          jobTitle: selectedJob.title,
          fullName,
          phone,
          email,
          experienceYears,
          skills,
          cvFileName: cvFileName || 'Resume_Attached.pdf',
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="careers" className="py-24 bg-[#4c1320] relative border-t border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#d4af37] mb-2">
            Engineering Careers &amp; Apprenticeships
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#fcf9f5] tracking-tight">
            Build With Mansehra’s Elite MEP Force
          </h2>
          <p className="mt-3 text-sm text-[#c4b5a5]">
            JD Electrical &amp; Plumbing Services invests in skilled tradespeople, certified diploma engineers, and master technicians. High compensation, safety gear, and prestigious villa projects.
          </p>
        </div>

        {/* Positions List */}
        {loading ? (
          <div className="text-xs text-[#c4b5a5] py-8">Loading positions...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="luxury-card rounded-lg p-6 flex flex-col justify-between hover:border-[#d4af37]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-[#d4af37] font-semibold uppercase tracking-wider">
                      {pos.department}
                    </span>
                    <span className="text-[#38bdf8] font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded">
                      {pos.type}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#fcf9f5] leading-snug">
                    {pos.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#c4b5a5] mt-2 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{pos.location}</span>
                  </div>

                  <p className="text-xs text-[#c4b5a5] leading-relaxed mb-4">
                    {pos.description}
                  </p>

                  <div className="p-3 bg-[#160307] rounded border border-white/5 text-[11px] text-[#fcf9f5]">
                    <span className="text-[#d4af37] font-semibold block mb-0.5">Requirements:</span>
                    {pos.requirements}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedJob(pos);
                      setSuccess(false);
                      setErrorMsg('');
                    }}
                    className="w-full py-2.5 bg-white/5 hover:bg-[#d4af37] hover:text-[#160307] text-[#fcf9f5] text-xs font-bold uppercase tracking-wider rounded border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply for Position</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#4c1320] border border-[#d4af37]/35 rounded-xl overflow-hidden shadow-2xl">
              
              <div className="bg-[#5c1626] p-4 border-b border-[#d4af37]/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                    Job Application
                  </div>
                  <h3 className="font-display font-bold text-base text-[#fcf9f5]">
                    {selectedJob.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1 text-[#c4b5a5] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[75vh] overflow-y-auto">
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-950/80 border border-red-700/50 rounded text-xs text-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {success ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-[#fcf9f5]">
                      Application Successfully Submitted
                    </h4>
                    <p className="text-xs text-[#c4b5a5] mt-2 max-w-sm mx-auto">
                      Your credentials have been securely stored in our Cloud SQL database. Our engineering management will contact you via phone or WhatsApp for interview scheduling.
                    </p>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="mt-6 px-5 py-2 bg-[#d4af37] text-[#3f0f1a] text-xs font-bold uppercase tracking-wider rounded"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Total Industry Experience *
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="1-2 Years">1–2 Years</option>
                        <option value="3-5 Years">3–5 Years</option>
                        <option value="5-10 Years">5–10 Years</option>
                        <option value="10+ Years (Master)">10+ Years (Master Tradesperson)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Core Technical Skills &amp; Certifications *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ATS Wiring, Grohe Sanitary Rigging, DAE Electrical"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        CV / Resume File
                      </label>
                      <label className="flex items-center justify-center gap-2 p-2.5 bg-[#3f0f1b] border border-dashed border-white/15 rounded-lg text-xs text-[#c4b5a5] hover:border-[#d4af37] cursor-pointer">
                        <Upload className="w-4 h-4 text-[#d4af37]" />
                        <span>{cvFileName ? `Attached: ${cvFileName}` : 'Upload CV / Diploma Scan (PDF or Image)'}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => setCvFileName(e.target.files?.[0]?.name || '')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Message / Statement of Qualifications
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly state your past projects in Mansehra or Hazara..."
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 bg-[#d4af37] hover:bg-[#f3e5ab] text-[#3f0f1a] font-bold text-xs uppercase tracking-wider rounded transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Submitting Application...' : 'Submit Application to HR'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
