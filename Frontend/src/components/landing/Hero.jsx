import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselSlides = [
  {
    title: 'Franchise Opportunity',
    subtitle: 'START YOUR TRADING BUSINESS',
    description: 'Join our proven business model with complete support',
    bg: 'bg-gradient-to-tr from-orange-400 via-orange-500 to-red-500',
  },
  {
    title: 'Premium Trading Tips',
    subtitle: 'EXPERT GUIDANCE',
    description: 'Get daily premium tips from our trading experts',
    bg: 'bg-gradient-to-tr from-blue-500 via-blue-600 to-indigo-500',
  },
  {
    title: '24/7 Support',
    subtitle: 'ALWAYS HERE FOR YOU',
    description: 'Our team is available round the clock for your needs',
    bg: 'bg-gradient-to-tr from-green-400 via-green-500 to-teal-500',
  },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % carouselSlides.length);
    }, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className={`w-full h-[320px] sm:h-[340px] md:h-[360px] lg:h-[380px] xl:h-[400px] rounded-xl overflow-hidden shadow-lg relative flex items-center justify-center ${carouselSlides[current].bg}`}> 
        {/* Stronger Blurred overlay */}
        <div className="absolute inset-0 backdrop-blur-lg bg-black/30 z-0" />
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80, position: 'absolute', width: '100%' }}
              animate={{ opacity: 1, x: 0, position: 'absolute', width: '100%' }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80, position: 'absolute', width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full h-full flex flex-col items-center justify-center text-center text-white px-6 z-10"
              style={{ top: 0, left: 0 }}
            >
              <div className="uppercase text-xs sm:text-sm font-semibold mb-2 tracking-wider opacity-90">{carouselSlides[current].subtitle}</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">{carouselSlides[current].title}</div>
              <div className="text-sm sm:text-base mb-6 opacity-90">{carouselSlides[current].description}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Dots */}
      <div className="flex gap-2 mt-4">
        {carouselSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white/90' : 'bg-white/40'} border border-white/60 transition`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const Hero = ({ isDarkMode }) => (
  <section className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex flex-col justify-center items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-20">
      {/* Hero Content */}
      <div className="flex-1 w-full max-w-3xl text-center lg:text-left flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-5xl sm:text-6xl lg:text-6xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
        >
          Welcome to <span className="text-blue-500">Khan</span> Trading<br />
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">World</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-sm sm:text-base mt-4 mb-8 max-w-2xl mx-auto lg:mx-0 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
        >
          Your trusted partner in trading success. Get expert consultation, premium trading tips, and comprehensive support to elevate your trading journey.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12"
        >
          <a
            href="#pricing"
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md text-sm font-semibold transition-colors shadow-sm"
            onClick={e => {
              e.preventDefault();
              const section = document.getElementById('pricing');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get Started Now
          </a>
          <a
            href="#about"
            className={`border-2 px-8 py-3 rounded-md text-sm font-semibold transition-colors ${
              isDarkMode
                ? 'border-slate-400 text-white hover:bg-slate-800'
                : 'border-slate-700 text-slate-900 hover:bg-slate-100'
            }`}
          >
            Learn More
          </a>
        </motion.div>
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center lg:justify-start gap-24 mt-2"
        >
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">1000+</div>
            <div className={`mt-1 text-xs sm:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">95%</div>
            <div className={`mt-1 text-xs sm:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">24/7</div>
            <div className={`mt-1 text-xs sm:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Support</div>
          </div>
        </motion.div>
      </div>
      {/* Carousel */}
      <div className="flex-1 w-full max-w-xl flex items-center justify-center">
        <Carousel />
      </div>
    </div>
  </section>
);

export default Hero; 
