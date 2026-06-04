import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Holy Spirit Chapel",
  description: "Terms of Service for Holy Spirit Chapel ESUT Agbani",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-navy-500 mb-8">Terms of Service</h1>
        
        <div className="prose prose-navy max-w-none font-body text-text-muted space-y-6">
          <p><strong>Last Updated:</strong> June 4, 2026</p>

          <p>
            Welcome to the Holy Spirit Chapel (ESUT Agbani) website. By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">1. Use License</h2>
          <p>
            Permission is granted to temporarily view the materials (information or software) on Holy Spirit Chapel's website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">2. Donations and Giving</h2>
          <p>
            Any donations, offerings, tithes, or monetary gifts made through this website are voluntary. 
            By making a donation, you confirm that you have the authorization to use the selected payment method. 
            All donations are final, though exceptions may be considered in cases of proven unauthorized transactions or technical errors.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">3. User Submissions</h2>
          <p>
            Any information you submit to us via contact forms, prayer requests, or email must be truthful and must not violate the rights of any third party. 
            We reserve the right to remove any inappropriate or offensive submissions.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">4. Links to Third-Party Sites</h2>
          <p>
            Our website may contain links to third-party websites or services that are not owned or controlled by Holy Spirit Chapel. 
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2 className="font-heading text-xl text-navy-500 font-bold mt-8">5. Modifications</h2>
          <p>
            Holy Spirit Chapel may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </div>
      </div>
    </main>
  );
}
