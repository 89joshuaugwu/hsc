/**
 * paymentReceiptVerified.ts — Payment confirmed (Paystack or bank verified)
 */
import { emailLayout, heading, subtext, statusIcon, infoTable, infoRow, badge, C } from "./emailLayout";

export function paymentReceiptVerified(data: {
  name: string;
  amount: string;
  giveTitle: string;
  method: string;
  reference: string;
  date: string;
}): { subject: string; html: string } {
  const content = `
    ${statusIcon("✓", C.green)}

    <div style="text-align:center;margin-bottom:12px;">
      ${badge("VERIFIED", "#DCFCE7", "#166534")}
    </div>

    ${heading("Payment Receipt")}
    ${subtext(`Thank you for your generous giving, ${data.name}!`)}

    ${infoTable(
      infoRow("Donor", `<strong>${data.name}</strong>`) +
      infoRow("Amount", `<span style="color:${C.gold};font-weight:700;font-size:18px;">${data.amount}</span>`, true) +
      infoRow("Give Type", data.giveTitle) +
      infoRow("Method", data.method === "paystack" ? "Card (Paystack)" : "Bank Transfer") +
      infoRow("Reference", `<span style="font-family:'Courier New',monospace;font-size:12px;color:${C.muted};">${data.reference}</span>`) +
      infoRow("Date", data.date)
    )}

    <div style="text-align:center;margin-top:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:${C.navy};font-weight:600;">God bless your giving heart!</p>
      <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};">Your faithfulness makes a difference.</p>
    </div>
  `;

  return {
    subject: `Payment Receipt — ${data.giveTitle} | Holy Spirit Chapel`,
    html: emailLayout(content, {
      preheader: `Your ${data.amount} offering to ${data.giveTitle} has been verified. Thank you!`,
      scripture: {
        text: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
        reference: "2 Corinthians 9:7",
      },
    }),
  };
}
