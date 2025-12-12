"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InternshipPage() {
  const [formData, setFormData] = useState({
    fname: "",
    designation: "",
    email: "",
    password: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ fname: "", designation: "", email: "", password: "" });
      setSubmitted(false);
    }, 3000);
  };

  const benefits = [
    {
      icon: "🎓",
      title: "Skill Development",
      description:
        "Gain practical experience and develop valuable professional skills in real-world settings.",
    },
    {
      icon: "🤝",
      title: "Networking",
      description:
        "Connect with like-minded individuals and build a strong professional network.",
    },
    {
      icon: "💼",
      title: "Work Experience",
      description:
        "Get hands-on experience working on meaningful projects that create social impact.",
    },
    {
      icon: "🌟",
      title: "Certificate",
      description:
        "Earn a recognized certificate upon completion of the internship program.",
    },
    {
      icon: "💡",
      title: "Mentorship",
      description:
        "Receive guidance from experienced mentors in your field of interest.",
    },
    {
      icon: "🌍",
      title: "Social Impact",
      description:
        "Make a real difference in the community while developing your career.",
    },
  ];

  const requirements = [
    "Must be a student or recent graduate",
    "Minimum 12th pass or pursuing graduation",
    "Age between 18-35 years",
    "Willingness to work in a team",
    "Passion for social work and community development",
    "Basic computer literacy",
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 relative"
        style={{
          backgroundImage: "url(/assests/2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="bg-black/50 p-8 md:p-12 rounded-lg backdrop-blur-sm w-fit mx-auto">
            <h1 className="text-5xl font-bold mb-4">
              Social Internship Program
            </h1>
            <p className="text-xl mb-8">
              Join Get Wish Foundation and make a real difference in society
            </p>
            <p className="text-lg opacity-90">
              Be part of a community dedicated to social change and sustainable
              development
            </p>
          </div>
        </div>
      </section>

      {/* About Internship Program */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                About Our Internship Program
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Get Wish Foundation offers a comprehensive social internship
                program designed to empower young professionals and students to
                contribute meaningfully to society while developing their skills
                and gaining valuable work experience.
              </p>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Our interns work on various initiatives including food security,
                healthcare, education, environmental conservation, and animal
                welfare. Whether you're passionate about education, community
                development, or environmental protection, there's a perfect
                opportunity for you.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Through this program, you'll gain practical experience, develop
                professional skills, build your network, and most importantly,
                make a positive impact on the lives of those in need.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-orange-600">
                Program Highlights
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Flexible Duration:</strong> Choose between 1-6
                    months
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Multiple Domains:</strong> Food, Education,
                    Environment, Animals, Health
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Mentorship:</strong> Guidance from experienced
                    professionals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Certificate:</strong> Recognized internship
                    completion certificate
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Remote & On-site:</strong> Flexible work
                    arrangements
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Join Our Internship?
            </h2>
            <p className="text-gray-600 text-lg">
              Discover the benefits of becoming a Savera intern
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 bg-gray-50 rounded-lg text-center hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Eligibility Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {requirements.map((req, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <span className="text-orange-500 font-bold text-2xl">✓</span>
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Application Process
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                num: "1",
                title: "Register",
                desc: "Fill out the registration form",
              },
              { num: "2", title: "Review", desc: "We review your application" },
              {
                num: "3",
                title: "Interview",
                desc: "Shortlisted candidates are called",
              },
              {
                num: "4",
                title: "Join",
                desc: "Get started with your internship",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block text-orange-500 text-2xl mt-4">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Intern Registration
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Complete the form below to register for our internship program
            </p>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 text-green-700 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">
                  ✓ Registration Successful!
                </h3>
                <p>
                  Thank you for registering. We'll review your application and
                  contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g., Student, Recent Graduate"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Register Now
                </button>

                <div className="text-center text-gray-600">
                  <p>
                    Already have an account?{" "}
                    <Link
                      href="/intern-login"
                      className="text-orange-500 font-semibold hover:underline"
                    >
                      Login Here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the duration of the internship?",
                a: "The internship duration ranges from 1 to 6 months, depending on your availability and the program requirements.",
              },
              {
                q: "Is this a paid internship?",
                a: "This is a voluntary internship program. However, we provide certificates and valuable experience for your career development.",
              },
              {
                q: "Can I work remotely?",
                a: "Yes, we offer both remote and on-site opportunities depending on the project requirements.",
              },
              {
                q: "What happens after the internship?",
                a: "Upon completion, you'll receive a certificate. Outstanding interns may have opportunities for permanent positions or further collaboration.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of interns who have contributed to meaningful social
            change
          </p>
          <a
            href="/intern-signup"
            className="inline-block bg-white text-orange-500 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}
