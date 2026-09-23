import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  createBookingEntry,
  resendBookingEmail,
  fetchAllBookings,
  updateBookingState,
  submitJazzCashPayment,
  verifyPayment,
  fetchAllPayments,
  fetchReviews,
  submitReviewEntry,
  moderateReview,
  fetchCareers,
  submitJobApplication,
  fetchJobApplications,
  updateJobApplicationStatus,
  fetchAuditLogs,
  fetchCustomers,
  getOrCreateCustomer,
} from './src/db/repository.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Endpoints

  // Sync / Login user
  app.post('/api/auth/sync', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, fullName, phone } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const customer = await getOrCreateCustomer({
        uid: uid || (req.user?.uid),
        email,
        fullName: fullName || 'Valued Client',
        phone: phone || '',
      });
      res.json({
        customer,
        isAdmin: customer.role === 'admin' || email.toLowerCase() === 'jaidykhan9@gmail.com',
      });
    } catch (err: any) {
      console.error('Error syncing user:', err);
      res.status(500).json({ error: 'Failed to synchronize customer identity' });
    }
  });

  // Bookings
  app.post('/api/bookings', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const {
        customerName,
        phone,
        email,
        serviceCategory,
        serviceTitle,
        problemDescription,
        preferredDate,
        preferredTime,
        address,
        latitude,
        longitude,
        mapLink,
        uploadedPhotos,
        notes,
      } = req.body;

      if (!customerName || !phone || !email || !serviceTitle || !problemDescription || !preferredDate || !address) {
        return res.status(400).json({ error: 'Missing required booking fields.' });
      }

      const booking = await createBookingEntry({
        customerName,
        phone,
        email,
        serviceCategory: serviceCategory || 'electrical',
        serviceTitle,
        problemDescription,
        preferredDate,
        preferredTime: preferredTime || 'Morning (9 AM - 1 PM)',
        address,
        latitude,
        longitude,
        mapLink,
        uploadedPhotos: typeof uploadedPhotos === 'string' ? uploadedPhotos : JSON.stringify(uploadedPhotos || []),
        notes,
      });

      res.status(201).json({
        success: true,
        booking,
        message: 'Booking successfully registered in Cloud SQL PostgreSQL.',
      });
    } catch (err: any) {
      console.error('API create booking error:', err);
      res.status(500).json({ error: err.message || 'Failed to submit booking' });
    }
  });

  app.get('/api/bookings', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const all = await fetchAllBookings();
      // If user is admin or requested by client
      res.json(all);
    } catch (err: any) {
      console.error('API get bookings error:', err);
      res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
  });

  app.patch('/api/bookings/:id', async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { bookingStatus, paymentStatus, notes } = req.body;
      const updated = await updateBookingState(bookingId, { bookingStatus, paymentStatus, notes });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  app.post('/api/bookings/:id/resend-email', async (req, res) => {
    try {
      const bookingId = req.params.id;
      const result = await resendBookingEmail(bookingId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to resend email' });
    }
  });

  // Payments (JazzCash)
  app.post('/api/payments/jazzcash', async (req, res) => {
    try {
      const { bookingId, amount, transactionRef, senderNumber, proofImageUrl } = req.body;
      if (!bookingId || !amount || !transactionRef || !senderNumber) {
        return res.status(400).json({ error: 'Missing required payment proof fields.' });
      }

      const payment = await submitJazzCashPayment({
        bookingId,
        amount: Number(amount),
        transactionRef,
        senderNumber,
        proofImageUrl,
      });

      res.status(201).json({
        success: true,
        payment,
        message: 'JazzCash payment proof submitted. Marked as PENDING VERIFICATION.',
      });
    } catch (err: any) {
      console.error('Payment submission error:', err);
      res.status(500).json({ error: err.message || 'Failed to submit payment proof' });
    }
  });

  app.get('/api/payments', async (_req, res) => {
    try {
      const list = await fetchAllPayments();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  app.post('/api/payments/:id/verify', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status, adminRemarks, reviewedBy } = req.body;
      if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ error: 'Invalid verification status' });
      }
      const verified = await verifyPayment(id, status, adminRemarks, reviewedBy);
      res.json(verified);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to verify payment' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const all = req.query.all === 'true';
      const list = await fetchReviews(!all);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const { bookingId, customerName, customerPhone, serviceCategory, rating, comment } = req.body;
      if (!customerName || !rating || !comment || !serviceCategory) {
        return res.status(400).json({ error: 'Missing required review fields.' });
      }
      const item = await submitReviewEntry({
        bookingId,
        customerName,
        customerPhone,
        serviceCategory,
        rating: Number(rating),
        comment,
      });
      res.status(201).json({
        success: true,
        review: item,
        message: 'Review received into moderation queue. It will become public upon administrator verification.',
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit review' });
    }
  });

  app.patch('/api/reviews/:id/moderate', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
      }
      const updated = await moderateReview(id, status);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to moderate review' });
    }
  });

  // Careers & Applications
  app.get('/api/careers', async (_req, res) => {
    try {
      const list = await fetchCareers();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch career positions' });
    }
  });

  app.post('/api/careers/apply', async (req, res) => {
    try {
      const { jobId, jobTitle, fullName, phone, email, experienceYears, skills, cvFileName, message } = req.body;
      if (!jobTitle || !fullName || !phone || !email || !experienceYears || !skills) {
        return res.status(400).json({ error: 'Missing required job application fields' });
      }
      const application = await submitJobApplication({
        jobId,
        jobTitle,
        fullName,
        phone,
        email,
        experienceYears,
        skills,
        cvFileName,
        message,
      });
      res.status(201).json({
        success: true,
        application,
        message: 'Your job application has been securely submitted to JD Electrical & Plumbing Services human resources.',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to apply' });
    }
  });

  app.get('/api/careers/applications', async (_req, res) => {
    try {
      const apps = await fetchJobApplications();
      res.json(apps);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch job applications' });
    }
  });

  app.patch('/api/careers/applications/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const updated = await updateJobApplicationStatus(id, status);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update application status' });
    }
  });

  // Customers & Audit
  app.get('/api/customers', async (_req, res) => {
    try {
      const custs = await fetchCustomers();
      res.json(custs);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  app.get('/api/audit-logs', async (_req, res) => {
    try {
      const logs = await fetchAuditLogs();
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  });

  app.get('/api/stats', async (_req, res) => {
    try {
      const allBookings = await fetchAllBookings();
      const allPayments = await fetchAllPayments();
      const allReviews = await fetchReviews(false);
      const approvedReviews = allReviews.filter(r => r.status === 'APPROVED');
      const pendingReviews = allReviews.filter(r => r.status === 'PENDING_MODERATION');
      const pendingPayments = allPayments.filter(p => p.status === 'PENDING_VERIFICATION');
      const approvedPayments = allPayments.filter(p => p.status === 'APPROVED');
      const totalRevenuePKR = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

      res.json({
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.bookingStatus === 'PENDING').length,
        completedBookings: allBookings.filter(b => b.bookingStatus === 'COMPLETED').length,
        pendingPaymentsCount: pendingPayments.length,
        totalRevenuePKR,
        approvedReviewsCount: approvedReviews.length,
        pendingReviewsCount: pendingReviews.length,
        ratingAverage: approvedReviews.length > 0
          ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
          : '5.0',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to calculate stats' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JD Services Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
