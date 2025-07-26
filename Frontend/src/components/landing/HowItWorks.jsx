import React from 'react';

const steps = [
  {
    number: 1,
    title: 'Contact Us',
    desc: 'Reach out via WhatsApp or call',
  },
  {
    number: 2,
    title: 'Account Setup',
    desc: 'We help setup your trading account',
  },
  {
    number: 3,
    title: 'Start Trading',
    desc: 'Our experts manage your trades',
  },
  {
    number: 4,
    title: 'Track Returns',
    desc: 'Monitor guaranteed monthly returns',
  },
];

const HowItWorks = ({ isDarkMode }) => (
  <section className="w-full py-10 px-2 sm:px-6 lg:px-12">
    <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-6 sm:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}> 
      <div className="text-center mb-8">
        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>How It Works</h2>
        <p className={`text-sm sm:text-base transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Simple process to get started with professional account handling</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-3 font-bold text-lg transition-colors ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>{step.number}</div>
            <div className={`font-semibold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</div>
            <div className={`text-xs sm:text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks; 