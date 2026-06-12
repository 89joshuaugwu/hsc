/**
 * paymentRejected.ts — Bank transfer rejected by admin
 */
import { emailLayout, heading, subtext, statusIcon, ctaButton, C, SITE_URL } from "./emailLayout";

export function paymentRejected(data: {
  name: string;
  amount: string;
  reason: string;
}): { subject: string; html: string } {
  const content = `
    ${statusIcon("!", C.red)}

    <div style="text-align:center;margin-bottom:12px;">
      <span style="display:inline-block;padding:4px 14px;background-color:#FEE2E2;color:#991B1B;font-family:Arial,sans-serif;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">NOT VERIFIED</span>
    </div>

    ${heading("Payment Verification Issue")}
    ${subtext(`Dear ${data.name}, we encountered an issue verifying your payment of ${data.amount}.`)}

    <div style="background-color:#FEF2F2;border-left:4px solid ${C.red};padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:#991B1B;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Reason</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#991B1B;line-height:1.5;">${data.reason}</p>
    </div>

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};line-height:1.6;">If you believe this is an error, please contact us with your payment details and we will be happy to assist you.</p>

    ${ctaButton("Contact Us", `${SITE_URL}/contact`, `linear-gradient(135deg,${C.chapel},#1a8ac0)`, C.white)}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">God bless you,<br/><strong style="color:${C.navy};">Holy Spirit Chapel Team</strong></p>
  `;

  return {
    subject: "Payment Update — Holy Spirit Chapel",
    html: emailLayout(content, {
      preheader: `Dear ${data.name}, there was an issue verifying your payment. Please review.`,
      scripture: {
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18",
      },
    }),
  };
}
