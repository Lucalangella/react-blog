function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xs">
              TC
            </div>
            <span className="font-serif font-bold text-gray-900">
              The Craft
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-500 text-center">
            Thoughts on design, development, and building things that matter.
          </p>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} The Craft
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
