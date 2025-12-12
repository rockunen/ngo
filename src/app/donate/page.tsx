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

      {/* Main Content */}
      <div className="py-12 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Donation Form */}
            <div className="md:col-span-2">
              <div className="card p-8 md:p-10 mb-8 shadow-lg border-l-4 border-orange-500">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Make Your Donation
                </h2>
                <DonationForm />
              </div>
            </div>

            {/* Donation Image */}
            <div className="md:col-span-1">
              <img
                src="/assests/savera1.jpg"
                alt="Donation Impact"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="mt-4 bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3">
                  💡 Impact Tip
                </h3>
                <p className="text-gray-700 text-sm">
                  Your donation is 100% tax deductible under Section 80G of the
                  Indian Income Tax Act.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
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
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Tax Receipt
              </h3>
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
                100% of your donation goes directly to our programs and
                community work.
              </p>
            </div>
          </div>

          {/* Why Donate Section with Image */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-10 border border-orange-200">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-6">
                Why Support Get Wish Foundation?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Proven Impact
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Years of successful community and environmental
                      initiatives.
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
                    <h3 className="font-bold text-gray-900 mb-1">
                      Registered NGO
                    </h3>
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

          {/* Impact Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              What Your Donation Achieves
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  amount: "₹500",
                  impact: "Provides meals for 5 families",
                  icon: "🍽️",
                },
                {
                  amount: "₹1,000",
                  impact: "Supports education for 10 children",
                  icon: "📚",
                },
                {
                  amount: "₹5,000",
                  impact: "Provides healthcare to 20 people",
                  icon: "⚕️",
                },
                {
                  amount: "₹10,000",
                  impact: "Plants 100 trees",
                  icon: "🌳",
                },
                {
                  amount: "₹25,000",
                  impact: "Vocational training for 25 youth",
                  icon: "🛠️",
                },
                {
                  amount: "₹1,00,000",
                  impact: "Year-long community program",
                  icon: "🌍",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/20 transition text-center"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-2xl font-bold mb-2">{item.amount}</div>
                  <p className="text-orange-100 text-sm leading-relaxed">
                    {item.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card p-8 md:p-10 shadow-lg mb-16">
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
                  gateways. Your financial information is protected with the
                  highest security standards. We never store your complete
                  payment details on our servers.
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
                  donation ID, and we'll process the cancellation within 2
                  business days.
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
                  Get Wish Foundation is registered under Section 80G of the
                  Indian Income Tax Act. You can claim tax deductions for your
                  donations. We provide tax receipts for all donations
                  immediately.
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
                  Currently, we accept donations in INR. For international
                  donors or alternative payment methods, please contact us at
                  info@saveranationaltrust.org. We're happy to explore options
                  for your donation.
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
                  Nutrition, Education, Environment, and Animal Welfare. We
                  publish detailed impact reports regularly showing exactly how
                  funds are utilized for maximum community impact.
                </p>
              </details>
            </div>
          </div>

          {/* Trust Section with Images */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
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
              <p className="text-gray-700 text-sm font-semibold">
                FCRA Registered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Background Image */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-6 text-white"
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
