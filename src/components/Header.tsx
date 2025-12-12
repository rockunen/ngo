"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [causesDropdownOpen, setCausesDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCausesDropdown = () => {
    setCausesDropdownOpen(!causesDropdownOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCausesDropdownOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" onClick={closeMobileMenu}>
        <Image
          src="/assests/logo.png"
          alt="logo"
          height={48}
          width={48}
          className="h-12 w-auto"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center text-sm">
        <Link href="/" className="nav-link hover:text-orange-600 transition">
          Home
        </Link>
        <Link href="/about" className="nav-link hover:text-orange-600 transition">
          About Us
        </Link>
        <div className="group relative">
          <button className="nav-link hover:text-orange-600 transition">
            Causes ▼
          </button>
          <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <Link
              href="/causes/animals"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Animals
            </Link>
            <Link
              href="/causes/education"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Education & Skills
            </Link>
            <Link
              href="/causes/environment"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Environment
            </Link>
            <Link
              href="/causes/food"
              className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
            >
              Food & Nutrition
            </Link>
          </div>
        </div>
        <Link href="/internship" className="nav-link hover:text-orange-600 transition">
          Social Internship
        </Link>
        <Link href="/gallery" className="nav-link hover:text-orange-600 transition">
          Gallery
        </Link>
        <Link href="/contact" className="nav-link hover:text-orange-600 transition">
          Contact
        </Link>
        <Link href="/donate" className="btn-primary text-sm px-5 py-2">
          Donate
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/donate" className="btn-primary text-xs px-3 py-1.5 rounded">
          Donate
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-gray-900 hover:text-orange-600 font-semibold py-2 transition"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-900 hover:text-orange-600 font-semibold py-2 transition"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>

            {/* Mobile Causes Dropdown */}
            <div>
              <button
                onClick={toggleCausesDropdown}
                className="w-full text-left text-gray-900 hover:text-orange-600 font-semibold py-2 transition flex items-center justify-between"
              >
                Causes
                <span
                  className={`transform transition-transform ${
                    causesDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {causesDropdownOpen && (
                <div className="pl-4 space-y-2 mt-2 border-l-2 border-orange-300">
                  <Link
                    href="/causes/animals"
                    className="block text-gray-700 hover:text-orange-600 py-1.5 transition"
                    onClick={closeMobileMenu}
                  >
                    Animals
                  </Link>
                  <Link
                    href="/causes/education"
                    className="block text-gray-700 hover:text-orange-600 py-1.5 transition"
                    onClick={closeMobileMenu}
                  >
                    Education & Skills
                  </Link>
                  <Link
                    href="/causes/environment"
                    className="block text-gray-700 hover:text-orange-600 py-1.5 transition"
                    onClick={closeMobileMenu}
                  >
                    Environment
                  </Link>
                  <Link
                    href="/causes/food"
                    className="block text-gray-700 hover:text-orange-600 py-1.5 transition"
                    onClick={closeMobileMenu}
                  >
                    Food & Nutrition
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/internship"
              className="block text-gray-900 hover:text-orange-600 font-semibold py-2 transition"
              onClick={closeMobileMenu}
            >
              Social Internship
            </Link>
            <Link
              href="/gallery"
              className="block text-gray-900 hover:text-orange-600 font-semibold py-2 transition"
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="block text-gray-900 hover:text-orange-600 font-semibold py-2 transition"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
