import nodemailer from "nodemailer";

/**
 * Gmail SMTP Transporter (Nodemailer 8.x)
 *
 * Uses a Google App Password (16-digit) stored in SMTP_PASS.
 * The Gmail account must have 2-Step Verification enabled and
 * an App Password generated specifically for this application.
 *
 * This module is server-side only — never import in client components.
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Default sender identity for all outgoing emails
 */
export const defaultFrom = `"Holy Spirit Chapel" <${process.env.SMTP_USER}>`;

/**
 * Send an email using the chapel transporter
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  return transporter.sendMail({
    from: from || defaultFrom,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
  });
}
