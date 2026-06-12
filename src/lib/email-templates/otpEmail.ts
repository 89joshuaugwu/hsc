/**
 * otpEmail.ts — 2FA login code email
 */
import { emailLayout, heading, C } from "./emailLayout";

export function send2FACode(code: string, expiresMinutes: number): { subject: string; html: string } {
  const content = `
    ${heading("Your Login Code")}
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};text-align:center;">Enter this 6-digit code to access the admin dashboard:</p>

    <!-- OTP Code Box -->
    <div style="text-align:center;margin:0 0 8px;">
      <div style="display:inline-block;padding:20px 40px;background-color:${C.goldLight};border:2px solid ${C.gold};border-radius:12px;">
        <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:700;letter-spacing:12px;color:${C.navy};">${code}</span>
      </div>
    </div>

    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:11px;color:${C.light};text-align:center;">Tap and hold the code above to copy</p>

    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">This code expires in <strong style="color:${C.navy};">${expiresMinutes} minutes</strong>.</p>
    </div>

    <div style="background-color:#FEF2F2;border-left:4px solid ${C.red};padding:12px 16px;border-radius:0 8px 8px 0;margin-top:16px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#991B1B;"><strong>Security Notice:</strong> If you didn't request this code, please secure your account immediately.</p>
    </div>
  `;

  return {
    subject: "Your Login Code — Holy Spirit Chapel",
    html: emailLayout(content, {
      preheader: `Your Holy Spirit Chapel login code: ${code}`,
      scripture: {
        text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
        reference: "Psalm 28:7",
      },
    }),
  };
}
