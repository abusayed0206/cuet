import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src="/CUET_Vector_ogo.svg"
                alt="CUET Logo"
                className="w-6 h-6"
              />
            </div>
            <span className="font-semibold text-slate-800">CUET Directory</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link
              href="/search"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/batch"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
