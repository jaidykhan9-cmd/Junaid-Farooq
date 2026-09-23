import React, { useState } from 'react';
import { TopLogoBanner } from './components/TopLogoBanner.tsx';
import { LogoIntro } from './components/LogoIntro.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { MaintenancePackages } from './components/MaintenancePackages.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { CareersSection } from './components/CareersSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { CustomerPortal } from './components/CustomerPortal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ChatbotWidget } from './components/ChatbotWidget.tsx';
import { ServiceItem, MaintenancePackage, Booking } from './types/index.ts';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingServiceTitle, setBookingServiceTitle] = useState<string>('');
  const [bookingCategory, setBookingCategory] = useState<string>('electrical');

  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [paymentBookingId, setPaymentBookingId] = useState<string>('');

  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const handleOpenBooking = (serviceTitle?: string, category?: string) => {
    if (serviceTitle) setBookingServiceTitle(serviceTitle);
    if (category) setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setBookingServiceTitle(service.title);
    setBookingCategory(service.category);
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkg: MaintenancePackage) => {
    setBookingServiceTitle(pkg.name);
    setBookingCategory('package');
    setIsBookingOpen(true);
  };

  const handleOpenPayment = (bookingId?: string) => {
    if (bookingId) setPaymentBookingId(bookingId);
    setIsPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#4c1320] text-[#fcf9f5] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#3f0f1a]">
      {/* 1. Animated Logo Intro Sequence */}
      {showIntro && (
        <LogoIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Top Animated Logo Moving Left-to-Right */}
      <TopLogoBanner />

      {/* 2. Top Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 3. Main Landing Architecture */}
      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Master Engineering Services */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* MEP Preventive Maintenance Packages */}
        <MaintenancePackages onSelectPackage={handleSelectPackage} />

        {/* Project Gallery & Specifications */}
        <GallerySection />

        {/* Story of JD Heritage (CEO Junaid Farooq) */}
        <AboutSection />

        {/* Verified Client Reviews & Moderation Queue */}
        <ReviewsSection />

        {/* Career Opportunities */}
        <CareersSection />
      </main>

      {/* 4. Luxury Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenPayment={() => handleOpenPayment()}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 5. Multi-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceTitle={bookingServiceTitle}
        initialCategory={bookingCategory}
        onOpenPayment={(id) => handleOpenPayment(id)}
      />

      {/* 6. JazzCash Manual Payment Verification Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        defaultBookingId={paymentBookingId}
      />

      {/* 7. Client Tracking Portal */}
      <CustomerPortal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onOpenPaymentModal={(id) => handleOpenPayment(id)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 8. Luxury Administrator Dispatch Console */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 9. Rule-based Booking Assistant Chatbot */}
      <ChatbotWidget
        onOpenBookingModal={(service) => handleOpenBooking(service)}
        onOpenPaymentModal={(id) => handleOpenPayment(id)}
      />
    </div>
  );
}

export default App;
