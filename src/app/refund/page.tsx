export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-red-600 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-red-50">
            Transparent and fair refund policies for our donors
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-900 font-semibold">
                At Get Wish Foundation, we believe in maintaining the highest
                standards of transparency and integrity. This refund policy
                outlines the terms under which refunds are processed for
                donations made to our organization.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Donation Refund Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Donations made to Get Wish Foundation are voluntary
                contributions to support our mission. Generally, donations are
                non-refundable once processed. However, we understand that
                circumstances may change, and we handle refund requests on a
                case-by-case basis.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Eligible Refund Requests
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A refund request may be considered under the following
                circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>
                  Duplicate or accidental donations made within 7 days of the
                  transaction
                </li>
                <li>
                  Technical errors during the donation process that resulted in
                  multiple charges
                </li>
                <li>
                  Unauthorized transactions (fraud) within 30 days of discovery
                </li>
                <li>
                  Service-related issues where a specific program or service was
                  not delivered as promised
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Refund Request Process
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mt-4">
                <li>
                  Contact us at{" "}
                  <a
                    href="mailto:info@saveranationaltrust.org"
                    className="text-red-600 font-bold hover:text-red-700"
                  >
                    info@saveranationaltrust.org
                  </a>{" "}
                  with your donation details
                </li>
                <li>Provide your transaction ID and date of donation</li>
                <li>Explain the reason for your refund request</li>
                <li>
                  Our team will review your request and respond within 10
                  business days
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Refund Timeline
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Once a refund request is approved, the following timelines apply
                based on your payment method:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Credit/Debit Card: 5-10 business days</li>
                <li>Bank Transfer: 7-15 business days</li>
                <li>
                  Online Payment Gateways (UPI, Wallet): 3-5 business days
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Non-Refundable Donations
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The following donations are generally non-refundable:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>
                  Donations made intentionally for a specific cause or program
                </li>
                <li>
                  Donations that have already been utilized for charitable
                  purposes
                </li>
                <li>
                  Donations made more than 30 days ago (except in cases of
                  fraud)
                </li>
                <li>Donations made through offline channels (checks, cash)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Tax Implications
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Please note that if you receive a refund for a donation, Savera
                National Trust will not reissue a tax receipt for that amount.
                You may need to consult with a tax professional regarding any
                tax implications of the refund.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Exceptional Cases
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Get Wish Foundation reserves the right to process refunds for
                other exceptional circumstances not mentioned above. Such
                requests will be reviewed and decided on their individual merits
                by our management team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For any questions or to submit a refund request:
              </p>
              <div className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@saveranationaltrust.org"
                    className="text-red-600 font-bold hover:text-red-700"
                  >
                    info@saveranationaltrust.org
                  </a>
                </p>
                <p className="text-gray-900 mt-2">
                  <strong>Address:</strong> G76, Noida Sector 63, Uttar Pradesh,
                  India
                </p>
                <p className="text-gray-900 mt-2">
                  <strong>Phone:</strong> +91 (XXX) XXX-XXXX
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> December 2024
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Get Wish Foundation reserves the right to modify this policy at
                any time. Changes will be communicated to donors via email or
                through our website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
