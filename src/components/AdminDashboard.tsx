import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  Users,
  Briefcase,
  FileText,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  ExternalLink,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Booking, PaymentRecord, Review, JobApplication, AuditLog } from '../types/index.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'payments' | 'reviews' | 'careers' | 'customers' | 'audit'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Selected Booking Modal Details
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookRes, payRes, revRes, appRes, custRes, logRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/bookings'),
        fetch('/api/payments'),
        fetch('/api/reviews?all=true'),
        fetch('/api/careers/applications'),
        fetch('/api/customers'),
        fetch('/api/audit-logs'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookRes.ok) setBookings(await bookRes.json());
      if (payRes.ok) setPayments(await payRes.json());
      if (revRes.ok) setReviews(await revRes.json());
      if (appRes.ok) setApplications(await appRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleUpdateBookingStatus = async (bookingId: string, bookingStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingStatus }),
      });
      if (res.ok) {
        showToast(`Booking ${bookingId} status updated to ${bookingStatus}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResendEmail = async (bookingId: string) => {
    try {
      showToast(`Resending dispatch alert to jaidykhan9@gmail.com for ${bookingId}...`);
      const res = await fetch(`/api/bookings/${bookingId}/resend-email`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Email status updated for ${bookingId}`);
        fetchAllData();
      } else {
        showToast(`Email error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyPayment = async (paymentId: number, status: 'APPROVED' | 'REJECTED') => {
    const remarks = prompt(
      status === 'APPROVED' ? 'Enter approval remarks (optional):' : 'Enter rejection reason:'
    );
    if (status === 'REJECTED' && !remarks) return;

    try {
      const res = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminRemarks: remarks || 'Verified by CEO Junaid Farooq',
          reviewedBy: 'Junaid Farooq (CEO)',
        }),
      });
      if (res.ok) {
        showToast(`Payment #${paymentId} marked as ${status}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateReview = async (reviewId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Review #${reviewId} has been ${status}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-7xl h-[92vh] bg-[#4c1320] border border-[#d4af37]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Header */}
        <div className="bg-[#5c1626] border-b border-[#d4af37]/20 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#641b2c] border border-[#d4af37] flex items-center justify-center font-serif-lux font-bold text-lg text-[#d4af37]">
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-[#fcf9f5]">
                  JD Executive Dispatch Console
                </span>
                <span className="text-[10px] bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab] px-2 py-0.5 rounded font-mono">
                  Cloud SQL Europe-West2
                </span>
              </div>
              <div className="text-xs text-[#c4b5a5]">
                CEO Junaid Farooq · Est. 2018 · Mansehra
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="p-2 rounded text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded text-[#c4b5a5] hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toast Banner */}
        {actionMessage && (
          <div className="bg-[#d4af37] text-[#3f0f1a] text-xs font-bold px-6 py-2 flex items-center justify-between shadow">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)}>×</button>
          </div>
        )}

        {/* Content Layout with Sidebar Tabs */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Navigation */}
          <aside className="w-60 bg-[#3f0f1b] border-r border-[#d4af37]/15 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                <span>Overview &amp; Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#38bdf8]" />
                  <span>Bookings &amp; Dispatch</span>
                </div>
                {bookings.filter((b) => b.bookingStatus === 'PENDING').length > 0 && (
                  <span className="text-[10px] bg-red-900/80 text-red-200 px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {bookings.filter((b) => b.bookingStatus === 'PENDING').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>JazzCash Queue</span>
                </div>
                {payments.filter((p) => p.status === 'PENDING_VERIFICATION').length > 0 && (
                  <span className="text-[10px] bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {payments.filter((p) => p.status === 'PENDING_VERIFICATION').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#d4af37]" />
                  <span>Reviews Moderation</span>
                </div>
                {reviews.filter((r) => r.status === 'PENDING_MODERATION').length > 0 && (
                  <span className="text-[10px] bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {reviews.filter((r) => r.status === 'PENDING_MODERATION').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('careers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'careers'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Job Applicants</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Client Database</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded font-medium transition-colors cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-[#5c1626] text-[#f3e5ab] border border-[#d4af37]/30'
                    : 'text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Audit Trails</span>
              </button>
            </nav>

            <div className="p-3 rounded bg-[#4c1320] border border-white/5 text-[11px] text-[#c4b5a5]">
              <div className="text-[#d4af37] font-semibold mb-1">Direct Dispatch Alert</div>
              <div>Recipient: <strong className="text-white">jaidykhan9@gmail.com</strong></div>
              <div>WhatsApp: <strong className="text-white">03021822160</strong></div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-[#1e0409]">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#24050c] border border-[#d4af37]/20">
                    <div className="text-xs text-[#c4b5a5]">Total Recorded Bookings</div>
                    <div className="font-display font-extrabold text-2xl text-[#fcf9f5] mt-1">
                      {stats?.totalBookings ?? bookings.length}
                    </div>
                    <div className="text-[11px] text-[#d4af37] mt-0.5">PostgreSQL Managed</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#24050c] border border-red-800/40">
                    <div className="text-xs text-[#c4b5a5]">Pending Dispatch</div>
                    <div className="font-display font-extrabold text-2xl text-red-400 mt-1">
                      {bookings.filter((b) => b.bookingStatus === 'PENDING').length}
                    </div>
                    <div className="text-[11px] text-red-300 mt-0.5">Require Assignment</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#24050c] border border-amber-800/40">
                    <div className="text-xs text-[#c4b5a5]">Pending JazzCash Verification</div>
                    <div className="font-display font-extrabold text-2xl text-amber-400 mt-1">
                      {payments.filter((p) => p.status === 'PENDING_VERIFICATION').length}
                    </div>
                    <div className="text-[11px] text-amber-300 mt-0.5">Slips &amp; TIDs Awaiting Review</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#24050c] border border-emerald-800/40">
                    <div className="text-xs text-[#c4b5a5]">Verified Revenue (PKR)</div>
                    <div className="font-display font-extrabold text-2xl text-emerald-400 mt-1">
                      Rs. {(stats?.totalRevenuePKR ?? 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">Approved JazzCash Transactions</div>
                  </div>
                </div>

                {/* Urgent Dispatch Attention Feed */}
                <div className="p-5 rounded-xl bg-[#24050c] border border-[#d4af37]/25 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-[#fcf9f5]">
                      Latest Dispatch Queue
                    </h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-[#d4af37] hover:underline"
                    >
                      View All Bookings &rarr;
                    </button>
                  </div>

                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-lg bg-[#160307] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#f3e5ab]">{b.bookingId}</span>
                          <span className="font-semibold text-[#fcf9f5]">{b.customerName}</span>
                          <span className="text-[#c4b5a5]">({b.phone})</span>
                        </div>
                        <div className="text-[#38bdf8] mt-0.5">{b.serviceTitle}</div>
                        <div className="text-[11px] text-[#8e7467]">{b.address}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.emailNotificationStatus === 'SENT'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                          }`}
                        >
                          Email: {b.emailNotificationStatus}
                        </span>

                        <a
                          href={`https://wa.me/923021822160?text=${encodeURIComponent(
                            `Hello ${b.customerName}, CEO Junaid Farooq from JD Services regarding booking ${b.bookingId}:`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25d366] text-white font-bold rounded"
                        >
                          WhatsApp
                        </a>

                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-[#3b0813] text-[#f3e5ab] border border-[#d4af37]/40 rounded hover:bg-[#4a0d19]"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                    Full Bookings Management ({bookings.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#160307] text-[#c4b5a5] border-b border-[#d4af37]/20">
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Date / Window</th>
                        <th className="p-3">Dispatch Status</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Email Alert</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#24050c] transition-colors">
                          <td className="p-3 font-mono font-bold text-[#f3e5ab]">{b.bookingId}</td>
                          <td className="p-3">
                            <div className="font-semibold text-[#fcf9f5]">{b.customerName}</div>
                            <div className="text-[11px] text-[#c4b5a5]">{b.phone}</div>
                          </td>
                          <td className="p-3 text-[#fcf9f5] max-w-xs truncate">{b.serviceTitle}</td>
                          <td className="p-3 text-[#c4b5a5]">{b.preferredDate}</td>
                          <td className="p-3">
                            <select
                              value={b.bookingStatus}
                              onChange={(e) => handleUpdateBookingStatus(b.bookingId, e.target.value)}
                              className="bg-[#160307] border border-white/10 rounded px-2 py-1 text-xs text-[#fcf9f5]"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-3 font-semibold text-[11px]">
                            <span
                              className={
                                b.paymentStatus === 'APPROVED'
                                  ? 'text-emerald-400'
                                  : b.paymentStatus === 'PENDING_VERIFICATION'
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleResendEmail(b.bookingId)}
                              className="flex items-center gap-1 text-[11px] text-[#d4af37] hover:underline"
                              title="Resend email alert to jaidykhan9@gmail.com"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{b.emailNotificationStatus} (Resend)</span>
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[11px] text-[#fcf9f5]"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAYMENTS TAB (JazzCash) */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                      JazzCash Manual Verification Queue
                    </h3>
                    <p className="text-xs text-[#c4b5a5]">
                      Audit customer payment slips, verify funds received in account 03021822160, and approve or reject.
                    </p>
                  </div>
                </div>

                {payments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#c4b5a5] border border-white/5 rounded-lg">
                    No payment submissions in queue.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-lg bg-[#24050c] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#f3e5ab]">
                              Rs. {p.amount.toLocaleString()}
                            </span>
                            <span className="text-[#c4b5a5]">via {p.paymentMethod}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                p.status === 'APPROVED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                                  : p.status === 'REJECTED'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-700/50'
                                  : 'bg-amber-950 text-amber-400 border border-amber-700/50'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          <div className="mt-1 space-y-0.5 text-[11px] text-[#c4b5a5]">
                            <div>Booking ID: <strong className="text-[#fcf9f5] font-mono">{p.bookingId}</strong></div>
                            <div>Transaction TID: <strong className="text-[#38bdf8] font-mono">{p.transactionRef}</strong></div>
                            <div>Sender Mobile: <strong className="text-[#fcf9f5]">{p.senderNumber}</strong></div>
                            {p.adminRemarks && <div>Remarks: <em className="text-[#d4af37]">{p.adminRemarks}</em></div>}
                          </div>
                        </div>

                        {/* Proof Image & Actions */}
                        <div className="flex items-center gap-3">
                          {p.proofImageUrl && (
                            <a
                              href={p.proofImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="h-16 w-24 rounded overflow-hidden border border-white/20 block"
                            >
                              <img src={p.proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                            </a>
                          )}

                          {p.status === 'PENDING_VERIFICATION' && (
                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => handleVerifyPayment(p.id, 'APPROVED')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleVerifyPayment(p.id, 'REJECTED')}
                                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                  Reviews Moderation Queue
                </h3>

                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-lg bg-[#24050c] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#fcf9f5]">{r.customerName}</strong>
                          <span className="text-[#d4af37]">{'★'.repeat(r.rating)}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'APPROVED'
                                ? 'bg-emerald-950 text-emerald-400'
                                : r.status === 'REJECTED'
                                ? 'bg-rose-950 text-rose-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[#c4b5a5] italic">"{r.comment}"</p>
                        {r.bookingId && (
                          <span className="text-[11px] font-mono text-[#38bdf8]">
                            Booking: {r.bookingId}
                          </span>
                        )}
                      </div>

                      {r.status === 'PENDING_MODERATION' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleModerateReview(r.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleModerateReview(r.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-rose-700 text-white font-bold rounded"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JOB APPLICANTS */}
            {activeTab === 'careers' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                  Job Applications Received
                </h3>

                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-lg bg-[#24050c] border border-white/10 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-[#fcf9f5] text-sm">{app.fullName}</strong>
                          <span className="text-[#d4af37] ml-2">applied for: {app.jobTitle}</span>
                        </div>
                        <span className="text-[#c4b5a5] text-[11px]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#c4b5a5]">
                        <div>Phone: <strong className="text-[#fcf9f5]">{app.phone}</strong></div>
                        <div>Email: <strong className="text-[#fcf9f5]">{app.email}</strong></div>
                        <div>Experience: <strong className="text-[#38bdf8]">{app.experienceYears}</strong></div>
                      </div>

                      <div>
                        <span className="text-[#d4af37] font-semibold">Skills:</span> {app.skills}
                      </div>

                      {app.message && (
                        <p className="text-[#c4b5a5] bg-[#160307] p-2 rounded italic">
                          "{app.message}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-[#25d366] text-white font-bold rounded text-[11px]"
                        >
                          WhatsApp Candidate
                        </a>
                        <a
                          href={`tel:${app.phone}`}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-[#fcf9f5] rounded text-[11px]"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                  Registered Client Directory ({customers.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#160307] text-[#c4b5a5] border-b border-[#d4af37]/20">
                        <th className="p-3">Customer ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {customers.map((c) => (
                        <tr key={c.id}>
                          <td className="p-3 font-mono font-bold text-[#38bdf8]">{c.customerId}</td>
                          <td className="p-3 text-[#fcf9f5] font-semibold">{c.fullName}</td>
                          <td className="p-3 text-[#c4b5a5]">{c.email}</td>
                          <td className="p-3 text-[#c4b5a5]">{c.phone || 'N/A'}</td>
                          <td className="p-3 uppercase text-[10px] font-bold text-[#d4af37]">{c.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#fcf9f5]">
                  System Security &amp; Activity Audit Trails
                </h3>

                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded bg-[#160307] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#d4af37] mr-2">[{log.action}]</span>
                        <span className="text-[#fcf9f5]">{log.entityType} ({log.entityId}):</span>
                        <span className="text-[#c4b5a5] ml-1">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-[#8e7467] shrink-0 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Selected Booking Details Lightbox */}
        {selectedBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-[#24050c] border border-[#d4af37] rounded-xl p-6 shadow-2xl text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="font-mono font-bold text-sm text-[#f3e5ab]">
                    {selectedBooking.bookingId}
                  </div>
                  <div className="text-[11px] text-[#c4b5a5]">
                    Customer ID: {selectedBooking.customerId}
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-1 text-[#c4b5a5] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-[#c4b5a5]">
                <div>Customer: <strong className="text-[#fcf9f5]">{selectedBooking.customerName}</strong> ({selectedBooking.phone}, {selectedBooking.email})</div>
                <div>Service: <strong className="text-[#fcf9f5]">{selectedBooking.serviceTitle}</strong></div>
                <div>Schedule: <strong className="text-[#fcf9f5]">{selectedBooking.preferredDate} ({selectedBooking.preferredTime})</strong></div>
                <div>Address: <strong className="text-[#fcf9f5]">{selectedBooking.address}</strong></div>
                {selectedBooking.mapLink && (
                  <div>
                    <a href={selectedBooking.mapLink} target="_blank" rel="noreferrer" className="text-[#38bdf8] underline flex items-center gap-1">
                      <span>Open Navigation Pin in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <div className="p-3 bg-[#160307] rounded border border-white/5">
                  <span className="font-bold text-[#d4af37] block mb-1">Problem Description:</span>
                  <p className="whitespace-pre-wrap text-[#fcf9f5]">{selectedBooking.problemDescription}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/923021822160?text=${encodeURIComponent(
                    `Hello ${selectedBooking.customerName}, regarding booking ${selectedBooking.bookingId}:`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#25d366] text-white font-bold rounded"
                >
                  WhatsApp Customer
                </a>
                <button
                  onClick={() => handleResendEmail(selectedBooking.bookingId)}
                  className="px-3 py-1.5 bg-[#3b0813] text-[#f3e5ab] border border-[#d4af37]/40 rounded"
                >
                  Resend Email to jaidykhan9@gmail.com
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-3 py-1.5 bg-white/5 text-[#c4b5a5] rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
