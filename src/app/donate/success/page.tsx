import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation Successful | Save Rana National Trust",
  description: "Thank you for your donation to Save Rana National Trust!",
};

function SuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You for Your Donation! 🦎
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your generous contribution will help us protect endangered species and
          restore their habitats.
        </p>

        {/* Details Card */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="text-left space-y-4 mb-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">DONATION RECEIPT</p>
              <p className="text-2xl font-bold text-gray-900">
                Receipt Sent to Your Email
              </p>
            </div>
            <p className="text-gray-700">
              A detailed receipt has been sent to your email address. You can
              use this for tax deduction under Section 80G of the Indian Income
              Tax Act.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">WHAT HAPPENS NEXT</p>
              <ul className="text-gray-700 text-sm mt-2 space-y-2">
                <li>✓ Receipt generated and sent</li>
                <li>✓ Fund transferred to our account</li>
                <li>✓ You'll receive impact updates</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">YOUR IMPACT</p>
              <ul className="text-gray-700 text-sm mt-2 space-y-2">
                <li>🌿 Habitat restoration</li>
                <li>🔬 Research & breeding</li>
                <li>📚 Community education</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Back to Home
          </Link>
          <a
            href="mailto:admin@saverana.org"
            className="inline-block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Contact Us
          </a>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">
            📧 Check Your Email
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            You should receive a donation receipt within a few minutes. If you
            don't see it, check your spam folder or contact us.
          </p>
          <p className="text-blue-800 text-sm">
            <strong>Email:</strong> admin@saverana.org
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
