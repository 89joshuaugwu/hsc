/**
 * Chapel-themed email templates (inline CSS for email clients).
 * Server-side only — used by API routes.
 */

function baseLayout(content: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#F8F7F3;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,97,136,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0A2D52 0%,#1E9FD8 100%);padding:28px 32px;text-align:center;">
                <h1 style="margin:0;font-size:20px;color:#F0B429;font-weight:700;letter-spacing:2px;">HOLY SPIRIT CHAPEL</h1>
                <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;">ESUT Agbani</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#040F1E;padding:24px 32px;text-align:center;">
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px;">DOMINUS REGNANT · ARISE, SHINE</p>
                <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.35);">Holy Spirit Chapel, ESUT Agbani, Enugu State</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

/* ─── Template 1: Payment Receipt (Paystack auto-verified) ─── */
export function paymentReceiptEmail(data: {
  name: string;
  amount: string;
  giveTitle: string;
  reference: string;
  date: string;
}): { subject: string; html: string } {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:#16A34A;text-align:center;line-height:56px;">
        <span style="font-size:28px;color:#ffffff;">✓</span>
      </div>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:#0A2D52;text-align:center;">Thank you, ${data.name}!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;text-align:center;">Your offering has been received and verified.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F3;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Amount</td><td style="padding:8px 16px;font-size:16px;font-weight:700;color:#0A2D52;text-align:right;">${data.amount}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Give Type</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.giveTitle}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Reference</td><td style="padding:8px 16px;font-size:12px;color:#64748B;text-align:right;font-family:monospace;">${data.reference}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Date</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.date}</td></tr>
    </table>
    
    <div style="text-align:center;padding:16px 0;border-top:1px solid #E4E1D6;">
      <p style="margin:0;font-size:14px;font-style:italic;color:#64748B;">"Each of you should give what you have decided in your heart to give."</p>
      <p style="margin:4px 0 0;font-size:12px;color:#F0B429;font-weight:600;">— 2 Corinthians 9:7</p>
    </div>`;

  return {
    subject: `Payment Receipt — ${data.giveTitle} | Holy Spirit Chapel`,
    html: baseLayout(content),
  };
}

/* ─── Template 2: Bank Transfer Submitted (pending) ─── */
export function bankTransferPendingEmail(data: {
  name: string;
  amount: string;
  giveTitle: string;
  transactionId: string;
}): { subject: string; html: string } {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:#D97706;text-align:center;line-height:56px;">
        <span style="font-size:28px;color:#ffffff;">⏳</span>
      </div>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:#0A2D52;text-align:center;">Submission Received</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;text-align:center;">We received your payment submission, ${data.name}. Your offering is being reviewed.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F3;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Amount</td><td style="padding:8px 16px;font-size:16px;font-weight:700;color:#0A2D52;text-align:right;">${data.amount}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Give Type</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.giveTitle}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Method</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">Bank Transfer</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Tracking ID</td><td style="padding:8px 16px;font-size:12px;color:#64748B;text-align:right;font-family:monospace;">${data.transactionId}</td></tr>
    </table>
    
    <div style="text-align:center;padding:16px;background-color:#FEF3C7;border-radius:8px;margin-bottom:16px;">
      <p style="margin:0;font-size:13px;color:#92400E;">You'll receive a confirmation email once your payment is verified.</p>
    </div>`;

  return {
    subject: `Offering Submission Received — ${data.giveTitle}`,
    html: baseLayout(content),
  };
}

/* ─── Template 3: Bank Transfer Verified ─── */
export function bankTransferVerifiedEmail(data: {
  name: string;
  amount: string;
  giveTitle: string;
  transactionId: string;
  date: string;
}): { subject: string; html: string } {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:#16A34A;text-align:center;line-height:56px;">
        <span style="font-size:28px;color:#ffffff;">✓</span>
      </div>
    </div>
    <div style="text-align:center;margin-bottom:8px;">
      <span style="display:inline-block;padding:4px 12px;background-color:#16A34A;color:#ffffff;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;">VERIFIED</span>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:#0A2D52;text-align:center;">Offering Verified!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;text-align:center;">God bless your giving heart, ${data.name}.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F3;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Amount</td><td style="padding:8px 16px;font-size:16px;font-weight:700;color:#0A2D52;text-align:right;">${data.amount}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Give Type</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.giveTitle}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Method</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">Bank Transfer</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Tracking ID</td><td style="padding:8px 16px;font-size:12px;color:#64748B;text-align:right;font-family:monospace;">${data.transactionId}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Verified</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.date}</td></tr>
    </table>
    
    <div style="text-align:center;padding:16px 0;border-top:1px solid #E4E1D6;">
      <p style="margin:0;font-size:14px;font-style:italic;color:#64748B;">"God loves a cheerful giver."</p>
      <p style="margin:4px 0 0;font-size:12px;color:#F0B429;font-weight:600;">— 2 Corinthians 9:7</p>
    </div>`;

  return {
    subject: "Offering Verified ✓ — Holy Spirit Chapel",
    html: baseLayout(content),
  };
}

/* ─── Template: Admin notification for pending bank transfer ─── */
export function adminPendingPaymentEmail(data: {
  donorName: string;
  amount: string;
  giveTitle: string;
  transactionId: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:#0A2D52;">New Pending Payment</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748B;">A new bank transfer submission needs your review.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F3;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Donor</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#0A2D52;text-align:right;">${data.donorName}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Amount</td><td style="padding:8px 16px;font-size:16px;font-weight:700;color:#0A2D52;text-align:right;">${data.amount}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">Type</td><td style="padding:8px 16px;font-size:14px;color:#0A2D52;text-align:right;">${data.giveTitle}</td></tr>
      <tr><td style="padding:8px 16px;font-size:13px;color:#64748B;">ID</td><td style="padding:8px 16px;font-size:12px;color:#64748B;text-align:right;font-family:monospace;">${data.transactionId}</td></tr>
    </table>
    
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/payments" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#F0B429,#FFD23F);color:#040F1E;font-weight:700;border-radius:8px;text-decoration:none;font-size:14px;">Review Payment</a>
    </div>`;

  return {
    subject: `New Pending Payment from ${data.donorName}`,
    html: baseLayout(content),
  };
}
