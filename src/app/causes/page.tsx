"use client";

import Link from "next/link";

export default function Causes() {
  const causes = [
    {
      id: "animals",
      icon: "🐾",
      title: "Animal Welfare",
      shortDesc: "Protecting and caring for animals in need",
      fullDesc:
        "We are committed to the welfare and protection of animals. Our animal welfare programs focus on rescue, rehabilitation, and adoption of stray and abandoned animals. We work with veterinarians and animal care specialists to ensure every animal receives proper medical care and treatment.",
      initiatives: [
        "Rescue and rehabilitation programs",
        "Veterinary care and medical support",
        "Animal shelter management",
        "Community awareness about animal rights",
        "Pet adoption drives",
      ],
      color: "from-pink-600 to-pink-500",
    },
    {
      id: "environment",
      icon: "🌍",
      title: "Environmental Conservation",
      shortDesc: "Protecting our planet for future generations",
      fullDesc:
        "Environmental conservation is at the heart of our mission. We work on sustainable development, tree plantation drives, plastic waste management, and renewable energy initiatives. Our goal is to create a healthier, greener planet for everyone.",
      initiatives: [
        "Tree plantation and reforestation",
        "Plastic waste management programs",
        "Clean water initiatives",
        "Renewable energy promotion",
        "Community environmental education",
      ],
      color: "from-green-600 to-green-500",
    },
    {
      id: "food",
      icon: "🍎",
      title: "Food & Nutrition Security",
      shortDesc: "Ensuring no one goes hungry",
      fullDesc:
        "Food security is a fundamental human right. We run food distribution programs, school meal initiatives, and nutrition awareness campaigns. We work with local communities to ensure access to nutritious food for vulnerable populations, especially children and elderly.",
      initiatives: [
        "Community food distribution",
        "School meal programs",
        "Nutrition awareness workshops",
        "Agricultural support for farmers",
        "Kitchen garden initiatives",
      ],
      color: "from-yellow-600 to-yellow-500",
    },
    {
      id: "skills",
      icon: "🎓",
      title: "Skill Development",
      shortDesc: "Empowering people through education and training",
      fullDesc:
        "We believe education and skills are the keys to breaking the cycle of poverty. Our skill development programs provide vocational training, digital literacy, and entrepreneurship training to youth and adults, enabling them to secure better livelihoods.",
      initiatives: [
        "Vocational training programs",
        "Digital literacy courses",
        "Entrepreneurship development",
        "Job placement assistance",
        "Scholarship programs for underprivileged students",
      ],
      color: "from-blue-600 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pink-600 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Causes
          </h1>
          <p className="text-lg text-pink-50">
            Making a difference across multiple social sectors
          </p>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {causes.map((cause) => (
              <div
                key={cause.id}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-r ${cause.color} p-8 text-white`}
                >
                  <div className="text-6xl mb-4">{cause.icon}</div>
                  <h2 className="text-3xl font-bold mb-2">{cause.title}</h2>
                  <p className="text-white/90">{cause.shortDesc}</p>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {cause.fullDesc}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Our Initiatives
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {cause.initiatives.map((initiative, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-xl mt-1">✓</span>
                        <span className="text-gray-700">{initiative}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/donate"
                    className="btn-primary inline-block w-full text-center"
                  >
                    Support This Cause
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-pink-50 py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "👥", stat: "50,000+", label: "People Reached" },
              { icon: "🌳", stat: "100,000+", label: "Trees Planted" },
              { icon: "🎓", stat: "5,000+", label: "Students Trained" },
              { icon: "🏥", stat: "10,000+", label: "Medical Treatments" },
            ].map((item, i) => (
              <div key={i} className="text-center card p-6">
                <div className="text-5xl mb-3">{item.icon}</div>
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {item.stat}
                </div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Be Part of the Change
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Every contribution, no matter how small, makes a real difference in
            the lives of people and communities we serve. Together, we can build
            a better future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="btn-primary text-lg px-8 py-3 inline-block"
            >
              Donate Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-pink-600 text-pink-600 font-bold py-3 px-8 rounded-lg hover:bg-pink-50 transition-all text-lg inline-block"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
