"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function About() {
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
      {/* Page Header with Background Image */}
      <section
        className="relative py-16 md:py-24 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-black/50 p-8 md:p-10 rounded-lg backdrop-blur-sm w-fit">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg md:text-xl text-orange-100">
              Learn about our mission and impact
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Mission Section with Image */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Get Wish Foundation is a non-profit organization established
                with a mission to alleviate the suffering within our community.
                We work tirelessly to create sustainable solutions that empower
                vulnerable communities and protect our environment.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our organization operates across four key areas of focus,
                ensuring comprehensive community support and environmental
                stewardship across India.
              </p>
              <Link
                href="/donate"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition"
              >
                Support Our Mission
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/assests/savera1.jpg"
                alt="Our Mission"
                className="rounded-lg shadow-2xl w-full object-cover h-96"
              />
            </div>
          </div>

          {/* Vision Section with Gradient */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 border border-orange-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We envision a world where every individual has access to
                  education, healthcare, and sustainable livelihood
                  opportunities. A world where wildlife and nature are
                  protected, and communities thrive together in harmony.
                </p>
              </div>
              <div>
                <img
                  src="/assests/2.jpg"
                  alt="Our Vision"
                  className="rounded-lg shadow-lg w-full object-cover h-80"
                />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "❤️",
                  title: "Compassion",
                  desc: "We care deeply for the welfare of all beings",
                },
                {
                  icon: "🎯",
                  title: "Commitment",
                  desc: "We are dedicated to sustainable impact",
                },
                {
                  icon: "🤝",
                  title: "Collaboration",
                  desc: "We work together with communities and partners",
                },
                {
                  icon: "🌟",
                  title: "Excellence",
                  desc: "We strive for the highest standards",
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className="card p-6 space-y-3 border-l-4 border-orange-500 hover:shadow-lg transition"
                >
                  <div className="text-4xl">{value.icon}</div>
                  <h3 className="text-xl font-bold text-orange-700">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas with Images */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Focus Areas
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🦁",
                  title: "Animal Welfare",
                  desc: "We work to protect and improve the welfare of animals through rescue operations, veterinary care, and public awareness programs.",
                  link: "/causes/animals",
                  image: "/assests/4.jpg",
                  color: "border-purple-500",
                },
                {
                  icon: "📚",
                  title: "Education & Skill Development",
                  desc: "We provide quality education and vocational training to underprivileged children and youth to create better employment opportunities.",
                  link: "/causes/education",
                  image: "/assests/3.jpg",
                  color: "border-blue-500",
                },
                {
                  icon: "🌍",
                  title: "Environmental Conservation",
                  desc: "We promote sustainable practices, tree planting initiatives, and environmental awareness to protect our planet.",
                  link: "/causes/environment",
                  image: "/assests/5.jpg",
                  color: "border-green-500",
                },
                {
                  icon: "🍽️",
                  title: "Food & Nutrition",
                  desc: "We ensure food security and nutritional support for vulnerable populations, particularly children and the elderly.",
                  link: "/causes/food",
                  image: "/assests/2.jpg",
                  color: "border-red-500",
                },
              ].map((area, i) => (
                <div
                  key={i}
                  className={`card overflow-hidden border-l-4 ${area.color} hover:shadow-xl transition`}
                >
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl flex-shrink-0">{area.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{area.desc}</p>
                    <Link
                      href={area.link}
                      className="text-orange-600 font-semibold hover:text-orange-700 transition inline-block"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stats with Images */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: "👥", stat: "300+", label: "Active Volunteers" },
                { icon: "👨‍👩‍👧‍👦", stat: "50K+", label: "Families Supported" },
                { icon: "🌍", stat: "25+", label: "States Covered" },
                { icon: "💚", stat: "100K+", label: "Lives Impacted" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <div className="text-4xl font-bold mb-2">{item.stat}</div>
                  <p className="text-orange-100">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-orange-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Get In Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-700">
                  📍 Address
                </h3>
                <p className="text-gray-700">
                  G76, Noida Sector 63
                  <br />
                  Uttar Pradesh, India
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-700">
                  📧 Contact
                </h3>
                <a
                  href="mailto:info@saveranationaltrust.org"
                  className="text-orange-600 hover:text-orange-700 transition font-semibold"
                >
                  info@saveranationaltrust.org
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-700">
                  🕐 Hours
                </h3>
                <p className="text-gray-700">
                  9:30 AM - 6:30 PM
                  <br />
                  Monday - Sunday
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-700">
                  ❤️ Support Us
                </h3>
                <Link
                  href="/donate"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold transition inline-block"
                >
                  Make a Donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/6.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/80"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Support Our Mission?
          </h2>
          <p className="text-lg text-orange-100">
            Join us in making a real difference in communities across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition inline-block"
            >
              Donate Now
            </Link>
            <Link
              href="/internship"
              className="inline-block bg-white text-orange-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
