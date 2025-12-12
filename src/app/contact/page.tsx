"use client";

import { FormEvent, useState, useEffect } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would send this to an API endpoint
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="bg-red-600 py-12 md:py-16 px-4 md:px-6 relative"
        style={{
          backgroundImage: "url(/assests/6.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-red-50">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-3xl">📍</span> Office Address
                </h3>
                <p className="text-gray-700 ml-12">
                  G76, Noida Sector 63,
                  <br />
                  Uttar Pradesh, India
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-3xl">📧</span> Email
                </h3>
                <a
                  href="mailto:info@saveranationaltrust.org"
                  className="text-red-600 hover:text-red-700 font-semibold ml-12"
                >
                  info@saveranationaltrust.org
                </a>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-3xl">🕐</span> Working Hours
                </h3>
                <p className="text-gray-700 ml-12">
                  Monday - Sunday
                  <br />
                  9:30 AM - 6:30 PM
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-3xl">🌐</span> Website
                </h3>
                <a
                  href="https://saveranationaltrust.org"
                  className="text-red-600 hover:text-red-700 font-semibold ml-12"
                >
                  saveranationaltrust.org
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="card p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    ✓ Thank you! We've received your message and will get back
                    to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                      placeholder="Your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all text-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "📝",
                title: "Register",
                desc: "Join as intern",
                link: "#",
              },
              {
                icon: "💳",
                title: "Donate",
                desc: "Support our cause",
                link: "/donate",
              },
              {
                icon: "🔐",
                title: "Intern Login",
                desc: "Access your account",
                link: "#",
              },
              {
                icon: "👨‍💼",
                title: "Manager Login",
                desc: "Staff portal",
                link: "#",
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.link}
                className="card p-6 text-center hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-5xl mb-3">{link.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
