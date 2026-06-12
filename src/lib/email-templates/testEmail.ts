/**
 * testEmail.ts — Test email sent from admin settings
 */
import { emailLayout, heading, statusIcon, C } from "./emailLayout";

export function testEmail(): { subject: string; html: string } {
  const content = `
    ${statusIcon("✓", C.green)}
    ${heading("Email Configuration Working!")}

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};text-align:center;line-height:1.6;">This is a test email from your admin settings. If you received this, your email configuration is working correctly!</p>

    <div style="background-color:${C.ivory};border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:${C.navy};font-weight:700;">What this confirms:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};">
            <span style="color:${C.green};font-weight:700;margin-right:8px;">&#10003;</span> SMTP connection is active
          </td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};">
            <span style="color:${C.green};font-weight:700;margin-right:8px;">&#10003;</span> Email credentials are valid
          </td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};">
            <span style="color:${C.green};font-weight:700;margin-right:8px;">&#10003;</span> Branded template renders correctly
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:${C.light};text-align:center;">Sent from Holy Spirit Chapel Admin Panel</p>
  `;

  return {
    subject: "Test Email — Holy Spirit Chapel Admin",
    html: emailLayout(content, {
      preheader: "Your Holy Spirit Chapel email configuration is working correctly!",
      scripture: {
        text: "Commit to the Lord whatever you do, and he will establish your plans.",
        reference: "Proverbs 16:3",
      },
    }),
  };
}
