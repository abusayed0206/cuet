import Link from "next/link";

export const revalidate = 31536000;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-600">Version 1.0 • Last Updated: April 1, 2026</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8 space-y-7">
              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">1. Individual Use</h2>
                <p className="text-slate-600 leading-relaxed">
                  Individual users can search and use this website freely for personal and non-commercial purposes.
                  No acknowledgment is required for that kind of use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">2. Commercial or System Integration Use</h2>
                <p className="text-slate-600 leading-relaxed">
                  If anyone uses this database commercially, or integrates the data into any other system, acknowledgment
                  is required.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">3. Data Ownership Notice</h2>
                <p className="text-slate-600 leading-relaxed">
                  I am not the data owner. I collected PDFs/data from publicly available internet sources and gathered
                  them in one place for easier search and access.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">4. Data Request from CUET Email Domains</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you need dataset access from CUET, please email{" "}
                  <a href="mailto:hello@sayed.page" className="text-blue-600 hover:underline">
                    hello@sayed.page
                  </a>{" "}
                  using an official <span className="font-medium">@student.cuet.ac.bd</span> or{" "}
                  <span className="font-medium">@cuet.ac.bd</span> address. I am happy to provide CSV/SQL exports.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
