import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pink-600 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-pink-50">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We collect information you provide directly to us, such as when
                you make a donation, register as a volunteer or intern, or
                contact us. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Name and email address</li>
                <li>Phone number</li>
                <li>Mailing address</li>
                <li>Payment information (for donations)</li>
                <li>Other information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Process donations and send receipts</li>
                <li>Communicate with you about our programs and activities</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal and tax requirements</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the Internet or electronic storage is 100%
                secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Third-Party Sharing
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We may share information with trusted partners
                who assist us in operating our website and conducting our
                business, provided they agree to keep this information
                confidential.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may use cookies to enhance your experience. You can
                choose to disable cookies through your browser settings,
                although this may limit your ability to use certain features of
                our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You have the right to access, correct, or delete your personal
                information. You can also opt-out of our mailing list at any
                time. To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:info@getWishFoundation.in"
                  className="text-pink-600 font-bold hover:text-pink-700"
                >
                  info@getWishFoundation.in
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically to reflect
                changes in our practices or for other reasons. We encourage you
                to review this page regularly to stay informed about how we
                protect your information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy or our privacy
                practices, please{" "}
                <Link
                  href="/contact"
                  className="text-pink-600 font-bold hover:text-pink-700"
                >
                  contact us
                </Link>
                .
              </p>
            </div>

            <div className="bg-pink-50 border border-red-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> December 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
