export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-emerald-700 mb-10">Last updated: July 2026</p>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            When you use Helping Hands, we collect the following information:
          </p>
          <ul className="text-gray-700 leading-relaxed space-y-2 list-disc list-inside">
            <li>Full name and email address, provided when you create an account.</li>
            <li>Account password, which is securely hashed and never stored in plain text.</li>
            <li>Funding request details, submitted by students seeking support.</li>
            <li>Payment proof screenshots, uploaded to confirm a completed donation.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We use the information you provide solely to operate the platform: to
            verify your identity as a student or donor, to display funding requests,
            to confirm donations, and to communicate with you about your account.
            We do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Store Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Account data is stored securely using MongoDB Atlas. Uploaded proof
            images are stored using Cloudinary, a third-party media hosting
            service. Access to these systems is restricted and protected using
            industry-standard authentication.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            We use Cloudinary to host uploaded images and MongoDB Atlas to store
            application data. These providers may process your data as part of
            delivering their service to us, under their own respective privacy
            and security policies.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Choices</h2>
          <p className="text-gray-700 leading-relaxed">
            You may request that your account and associated data be deleted at
            any time by contacting us. We will remove your information within a
            reasonable timeframe, except where retention is required for fraud
            prevention or legal compliance.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy or how your data is
            handled, contact us at{" "}
            <a href="mailto:support@example.com" className="text-emerald-700 underline">
              deepakdoultani00@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
