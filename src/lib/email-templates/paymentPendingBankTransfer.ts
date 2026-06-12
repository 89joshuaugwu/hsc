/**
 * paymentPendingBankTransfer.ts — Bank transfer submitted, awaiting verification
 */
import { emailLayout, heading, subtext, statusIcon, infoTable, infoRow, badge, C } from "./emailLayout";

export function paymentPendingBankTransfer(data: {
  name: string;
  amount: string;
  giveTitle: string;
  transactionId: string;
}): { subject: string; html: string } {
  const content = `
    ${statusIcon("⏳", C.amber)}

    <div style="text-align:center;margin-bottom:12px;">
      ${badge("PENDING REVIEW", "#FEF3C7", "#92400E")}
    </div>

    ${heading("Payment Submission Received")}
    ${subtext(`We received your payment submission, ${data.name}.`)}

    ${infoTable(
      infoRow("Donor", `<strong>${data.name}</strong>`) +
      infoRow("Amount", `<span style="font-weight:700;">${data.amount}</span>`, true) +
      infoRow("Give Type", data.giveTitle) +
      infoRow("Method", "Bank Transfer") +
      infoRow("Tracking ID", `<span style="font-family:'Courier New',monospace;font-size:12px;color:${C.muted};">${data.transactionId}</span>`)
    )}

    <div style="background-color:#FEF3C7;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#92400E;font-weight:700;">What happens next?</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#92400E;">Our team will verify your payment and send a confirmation email within 24 hours.</p>
    </div>

    <div style="background-color:${C.ivory};border-radius:8px;padding:12px;text-align:center;margin-top:16px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:${C.light};">Your Tracking ID</p>
      <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:16px;color:${C.navy};font-weight:700;letter-spacing:1px;">${data.transactionId}</p>
    </div>
  `;

  return {
    subject: `Offering Submission Received — ${data.giveTitle} | Holy Spirit Chapel`,
    html: emailLayout(content, {
      preheader: `Your ${data.amount} offering to ${data.giveTitle} is being reviewed. Tracking ID: ${data.transactionId}`,
      scripture: {
        text: "Wait for the Lord; be strong and take heart and wait for the Lord.",
        reference: "Psalm 27:14",
      },
    }),
  };
}
