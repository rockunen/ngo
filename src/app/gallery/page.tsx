"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
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

  const galleryImages = [
    {
      id: 1,
      title: "Community Outreach",
      category: "outreach",
      description: "Working together with communities for sustainable change",
      image: "/assests/1.jpg",
    },
    {
      id: 2,
      title: "Educational Programs",
      category: "education",
      description: "Empowering youth through quality education and training",
      image: "/assests/3.jpg",
    },
    {
      id: 3,
      title: "Healthcare Initiatives",
      category: "healthcare",
      description: "Providing medical support and health awareness",
      image: "/assests/savera1.jpg",
    },
    {
      id: 4,
      title: "Environmental Work",
      category: "environment",
      description: "Planting trees and protecting our environment",
      image: "/assests/5.jpg",
    },
    {
      id: 5,
      title: "Animal Welfare",
      category: "animals",
      description: "Caring for animals in need",
      image: "/assests/4.jpg",
    },
    {
      id: 6,
      title: "Food Distribution",
      category: "food",
      description: "Ensuring food security for vulnerable communities",
      image: "/assests/2.jpg",
    },
    {
      id: 7,
      title: "Skill Training",
      category: "skills",
      description: "Vocational training for livelihood improvement",
      image: "/assests/6.jpg",
    },
    {
      id: 8,
      title: "Community Events",
      category: "outreach",
      description: "Bringing communities together for social good",
      image: "/assests/1.jpg",
    },
    {
      id: 9,
      title: "Disaster Relief",
      category: "outreach",
      description: "Quick response to help affected communities",
      image: "/assests/3.jpg",
    },
  ];

  const categories = [
    { id: "all", label: "All" },
    { id: "outreach", label: "Outreach" },
    { id: "education", label: "Education" },
    { id: "healthcare", label: "Healthcare" },
    { id: "environment", label: "Environment" },
    { id: "animals", label: "Animals" },
    { id: "food", label: "Food" },
    { id: "skills", label: "Skills" },
  ];

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="bg-pink-600 py-12 md:py-16 px-4 md:px-6 relative"
        style={{
          backgroundImage: "url(/assests/5.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-lg text-pink-50">
            Visual stories of our impact and community work
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Category Filters */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Filter by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-pink-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-64"
              >
                {/* Image */}
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>

                {/* Content on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-center text-white px-4">
                    <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-white/90">{image.description}</p>
                  </div>
                </div>

                {/* Static Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-lg font-bold text-white">
                    {image.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {image.category.charAt(0).toUpperCase() +
                      image.category.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-pink-50 py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Our Work in Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "📸", stat: "500+", label: "Photos Captured" },
              { icon: "🎬", stat: "50+", label: "Videos Created" },
              { icon: "👥", stat: "100+", label: "Success Stories" },
              { icon: "🌍", stat: "25+", label: "Locations Covered" },
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
            Share Your Story
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Have photos or videos from our events? We'd love to feature your
            content! Help us tell our impact story by sharing your perspective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary text-lg px-8 py-3 inline-block"
            >
              Submit Content
            </Link>
            <Link
              href="/donate"
              className="border-2 border-pink-600 text-pink-600 font-bold py-3 px-8 rounded-lg hover:bg-pink-50 transition-all text-lg inline-block"
            >
              Support Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
