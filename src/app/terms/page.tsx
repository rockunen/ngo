import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pink-600 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-pink-50">
            Please read these terms carefully before using our website
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Use License
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Get Wish Foundation
                website for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Modifying or copying the materials</li>
                <li>
                  Using the materials for any commercial purpose or for any
                  public display
                </li>
                <li>
                  Attempting to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  Removing any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transferring the materials to another person or "mirroring"
                  the materials on any other server
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Disclaimer
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The materials on Get Wish Foundation website are provided on an
                'as is' basis. Get Wish Foundation makes no warranties,
                expressed or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation
                of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Limitations
              </h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall Get Wish Foundation or its suppliers be liable
                for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on Get Wish
                Foundation website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Accuracy of Materials
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The materials appearing on Get Wish Foundation website could
                include technical, typographical, or photographic errors. Savera
                National Trust does not warrant that any of the materials on
                this website are accurate, complete, or current.
                getWishFoundationNational Trust may make changes to the
                materials contained on this website at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Get Wish Foundation has not reviewed all of the sites linked to
                its website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by Get Wish Foundation of the site. Use of any such
                linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Modifications
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Get Wish Foundation may revise these terms of service for its
                website at any time without notice. By using this website, you
                are agreeing to be bound by the then current version of these
                terms of service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in
                accordance with the laws of India, and you irrevocably submit to
                the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div className="bg-pink-50 border border-red-200 rounded-lg p-6 mt-8">
              <p className="text-gray-700">
                For any questions regarding these Terms & Conditions, please{" "}
                <Link
                  href="/contact"
                  className="text-pink-600 font-bold hover:text-pink-700"
                >
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
