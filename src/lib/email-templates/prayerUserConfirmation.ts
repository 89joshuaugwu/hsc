/**
 * prayerUserConfirmation.ts — Sent to person who submitted a prayer request
 */
import { emailLayout, heading, C } from "./emailLayout";

export function prayerUserConfirmation(data: {
  name: string;
}): { subject: string; html: string } {
  const content = `
    ${heading("Your Prayer Has Been Received")}

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.text};">Dear <strong>${data.name}</strong>,</p>

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:${C.muted};line-height:1.6;">Be encouraged — you have taken a step of faith by bringing your request before God. We want you to know that your prayer matters to us and to the Lord.</p>

    <div style="background-color:${C.ivory};border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${C.navy};font-style:italic;line-height:1.5;">Our prayer team will lift this before the Lord on your behalf.</p>
    </div>

    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};line-height:1.5;">Remember, God hears every prayer. Whether the answer comes quickly or in His perfect timing, trust that He is working all things for your good.</p>

    <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${C.muted};">With love and prayers,<br/><strong style="color:${C.navy};">Holy Spirit Chapel Prayer Team</strong></p>
  `;

  return {
    subject: "Your prayer has been received | Holy Spirit Chapel",
    html: emailLayout(content, {
      preheader: `Dear ${data.name}, your prayer request has been received. We are praying with you.`,
      scripture: {
        text: "Cast all your anxiety on him because he cares for you.",
        reference: "1 Peter 5:7",
      },
    }),
  };
}
