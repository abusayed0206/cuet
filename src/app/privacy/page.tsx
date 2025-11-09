import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Back button */}
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600">Last Updated: 25 July 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  1. Introduction
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome to the CUET Student Directory. This privacy policy
                  outlines how we collect, use, and protect student information.
                  By using our website, you agree to the terms described below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  2. Data We Collect
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We maintain a database of CUET student information that
                  includes:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Student Name</li>
                  <li>Student ID</li>
                  <li>Department</li>
                  <li>Admission Roll Number</li>
                  <li>Admission Merit Position</li>
                  <li>Batch Number</li>
                  <li>Academic Session</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  3. Data Source
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  All student information is sourced from publicly available
                  academic records and official university publications. We do
                  not collect any private or personal information beyond what is
                  already in the public domain.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  4. How We Use Your Information
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The information is used solely for:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Providing a searchable directory service</li>
                  <li>
                    Displaying academic information for identification purposes
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  5. Data Security
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We implement appropriate security measures(RLS) to protect the
                  information in our database.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  6. Third-Party Services
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We may use third-party services for analytics and performance
                  monitoring. These services do not have access to personal
                  student information and only receive anonymized usage data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  7. Your Rights
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  As a student whose information appears in our directory, you
                  have the right to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Request correction of inaccurate information</li>
                  <li>Inquire about how your data is being used</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  8. Updates to This Policy
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We may update this privacy policy from time to time. Any
                  changes will be posted on this page with an updated revision
                  date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  9. Contact Information
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about this privacy policy or wish to
                  exercise your rights regarding your personal information,
                  please contact me at{" "}
                  <a
                    href="mailto:hello@sayed.page"
                    className="text-blue-600 hover:underline"
                  >
                    hello@sayed.page
                  </a>
                  . or signal at sayed.46
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  10. Disclaimer
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This directory is maintained by a student and is not an
                  official CUET service. We strive to keep information accurate
                  but cannot guarantee the completeness or accuracy of all data.
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t  py-4">
            <div className="container mx-auto px-4 text-center">
              <p className="text-slate-600 text-sm">
                Developed by{" "}
                <span className="font-semibold text-slate-800">Sayed</span> •
                ID:{" "}
                <span className="font-semibold text-slate-800">1901049</span>
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Department of Civil Engineering • Batch 19 • Session 2019-20
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
