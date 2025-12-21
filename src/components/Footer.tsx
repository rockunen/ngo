"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <p className="text-sm">
              <strong>About Get Wish Foundation:</strong> Get Wish Foundation is
              a non-profit organization established with a mission to alleviate
              the suffering within our community.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span>✉️</span>
              <div>
                <p>info@getWishFoundation.in</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span>🏠</span>
              <div>
                <p>
                  Subedargunj, Prayagraj
                  <br />
                  Uttar Pradesh, India
                </p>
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <p className="font-bold mb-3">Important Links:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/intern-signup"
                  className="hover:text-pink-500 transition"
                >
                  Intern Signup
                </Link>
              </li>
              <li>
                <Link
                  href="/intern-login"
                  className="hover:text-pink-500 transition"
                >
                  Intern Login
                </Link>
              </li>

              <li>
                <Link
                  href="/manager-login"
                  className="hover:text-pink-500 transition"
                >
                  Manager Login
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-pink-500 transition">
                  Donation
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="font-bold mb-3">Useful Links:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-pink-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pink-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/internship"
                  className="hover:text-pink-500 transition"
                >
                  Internship
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-500 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-pink-500 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-pink-500 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>
            &copy; 2025{" "}
            <Link href="/" className="hover:text-pink-500 transition">
              Get Wish Foundation
            </Link>{" "}
            Creation By{" "}
            <a
              href="mailto:aamanprime@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              Aaman
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
