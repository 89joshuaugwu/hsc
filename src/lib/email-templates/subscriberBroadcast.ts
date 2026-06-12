/**
 * subscriberBroadcast.ts — Bulk message from admin to subscribers
 */
import { emailLayout, C } from "./emailLayout";

export function subscriberBroadcast(data: {
  name: string;
  subject: string;
  message: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${C.navy};">${data.subject}</h2>

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.text};">Dear <strong>${data.name}</strong>,</p>

    <div style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:${C.text};line-height:1.7;">
      ${data.message.replace(/\n/g, "<br/>")}
    </div>

    <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">God bless you,<br/><strong style="color:${C.navy};">Holy Spirit Chapel</strong></p>
  `;

  return {
    subject: data.subject,
    html: emailLayout(content, {
      preheader: `Message from Holy Spirit Chapel: ${data.subject}`,
      scripture: {
        text: "For where two or three gather in my name, there am I with them.",
        reference: "Matthew 18:20",
      },
      unsubscribeUrl: data.unsubscribeUrl,
    }),
  };
}
