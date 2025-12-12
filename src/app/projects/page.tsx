import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Projects | Save Rana National Trust",
  description:
    "Explore our conservation projects focused on habitat restoration, breeding programs, and research.",
};

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Western Ghats Habitat Restoration",
      status: "active",
      targetAmount: 5000000,
      currentAmount: 3200000,
      description:
        "Restoring 500+ hectares of wetland habitat in the Western Ghats region.",
      impact: "250+ species protected",
      icon: "🌾",
      fullDescription:
        "This comprehensive habitat restoration project focuses on protecting and restoring critical wetland ecosystems in the Western Ghats. We work with local communities to remove invasive species, restore water channels, and create breeding grounds for endangered amphibians.",
    },
    {
      id: 2,
      name: "Captive Breeding Program",
      status: "active",
      targetAmount: 7500000,
      currentAmount: 5800000,
      description:
        "Scientific breeding programs for 12 endangered amphibian species.",
      impact: "5000+ individuals bred annually",
      icon: "🔬",
      fullDescription:
        "Our state-of-the-art breeding facility maintains populations of endangered frogs and salamanders. This program ensures genetic diversity and provides individuals for reintroduction into restored habitats.",
    },
    {
      id: 3,
      name: "Community Education Initiative",
      status: "active",
      targetAmount: 4000000,
      currentAmount: 2100000,
      description:
        "Environmental education for 50+ villages in partnership with schools.",
      impact: "10,000+ students reached",
      icon: "📚",
      fullDescription:
        "We conduct workshops, field trips, and school programs to raise awareness about amphibian conservation and ecosystem health. This builds local support for long-term conservation efforts.",
    },
    {
      id: 4,
      name: "Research & Monitoring",
      status: "active",
      targetAmount: 3500000,
      currentAmount: 1750000,
      description:
        "Long-term population monitoring and species discovery research.",
      impact: "15+ scientific papers published",
      icon: "🔍",
      fullDescription:
        "Our research team conducts longitudinal studies to track population trends and publish findings in peer-reviewed journals. This research guides our conservation strategies.",
    },
    {
      id: 5,
      name: "Water Management Systems",
      status: "planning",
      targetAmount: 6000000,
      currentAmount: 1200000,
      description:
        "Building sustainable water management systems for breeding ponds.",
      impact: "To benefit 100+ hectares",
      icon: "💧",
      fullDescription:
        "We are constructing modern water management infrastructure to maintain optimal conditions for amphibian breeding. This includes filter systems, monitoring technology, and sustainable water sourcing.",
    },
    {
      id: 6,
      name: "Climate Resilience Program",
      status: "planning",
      targetAmount: 5500000,
      currentAmount: 800000,
      description: "Preparing habitats for climate change impacts.",
      impact: "Protecting future generations",
      icon: "🌍",
      fullDescription:
        "This forward-looking initiative focuses on making amphibian populations resilient to climate change through habitat diversification and genetic conservation programs.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="gradient-header py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Our Conservation Projects
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
            Protecting amphibians through habitat restoration, research, and
            community engagement
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 gradient-bg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "6", label: "Active Projects" },
              { value: "1650+", label: "Hectares Restored" },
              { value: "250+", label: "Species Protected" },
              { value: "₹2Cr+", label: "Total Investment" },
            ].map((stat, i) => (
              <div
                key={i}
                className="card p-6 md:p-8 text-center hover:shadow-lg"
              >
                <div className="text-4xl md:text-5xl font-bold text-green-700 mb-3">
                  {stat.value}
                </div>
                <p className="text-gray-700 font-semibold text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project) => {
              const progress =
                (project.currentAmount / project.targetAmount) * 100;
              return (
                <div
                  key={project.id}
                  className="card p-8 hover:shadow-lg hover:border-green-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-6xl">{project.icon}</div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                        project.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {project.status === "active"
                        ? "🟢 Active"
                        : "🔵 Planning"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {project.name}
                  </h3>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Funds Raised
                      </span>
                      <span className="text-sm font-bold text-green-700">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        ₹{(project.currentAmount / 100000).toFixed(1)}L
                      </span>
                      <span>
                        ₹{(project.targetAmount / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                    <p className="text-sm font-semibold text-green-700">
                      ✨ Impact: {project.impact}
                    </p>
                  </div>

                  <p className="text-gray-700 text-base mb-6 leading-relaxed">
                    {project.fullDescription}
                  </p>

                  <Link
                    href={`/donate?project=${project.id}`}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-center block"
                  >
                    Support This Project →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact by Numbers */}
      <section className="py-16 md:py-24 px-4 md:px-6 gradient-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading">Our Impact So Far</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                number: "500+",
                description: "Amphibian species in our care",
                icon: "🦎",
              },
              {
                number: "5,000+",
                description: "Individuals bred & released",
                icon: "🐣",
              },
              {
                number: "1,650+",
                description: "Hectares of habitat restored",
                icon: "🌾",
              },
              {
                number: "50,000+",
                description: "Donors supporting our work",
                icon: "❤️",
              },
            ].map((impact, i) => (
              <div
                key={i}
                className="card p-8 md:p-10 hover:shadow-lg text-center"
              >
                <div className="text-6xl md:text-7xl mb-4">{impact.icon}</div>
                <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">
                  {impact.number}
                </div>
                <p className="text-gray-700 text-lg">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="gradient-header py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Make Conservation Happen
            </h2>
            <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
              Every donation directly funds one of our conservation projects.
              Choose the project that inspires you.
            </p>
          </div>
          <Link
            href="/donate"
            className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Donate to Our Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
