import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Plus, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Review } from '../types/index.ts';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [serviceCategory, setServiceCategory] = useState('electrical');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchApprovedReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!customerName || !comment || !serviceCategory) {
      setStatusMsg({ type: 'error', text: 'Please fill in all required review fields.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingId.trim() || undefined,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim() || undefined,
          serviceCategory,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setStatusMsg({
        type: 'success',
        text: 'Thank you! Your review has been entered into the moderation queue. It will be displayed once verified by our administration team.',
      });
      setComment('');
      setBookingId('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error submitting review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-[#44101d] relative border-t border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#d4af37] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Verified Client Feedback Protocol</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#fcf9f5] tracking-tight">
              Verified Client Experiences
            </h2>
            <p className="mt-3 text-sm text-[#c4b5a5] max-w-xl">
              Authentic reviews from registered property owners and facility managers in Mansehra. Every review is verified against our service records.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-2.5 rounded bg-white/5 hover:bg-[#641b2c] border border-[#d4af37]/30 text-xs font-semibold text-[#f3e5ab] transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Submit Verified Review</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-xs text-[#c4b5a5]">
            Loading verified reviews from Cloud SQL PostgreSQL...
          </div>
        ) : reviews.length === 0 ? (
          <div className="luxury-card rounded-xl p-10 text-center max-w-2xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-[#d4af37] mx-auto mb-3 opacity-80" />
            <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
              Strict Authenticity &amp; Moderation Standard
            </h3>
            <p className="mt-2 text-xs text-[#c4b5a5] leading-relaxed">
              In accordance with our zero-fabrication policy, only verified clients with confirmed booking references can publish reviews. Newly submitted reviews are currently in the administrator moderation queue.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-5 py-2.5 bg-[#d4af37] text-[#160307] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#f3e5ab] transition-colors"
            >
              Submit Your Verified Experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="luxury-card rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.bookingId && (
                      <span className="text-[10px] font-mono text-[#38bdf8] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        Verified Booking
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#fcf9f5] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#fcf9f5]">{rev.customerName}</div>
                    <div className="text-[11px] text-[#c4b5a5] capitalize">{rev.serviceCategory} Client</div>
                  </div>
                  <span className="text-[10px] text-[#8e7467]">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#4c1320] border border-[#d4af37]/35 rounded-xl overflow-hidden shadow-2xl">
              
              <div className="bg-[#5c1626] p-4 border-b border-[#d4af37]/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                    Client Feedback Moderation
                  </div>
                  <h3 className="font-display font-bold text-base text-[#fcf9f5]">
                    Submit Verified Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#c4b5a5] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {statusMsg && (
                  <div
                    className={`mb-4 p-3 rounded text-xs flex items-center gap-2 ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-700/50 text-emerald-200'
                        : 'bg-red-950/80 border border-red-700/50 text-red-200'
                    }`}
                  >
                    {statusMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    )}
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Booking ID (e.g. JD-BOOK-2026-XXXXXX)
                      </label>
                      <input
                        type="text"
                        placeholder="Optional but verified faster"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                        Service Category *
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="electrical">Electrical Work</option>
                        <option value="plumbing">Plumbing &amp; Sanitary</option>
                        <option value="package">Maintenance Package</option>
                        <option value="emergency">Emergency Repair</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-[#f3e5ab] ml-2">
                        {rating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Your Review / Experience Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the quality of installation, punctuality of technicians, and overall reliability..."
                      className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <p className="text-[11px] text-[#c4b5a5]/70">
                    All reviews enter our moderation queue to prevent spam and verify completed services before publishing.
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-[#d4af37] hover:bg-[#f3e5ab] text-[#3f0f1a] font-bold text-xs uppercase tracking-wider rounded transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting to Queue...' : 'Submit to Moderation Queue'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
