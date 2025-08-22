import React from 'react';
import { Link } from 'react-router-dom';
import logoWhiteShort from '../../assets/Logo_White_Short.png';
import logoBlackShort from '../../assets/Logo_Black_Short.png';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = ({ isDarkMode }) => {
  // Smooth scroll for footer quick links
  const handleFooterLinkClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  return (
    <footer className={`w-full transition-colors ${isDarkMode ? 'bg-[#101c2b]' : 'bg-slate-100'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-10 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo, Name, Description, Socials */}
        <div className="flex flex-col gap-3 min-w-[250px]">
          <div className="flex items-center gap-3 mb-1">
            <img
              src={isDarkMode ? logoWhiteShort : logoBlackShort}
              alt="KTW Logo"
              className="h-10 w-10 rounded-md object-contain"
            />
            <div>
              <div className={`font-bold text-lg tracking-wide ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>KHAN TRADING WORLD</div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Professional Trading Consultancy</div>
            </div>
          </div>
          <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Your trusted partner in trading success. We provide expert consultation, premium trading tips, and comprehensive support to help you achieve your financial goals with 90%+ accuracy.
          </div>
          <div className="flex gap-3 mt-2">
            <a href="https://wa.me/919339973793" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#25D366] hover:bg-[#1ebc59] transition">
              <FaWhatsapp className="text-white text-xl" />
            </a>
            <a href="mailto:khantradingworld477@gmail.com" className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-500 hover:bg-blue-600 transition">
              <FaEnvelope className="text-white text-lg" />
            </a>
          </div>
        </div>
        {/* Middle: Quick Links */}
        <div className="flex flex-col gap-2 min-w-[150px]">
          <div className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Links</div>
          <a href="#home" onClick={handleFooterLinkClick} className={`text-sm hover:underline transition-colors ${isDarkMode ? 'text-slate-300 hover:text-blue-300' : 'text-slate-700 hover:text-blue-700'}`}>Home</a>
          <a href="#about" onClick={handleFooterLinkClick} className={`text-sm hover:underline transition-colors ${isDarkMode ? 'text-slate-300 hover:text-blue-300' : 'text-slate-700 hover:text-blue-700'}`}>About Us</a>
          <a href="#pricing" onClick={handleFooterLinkClick} className={`text-sm hover:underline transition-colors ${isDarkMode ? 'text-slate-300 hover:text-blue-300' : 'text-slate-700 hover:text-blue-700'}`}>Pricing</a>
          <a href="#contactUs" onClick={handleFooterLinkClick} className={`text-sm hover:underline transition-colors ${isDarkMode ? 'text-slate-300 hover:text-blue-300' : 'text-slate-700 hover:text-blue-700'}`}>Contact Us</a>
        </div>
        {/* Right: Contact Info */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Contact Info</div>
          {/* <div className={`text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}> 
            <span className="font-semibold">Customer Care:</span><br />
            <span>+91-XXXXXXXXXX</span>
          </div> */}
          <div className={`text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}> 
            <span className="font-semibold">Email:</span><br />
            <span>khantradingworld477@gmail.com</span>
          </div>
          <div className={`text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}> 
            <span className="font-semibold">WhatsApp:</span><br />
            <span>+91-9339973793</span>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-700'}`}> 
            <span className="font-semibold">SMS & Call Support:</span><br />
            <span>For queries and updates</span>
          </div>
        </div>
      </div>
      <div className="flex">
      <div className={`w-full text-center text-sm pt-2 pb-3 border-t flex justify-end ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
        &copy; 2025 Khan Trading World. All rights reserved.
      </div>
      <div className={`w-full text-center text-sm pt-2 pb-3 border-t flex justify-start pl-1 ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
         Developed by<Link to="https://asthetcss.in" target="_blank" className="underline hover:text-blue-400 pl-1">AsthetCSS</Link>
      </div>
      </div>
    </footer>
  );
};

export default Footer; 