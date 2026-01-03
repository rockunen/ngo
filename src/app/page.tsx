"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    );
  }

  const carouselSlides = [
    {
      title: "Your Help creates lasting change.",
      image: "/assests/1.jpg",
    },
    {
      title: "Together for a Better Tomorrow",
      image: "/assests/2.jpg",
    },
    {
      title: "Empower Educate Protect",
      image: "/assests/3.jpg",
    },
    {
      title: "Nurturing Lives, Caring for Nature",
      image: "/assests/5.jpg",
    },
    {
      title: "Love, Rescue, Protect",
      image: "/assests/4.jpg",
    },
  ];

  const focusAreas = [
    {
      icon: "🍽️",
      title: "Food & Nutrition",
      description:
        "Providing nutritious meals to those in need, ensuring no one goes hungry.",
      link: "/causes/food",
      image: "/assests/01(1).png",
      color: "border-pink-500",
    },
    {
      icon: "📚",
      title: "Education & Skills",
      description:
        "Quality education and vocational training for underprivileged children and youth.",
      link: "/causes/education",
      image: "/assests/04.png",
      color: "border-blue-500",
    },
    {
      icon: "🌍",
      title: "Environment",
      description:
        "Sustainable practices and environmental conservation initiatives.",
      link: "/causes/environment",
      image: "/assests/03.png",
      color: "border-green-500",
    },
    {
      icon: "🐾",
      title: "Animal Welfare",
      description:
        "Protecting and improving the welfare of animals through rescue and care.",
      link: "/causes/animals",
      image: "/assests/02.png",
      color: "border-purple-500",
    },
  ];

  const stats = [
    {
      icon: "👥",
      stat: "300+",
      label: "Active Volunteers",
      image: "/assests/01(4).png",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      stat: "2300+",
      label: "Happy Children",
      image: "/assests/02(3).png",
    },
    {
      icon: "💚",
      stat: "100K+",
      label: "Total Donations",
      image: "/assests/03(2).png",
    },
    {
      icon: "🎁",
      stat: "550+",
      label: "Products & Gifts",
      image: "/assests/04(2).png",
    },
  ];

  const faqItems = [
    {
      question: "How to Register as an Intern?",
      answer:
        "Visit our internship page and fill out the registration form with your details. You'll receive confirmation and next steps via email.",
    },
    {
      question: "How to Make a Donation?",
      answer:
        "Click on the Donate button and choose your donation amount. We accept various payment methods and provide tax receipts.",
    },
    {
      question: "Where is Get Wish Foundation Located?",
      answer:
        "We are headquartered at Subedargunj, Prayagraj, Uttar Pradesh, India. We operate across 25+ states nationwide.",
    },
    {
      question: "How Can I Volunteer?",
      answer:
        "Join our Internship program or contact us at info@getwishfoundation.in to discuss volunteer opportunities.",
    },
  ];

  return (
    <main className="bg-white">
      {/* Carousel Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {carouselSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === activeCarousel ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative h-full flex items-center justify-start">
                <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
                  <div className="bg-black/60 p-8 md:p-12 rounded-lg backdrop-blur-sm w-fit max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
                      {slide.title.split(" ").map((word, i) =>
                        word === "Help" ||
                        word === "lasting" ||
                        word === "change" ||
                        word === "Better" ||
                        word === "Tomorrow" ||
                        word === "Educate" ||
                        word === "Protect" ||
                        word === "Nurturing" ||
                        word === "Caring" ||
                        word === "Nature" ||
                        word === "Rescue" ? (
                          <span key={i} className="text-pink-500">
                            {word}{" "}
                          </span>
                        ) : (
                          <span key={i}>{word} </span>
                        )
                      )}
                    </h1>
                    <div className="flex flex-col items-center gap-4">
                      <Link
                        href="/donate"
                        className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded transition font-bold relative z-10"
                      >
                        ❤️ Donate Now
                      </Link>
                      <div className="flex gap-4 flex-wrap justify-center relative z-10">
                        <Link
                          href="/intern-signup"
                          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded transition font-bold text-sm md:text-base"
                        >
                          📝 Intern Signup
                        </Link>
                        <Link
                          href="/intern-login"
                          className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded transition font-bold text-sm md:text-base"
                        >
                          🔐 Intern Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center gap-2 py-4 bg-gray-900">
          {carouselSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCarousel(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === activeCarousel ? "bg-pink-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Niti Ayog Details Section */}
      <section className="bg-gray-100 text-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <strong>Niti Ayog: UP/20XX/XXXXXXX</strong>
            </div>
            <div className="md:col-span-2">
              Tax exempted under Section 80G/12A of Income tax Vide Registration
              No: XXXXXXXXXXXXXXX
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "/assests/80g.jpg",
              "/assests/animal.jpg",
              "/assests/fcra.jpg",
              "/assests/gausewa.jpg",
              "/assests/incometax.jpg",
              "/assests/mp.jpg",
              "/assests/niti.jpg",
              "/assests/uttrakhand.jpg",
            ].map((img, idx) => (
              <img key={idx} src={img} alt="certification" className="h-16" />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-pink-500 font-semibold text-lg">About Us</span>
          <h2 className="text-4xl font-bold my-4">Get Wish Foundation</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-700 mx-auto mb-8"></div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Get Wish Foundation is a non-profit organization dedicated to
            empowering communities and creating sustainable development
            initiatives across India. Our mission is to uplift underprivileged
            sections of society by providing access to education, healthcare,
            and livelihood opportunities. We believe in fostering equality,
            dignity, and social justice for all.
            <br />
            <br />
            With a network of over 300 volunteers, we provide essential services
            in food security, healthcare, clean water, and education, ensuring
            that underserved individuals and communities have access to basic
            needs and opportunities for a better life.
          </p>
        </div>
      </section>

      {/* Focus Areas with Cards and Links */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Focus Areas
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-700 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {focusAreas.map((area, idx) => (
              <Link
                key={idx}
                href={area.link}
                className="card overflow-hidden border-l-4 border-gray-200 hover:shadow-xl hover:border-pink-500 transition cursor-pointer group flex flex-col"
              >
                <div className="w-full h-56 overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition"
                  />
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0">{area.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                      {area.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {area.description}
                  </p>
                  <span className="text-pink-600 font-semibold group-hover:translate-x-1 transition inline-block mt-auto">
                    Learn More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Impact</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-700 mx-auto mb-12"></div>
          <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((item, i) => (
                <div key={i} className="text-center">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-16 h-16 mx-auto mb-4 invert"
                  />
                  <h3 className="text-4xl font-bold mb-2">{item.stat}</h3>
                  <p className="text-pink-100">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Core Values
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-700 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-4 gap-6">
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
                className="card p-6 space-y-3 border-l-4 border-pink-500 hover:shadow-lg transition text-center"
              >
                <div className="text-4xl">{value.icon}</div>
                <h3 className="text-lg font-bold text-pink-700">
                  {value.title}
                </h3>
                <p className="text-gray-700 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">FAQ</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-700 mx-auto mb-12"></div>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="card overflow-hidden border">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? -1 : idx)}
                  className="w-full p-4 text-left font-semibold flex justify-between items-center hover:bg-pink-50 transition"
                >
                  {item.question}
                  <span
                    className={`transform transition text-pink-500 ${
                      activeFAQ === idx ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                {activeFAQ === idx && (
                  <div className="p-4 bg-gray-50 border-t text-gray-700">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-6 text-white"
        style={{
          backgroundImage: "url(/assests/6.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-pink-100">
            Join us in creating meaningful change in communities across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold transition inline-block"
            >
              Donate Now
            </Link>
            <Link
              href="/internship"
              className="inline-block bg-white text-pink-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
