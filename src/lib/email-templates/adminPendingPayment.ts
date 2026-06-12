/**
 * adminPendingPayment.ts — Notification to admin when a bank transfer is submitted
 */
import { emailLayout, heading, subtext, infoTable, infoRow, ctaButton, C, SITE_URL } from "./emailLayout";

export function adminPendingPayment(data: {
  donorName: string;
  amount: string;
  giveTitle: string;
  transactionId: string;
}): { subject: string; html: string } {
  const content = `
    ${heading("New Pending Payment")}
    ${subtext("A new bank transfer submission needs your review.")}

    ${infoTable(
      infoRow("Donor", `<strong>${data.donorName}</strong>`) +
      infoRow("Amount", `<span style="font-weight:700;">${data.amount}</span>`, true) +
      infoRow("Give Type", data.giveTitle) +
      infoRow("Method", "Bank Transfer") +
      infoRow("Transaction ID", `<span style="font-family:'Courier New',monospace;font-size:12px;color:${C.muted};">${data.transactionId}</span>`)
    )}

    ${ctaButton("Review Payment", `${SITE_URL}/admin/payments`)}
  `;

  return {
    subject: `New Pending Payment from ${data.donorName} | Holy Spirit Chapel`,
    html: emailLayout(content, {
      preheader: `${data.donorName} submitted a ${data.amount} bank transfer for ${data.giveTitle}. Review needed.`,
      scripture: {
        text: "Whatever you do, work at it with all your heart, as working for the Lord.",
        reference: "Colossians 3:23",
      },
    }),
  };
}
