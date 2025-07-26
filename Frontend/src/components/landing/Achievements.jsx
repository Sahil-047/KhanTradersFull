import React from 'react';

const Achievements = ({ isDarkMode }) => (
  <section className="w-full py-12 sm:py-16 px-2 sm:px-6 lg:px-12">
    <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-6 sm:p-12 transition-colors duration-300
      ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50 border-slate-100'}`}
    >
      <div className="text-center mb-6">
        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Our Achievements</h2>
        <p className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Proven track record of excellence and client satisfaction</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8 text-center">
        <div>
          <div className={`font-extrabold text-2xl sm:text-1xl mb-1 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹50Cr+</div>
          <div className={`text-xs sm:text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Funds Managed</div>
        </div>
        <div>
          <div className={`font-extrabold text-2xl sm:text-1xl mb-1 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>7+</div>
          <div className={`text-xs sm:text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Years Experience</div>
        </div>
        <div>
          <div className={`font-extrabold text-2xl sm:text-1xl mb-1 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>90%+</div>
          <div className={`text-xs sm:text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tip Accuracy</div>
        </div>
        <div>
          <div className={`font-extrabold text-2xl sm:text-1xl mb-1 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1000+</div>
          <div className={`text-xs sm:text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Happy Clients</div>
        </div>
      </div>
    </div>
  </section>
);

export default Achievements; 