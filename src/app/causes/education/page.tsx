"use client";

import Link from "next/link";

export default function Education() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header with Background Image */}
      <section
        className="relative py-20 md:py-32 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎓 Education & Skill Development
          </h1>
          <p className="text-lg md:text-xl text-orange-100">
            Empowering minds, building futures
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Education Programs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We provide quality education, skill training, and mentorship to
              underprivileged children and youth, enabling them to build better
              futures for themselves and their families.
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
                  title: "Scholarship Programs",
                  desc: "Financial aid for deserving students to pursue higher education.",
                  icon: "📚",
                },
                {
                  title: "Skill Training Centers",
                  desc: "Vocational training in IT, tailoring, welding, and more.",
                  icon: "🛠️",
                },
                {
                  title: "Digital Literacy",
                  desc: "Computer training and internet literacy programs.",
                  icon: "💻",
                },
                {
                  title: "Educational Support",
                  desc: "Tutoring, study materials, and exam preparation.",
                  icon: "✏️",
                },
                {
                  title: "Career Counseling",
                  desc: "Guidance for educational and career planning.",
                  icon: "🎯",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 border-l-4 border-blue-500 bg-gray-50 hover:shadow-lg transition rounded"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-blue-600 mb-2">
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 border border-blue-200">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
                <p className="text-gray-700">Students Supported</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">2K+</div>
                <p className="text-gray-700">Scholarships Awarded</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <p className="text-gray-700">Youth Trained</p>
              </div>
            </div>
          </div>

          {/* How to Help */}
          <div className="border-2 border-blue-300 rounded-2xl p-8 md:p-12 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              How You Can Help
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-blue-600">
                  Sponsor Education
                </h3>
                <p className="text-gray-700">
                  Fund scholarships for deserving students.
                </p>
                <Link
                  href="/donate"
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  Donate Now →
                </Link>
              </div>
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-blue-600">
                  Volunteer Tutor
                </h3>
                <p className="text-gray-700">
                  Teach or mentor students in your area.
                </p>
                <Link
                  href="/internship"
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition"
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
          backgroundImage: "url(/assests/4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Education is the Key to Tomorrow
          </h2>
          <p className="text-lg text-orange-100">
            Help us empower the next generation with quality education
          </p>
          <Link
            href="/donate"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Support Education
          </Link>
        </div>
      </section>

    </main>
  );
}
