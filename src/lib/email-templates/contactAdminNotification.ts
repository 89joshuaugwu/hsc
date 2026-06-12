/**
 * contactAdminNotification.ts — Sent to admin when someone submits the contact form
 */
import { emailLayout, heading, subtext, infoTable, infoRow, ctaButton, badge, C } from "./emailLayout";

export function contactAdminNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}): { subject: string; html: string } {
  const content = `
    ${heading("New Contact Message")}
    ${subtext("Someone reached out through the chapel website.")}

    ${infoTable(
      infoRow("Name", `<strong>${data.name}</strong>`) +
      infoRow("Email", `<a href="mailto:${data.email}" style="color:${C.chapel};text-decoration:none;">${data.email}</a>`) +
      infoRow("Subject", badge(data.subject || "General", C.ivory, C.navy)) +
      infoRow("Date", data.date)
    )}

    <div style="border-left:4px solid ${C.chapel};background-color:${C.ivory};padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:${C.light};text-transform:uppercase;letter-spacing:1px;">Message</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.text};line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</p>
    </div>

    ${ctaButton("Reply via Email", `mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || "Your Message")}`)}
  `;

  return {
    subject: `New Message from ${data.name} | Holy Spirit Chapel`,
    html: emailLayout(content, {
      preheader: `${data.name} sent a message: "${data.subject || "General"}"`,
      scripture: {
        text: "Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone.",
        reference: "Colossians 4:6",
      },
    }),
  };
}
