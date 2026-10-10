export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-700 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-pink-100">
            Transparent and fair refund policies for our donors
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <div className="space-y-8">
            <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6">
              <p className="text-gray-900 font-semibold text-lg">
                ❌ NO REFUND ALLOWED
              </p>
              <p className="text-gray-700 mt-3">
                All donations made to Get Wish Foundation are final and
                non-refundable. Once a donation is completed and verified, it
                cannot be reversed or refunded under any circumstances.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-pink-600">📋</span> Policy Details
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-pink-600 font-bold">✓</span>
                  <span>All donations are voluntary and final</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-600 font-bold">✓</span>
                  <span>
                    No refunds will be issued once payment is processed
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-600 font-bold">✓</span>
                  <span>Donations cannot be transferred or reassigned</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-600 font-bold">✓</span>
                  <span>
                    All donations are tax-deductible under Section 80G
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-pink-600">🤔</span> Frequently Asked
                Questions
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    What if I made a donation by mistake?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Unfortunately, we cannot process refunds. However, if there
                    was a technical error or duplicate charge, please contact us
                    immediately at support@getwishfoundation.org with your
                    transaction details.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Is my donation secure?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Yes, all donations are processed through Razorpay with
                    industry-standard encryption and security protocols.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-700">
                <strong>📅 Last Updated:</strong> December 21, 2025
              </p>
              <p className="text-sm text-gray-700 mt-3">
                Get Wish Foundation reserves the right to modify this policy at
                any time. Changes will be communicated to donors via email or
                through our website.
              </p>
              <p className="text-sm text-gray-700 mt-3">
                <strong>❓ Questions?</strong> Contact us at
                support@getwishfoundation.org
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
