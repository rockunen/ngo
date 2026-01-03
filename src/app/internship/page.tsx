"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { internSignupSchema, InternSignupData } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function InternshipPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [donationLink, setDonationLink] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InternSignupData>({
    resolver: zodResolver(internSignupSchema),
  });

  const onSubmit = async (data: InternSignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/intern-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      // Store session token in cookie
      document.cookie = `intern_session=${
        result.session_token
      }; path=/; max-age=${30 * 24 * 60 * 60}`;

      // Show success with referral code
      setReferralCode(result.referral_code);
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      setDonationLink(`${baseUrl}/donate?referral=${result.referral_code}`);
      setSignupSuccess(true);

      // Auto redirect after 5 seconds
      setTimeout(() => {
        router.push("/intern-dashboard");
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
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

  // Success screen
  if (signupSuccess && referralCode && donationLink) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Created!
            </h1>
            <p className="text-gray-600">Welcome to Get Wish Foundation</p>
          </div>

          <div className="space-y-6">
            <div className="bg-pink-50 border-2 border-pink-500 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Your Referral Code:</p>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-bold text-pink-600 flex-1 break-all">
                  {referralCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    alert("Referral code copied!");
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded font-semibold text-sm transition whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900 mb-3">
                <strong>💡 Donation Link:</strong> Share this link with your
                friends and family:
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 mb-3 break-all text-xs font-mono">
                {donationLink}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(donationLink);
                  alert("Donation link copied to clipboard!");
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
              >
                📋 Copy Full Link
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                Redirecting to dashboard in 5 seconds...
              </p>
              <Link
                href="/intern-dashboard"
                className="inline-block bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-pink-800 transition"
              >
                Go to Dashboard Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-pink-600/85 to-pink-700/85 text-white py-16 relative"
        style={{
          backgroundImage: "url(/assests/2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="bg-black/50 p-8 md:p-12 rounded-lg backdrop-blur-sm w-fit mx-auto">
            <h1 className="text-5xl font-bold mb-4">Internship Program</h1>
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
                Get Wish Foundation offers a comprehensive Internship program
                designed to empower young professionals and students to
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
            <div className="bg-gradient-to-br from-pink-100 to-pink-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-pink-600">
                Program Highlights
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Flexible Duration:</strong> Choose between 1-6
                    months
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Multiple Domains:</strong> Food, Education,
                    Environment, Animals, Health
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Mentorship:</strong> Guidance from experienced
                    professionals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">✓</span>
                  <span className="text-gray-700">
                    <strong>Certificate:</strong> Recognized internship
                    completion certificate
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">✓</span>
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
              Discover the benefits of becoming a getWishFoundationintern
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
                <span className="text-pink-500 font-bold text-2xl">✓</span>
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
                <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block text-pink-500 text-2xl mt-4">
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

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded">
                <p className="font-semibold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="10 digit mobile number"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Email <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Password <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Create a password"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-pink-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Re-enter your password"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                {isLoading ? "Registering..." : "Register Now"}
              </button>

              <div className="text-center text-gray-600">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/intern-login"
                    className="text-pink-500 font-semibold hover:underline"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </form>
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
      <section className="py-16 px-4 bg-pink-500 text-white">
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
            className="inline-block bg-white text-pink-500 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}
