import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import LiveMarkets from '../components/landing/LiveMarkets';
import About from '../components/landing/About';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Reviews from '../components/landing/Reviews';
import Footer from '../components/landing/Footer';
import Achievements from '../components/landing/Achievements';
import CoreServices from '../components/landing/CoreServices';
import HowItWorks from '../components/landing/HowItWorks';
import FranchiseOpportunity from '../components/landing/FranchiseOpportunity';
import AccountHandling from '../components/landing/AccountHandling';
import ContactUs from '../components/landing/ContactUs';
// import ForgotPassword from '../components/Auth/ForgotPassword';
// import ResetPassword from '../components/Auth/ResetPassword';
import { features, pricingPlans, reviews } from '../components/landing/landingData';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Hero isDarkMode={isDarkMode} />
      <Achievements isDarkMode={isDarkMode} />
      <CoreServices isDarkMode={isDarkMode} />
      <LiveMarkets isDarkMode={isDarkMode} />
      <About isDarkMode={isDarkMode} />
      <HowItWorks isDarkMode={isDarkMode} />
      <Pricing isDarkMode={isDarkMode} />
      <Reviews isDarkMode={isDarkMode} reviews={reviews} />
      <AccountHandling isDarkMode={isDarkMode} />
      <ContactUs isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default LandingPage; 