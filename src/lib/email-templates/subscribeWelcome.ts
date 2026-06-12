/**
 * subscribeWelcome.ts — Sent when someone subscribes to the mailing list
 */
import { emailLayout, heading, ctaButton, C, SITE_URL } from "./emailLayout";

export function subscribeWelcome(data: {
  name: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const content = `
    ${heading("Welcome to the Family!")}

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.text};">Dear <strong>${data.name}</strong>,</p>

    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};line-height:1.6;">Thank you for joining the Holy Spirit Chapel community! We're thrilled to have you with us. You'll now stay connected with everything happening at the chapel.</p>

    <div style="background-color:${C.ivory};border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:${C.navy};font-weight:700;">Here's what you'll receive:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">
            <span style="color:${C.gold};font-weight:700;margin-right:8px;">&#10003;</span> Event updates and program schedules
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">
            <span style="color:${C.gold};font-weight:700;margin-right:8px;">&#10003;</span> Live service notifications
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">
            <span style="color:${C.gold};font-weight:700;margin-right:8px;">&#10003;</span> Important announcements and chapel news
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">
            <span style="color:${C.gold};font-weight:700;margin-right:8px;">&#10003;</span> Inspirational messages from the fellowship
          </td>
        </tr>
      </table>
    </div>

    ${ctaButton("Visit Our Website", SITE_URL)}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">God bless you,<br/><strong style="color:${C.navy};">Holy Spirit Chapel Team</strong></p>
  `;

  return {
    subject: "Welcome to the Holy Spirit Chapel family!",
    html: emailLayout(content, {
      preheader: `Welcome ${data.name}! You're now part of the Holy Spirit Chapel community.`,
      scripture: {
        text: "Arise, shine, for your light has come, and the glory of the Lord rises upon you.",
        reference: "Isaiah 60:1",
      },
      unsubscribeUrl: data.unsubscribeUrl,
    }),
  };
}
