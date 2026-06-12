/**
 * email-templates barrel export
 *
 * Import all templates from this single entry point:
 *   import { send2FACode, contactAdminNotification, ... } from "@/lib/email-templates"
 */
export { emailLayout } from "./emailLayout";
export { send2FACode } from "./otpEmail";
export { contactAdminNotification } from "./contactAdminNotification";
export { contactUserAutoReply } from "./contactUserAutoReply";
export { prayerAdminNotification } from "./prayerAdminNotification";
export { prayerUserConfirmation } from "./prayerUserConfirmation";
export { subscribeWelcome } from "./subscribeWelcome";
export { subscriberBroadcast } from "./subscriberBroadcast";
export { paymentReceiptVerified } from "./paymentReceiptVerified";
export { paymentPendingBankTransfer } from "./paymentPendingBankTransfer";
export { paymentRejected } from "./paymentRejected";
export { adminPendingPayment } from "./adminPendingPayment";
export { testEmail } from "./testEmail";
