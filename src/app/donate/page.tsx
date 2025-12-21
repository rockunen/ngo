"use client";

import DonationForm from "@/components/DonationForm";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DonatePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-16 md:py-24 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-black/50 p-8 md:p-12 rounded-lg backdrop-blur-sm w-fit">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Your Generosity Makes a Difference
            </h1>
            <p className="text-lg md:text-xl text-orange-100 max-w-2xl leading-relaxed">
              Every donation helps us create meaningful impact in communities
              across India.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Side by Side */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Donation Form */}
          <div>
            <DonationForm />
          </div>

          {/* Right: What Your Donation Achieves */}
          <div>
            {/* Background Image with Overlay */}
            <div
              className="relative rounded-lg overflow-hidden flex flex-col justify-between"
              style={{
                backgroundImage: "url(/assests/savera1.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "600px",
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
                {/* Impact Tip Header */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full mb-6 w-fit">
                    <span className="text-2xl">💡</span>
                    <span className="font-semibold text-gray-900">
                      Impact Tip
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    What Your Donation Achieves
                  </h3>
                </div>

                {/* Impact Tips List */}
                <div className="space-y-3">
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-gray-900 font-semibold text-sm">
                      ₹500 - Provides food for 10 animals for one week
                    </p>
                  </div>
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-gray-900 font-semibold text-sm">
                      ₹1000 - Funds medical treatment for an injured animal
                    </p>
                  </div>
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-gray-900 font-semibold text-sm">
                      ₹2500 - Supports habitat restoration for 1 month
                    </p>
                  </div>
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-gray-900 font-semibold text-sm">
                      ₹5000 - Provides shelter and care for 5 rescued animals
                    </p>
                  </div>
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-gray-900 font-semibold text-sm">
                      ₹10000 - Funds a complete conservation project
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="card p-8 text-center hover:shadow-lg hover:border-orange-300 border-t-4 border-orange-500 transition">
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            Secure Payment
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Your payment is encrypted and processed securely through
            industry-standard gateways.
          </p>
        </div>

        <div className="card p-8 text-center hover:shadow-lg hover:border-orange-300 border-t-4 border-red-500 transition">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Tax Receipt</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Receive 80G tax deductible receipt instantly for your donation.
          </p>
        </div>

        <div className="card p-8 text-center hover:shadow-lg hover:border-orange-300 border-t-4 border-orange-400 transition">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            100% Transparent
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            100% of your donation goes directly to our programs and community
            work.
          </p>
        </div>
      </div>

      {/* Why Donate Section with Image */}
      <div className="grid md:grid-cols-2 gap-8 mb-16 items-center px-4 md:px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-10 border border-orange-200">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-6">
            Why Support Get Wish Foundation?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Proven Impact</h3>
                <p className="text-gray-700 text-sm">
                  Years of successful community and environmental initiatives.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Community Focus
                </h3>
                <p className="text-gray-700 text-sm">
                  We work directly with communities for sustainable impact.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Complete Transparency
                </h3>
                <p className="text-gray-700 text-sm">
                  Regular reports on how your donations create real change.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Registered NGO</h3>
                <p className="text-gray-700 text-sm">
                  Verified and registered with official certifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <img
            src="/assests/1.jpg"
            alt="Community Impact"
            className="rounded-lg shadow-2xl w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card p-8 md:p-10 shadow-lg mb-16 mx-4 md:mx-6 max-w-7xl md:mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <details className="border-b border-gray-200 pb-6 cursor-pointer group">
            <summary className="font-bold text-gray-900 hover:text-orange-700 text-lg flex items-center gap-3">
              <span className="text-2xl group-open:hidden">➕</span>
              <span className="text-2xl hidden group-open:inline text-orange-600">
                ➖
              </span>
              Is my donation secure?
            </summary>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Yes, we use industry-standard encryption and secure payment
              gateways. Your financial information is protected with the highest
              security standards. We never store your complete payment details
              on our servers.
            </p>
          </details>

          <details className="border-b border-gray-200 pb-6 cursor-pointer group">
            <summary className="font-bold text-gray-900 hover:text-orange-700 text-lg flex items-center gap-3">
              <span className="text-2xl group-open:hidden">➕</span>
              <span className="text-2xl hidden group-open:inline text-orange-600">
                ➖
              </span>
              Can I cancel my monthly donation?
            </summary>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Yes, you can cancel monthly donations anytime without penalty.
              Simply contact us at info@saveranationaltrust.org with your
              donation ID, and we'll process the cancellation within 2 business
              days.
            </p>
          </details>

          <details className="border-b border-gray-200 pb-6 cursor-pointer group">
            <summary className="font-bold text-gray-900 hover:text-orange-700 text-lg flex items-center gap-3">
              <span className="text-2xl group-open:hidden">➕</span>
              <span className="text-2xl hidden group-open:inline text-orange-600">
                ➖
              </span>
              What is the 80G tax benefit?
            </summary>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Get Wish Foundation is registered under Section 80G of the Indian
              Income Tax Act. You can claim tax deductions for your donations.
              We provide tax receipts for all donations immediately.
            </p>
          </details>

          <details className="border-b border-gray-200 pb-6 cursor-pointer group">
            <summary className="font-bold text-gray-900 hover:text-orange-700 text-lg flex items-center gap-3">
              <span className="text-2xl group-open:hidden">➕</span>
              <span className="text-2xl hidden group-open:inline text-orange-600">
                ➖
              </span>
              Do you accept international donations?
            </summary>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Currently, we accept donations in INR. For international donors or
              alternative payment methods, please contact us at
              info@saveranationaltrust.org. We're happy to explore options for
              your donation.
            </p>
          </details>

          <details className="pb-6 cursor-pointer group">
            <summary className="font-bold text-gray-900 hover:text-orange-700 text-lg flex items-center gap-3">
              <span className="text-2xl group-open:hidden">➕</span>
              <span className="text-2xl hidden group-open:inline text-orange-600">
                ➖
              </span>
              How are donations used?
            </summary>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Your donations support our four main focus areas: Food &
              Nutrition, Education, Environment, and Animal Welfare. We publish
              detailed impact reports regularly showing exactly how funds are
              utilized for maximum community impact.
            </p>
          </details>
        </div>
      </div>

      {/* Trust Section with Images */}
      <div className="grid md:grid-cols-3 gap-6 mb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="card p-6 text-center">
          <img
            src="/assests/80g.jpg"
            alt="80G Certificate"
            className="w-full h-32 object-contain mb-4"
          />
          <p className="text-gray-700 text-sm font-semibold">
            80G Tax Exemption
          </p>
        </div>
        <div className="card p-6 text-center">
          <img
            src="/assests/niti.jpg"
            alt="Niti Aayog"
            className="w-full h-32 object-contain mb-4"
          />
          <p className="text-gray-700 text-sm font-semibold">
            Niti Aayog Registered
          </p>
        </div>
        <div className="card p-6 text-center">
          <img
            src="/assests/fcra.jpg"
            alt="FCRA Certificate"
            className="w-full h-32 object-contain mb-4"
          />
          <p className="text-gray-700 text-sm font-semibold">FCRA Registered</p>
        </div>
      </div>

      {/* CTA Section with Background Image */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-6 text-white mt-8"
        style={{
          backgroundImage: "url(/assests/6.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/85 to-red-600/85"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Every Donation Counts
          </h2>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Whether it's ₹100 or ₹1,00,000, your support directly helps us
            create real change in communities.
          </p>
          <Link
            href="#donation-form"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
}
