import React, { useState, useEffect } from 'react';
import { X, User, LogIn, LogOut, CheckCircle2, Clock, AlertTriangle, CreditCard, Star, RefreshCw } from 'lucide-react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Booking } from '../types/index.ts';

interface CustomerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal: (bookingId: string) => void;
  onOpenAdmin: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  isOpen,
  onClose,
  onOpenPaymentModal,
  onOpenAdmin,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [customerRecord, setCustomerRecord] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [guestBookings, setGuestBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        syncUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const syncUser = async (u: FirebaseUser) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: u.uid,
          email: u.email,
          fullName: u.displayName || 'Valued Customer',
          phone: u.phoneNumber || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCustomerRecord(data.customer);
        fetchMyBookings(data.customer.email);
      }
    } catch (err) {
      console.error('Error syncing user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async (emailOrPhone: string) => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const all: Booking[] = await res.json();
        const filtered = all.filter(
          (b) =>
            b.email.toLowerCase() === emailOrPhone.toLowerCase() ||
            b.phone.includes(emailOrPhone)
        );
        setBookings(filtered);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      alert('Google Sign-In failed: ' + (error.message || 'Please check browser popup settings.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setCustomerRecord(null);
    setBookings([]);
  };

  const handleSearchByPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const all: Booking[] = await res.json();
        const found = all.filter(
          (b) =>
            b.phone.includes(searchPhone.trim()) ||
            b.bookingId.toLowerCase() === searchPhone.trim().toLowerCase()
        );
        setGuestBookings(found);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isAdmin = user?.email?.toLowerCase() === 'jaidykhan9@gmail.com' || customerRecord?.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#4c1320] border border-[#d4af37]/35 rounded-xl overflow-hidden shadow-2xl my-6">
        
        {/* Header */}
        <div className="bg-[#5c1626] border-b border-[#d4af37]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">
                Customer Account &amp; Tracking
              </div>
              <h2 className="font-display font-bold text-base text-[#fcf9f5]">
                JD Client Portal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* User Sign-In Banner */}
          {user ? (
            <div className="p-4 rounded-lg bg-[#3f0f1b] border border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full border border-[#d4af37]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#5c1626] border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold">
                    {user.displayName?.[0] || 'C'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-[#fcf9f5]">{user.displayName || 'Valued Client'}</div>
                  <div className="text-[11px] text-[#c4b5a5]">{user.email}</div>
                  {customerRecord?.customerId && (
                    <div className="text-[11px] font-mono text-[#38bdf8] mt-0.5">
                      Customer ID: <strong>{customerRecord.customerId}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="px-3 py-1.5 bg-[#d4af37] text-[#3f0f1a] rounded text-xs font-bold"
                  >
                    Open Admin Console
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-[#c4b5a5] rounded border border-white/10"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-lg bg-[#3f0f1b] border border-[#d4af37]/25 text-center">
              <h3 className="font-display font-bold text-sm text-[#fcf9f5]">
                Sign in to view your dispatch history &amp; Customer ID
              </h3>
              <p className="text-xs text-[#c4b5a5] mt-1 mb-4">
                Access all scheduled bookings, payment statuses, and engineering logs.
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded text-xs font-bold transition-all shadow cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Guest Booking Search */}
          <div className="p-4 rounded-lg bg-[#3f0f1b] border border-white/10">
            <h4 className="text-xs font-bold text-[#f3e5ab] mb-1">
              Lookup by Booking ID or Mobile Number
            </h4>
            <p className="text-[11px] text-[#c4b5a5] mb-3">
              Booked as a guest? Enter your phone number (e.g. 03001234567) or Booking ID to track live dispatch status.
            </p>
            <form onSubmit={handleSearchByPhone} className="flex gap-2">
              <input
                type="text"
                placeholder="Phone (03001234567) or Booking ID"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1 bg-[#4c1320] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5c1626] hover:bg-[#6e1d31] border border-[#d4af37]/40 text-[#f3e5ab] rounded text-xs font-bold cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Bookings Display */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3">
              Your Registered Bookings
            </h4>

            {(() => {
              const listToDisplay = guestBookings !== null ? guestBookings : bookings;

              if (listToDisplay.length === 0) {
                return (
                  <div className="p-6 text-center text-xs text-[#c4b5a5] border border-white/5 rounded-lg">
                    No active bookings found matching your search.
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {listToDisplay.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-lg bg-[#3f0f1b] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#f3e5ab]">{b.bookingId}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              b.bookingStatus === 'COMPLETED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                                : b.bookingStatus === 'IN_PROGRESS'
                                ? 'bg-sky-950 text-sky-400 border border-sky-700/50'
                                : 'bg-amber-950 text-amber-400 border border-amber-700/50'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              b.paymentStatus === 'APPROVED'
                                ? 'bg-emerald-950 text-emerald-400'
                                : b.paymentStatus === 'PENDING_VERIFICATION'
                                ? 'bg-yellow-950 text-yellow-400'
                                : 'bg-rose-950 text-rose-400'
                            }`}
                          >
                            Payment: {b.paymentStatus}
                          </span>
                        </div>

                        <div className="font-semibold text-xs text-[#fcf9f5] mt-1">{b.serviceTitle}</div>
                        <div className="text-[11px] text-[#c4b5a5] mt-0.5">
                          Schedule: {b.preferredDate} · {b.preferredTime}
                        </div>
                        <div className="text-[11px] text-[#8e7467]">{b.address}</div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {b.paymentStatus === 'UNPAID' && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenPaymentModal(b.bookingId);
                            }}
                            className="px-3 py-1.5 bg-[#d4af37] text-[#160307] text-xs font-bold rounded flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay JazzCash</span>
                          </button>
                        )}
                        <a
                          href={`https://wa.me/923021822160?text=${encodeURIComponent(
                            `Hello CEO Junaid Farooq, regarding booking ${b.bookingId}:`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25d366] text-white text-xs font-bold rounded"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </div>
  );
};
