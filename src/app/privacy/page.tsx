import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Holy Spirit Chapel",
  description: "Privacy Policy for Holy Spirit Chapel ESUT Agbani",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-navy-500 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-navy max-w-none font-body text-text-muted space-y-6">
          <p><strong>Last Updated:</strong> June 4, 2026</p>

          <p>
            Welcome to the Holy Spirit Chapel (ESUT Agbani) website. We are committed to protecting your personal information and your right to privacy.
            If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our services, 
            when participating in activities on the website (such as filling a contact form, submitting a prayer request, or subscribing to our newsletter), 
            or otherwise contacting us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. 
            The personal information we collect can include the following:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Name and Contact Data:</strong> We collect your first and last name, email address, phone number, and other similar contact data.</li>
            <li><strong>Payment Information:</strong> If you choose to give online, we collect data necessary to process your payment (e.g. proof of transfer or Paystack references). We do not store full credit card numbers; payment processing is handled securely by our payment partners.</li>
          </ul>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of organizational purposes described below:
          </p>
          <ul className="list-disc pl-5">
            <li>To respond to your inquiries and offer support.</li>
            <li>To send you updates, newsletters, and announcements (if you have opted in).</li>
            <li>To process your donations and send you receipts.</li>
            <li>To pray for you (in the case of prayer requests).</li>
          </ul>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">3. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill organizational obligations.
            We do not sell your personal data to third parties. 
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">4. How Long Do We Keep Your Information?</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">5. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may contact us via our Contact Page.
          </p>
        </div>
      </div>
    </main>
  );
}
