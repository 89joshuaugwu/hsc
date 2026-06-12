/**
 * contactUserAutoReply.ts — Auto-reply to user who submitted the contact form
 */
import { emailLayout, heading, C } from "./emailLayout";

export function contactUserAutoReply(data: {
  name: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  const preview = data.message.length > 120 ? data.message.substring(0, 120) + "..." : data.message;

  const content = `
    ${heading("We Received Your Message")}

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.text};">Dear <strong>${data.name}</strong>,</p>

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};line-height:1.6;">Thank you for reaching out to Holy Spirit Chapel! We've received your message and our team will review it shortly. You can expect a response within <strong style="color:${C.navy};">24-48 hours</strong>.</p>

    <div style="background-color:${C.ivory};border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:${C.light};text-transform:uppercase;letter-spacing:1px;">Your message summary</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:${C.navy};font-weight:700;">${data.subject || "General Inquiry"}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};line-height:1.5;font-style:italic;">"${preview}"</p>
    </div>

    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};line-height:1.5;">If your matter is urgent, you can reach us directly during service hours.</p>

    <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">God bless you,<br/><strong style="color:${C.navy};">Holy Spirit Chapel Team</strong></p>
  `;

  return {
    subject: "We received your message | Holy Spirit Chapel",
    html: emailLayout(content, {
      preheader: `Hi ${data.name}, we received your message and will respond soon.`,
      scripture: {
        text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.",
        reference: "Matthew 7:7",
      },
    }),
  };
}
