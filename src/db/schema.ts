import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  customerId: text('customer_id').notNull().unique(), // e.g. JD-CUST-000001
  email: text('email').notNull(),
  fullName: text('full_name'),
  phone: text('phone'),
  role: text('role').default('customer').notNull(), // 'customer' | 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingId: text('booking_id').notNull().unique(), // e.g. JD-BOOK-2026-000001
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  serviceCategory: text('service_category').notNull(), // 'electrical' | 'plumbing' | 'package' | 'emergency'
  serviceTitle: text('service_title').notNull(),
  problemDescription: text('problem_description').notNull(),
  preferredDate: text('preferred_date').notNull(),
  preferredTime: text('preferred_time').notNull(),
  address: text('address').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  mapLink: text('map_link'),
  uploadedPhotos: text('uploaded_photos'), // JSON string array of preview links/names
  paymentStatus: text('payment_status').default('UNPAID').notNull(), // 'UNPAID' | 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  bookingStatus: text('booking_status').default('PENDING').notNull(), // 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  emailNotificationStatus: text('email_notification_status').default('PENDING').notNull(), // 'PENDING' | 'SENT' | 'FAILED'
  emailNotificationError: text('email_notification_error'),
  emailSentAt: timestamp('email_sent_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  bookingId: text('booking_id').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method').default('JazzCash').notNull(),
  transactionRef: text('transaction_ref').notNull(),
  senderNumber: text('sender_number').notNull(),
  proofImageUrl: text('proof_image_url'),
  status: text('status').default('PENDING_VERIFICATION').notNull(), // 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  adminRemarks: text('admin_remarks'),
  reviewedBy: text('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  bookingId: text('booking_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  serviceCategory: text('service_category').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  status: text('status').default('PENDING_MODERATION').notNull(), // 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const careers = pgTable('careers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(), // 'Electrical' | 'Plumbing' | 'Engineering' | 'Operations'
  type: text('type').notNull(), // 'Full-Time' | 'On-Call' | 'Apprentice'
  location: text('location').default('Mansehra, KP').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  isOpen: integer('is_open').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id'),
  jobTitle: text('job_title').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  experienceYears: text('experience_years').notNull(),
  skills: text('skills').notNull(),
  cvFileName: text('cv_file_name'),
  message: text('message'),
  status: text('status').default('NEW').notNull(), // 'NEW' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
