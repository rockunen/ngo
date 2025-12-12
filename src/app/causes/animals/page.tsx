"use client";

import Link from "next/link";

export default function Animals() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header with Background Image */}
      <section
        className="relative py-20 md:py-32 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🐾 Animal Welfare & Protection
          </h1>
          <p className="text-lg md:text-xl text-orange-100">
            Protecting and caring for our animal friends
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Animal Welfare Programs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are dedicated to the protection and welfare of animals through
              rescue operations, medical care, rehabilitation, and community
              education on animal rights and responsible pet ownership.
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
                  title: "Animal Rescue",
                  desc: "Rescuing stray and abandoned animals from harsh conditions.",
                  icon: "🚑",
                },
                {
                  title: "Veterinary Care",
                  desc: "Providing free medical treatment and health care services.",
                  icon: "⚕️",
                },
                {
                  title: "Adoption Programs",
                  desc: "Finding loving homes for rescued animals.",
                  icon: "🏠",
                },
                {
                  title: "Animal Sanctuary",
                  desc: "Safe shelters and rehabilitation centers for animals.",
                  icon: "🏞️",
                },
                {
                  title: "Community Awareness",
                  desc: "Education on animal rights, welfare, and compassion.",
                  icon: "📢",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 border-l-4 border-purple-500 bg-gray-50 hover:shadow-lg transition rounded"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-purple-600 mb-2">
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
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 border border-purple-200">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  3K+
                </div>
                <p className="text-gray-700">Animals Rescued</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  2K+
                </div>
                <p className="text-gray-700">Adoptions Successful</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  500+
                </div>
                <p className="text-gray-700">Animals in Shelter</p>
              </div>
            </div>
          </div>

          {/* How to Help */}
          <div className="border-2 border-purple-300 rounded-2xl p-8 md:p-12 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              How You Can Help
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-bold text-purple-600">
                  Support Animal Care
                </h3>
                <p className="text-gray-700">
                  Fund rescue, medical, and rehabilitation services.
                </p>
                <Link
                  href="/donate"
                  className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition"
                >
                  Donate Now →
                </Link>
              </div>
              <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-bold text-purple-600">
                  Adopt or Volunteer
                </h3>
                <p className="text-gray-700">
                  Adopt a rescued animal or volunteer with us.
                </p>
                <Link
                  href="/internship"
                  className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition"
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
          backgroundImage: "url(/assests/3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Every Animal Deserves Care and Compassion
          </h2>
          <p className="text-lg text-orange-100">
            Help us protect and rescue animals in need
          </p>
          <Link
            href="/donate"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Support Animal Welfare
          </Link>
        </div>
      </section>
    </main>
  );
}
