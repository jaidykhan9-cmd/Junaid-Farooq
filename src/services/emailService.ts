import nodemailer from 'nodemailer';

export interface BookingEmailData {
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
  paymentStatus: string;
  bookingStatus: string;
  uploadedPhotos?: string | null;
}

export function generateBookingHtmlEmail(data: BookingEmailData): string {
  const mapUrl = data.mapLink || (data.latitude && data.longitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address + ', Mansehra')}`);
  
  let photosHtml = '<p style="color: #888888; font-size: 13px; margin: 4px 0 0 0;">No photos attached</p>';
  if (data.uploadedPhotos) {
    try {
      const photos: string[] = JSON.parse(data.uploadedPhotos);
      if (photos.length > 0) {
        photosHtml = `<p style="color: #2b1016; font-size: 13px; font-weight: 600; margin: 4px 0 6px 0;">${photos.length} Photo(s) Provided</p>` +
          photos.map((p, idx) => `<span style="display:inline-block; font-size: 12px; background: #f5f0eb; border: 1px solid #d4af37; padding: 4px 8px; border-radius: 4px; margin-right: 6px; margin-bottom: 4px; color: #4a0e17;">Photo #${idx + 1}</span>`).join('');
      }
    } catch {
      photosHtml = `<p style="color: #666; font-size: 13px;">${data.uploadedPhotos}</p>`;
    }
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New JD Service Booking — ${data.bookingId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a080c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a080c; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="640" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3d0711 0%, #5c0f1c 100%); padding: 36px 40px; text-align: left; border-bottom: 3px solid #d4af37;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">JD Electrical &amp; Plumbing Services</div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New Service Booking Dispatch</h1>
                    <div style="color: #e2cbb0; font-size: 13px; margin-top: 6px;">Mansehra, Khyber Pakhtunkhwa • Est. 2018 • CEO: Junaid Farooq</div>
                  </td>
                  <td align="right" valign="top">
                    <div style="background-color: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; color: #f4d068; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 700; text-align: right; white-space: nowrap;">
                      ${data.bookingId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <div style="margin-bottom: 24px;">
                <p style="font-size: 15px; line-height: 1.6; color: #444444; margin: 0 0 16px 0;">
                  A new client booking has been confirmed in the PostgreSQL database and is ready for dispatch assignment.
                </p>
              </div>

              <!-- Key Info Grid -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td width="50%" style="padding: 12px 14px; background: #faf7f5; border: 1px solid #eee5dc; border-radius: 6px 0 0 0;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Customer Name</span>
                    <strong style="font-size: 15px; color: #2b0b12;">${data.customerName}</strong>
                    <span style="display: block; font-size: 12px; color: #8c6d48; margin-top: 2px;">ID: ${data.customerId}</span>
                  </td>
                  <td width="50%" style="padding: 12px 14px; background: #faf7f5; border: 1px solid #eee5dc; border-left: none; border-radius: 0 6px 0 0;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Contact Phone</span>
                    <strong style="font-size: 15px; color: #2b0b12;"><a href="tel:${data.phone}" style="color: #4a0e17; text-decoration: none;">${data.phone}</a></strong>
                    <span style="display: block; font-size: 12px; color: #666; margin-top: 2px;">Email: ${data.email}</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 12px 14px; background: #ffffff; border: 1px solid #eee5dc; border-top: none;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Service Requested</span>
                    <strong style="font-size: 15px; color: #2b0b12;">${data.serviceTitle}</strong>
                    <span style="display: block; font-size: 12px; color: #555; text-transform: capitalize; margin-top: 2px;">Category: ${data.serviceCategory}</span>
                  </td>
                  <td width="50%" style="padding: 12px 14px; background: #ffffff; border: 1px solid #eee5dc; border-left: none; border-top: none;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Schedule Window</span>
                    <strong style="font-size: 15px; color: #2b0b12;">${data.preferredDate}</strong>
                    <span style="display: block; font-size: 12px; color: #666; margin-top: 2px;">Slot: ${data.preferredTime}</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 12px 14px; background: #faf7f5; border: 1px solid #eee5dc; border-top: none; border-radius: 0 0 0 6px;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Payment Status</span>
                    <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 2px 8px; border-radius: 4px; margin-top: 4px;">
                      ${data.paymentStatus}
                    </span>
                  </td>
                  <td width="50%" style="padding: 12px 14px; background: #faf7f5; border: 1px solid #eee5dc; border-left: none; border-top: none; border-radius: 0 0 6px 0;">
                    <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Dispatch Status</span>
                    <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #1e3a8a; background: #dbeafe; padding: 2px 8px; border-radius: 4px; margin-top: 4px;">
                      ${data.bookingStatus}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Problem Description -->
              <div style="background-color: #faf6f0; border-left: 4px solid #4a0e17; padding: 16px 20px; border-radius: 0 6px 6px 0; margin-bottom: 24px;">
                <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 6px;">Problem Description &amp; Scope</span>
                <p style="font-size: 14px; line-height: 1.6; color: #222222; margin: 0; white-space: pre-wrap;">${data.problemDescription}</p>
              </div>

              <!-- Address & Location Map -->
              <div style="margin-bottom: 24px; padding: 16px 20px; border: 1px solid #eee5dc; border-radius: 6px; background-color: #ffffff;">
                <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 4px;">Service Address &amp; Navigation Coordinates</span>
                <p style="font-size: 14px; color: #222222; margin: 0 0 8px 0; font-weight: 600;">${data.address}</p>
                ${data.latitude && data.longitude ? `<p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">GPS: ${data.latitude}, ${data.longitude}</p>` : ''}
                <a href="${mapUrl}" target="_blank" style="display: inline-block; background-color: #4a0e17; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 4px;">
                  Open Location in Google Maps &rarr;
                </a>
              </div>

              <!-- Photos Info -->
              <div style="margin-bottom: 28px;">
                <span style="font-size: 11px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 6px;">Client Uploaded Media</span>
                ${photosHtml}
              </div>

              <!-- Quick Action Links for Jaidy / Admin -->
              <div style="padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
                <a href="https://wa.me/923021822160?text=${encodeURIComponent(`Hello ${data.customerName}, regarding your booking ${data.bookingId} with JD Electrical & Plumbing Services:`)}" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 6px; margin: 0 6px 8px 6px;">
                  Message Customer on WhatsApp
                </a>
                <a href="tel:${data.phone}" style="display: inline-block; background-color: #4a0e17; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 6px; margin: 0 6px 8px 6px;">
                  Call Customer (${data.phone})
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #22050b; padding: 24px 40px; text-align: center; color: #baa194; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #d4af37; font-weight: 600;">JD Electrical &amp; Plumbing Services</p>
              <p style="margin: 0 0 6px 0;">Mansehra, Khyber Pakhtunkhwa, Pakistan • CEO: Junaid Farooq (Est. 2018)</p>
              <p style="margin: 0; color: #8e7467; font-size: 11px;">Direct Dispatch Alert sent to jaidykhan9@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendBookingNotificationEmail(data: BookingEmailData): Promise<{ success: boolean; error?: string }> {
  const recipient = 'jaidykhan9@gmail.com';
  const subject = `New JD Service Booking — ${data.bookingId}`;
  const htmlContent = generateBookingHtmlEmail(data);

  // Check for SMTP / Gmail configuration
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  if (!smtpUser || !smtpPass) {
    console.warn('[EmailService] SMTP credentials not configured (SMTP_USER/SMTP_PASS). Notification logged for jaidykhan9@gmail.com.');
    return {
      success: false,
      error: 'SMTP credentials not configured on server. Booking stored securely in Cloud SQL PostgreSQL.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"JD Electrical & Plumbing Services" <${smtpUser}>`,
      to: recipient,
      subject,
      html: htmlContent,
    });

    console.log('[EmailService] Notification successfully dispatched to jaidykhan9@gmail.com:', info.messageId);
    return { success: true };
  } catch (err: any) {
    console.error('[EmailService] Error sending email via transporter:', err);
    return { success: false, error: err.message || 'Failed to dispatch email' };
  }
}
