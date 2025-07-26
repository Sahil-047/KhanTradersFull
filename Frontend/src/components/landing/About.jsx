import React from 'react';

const features = [
  {
    title: 'Bank Nifty Tips',
    badge: '90%+',
    badgeType: 'success',
  },
  {
    title: 'Volatility Strategies',
    badge: 'High Success',
    badgeType: 'info',
  },
  {
    title: 'Stop-Loss Management',
    badge: 'Risk Control',
    badgeType: 'warning',
  },
  {
    title: 'Account Handling',
    badge: 'Professional',
    badgeType: 'info',
  },
];

const About = ({ isDarkMode }) => (
  <section id="about" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}> 
    <div className="max-w-6xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>About KHAN TRADING WORLD</h2>
        <p className={`text-sm max-w-2xl mx-auto transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Leading the way in professional trading consultancy with expertise in Bank Nifty and comprehensive financial services.</p>
      </div>
      {/* Main Card */}
      <div className={`w-full rounded-2xl shadow p-6 md:p-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12 border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        {/* Left: Logo and Info */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-slate-200 to-yellow-400 flex items-center justify-center mb-4">
            <span className="text-4xl font-extrabold text-white drop-shadow">SKH</span>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">Samim Hossain Khan</div>
            <div className="text-lg font-semibold text-yellow-500 mb-2">CEO & Fund Manager</div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>7+ Years Experience</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>₹50Cr+ Managed</span>
            </div>
          </div>
        </div>
        {/* Right: Leadership Excellence */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className={`text-2xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Leadership Excellence</div>
          <ul className="space-y-4 w-full">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
              <div>
                <div className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Professional Fund Management</div>
                <div className={`text-xs transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Managing over ₹50 Crores in client funds with proven expertise and dedication</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
              <div>
                <div className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>7+ Years Market Experience</div>
                <div className={`text-xs transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Deep understanding of market dynamics and volatility strategies</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
              <div>
                <div className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bank Nifty Specialist</div>
                <div className={`text-xs transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Specialized expertise in Bank Nifty trading with exceptional accuracy rates</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {features.map((feature, idx) => (
          <div key={idx} className={`rounded-2xl shadow border flex flex-col items-center p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <svg className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className={`font-semibold mb-2 text-center text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
              feature.badgeType === 'success'
                ? isDarkMode
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-900/20'
                  : 'border-yellow-400 text-yellow-500 bg-yellow-50'
                : feature.badgeType === 'warning'
                ? isDarkMode
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-900/20'
                  : 'border-yellow-400 text-yellow-500 bg-yellow-50'
                : isDarkMode
                ? 'border-blue-400 text-blue-400 bg-blue-900/20'
                : 'border-blue-200 text-blue-500 bg-blue-50'
            }`}>{feature.badge}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About; 