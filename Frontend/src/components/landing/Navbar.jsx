import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoBlack from '../../assets/Logo_Black_Full.png';
import logoWhite from '../../assets/Logo_White_Full-01.png';

const navItems = [
  { label: 'Home', link: '#home' },
  { label: 'About', link: '#about' },
  { label: 'Pricing', link: '#pricing' },
  { label: 'Contact Us', link: '#contactUs' },
  { label: 'Login / Signup', link: '/login' },
];

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (item) => {
    if (item.link === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    } else if (item.link.startsWith('#')) {
      const el = document.querySelector(item.link);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    } else {
      window.location.href = item.link;
    }
  };

  return (
    <nav className={`sticky top-0 w-full z-50 border-b-[2px] ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
      style={{ minHeight: '56px' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between h-14 sm:h-16">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 select-none min-w-[120px]">
          <img src={isDarkMode ? logoBlack : logoWhite} alt="Khan Trading World" className="h-7 w-auto sm:h-8" />
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-5 lg:space-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`bg-transparent border-none outline-none cursor-pointer font-medium px-0 transition-colors duration-150 text-[11px] sm:text-xs md:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} hover:text-yellow-400`}
                  style={{ padding: 0 }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Theme Toggle & Hamburger */}
        <div className="flex items-center min-w-[60px] justify-end space-x-2">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded transition-colors duration-300 bg-transparent"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              // Sun icon for dark mode
              <svg className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
            ) : (
              // Moon icon for light mode
              <svg className="h-4 w-4 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            )}
          </button>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center h-8 w-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`md:hidden px-2 pb-2 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-lg rounded-b-xl z-40`}
            style={{ position: 'absolute', left: 0, right: 0, top: '100%' }}
          >
            <ul className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`w-full text-left bg-transparent border-none outline-none cursor-pointer font-medium py-2 transition-colors duration-150 text-[11px] sm:text-xs md:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} hover:text-yellow-400`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 