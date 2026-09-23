import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Upload,
  User,
  Phone,
  Mail,
  Zap,
  Droplets,
  AlertTriangle,
  MessageCircle,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import { ELECTRICAL_SERVICES, PLUMBING_SERVICES, MAINTENANCE_PACKAGES, MANSEHRA_NEIGHBORHOODS } from '../data/servicesData.ts';
import { Booking } from '../types/index.ts';
import { BookingStepper } from './BookingStepper.tsx';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceTitle?: string;
  initialCategory?: string;
  onBookingCreated?: (booking: Booking) => void;
  onOpenPayment?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceTitle,
  initialCategory,
  onBookingCreated,
  onOpenPayment,
}) => {
  // Step state: 1 to 8 (8 is review/submit, then confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Form State
  const [category, setCategory] = useState<string>(initialCategory || 'electrical');
  const [serviceTitle, setServiceTitle] = useState<string>(initialServiceTitle || 'Architectural Electrical Installation');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('Standard (Next available slot)');
  
  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState<string>(defaultDateStr);
  const [preferredTime, setPreferredTime] = useState<string>('Morning (9:00 AM - 1:00 PM)');

  // Contact
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Location
  const [neighborhood, setNeighborhood] = useState<string>(MANSEHRA_NEIGHBORHOODS[0]);
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('34.3332');
  const [longitude, setLongitude] = useState<string>('73.1994');
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (initialServiceTitle) {
      setServiceTitle(initialServiceTitle);
    }
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialServiceTitle, initialCategory]);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsLoading(false);
        // Default to Mansehra city center coords
        setLatitude('34.3332');
        setLongitude('73.1994');
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Read files as Data URLs for immediate visual preview and transmission
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage('');
    if (step === 1) {
      if (!serviceTitle) {
        setErrorMessage('Please select a service or maintenance package.');
        return false;
      }
    } else if (step === 2) {
      if (problemDescription.trim().length < 10) {
        setErrorMessage('Please provide a brief description of the issue or scope (min 10 characters).');
        return false;
      }
    } else if (step === 3) {
      if (!preferredDate || !preferredTime) {
        setErrorMessage('Please select your preferred service date and time slot.');
        return false;
      }
    } else if (step === 4) {
      if (!customerName.trim() || !phone.trim() || !email.trim()) {
        setErrorMessage('Please complete all contact details (Name, Phone, Email).');
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        setErrorMessage('Please enter a valid email address for dispatch confirmations.');
        return false;
      }
      if (phone.replace(/[^0-9]/g, '').length < 10) {
        setErrorMessage('Please enter a valid 11-digit phone number (e.g., 03021822160).');
        return false;
      }
    } else if (step === 5) {
      if (!streetAddress.trim()) {
        setErrorMessage('Please specify your street address or landmark in Mansehra.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const fullAddress = `${streetAddress}, ${neighborhood}, Mansehra, KP, Pakistan`;
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          serviceCategory: category,
          serviceTitle,
          problemDescription: `[Urgency: ${urgency}]\n${problemDescription}`,
          preferredDate,
          preferredTime,
          address: fullAddress,
          latitude,
          longitude,
          mapLink: mapUrl,
          uploadedPhotos: photos.length > 0 ? photos : [],
          notes: `Neighborhood: ${neighborhood}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSubmittedBooking(data.booking);
      if (onBookingCreated) {
        onBookingCreated(data.booking);
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(err.message || 'An error occurred while creating the booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingId = () => {
    if (submittedBooking?.bookingId) {
      navigator.clipboard.writeText(submittedBooking.bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const stepsList = [
    'Service',
    'Problem',
    'Schedule',
    'Contact',
    'Location',
    'Media',
    'Review',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#4c1320] border border-[#d4af37]/35 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-[#5c1626] border-b border-[#d4af37]/20 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">
              JD Engineering Dispatch Protocol
            </div>
            <h2 className="font-display font-bold text-lg text-[#fcf9f5]">
              {submittedBooking ? 'Service Booking Registered' : 'Book Professional Service'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Visual Progress Stepper */}
        <BookingStepper
          currentStep={currentStep}
          isConfirmed={Boolean(submittedBooking)}
          onStepClick={(step) => {
            setErrorMessage('');
            setCurrentStep(step);
          }}
        />

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/70 border border-red-700/50 rounded text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Confirmation View */}
          {submittedBooking ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#d4af37] mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-display font-bold text-2xl text-[#fcf9f5]">
                Booking Sent to JD's Team
              </h3>
              <p className="mt-2 text-xs text-[#c4b5a5] max-w-md mx-auto">
                Your service booking has been registered and directly sent to <strong className="text-[#f3e5ab]">JD's team</strong> (<strong className="text-[#d4af37]">jaidykhan9@gmail.com</strong>). Our dispatch crew is reviewing your request for technician deployment.
              </p>

              {/* ID Badges */}
              <div className="mt-6 p-4 rounded-lg bg-[#3f0f1b] border border-[#d4af37]/35 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c4b5a5]">Official Booking ID:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[#f3e5ab]">
                    <span>{submittedBooking.bookingId}</span>
                    <button
                      onClick={copyBookingId}
                      className="p-1 hover:text-[#d4af37] transition-colors cursor-pointer"
                      title="Copy ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c4b5a5]">Customer ID:</span>
                  <span className="font-mono font-semibold text-[#38bdf8]">{submittedBooking.customerId}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span className="text-[#c4b5a5]">Service:</span>
                  <span className="font-medium text-[#fcf9f5]">{submittedBooking.serviceTitle}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c4b5a5]">Scheduled Window:</span>
                  <span className="font-medium text-[#fcf9f5]">
                    {submittedBooking.preferredDate} · {submittedBooking.preferredTime}
                  </span>
                </div>
              </div>

              {/* Next Steps Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/923021822160?text=${encodeURIComponent(
                    `Hello JD's Team / JD Services, I have booked a service. Booking ID: ${submittedBooking.bookingId}, Customer Name: ${submittedBooking.customerName}. Service: ${submittedBooking.serviceTitle}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>

                {onOpenPayment && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPayment(submittedBooking.bookingId);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#d4af37] hover:bg-[#f3e5ab] text-[#3f0f1a] rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Advance with JazzCash</span>
                  </button>
                )}
                    <span>Pay Advance with JazzCash</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#c4b5a5] rounded text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* STEP 1: CHOOSE SERVICE */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setCategory('electrical')}
                      className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                        category === 'electrical'
                          ? 'bg-[#3b0813] text-[#38bdf8] border-[#38bdf8]/50'
                          : 'bg-[#160307] text-[#c4b5a5] border-white/5'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 inline mr-1 text-[#38bdf8]" />
                      Electrical Services
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('plumbing')}
                      className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                        category === 'plumbing'
                          ? 'bg-[#3b0813] text-[#22d3ee] border-[#22d3ee]/50'
                          : 'bg-[#160307] text-[#c4b5a5] border-white/5'
                      }`}
                    >
                      <Droplets className="w-3.5 h-3.5 inline mr-1 text-[#22d3ee]" />
                      Plumbing Services
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('package')}
                      className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                        category === 'package'
                          ? 'bg-[#3b0813] text-[#d4af37] border-[#d4af37]/50'
                          : 'bg-[#160307] text-[#c4b5a5] border-white/5'
                      }`}
                    >
                      Maintenance Packages
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    <label className="text-xs font-medium text-[#c4b5a5]">Select Specific Service</label>
                    <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                      {category === 'package'
                        ? MAINTENANCE_PACKAGES.map((pkg) => (
                            <div
                              key={pkg.id}
                              onClick={() => setServiceTitle(pkg.name)}
                              className={`p-3 rounded border text-left cursor-pointer transition-all ${
                                serviceTitle === pkg.name
                                  ? 'bg-[#3b0813] border-[#d4af37] text-[#fcf9f5]'
                                  : 'bg-[#160307] border-white/5 hover:border-white/20 text-[#c4b5a5]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-[#fcf9f5]">
                                <span>{pkg.name}</span>
                                <span className="text-[#d4af37]">{pkg.pricePKR}</span>
                              </div>
                              <div className="text-[11px] text-[#c4b5a5] mt-1">{pkg.description}</div>
                            </div>
                          ))
                        : (category === 'electrical' ? ELECTRICAL_SERVICES : PLUMBING_SERVICES).map((srv) => (
                            <div
                              key={srv.id}
                              onClick={() => setServiceTitle(srv.title)}
                              className={`p-3 rounded border text-left cursor-pointer transition-all ${
                                serviceTitle === srv.title
                                  ? 'bg-[#3b0813] border-[#d4af37] text-[#fcf9f5]'
                                  : 'bg-[#160307] border-white/5 hover:border-white/20 text-[#c4b5a5]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-[#fcf9f5]">
                                <span>{srv.title}</span>
                                <span className="text-[#d4af37]">{srv.startingPrice}</span>
                              </div>
                              <div className="text-[11px] text-[#c4b5a5] mt-1">{srv.shortDesc}</div>
                            </div>
                          ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DESCRIBE PROBLEM */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Problem Scope &amp; Symptoms
                    </label>
                    <textarea
                      rows={5}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="e.g. Breakers tripping frequently in the master bedroom, or water booster pump vibrating without pumping pressure to the second floor..."
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[11px] text-[#c4b5a5]/70 mt-1">
                      Providing detailed symptoms helps our engineering technicians bring exact replacement components and testing meters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Urgency Classification
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Standard (Next available slot)', 'High Priority (< 24 Hours)', 'Critical Emergency (< 2 Hours)'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setUrgency(lvl)}
                          className={`p-2.5 rounded border text-xs text-left transition-all ${
                            urgency === lvl
                              ? 'bg-[#3b0813] border-[#d4af37] text-[#f3e5ab]'
                              : 'bg-[#160307] border-white/5 text-[#c4b5a5]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SCHEDULE */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Preferred Time Window
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        'Morning (9:00 AM - 1:00 PM)',
                        'Afternoon (1:00 PM - 5:00 PM)',
                        'Evening (5:00 PM - 8:00 PM)',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPreferredTime(slot)}
                          className={`p-3 rounded border text-xs text-center transition-all ${
                            preferredTime === slot
                              ? 'bg-[#3b0813] border-[#d4af37] text-[#f3e5ab]'
                              : 'bg-[#160307] border-white/5 text-[#c4b5a5]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CONTACT INFORMATION */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Khan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Mobile / WhatsApp Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="03001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[11px] text-[#c4b5a5]/70 mt-1">
                      Your booking receipt and Customer ID will be sent here.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: SELECT/PIN LOCATION */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Mansehra Neighborhood / Sector
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    >
                      {MANSEHRA_NEIGHBORHOODS.map((n) => (
                        <option key={n} value={n} className="bg-[#160307]">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      House / Street Address &amp; Nearest Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="House # 12, Street 4, Near Madina Mosque"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-[#160307] border border-white/10 rounded-lg p-3 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="p-3 bg-[#160307] rounded-lg border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#fcf9f5] font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>GPS Coordinates (for van routing)</span>
                      </div>
                      <div className="text-[11px] text-[#c4b5a5] font-mono mt-0.5">
                        {latitude}, {longitude}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gpsLoading}
                      className="px-3 py-1.5 text-xs text-[#d4af37] border border-[#d4af37]/40 rounded hover:bg-[#d4af37]/10 transition-colors"
                    >
                      {gpsLoading ? 'Detecting...' : 'Pin Current GPS'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: UPLOAD OPTIONAL PROBLEM PHOTOS */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-[#d4af37]/30 rounded-xl p-6 text-center bg-[#160307]/50 hover:bg-[#160307] transition-all">
                    <Camera className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-80" />
                    <div className="text-xs font-semibold text-[#fcf9f5]">
                      Upload Photos of the Issue (Optional)
                    </div>
                    <p className="text-[11px] text-[#c4b5a5] mt-1 mb-3">
                      Take photos of your distribution board, leakage point, water tank, or fixture for quicker diagnosis.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b0813] hover:bg-[#4a0d19] border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-medium rounded cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((p, idx) => (
                        <div key={idx} className="relative rounded overflow-hidden border border-white/10 h-20">
                          <img src={p} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 7: REVIEW REQUEST */}
              {currentStep === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-xs text-[#c4b5a5]">
                    Please verify your engineering dispatch details before finalizing:
                  </div>

                  <div className="bg-[#160307] border border-white/10 rounded-lg p-4 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#c4b5a5]">Selected Service:</span>
                      <strong className="text-[#fcf9f5]">{serviceTitle}</strong>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#c4b5a5]">Category &amp; Urgency:</span>
                      <span className="text-[#f3e5ab] capitalize">{category} · {urgency}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#c4b5a5]">Preferred Schedule:</span>
                      <span className="text-[#fcf9f5]">{preferredDate} ({preferredTime})</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#c4b5a5]">Customer Contact:</span>
                      <span className="text-[#fcf9f5]">{customerName} · {phone}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#c4b5a5]">Address:</span>
                      <span className="text-[#fcf9f5] text-right max-w-xs">{streetAddress}, {neighborhood}</span>
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-[#c4b5a5]">Problem Notes:</span>
                      <span className="text-[#fcf9f5] text-right max-w-xs italic line-clamp-2">
                        {problemDescription}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#5c1626]/80 border border-[#d4af37]/35 rounded text-[11px] text-[#f3e5ab]">
                    By submitting, your dispatch request is securely registered in our PostgreSQL database and an automated notification is sent directly to <strong className="text-white">JD's team</strong> (jaidykhan9@gmail.com) for prompt technician assignment.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {!submittedBooking && (
          <div className="bg-[#3f0f1b] border-t border-[#d4af37]/20 px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-4 py-2 text-xs font-semibold rounded flex items-center gap-1 transition-colors ${
                currentStep === 1
                  ? 'opacity-30 cursor-not-allowed text-[#c4b5a5]'
                  : 'text-[#fcf9f5] hover:bg-white/5 border border-white/10 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#3f0f1a] bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa820a] hover:brightness-110 rounded flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#3f0f1a] bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa820a] hover:brightness-110 rounded flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording in Database...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Dispatch to JD's Team</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
