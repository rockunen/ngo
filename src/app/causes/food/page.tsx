"use client";

import Link from "next/link";

export default function Food() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header with Background Image */}
      <section
        className="relative py-20 md:py-32 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🥗 Food & Nutrition
          </h1>
          <p className="text-lg md:text-xl text-orange-100">
            Ensuring no one sleeps hungry
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Food Security Programs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We run community kitchens, distribute ration kits, and provide
              nutritious meals to children, the elderly, and vulnerable
              families.
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
                  title: "Community Kitchens",
                  desc: "Serving hot meals to those in need across urban and rural areas.",
                  icon: "🍲",
                },
                {
                  title: "Ration Distribution",
                  desc: "Providing essential grocery kits to low-income families.",
                  icon: "📦",
                },
                {
                  title: "Child Nutrition",
                  desc: "Supplying mid-day meals and fortified foods to children.",
                  icon: "👶",
                },
                {
                  title: "Emergency Relief",
                  desc: "Rapid food relief during disasters and crises.",
                  icon: "🆘",
                },
                {
                  title: "Nutrition Awareness",
                  desc: "Workshops on balanced diets and healthy eating.",
                  icon: "📚",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 border-l-4 border-orange-500 bg-gray-50 hover:shadow-lg transition rounded"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-orange-600 mb-2">
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
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 border border-orange-200">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-900 mb-6">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  2M+
                </div>
                <p className="text-gray-700">Meals Served</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  50K+
                </div>
                <p className="text-gray-700">Families Supported</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  10K+
                </div>
                <p className="text-gray-700">Children Nourished</p>
              </div>
            </div>
          </div>

          {/* How to Help */}
          <div className="border-2 border-orange-300 rounded-2xl p-8 md:p-12 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              How You Can Help
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-bold text-orange-600">
                  Sponsor Meals
                </h3>
                <p className="text-gray-700">
                  Fund daily meals for children and the elderly.
                </p>
                <Link
                  href="/donate"
                  className="inline-block text-orange-600 font-semibold hover:text-orange-700 transition"
                >
                  Donate Now →
                </Link>
              </div>
              <div className="space-y-3 p-4 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-bold text-orange-600">Volunteer</h3>
                <p className="text-gray-700">
                  Help us cook and distribute meals in your locality.
                </p>
                <Link
                  href="/internship"
                  className="inline-block text-orange-600 font-semibold hover:text-orange-700 transition"
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
          backgroundImage: "url(/assests/2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Together, We Can End Hunger
          </h2>
          <p className="text-lg text-orange-100">
            Support our mission to provide nutritious food to all
          </p>
          <Link
            href="/donate"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Support Nutrition
          </Link>
        </div>
      </section>

    </main>
  );
}
