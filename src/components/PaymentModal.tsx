import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Upload, CreditCard, Copy, Check } from 'lucide-react';
import { PaymentRecord } from '../types/index.ts';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
  onPaymentSubmitted?: (payment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultBookingId = '',
  onPaymentSubmitted,
}) => {
  const [bookingId, setBookingId] = useState(defaultBookingId);
  const [amount, setAmount] = useState('5000');
  const [transactionRef, setTransactionRef] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [proofImage, setProofImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<PaymentRecord | null>(null);
  const [copiedJazz, setCopiedJazz] = useState(false);

  if (!isOpen) return null;

  const copyNumber = () => {
    navigator.clipboard.writeText('03021822160');
    setCopiedJazz(true);
    setTimeout(() => setCopiedJazz(false), 2000);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setProofImage(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!bookingId.trim()) {
      setErrorMsg('Please enter your Booking ID (e.g. JD-BOOK-2026-000001).');
      return;
    }
    if (!transactionRef.trim()) {
      setErrorMsg('Please enter the 12-digit JazzCash Transaction ID / TID.');
      return;
    }
    if (!senderNumber.trim()) {
      setErrorMsg('Please enter the JazzCash mobile number you sent funds from.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments/jazzcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingId.trim(),
          amount: Number(amount),
          transactionRef: transactionRef.trim(),
          senderNumber: senderNumber.trim(),
          proofImageUrl: proofImage || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment proof');
      }

      setSuccessResult(data.payment);
      if (onPaymentSubmitted) {
        onPaymentSubmitted(data.payment);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting JazzCash payment proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#4c1320] border border-[#d4af37]/35 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#5c1626] border-b border-[#d4af37]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">
                Official Payment Gateway
              </div>
              <h2 className="font-display font-bold text-base text-[#fcf9f5]">
                JazzCash Manual Verification
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

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/70 border border-red-700/50 rounded text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successResult ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500 mx-auto flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-[#fcf9f5]">
                  Payment Submitted for Verification
                </h3>
                <div className="inline-block mt-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Status: PENDING VERIFICATION
                </div>
              </div>

              <p className="text-xs text-[#c4b5a5] max-w-sm mx-auto leading-relaxed">
                Your transaction TID <strong className="text-[#fcf9f5] font-mono">{successResult.transactionRef}</strong> for booking <strong className="text-[#fcf9f5] font-mono">{successResult.bookingId}</strong> has been logged. Admin will review the proof and approve.
              </p>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#d4af37] text-[#3f0f1a] rounded text-xs font-bold uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* JazzCash Instructions Box */}
              <div className="p-4 rounded-lg bg-[#3f0f1b] border border-[#d4af37]/25 space-y-2 text-xs">
                <div className="text-[#d4af37] font-bold uppercase tracking-wider text-[11px]">
                  JazzCash Transfer Instructions
                </div>
                <div className="flex justify-between items-center text-[#c4b5a5] pt-1">
                  <span>Account Title:</span>
                  <strong className="text-[#fcf9f5]">Junaid Farooq (CEO)</strong>
                </div>
                <div className="flex justify-between items-center text-[#c4b5a5]">
                  <span>JazzCash Mobile Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#f3e5ab] font-mono">03021822160</strong>
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="text-[#d4af37] hover:underline text-[11px]"
                    >
                      {copiedJazz ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#c4b5a5]/70 pt-1 border-t border-white/5">
                  Send via JazzCash App or *786# &rarr; Enter TID &amp; Screenshot below.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Booking ID Reference
                </label>
                <input
                  type="text"
                  placeholder="JD-BOOK-2026-000001"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37] font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Amount Transferred (PKR)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Sender Mobile No.
                  </label>
                  <input
                    type="text"
                    placeholder="03001234567"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  JazzCash Transaction ID (TID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 109283746501"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-[#3f0f1b] border border-white/10 rounded-lg p-2.5 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Payment Receipt / Screenshot (Optional)
                </label>
                <label className="flex items-center justify-center gap-2 p-3 bg-[#3f0f1b] border border-dashed border-white/15 rounded-lg text-xs text-[#c4b5a5] hover:border-[#d4af37] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <span>{proofImage ? 'Screenshot Attached ✓' : 'Upload JazzCash SMS or App Slip'}</span>
                  <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                </label>
                {proofImage && (
                  <div className="mt-2 h-20 w-32 rounded overflow-hidden border border-white/10">
                    <img src={proofImage} alt="Payment Proof" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa820a] text-[#3f0f1a] rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Recording Proof...' : 'Submit Payment Proof'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
