"use client";

import Link from "next/link";

export default function Environment() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header with Background Image */}
      <section
        className="relative py-20 md:py-32 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/5.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🌍 Environment & Sustainability
          </h1>
          <p className="text-lg md:text-xl text-pink-100">
            Protecting our planet for future generations
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Environmental Programs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are committed to environmental conservation through tree
              planting, waste management, renewable energy initiatives, and
              community awareness programs to create a sustainable future.
            </p>
          </div>

          {/* Key Initiatives */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Key Initiatives
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Tree Plantation",
                  desc: "Planting trees and creating green spaces in urban and rural areas.",
                  icon: "🌳",
                },
                {
                  title: "Waste Management",
                  desc: "Promoting recycling and proper disposal of waste.",
                  icon: "♻️",
                },
                {
                  title: "Clean Water",
                  desc: "Installing water harvesting systems and purification units.",
                  icon: "💧",
                },
                {
                  title: "Renewable Energy",
                  desc: "Promoting solar and sustainable energy solutions.",
                  icon: "☀️",
                },
                {
                  title: "Community Awareness",
                  desc: "Environmental education and conservation workshops.",
                  icon: "🌱",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 border-l-4 border-green-500 bg-gray-50 hover:shadow-lg transition rounded"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-200">
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  50K+
                </div>
                <p className="text-gray-700">Trees Planted</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  100T+
                </div>
                <p className="text-gray-700">Waste Recycled</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  20K+
                </div>
                <p className="text-gray-700">People Engaged</p>
              </div>
            </div>
          </div>

          {/* How to Help */}
          <div className="border-2 border-green-300 rounded-2xl p-8 md:p-12 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              How You Can Help
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold text-green-600">
                  Support Green Projects
                </h3>
                <p className="text-gray-700">
                  Fund environmental conservation initiatives.
                </p>
                <Link
                  href="/donate"
                  className="inline-block text-green-600 font-semibold hover:text-green-700 transition"
                >
                  Donate Now →
                </Link>
              </div>
              <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold text-green-600">Volunteer</h3>
                <p className="text-gray-700">
                  Join our tree planting and clean-up drives.
                </p>
                <Link
                  href="/internship"
                  className="inline-block text-green-600 font-semibold hover:text-green-700 transition"
                >
                  Join Us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/6.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            A Greener Tomorrow Starts Today
          </h2>
          <p className="text-lg text-pink-100">
            Help us protect our environment for future generations
          </p>
          <Link
            href="/donate"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Support Environment
          </Link>
        </div>
      </section>
    </main>
  );
}
