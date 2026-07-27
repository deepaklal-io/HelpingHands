export default function AboutUs() {
  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About Helping Hands</h1>
        <p className="text-emerald-700 mb-10">Connecting need with kindness</p>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            Helping Hands is a platform built to connect students facing genuine
            financial hardship with donors willing to support their education.
            Our goal is simple: make it easier for people who need help to be
            seen, and for people who want to help to find someone real to support.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h2>
          <ul className="text-gray-700 leading-relaxed space-y-2 list-disc list-inside">
            <li>Students create an account using a verified university email address.</li>
            <li>Students submit a funding request describing their need.</li>
            <li>Donors browse requests and choose who they'd like to support.</li>
            <li>Once a donation is made, students upload proof of payment for transparency.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Why We Verify Students</h2>
          <p className="text-gray-700 leading-relaxed">
            To keep this platform trustworthy, only students with a valid university
            email address (ending in .edu.pk) can create funding requests. This
            reduces misuse and helps donors give with confidence.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Have questions, concerns, or feedback about Helping Hands? Reach out to
            us at{" "}
            <a href="mailto:support@example.com" className="text-emerald-700 underline">
              support@example.com
            </a>
            . We're a small, independent project and take reports of misuse seriously.
          </p>
        </section>
      </div>
    </div>
  );
}
