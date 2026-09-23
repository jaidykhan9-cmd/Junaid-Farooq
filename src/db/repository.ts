import { db } from './index.ts';
import { users, bookings, payments, reviews, careers, jobApplications, auditLogs } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { sendBookingNotificationEmail } from '../services/emailService.ts';

export async function generateNextCustomerId(): Promise<string> {
  try {
    const allUsers = await db.select({ id: users.id }).from(users);
    const nextNum = (allUsers.length + 1).toString().padStart(6, '0');
    return `JD-CUST-${nextNum}`;
  } catch (error) {
    console.error('Error generating Customer ID:', error);
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `JD-CUST-${rand}`;
  }
}

export async function generateNextBookingId(): Promise<string> {
  try {
    const allBookings = await db.select({ id: bookings.id }).from(bookings);
    const year = new Date().getFullYear();
    const nextNum = (allBookings.length + 1).toString().padStart(6, '0');
    return `JD-BOOK-${year}-${nextNum}`;
  } catch (error) {
    console.error('Error generating Booking ID:', error);
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `JD-BOOK-${year}-${rand}`;
  }
}

export async function getOrCreateCustomer(data: {
  uid?: string;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
}) {
  try {
    // If uid provided, check existing
    if (data.uid) {
      const existing = await db.select().from(users).where(eq(users.uid, data.uid));
      if (existing.length > 0) {
        return existing[0];
      }
    }

    // Check by email
    const existingByEmail = await db.select().from(users).where(eq(users.email, data.email));
    if (existingByEmail.length > 0) {
      return existingByEmail[0];
    }

    const customerId = await generateNextCustomerId();
    const inserted = await db.insert(users).values({
      uid: data.uid || `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      customerId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.email.toLowerCase() === 'jaidykhan9@gmail.com' ? 'admin' : 'customer',
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to get/create customer:', error);
    throw new Error('Database customer operation failed', { cause: error });
  }
}

export async function createBookingEntry(bookingData: {
  customerId?: string;
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
  notes?: string | null;
}) {
  let customerId = bookingData.customerId;
  if (!customerId) {
    const cust = await getOrCreateCustomer({
      fullName: bookingData.customerName,
      phone: bookingData.phone,
      email: bookingData.email,
      address: bookingData.address,
    });
    customerId = cust.customerId;
  }

  const bookingId = await generateNextBookingId();

  // 1. MUST save to PostgreSQL BEFORE attempting email
  let newBooking;
  try {
    const inserted = await db.insert(bookings).values({
      bookingId,
      customerId,
      customerName: bookingData.customerName,
      phone: bookingData.phone,
      email: bookingData.email,
      serviceCategory: bookingData.serviceCategory,
      serviceTitle: bookingData.serviceTitle,
      problemDescription: bookingData.problemDescription,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      address: bookingData.address,
      latitude: bookingData.latitude,
      longitude: bookingData.longitude,
      mapLink: bookingData.mapLink,
      uploadedPhotos: bookingData.uploadedPhotos,
      paymentStatus: 'UNPAID',
      bookingStatus: 'PENDING',
      emailNotificationStatus: 'PENDING',
      notes: bookingData.notes,
    }).returning();
    newBooking = inserted[0];
  } catch (dbError) {
    console.error('PostgreSQL booking insert failed:', dbError);
    throw new Error('Failed to record booking in database', { cause: dbError });
  }

  // 2. Trigger server-side email notification to jaidykhan9@gmail.com
  // If email fails: Do NOT delete booking. Mark email notification as failed/pending.
  try {
    const emailResult = await sendBookingNotificationEmail({
      bookingId: newBooking.bookingId,
      customerId: newBooking.customerId,
      customerName: newBooking.customerName,
      phone: newBooking.phone,
      email: newBooking.email,
      serviceCategory: newBooking.serviceCategory,
      serviceTitle: newBooking.serviceTitle,
      problemDescription: newBooking.problemDescription,
      preferredDate: newBooking.preferredDate,
      preferredTime: newBooking.preferredTime,
      address: newBooking.address,
      latitude: newBooking.latitude,
      longitude: newBooking.longitude,
      mapLink: newBooking.mapLink,
      paymentStatus: newBooking.paymentStatus,
      bookingStatus: newBooking.bookingStatus,
      uploadedPhotos: newBooking.uploadedPhotos,
    });

    if (emailResult.success) {
      const updated = await db.update(bookings).set({
        emailNotificationStatus: 'SENT',
        emailSentAt: new Date(),
        emailNotificationError: null,
      }).where(eq(bookings.id, newBooking.id)).returning();
      newBooking = updated[0];
    } else {
      const updated = await db.update(bookings).set({
        emailNotificationStatus: 'FAILED',
        emailNotificationError: emailResult.error || 'Failed to dispatch email',
      }).where(eq(bookings.id, newBooking.id)).returning();
      newBooking = updated[0];
    }
  } catch (emailErr: any) {
    console.error('Error during email dispatch attempt:', emailErr);
    const updated = await db.update(bookings).set({
      emailNotificationStatus: 'FAILED',
      emailNotificationError: emailErr.message || 'Email attempt error',
    }).where(eq(bookings.id, newBooking.id)).returning();
    newBooking = updated[0];
  }

  // 3. Log Audit
  try {
    await db.insert(auditLogs).values({
      action: 'BOOKING_CREATED',
      entityType: 'BOOKING',
      entityId: newBooking.bookingId,
      details: `Created by ${newBooking.customerName} for ${newBooking.serviceTitle}`,
    });
  } catch (e) {
    console.error('Audit log failed:', e);
  }

  return newBooking;
}

export async function resendBookingEmail(bookingId: string) {
  try {
    const found = await db.select().from(bookings).where(eq(bookings.bookingId, bookingId));
    if (found.length === 0) {
      throw new Error(`Booking ${bookingId} not found`);
    }
    const item = found[0];
    const emailResult = await sendBookingNotificationEmail({
      bookingId: item.bookingId,
      customerId: item.customerId,
      customerName: item.customerName,
      phone: item.phone,
      email: item.email,
      serviceCategory: item.serviceCategory,
      serviceTitle: item.serviceTitle,
      problemDescription: item.problemDescription,
      preferredDate: item.preferredDate,
      preferredTime: item.preferredTime,
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      mapLink: item.mapLink,
      paymentStatus: item.paymentStatus,
      bookingStatus: item.bookingStatus,
      uploadedPhotos: item.uploadedPhotos,
    });

    const updated = await db.update(bookings).set({
      emailNotificationStatus: emailResult.success ? 'SENT' : 'FAILED',
      emailNotificationError: emailResult.success ? null : (emailResult.error || 'Failed to dispatch'),
      emailSentAt: emailResult.success ? new Date() : item.emailSentAt,
      updatedAt: new Date(),
    }).where(eq(bookings.id, item.id)).returning();

    await db.insert(auditLogs).values({
      action: 'EMAIL_RESENT',
      entityType: 'BOOKING',
      entityId: bookingId,
      details: `Admin requested email resend. Status: ${emailResult.success ? 'SENT' : 'FAILED'}`,
    });

    return { booking: updated[0], emailResult };
  } catch (error) {
    console.error('Failed to resend booking email:', error);
    throw new Error('Resend booking email failed', { cause: error });
  }
}

export async function fetchAllBookings() {
  try {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  } catch (error) {
    console.error('Database query failed for bookings:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function updateBookingState(bookingId: string, updates: {
  bookingStatus?: string;
  paymentStatus?: string;
  notes?: string;
}) {
  try {
    const updated = await db.update(bookings).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(bookings.bookingId, bookingId)).returning();

    await db.insert(auditLogs).values({
      action: 'BOOKING_UPDATED',
      entityType: 'BOOKING',
      entityId: bookingId,
      details: `Status: ${updates.bookingStatus || 'unchanged'}, Payment: ${updates.paymentStatus || 'unchanged'}`,
    });

    return updated[0];
  } catch (error) {
    console.error('Failed to update booking:', error);
    throw new Error('Failed to update booking', { cause: error });
  }
}

export async function submitJazzCashPayment(data: {
  bookingId: string;
  amount: number;
  transactionRef: string;
  senderNumber: string;
  proofImageUrl?: string;
}) {
  try {
    const inserted = await db.insert(payments).values({
      bookingId: data.bookingId,
      amount: data.amount,
      paymentMethod: 'JazzCash',
      transactionRef: data.transactionRef,
      senderNumber: data.senderNumber,
      proofImageUrl: data.proofImageUrl,
      status: 'PENDING_VERIFICATION',
    }).returning();

    // Mark booking payment status as PENDING_VERIFICATION
    await db.update(bookings).set({
      paymentStatus: 'PENDING_VERIFICATION',
      updatedAt: new Date(),
    }).where(eq(bookings.bookingId, data.bookingId));

    await db.insert(auditLogs).values({
      action: 'PAYMENT_SUBMITTED',
      entityType: 'PAYMENT',
      entityId: data.transactionRef,
      details: `JazzCash PKR ${data.amount} for ${data.bookingId}`,
    });

    return inserted[0];
  } catch (error) {
    console.error('Failed to submit JazzCash payment:', error);
    throw new Error('Payment submission failed', { cause: error });
  }
}

export async function verifyPayment(paymentId: number, status: 'APPROVED' | 'REJECTED', adminRemarks?: string, reviewedBy?: string) {
  try {
    const updated = await db.update(payments).set({
      status,
      adminRemarks: adminRemarks || null,
      reviewedBy: reviewedBy || 'CEO Junaid Farooq',
      reviewedAt: new Date(),
    }).where(eq(payments.id, paymentId)).returning();

    if (updated.length > 0) {
      const p = updated[0];
      await db.update(bookings).set({
        paymentStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        updatedAt: new Date(),
      }).where(eq(bookings.bookingId, p.bookingId));

      await db.insert(auditLogs).values({
        action: `PAYMENT_${status}`,
        entityType: 'PAYMENT',
        entityId: p.transactionRef,
        details: `Reviewed by ${reviewedBy || 'Admin'}. Remarks: ${adminRemarks || 'None'}`,
      });
    }

    return updated[0];
  } catch (error) {
    console.error('Failed to verify payment:', error);
    throw new Error('Payment verification update failed', { cause: error });
  }
}

export async function fetchAllPayments() {
  try {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  } catch (error) {
    console.error('Database query failed for payments:', error);
    throw new Error('Failed to query payments', { cause: error });
  }
}

export async function fetchReviews(approvedOnly: boolean = true) {
  try {
    if (approvedOnly) {
      return await db.select().from(reviews).where(eq(reviews.status, 'APPROVED')).orderBy(desc(reviews.createdAt));
    }
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('Database query failed for reviews:', error);
    throw new Error('Failed to query reviews', { cause: error });
  }
}

export async function submitReviewEntry(data: {
  bookingId?: string;
  customerName: string;
  customerPhone?: string;
  serviceCategory: string;
  rating: number;
  comment: string;
}) {
  try {
    // Only genuine registered customers should submit reviews.
    // Verify booking if provided
    if (data.bookingId) {
      const matching = await db.select().from(bookings).where(eq(bookings.bookingId, data.bookingId));
      if (matching.length === 0) {
        throw new Error('Invalid Booking ID. Reviews require a verified booking reference.');
      }
    }

    const inserted = await db.insert(reviews).values({
      bookingId: data.bookingId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone || null,
      serviceCategory: data.serviceCategory,
      rating: Math.min(5, Math.max(1, data.rating)),
      comment: data.comment,
      status: 'PENDING_MODERATION', // Moderation queue
    }).returning();

    await db.insert(auditLogs).values({
      action: 'REVIEW_SUBMITTED',
      entityType: 'REVIEW',
      entityId: String(inserted[0].id),
      details: `${data.rating} stars by ${data.customerName}`,
    });

    return inserted[0];
  } catch (error: any) {
    console.error('Failed to submit review:', error);
    throw new Error(error.message || 'Review submission failed', { cause: error });
  }
}

export async function moderateReview(reviewId: number, status: 'APPROVED' | 'REJECTED') {
  try {
    const updated = await db.update(reviews).set({
      status,
    }).where(eq(reviews.id, reviewId)).returning();

    await db.insert(auditLogs).values({
      action: `REVIEW_${status}`,
      entityType: 'REVIEW',
      entityId: String(reviewId),
      details: `Moderation set to ${status}`,
    });

    return updated[0];
  } catch (error) {
    console.error('Failed to moderate review:', error);
    throw new Error('Review moderation failed', { cause: error });
  }
}

export async function fetchCareers() {
  try {
    return await db.select().from(careers).where(eq(careers.isOpen, 1)).orderBy(desc(careers.createdAt));
  } catch (error) {
    console.error('Database query failed for careers:', error);
    throw new Error('Failed to query careers', { cause: error });
  }
}

export async function submitJobApplication(data: {
  jobId?: number;
  jobTitle: string;
  fullName: string;
  phone: string;
  email: string;
  experienceYears: string;
  skills: string;
  cvFileName?: string;
  message?: string;
}) {
  try {
    const inserted = await db.insert(jobApplications).values({
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      experienceYears: data.experienceYears,
      skills: data.skills,
      cvFileName: data.cvFileName || null,
      message: data.message || null,
      status: 'NEW',
    }).returning();

    await db.insert(auditLogs).values({
      action: 'JOB_APPLICATION_SUBMITTED',
      entityType: 'JOB_APPLICATION',
      entityId: String(inserted[0].id),
      details: `${data.fullName} applied for ${data.jobTitle}`,
    });

    return inserted[0];
  } catch (error) {
    console.error('Failed to submit job application:', error);
    throw new Error('Job application submission failed', { cause: error });
  }
}

export async function fetchJobApplications() {
  try {
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  } catch (error) {
    console.error('Database query failed for job applications:', error);
    throw new Error('Failed to query job applications', { cause: error });
  }
}

export async function updateJobApplicationStatus(id: number, status: string) {
  try {
    const updated = await db.update(jobApplications).set({
      status,
    }).where(eq(jobApplications.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update job application status:', error);
    throw new Error('Job application update failed', { cause: error });
  }
}

export async function fetchAuditLogs() {
  try {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
  } catch (error) {
    console.error('Database query failed for audit logs:', error);
    throw new Error('Failed to query audit logs', { cause: error });
  }
}

export async function fetchCustomers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('Database query failed for customers:', error);
    throw new Error('Failed to query customers', { cause: error });
  }
}
