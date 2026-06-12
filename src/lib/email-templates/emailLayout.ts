/**
 * emailLayout.ts — Branded email shell for ALL chapel emails.
 *
 * Uses table-based layout and inline CSS exclusively for
 * maximum email-client compatibility (Gmail, Outlook, etc.).
 *
 * Server-side only.
 */

const LOGO_URL = "https://hscesut.vercel.app/clogo.png";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hscesut.vercel.app";

/* ─── Colors ─── */
const C = {
  navy: "#0A2D52",
  navyDark: "#040F1E",
  chapel: "#1E9FD8",
  gold: "#F0B429",
  goldLight: "#FFF8E7",
  ivory: "#F8F7F3",
  text: "#1A1A2E",
  muted: "#64748B",
  light: "#94A3B8",
  white: "#ffffff",
  green: "#16A34A",
  amber: "#D97706",
  red: "#EF4444",
} as const;

export interface EmailLayoutOptions {
  /** Hidden preview text shown in inbox list (preheader) */
  preheader?: string;
  /** Scripture verse for the footer */
  scripture?: { text: string; reference: string };
  /** Unsubscribe link URL (only shown for subscriber emails) */
  unsubscribeUrl?: string;
}

export function emailLayout(
  content: string,
  options?: EmailLayoutOptions
): string {
  const preheader = options?.preheader || "";
  const scripture = options?.scripture;
  const unsubscribeUrl = options?.unsubscribeUrl;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Holy Spirit Chapel</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.ivory};font-family:Arial,Helvetica,'Segoe UI',sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ""}

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.ivory};padding:24px 8px;">
    <tr>
      <td align="center">

        <!-- Main container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,97,136,0.08);">

          <!-- ═══ HEADER ═══ -->
          <tr>
            <td style="background:linear-gradient(135deg,${C.navy} 0%,${C.chapel} 100%);padding:32px 32px 24px;text-align:center;">
              <img src="${LOGO_URL}" alt="HSC Logo" width="64" height="64" style="display:block;margin:0 auto 12px;width:64px;height:64px;border-radius:8px;" />
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${C.gold};font-weight:700;letter-spacing:3px;text-transform:uppercase;">HOLY SPIRIT CHAPEL</h1>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:1.5px;">ESUT Agbani &middot; Dominus Regnant</p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:3px;background:linear-gradient(90deg,${C.gold},${C.goldLight},${C.gold});border-radius:2px;"></div>
            </td>
          </tr>

          <!-- ═══ BODY ═══ -->
          <tr>
            <td style="padding:32px;color:${C.text};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;">
              ${content}
            </td>
          </tr>

          ${scripture ? `
          <!-- ═══ SCRIPTURE FOOTER ═══ -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background-color:${C.gold};opacity:0.3;"></div>
            </td>
          </tr>
          <tr>
            <td style="background-color:${C.ivory};padding:24px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:${C.muted};line-height:1.5;">"${scripture.text}"</p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${C.gold};font-weight:700;">— ${scripture.reference}</p>
            </td>
          </tr>
          ` : ""}

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="background-color:${C.navyDark};padding:28px 32px;text-align:center;">
              <img src="${LOGO_URL}" alt="HSC" width="40" height="40" style="display:block;margin:0 auto 12px;width:40px;height:40px;border-radius:6px;opacity:0.8;" />
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.5px;">Holy Spirit Chapel &middot; ESUT Agbani, Enugu State</p>

              <!-- Links row -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${SITE_URL}" style="font-family:Arial,sans-serif;font-size:11px;color:${C.chapel};text-decoration:none;">Website</a>
                  </td>
                  <td style="color:rgba(255,255,255,0.2);font-size:11px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="${SITE_URL}/contact" style="font-family:Arial,sans-serif;font-size:11px;color:${C.chapel};text-decoration:none;">Contact</a>
                  </td>
                  <td style="color:rgba(255,255,255,0.2);font-size:11px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="${SITE_URL}/give" style="font-family:Arial,sans-serif;font-size:11px;color:${C.chapel};text-decoration:none;">Give</a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.5px;">DOMINUS REGNANT &middot; ARISE, SHINE</p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} Holy Spirit Chapel. All rights reserved.</p>

              ${unsubscribeUrl ? `
              <p style="margin:12px 0 0;font-size:10px;">
                <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,0.3);text-decoration:underline;font-family:Arial,sans-serif;">Unsubscribe from future emails</a>
              </p>
              ` : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ─── Shared UI helpers used across templates ─── */

export function badge(text: string, bg: string, color: string): string {
  return `<span style="display:inline-block;padding:4px 14px;background-color:${bg};color:${color};font-family:Arial,sans-serif;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">${text}</span>`;
}

export function infoRow(label: string, value: string, bold = false): string {
  return `<tr>
    <td style="padding:10px 16px;font-family:Arial,sans-serif;font-size:13px;color:${C.muted};border-bottom:1px solid #f0ede8;">${label}</td>
    <td style="padding:10px 16px;font-family:Arial,sans-serif;font-size:${bold ? "16px" : "14px"};font-weight:${bold ? "700" : "400"};color:${C.navy};text-align:right;border-bottom:1px solid #f0ede8;">${value}</td>
  </tr>`;
}

export function infoTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.ivory};border-radius:12px;margin:20px 0;">
    ${rows}
  </table>`;
}

export function ctaButton(text: string, href: string, bg: string = `linear-gradient(135deg,${C.gold},#FFD23F)`, color: string = C.navyDark): string {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${href}" style="display:inline-block;padding:14px 36px;background:${bg};color:${color};font-family:Arial,sans-serif;font-size:14px;font-weight:700;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">${text}</a>
  </div>`;
}

export function heading(text: string): string {
  return `<h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${C.navy};text-align:center;">${text}</h2>`;
}

export function subtext(text: string): string {
  return `<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};text-align:center;line-height:1.5;">${text}</p>`;
}

export function statusIcon(emoji: string, bg: string): string {
  return `<div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:${bg};text-align:center;line-height:56px;">
      <span style="font-size:28px;color:${C.white};">${emoji}</span>
    </div>
  </div>`;
}

export { C, SITE_URL };
