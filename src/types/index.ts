export interface ServiceItem {
  id: string;
  category: 'electrical' | 'plumbing' | 'package' | 'emergency';
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  startingPrice: string;
  image?: string;
  tag: string;
}

export interface MaintenancePackage {
  id: string;
  name: string;
  tier: 'Residential Standard' | 'Executive Villa' | 'Commercial MEP';
  pricePKR: string;
  period: string;
  description: string;
  inclusions: string[];
  recommendedFor: string;
}

export interface Booking {
  id: number;
  bookingId: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  serviceCategory: string;
  serviceTitle: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  mapLink?: string | null;
  uploadedPhotos?: string | null;
  paymentStatus: 'UNPAID' | 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  emailNotificationStatus: 'PENDING' | 'SENT' | 'FAILED';
  emailNotificationError?: string | null;
  emailSentAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: number;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  senderNumber: string;
  proofImageUrl?: string | null;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  adminRemarks?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface Review {
  id: number;
  bookingId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  serviceCategory: string;
  rating: number;
  comment: string;
  status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface CareerPosition {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string;
  isOpen: number;
  createdAt: string;
}

export interface JobApplication {
  id: number;
  jobId?: number | null;
  jobTitle: string;
  fullName: string;
  phone: string;
  email: string;
  experienceYears: string;
  skills: string;
  cvFileName?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  details?: string | null;
  timestamp: string;
}
