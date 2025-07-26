import React from 'react';

const services = [
  {
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>
    ),
    bg: 'bg-green-100',
    darkBg: 'bg-green-900/30',
    title: 'Premium Trading Tips',
    desc: 'High-accuracy Bank Nifty tips with proper stop-loss management',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 17l6-6 4 4 6-6" /></svg>
    ),
    bg: 'bg-blue-100',
    darkBg: 'bg-blue-900/30',
    title: 'Account Handling',
    desc: 'Professional fund management with guaranteed returns and safety',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
    ),
    bg: 'bg-purple-100',
    darkBg: 'bg-purple-900/30',
    title: 'Expert Consultation',
    desc: 'Personalized guidance and volatility strategy development',
  },
];

const CoreServices = ({ isDarkMode }) => (
  <section className="w-full py-12 sm:py-16 px-2 sm:px-6 lg:px-12">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Our Core Services</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={`rounded-2xl shadow-sm p-8 flex flex-col items-center text-center transition hover:shadow-md border transition-colors
              ${isDarkMode ? 'bg-slate-800/70 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'}`}
          >
            <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-6 transition-colors ${isDarkMode ? service.darkBg : service.bg}`}>{service.icon}</div>
            <div className={`font-bold text-lg mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{service.title}</div>
            <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{service.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoreServices; 