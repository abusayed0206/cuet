export default function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src="/CUET_Vector_ogo.svg"
                alt="CUET Logo"
                className="w-6 h-6"
              />
            </div>
            <span className="font-semibold text-slate-800">CUET Directory</span>
          </a>

          <div className="hidden md:flex space-x-6">
            <a
              href="/search"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Search
            </a>
            <a
              href="/batch"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Browse
            </a>
            <a
              href="/terms"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
