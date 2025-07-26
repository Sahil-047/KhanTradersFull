import React from 'react';

const monthlyFeatures = [
  'Exclusive WhatsApp trading tips',
  'Daily Bank Nifty analysis',
  'Real-time trade alerts',
  'Stop-loss management strategies',
  'Portfolio optimization guidance',
  '1-on-1 consultation sessions',
];

const quarterlyFeatures = [
  ...monthlyFeatures,
  'Priority customer support',
  'Monthly performance reports',
  'SMS updates after every call',
  'Volatility strategy development',
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

const Pricing = ({ isDarkMode }) => (
  <section id="pricing" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <span className={`px-4 py-1 rounded-full text-xs font-semibold border mb-4 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300 bg-slate-800' : 'border-blue-200 text-blue-600 bg-blue-50'}`}>Premium Membership Plans</span>
        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-2 text-center transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Choose Your Premium Plan</h2>
        <p className={`text-lg text-center max-w-2xl transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Get exclusive access to high-accuracy trading tips, expert guidance, and professional support</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Monthly Plan */}
        <div className={`relative rounded-2xl border p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-xl">⚡</span>
            <span className={`font-bold text-lg transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Monthly Plan</span>
          </div>
          <div className="text-blue-600 font-extrabold text-4xl mb-1">₹5,000</div>
          <div className={`text-sm mb-2 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>per month</div>
          <span className={`inline-block mb-4 text-xs px-3 py-1 rounded-full font-semibold ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-500'}`}>Most Flexible</span>
          <div className={`font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>What's Included:</div>
          <ul className="mb-6 space-y-3">
            {monthlyFeatures.map((f, i) => (
              <li key={i} className={`flex items-center transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}><CheckIcon />{f}</li>
            ))}
          </ul>
          <a
            href="https://wa.me/919339973793?text=I'm%20interested%20in%20the%20Monthly%20Plan%20on%20Khan%20Trading%20World"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.646.86 5.09 2.33 7.09L4.06 29.25a1 1 0 0 0 1.25 1.25l7.16-2.27A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.77 0-3.47-.36-5.01-1.01l-.36-.15-4.25 1.35 1.36-4.18-.18-.37A9.97 9.97 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.21 3.05.15.19 2.09 3.19 5.07 4.35.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
            Buy/Enquire on WhatsApp
          </a>
        </div>
        {/* Quarterly Plan */}
        <div className={`relative rounded-2xl border p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-blue-400' : 'bg-white border-blue-400'}`}>
          {/* Most Popular Badge */}
          <div className="flex flex-col items-center mb-2 mt-2">
            <span className={`mb-2 px-4 py-1 rounded-full font-semibold text-xs shadow border ${isDarkMode ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700' : 'bg-yellow-400 text-slate-900 border-yellow-300'}`}>Most Popular</span>
            <div className="flex items-center">
              <span className="mr-2 text-xl">👑</span>
              <span className={`font-bold text-lg transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quarterly Plan</span>
            </div>
          </div>
          <div className="text-blue-600 font-extrabold text-4xl mb-1">₹12,000</div>
          <div className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>for 3 months</div>
          <span className={`inline-block mb-1 text-xs px-3 py-1 rounded-full font-semibold ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>Save ₹3,000</span>
          <div className={`text-xs line-through mb-2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹15,000 → ₹12,000</div>
          <div className={`font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Everything in Monthly, Plus:</div>
          <ul className="mb-6 space-y-3">
            {quarterlyFeatures.map((f, i) => (
              <li key={i} className={`flex items-center transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}><CheckIcon />{f}</li>
            ))}
          </ul>
          <a
            href="https://wa.me/919339973793?text=I'm%20interested%20in%20the%20Quarterly%20Plan%20on%20Khan%20Trading%20World"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.646.86 5.09 2.33 7.09L4.06 29.25a1 1 0 0 0 1.25 1.25l7.16-2.27A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.77 0-3.47-.36-5.01-1.01l-.36-.15-4.25 1.35 1.36-4.18-.18-.37A9.97 9.97 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.21 3.05.15.19 2.09 3.19 5.07 4.35.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
            Buy/Enquire on WhatsApp
          </a>
        </div>
      </div>
      {/* Secure Payment Box */}
      <div className={`mt-10 rounded-xl shadow-sm p-6 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-yellow-50 via-white to-blue-50'}`}>
        <div className={`font-semibold mb-2 text-lg transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Secure Payment Process</div>
        <div className={`mb-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Premium payments are processed manually via WhatsApp/UPI for your security and convenience. Our team will guide you through the simple payment process and activate your premium access immediately.</div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-700'}`}>✓ UPI Payment</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-700'}`}>✓ Bank Transfer</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-700'}`}>✓ WhatsApp Support</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-700'}`}>✓ Instant Activation</span>
        </div>
      </div>
    </div>
  </section>
);

export default Pricing; 