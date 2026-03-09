import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add background blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo / Site name */}
        <Link to="/" className="group">
          <span className="text-xl font-serif font-bold text-gray-900 group-hover:text-black transition-colors">
            Liminality
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <a
            href="https://github.com/Lucalangella/react-blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors hidden sm:inline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
