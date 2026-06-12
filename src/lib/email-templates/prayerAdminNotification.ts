/**
 * prayerAdminNotification.ts — Sent to prayer email when request submitted
 */
import { emailLayout, heading, subtext, infoTable, infoRow, badge, C } from "./emailLayout";

export function prayerAdminNotification(data: {
  name: string;
  email: string;
  topic: string;
  request: string;
  isPrivate: boolean;
  date: string;
}): { subject: string; html: string } {
  const content = `
    ${data.isPrivate ? `<div style="text-align:center;margin-bottom:16px;">${badge("CONFIDENTIAL", "#FEE2E2", "#991B1B")}</div>` : ""}

    ${heading("New Prayer Request")}
    ${subtext("A member of the community has submitted a prayer request.")}

    ${infoTable(
      infoRow("Name", `<strong>${data.name}</strong>`) +
      infoRow("Email", `<a href="mailto:${data.email}" style="color:${C.chapel};text-decoration:none;">${data.email}</a>`) +
      infoRow("Topic", data.topic || "N/A") +
      infoRow("Date", data.date) +
      (data.isPrivate ? infoRow("Privacy", badge("Private", "#FEE2E2", "#991B1B")) : "")
    )}

    <div style="border-left:4px solid ${data.isPrivate ? C.red : C.chapel};background-color:${C.ivory};padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:${C.light};text-transform:uppercase;letter-spacing:1px;">Prayer Request</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${C.text};line-height:1.6;">${data.request.replace(/\n/g, "<br/>")}</p>
    </div>

    ${data.isPrivate ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#991B1B;text-align:center;"><strong>This request is marked private.</strong> Please handle with utmost confidentiality.</p>` : ""}
  `;

  return {
    subject: `Prayer Request from ${data.name}${data.isPrivate ? " [PRIVATE]" : ""} | Holy Spirit Chapel`,
    html: emailLayout(content, {
      preheader: `New prayer request from ${data.name}: ${data.topic || "General"}`,
      scripture: {
        text: "The prayer of a righteous person is powerful and effective.",
        reference: "James 5:16",
      },
    }),
  };
}
