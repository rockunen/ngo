import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Donation Failed | Get Wish Foundation",
  description: "There was an issue processing your donation.",
};

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-pink-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          We couldn't process your donation at this time. Your account has not been charged.
        </p>

        {/* Details Card */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="text-left space-y-4 mb-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">WHAT HAPPENED?</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                Transaction Declined or Cancelled
              </p>
            </div>
            <p className="text-gray-700 text-sm">
              This usually happens when the payment is cancelled, the bank declines the transaction, or there is a temporary issue with the payment gateway.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-gray-600 text-sm font-semibold">POSSIBLE REASONS</p>
              <ul className="text-gray-700 text-sm mt-2 space-y-2">
                <li>• You cancelled the payment</li>
                <li>• Insufficient funds or limits</li>
                <li>• Bank server timeout</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-gray-600 text-sm font-semibold">WHAT TO DO NEXT</p>
              <ul className="text-gray-700 text-sm mt-2 space-y-2">
                <li>• Try again with a different method</li>
                <li>• Contact your bank if issues persist</li>
                <li>• Reach out to our support team</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link
            href="/donate"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition shadow"
          >
            Try Again
          </Link>
          <a
            href="mailto:info@getwishfoundation.in"
            className="inline-block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Contact Support
          </a>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">
            📧 Need help?
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            If you believe your account was charged but you see this error, please don't worry. The amount will be automatically refunded by your bank within 5-7 business days. 
          </p>
          <p className="text-blue-800 text-sm">
            <strong>Support:</strong> info@getwishfoundation.in
          </p>
        </div>
      </div>
    </div>
  );
}
