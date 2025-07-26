import React from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>
    ),
    bg: 'bg-green-100',
    darkBg: 'bg-green-900/30',
    title: 'Guaranteed 6% Returns',
    desc: 'Monthly guaranteed returns with professional fund management',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
    ),
    bg: 'bg-blue-100',
    darkBg: 'bg-blue-900/30',
    title: 'Capital Safety First',
    desc: 'Your capital protection is our top priority with risk management',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
    ),
    bg: 'bg-purple-100',
    darkBg: 'bg-purple-900/30',
    title: 'SMS After Every Call',
    desc: 'Complete transparency with SMS updates after each trading decision',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    ),
    bg: 'bg-orange-100',
    darkBg: 'bg-orange-900/30',
    title: 'Dedicated Support',
    desc: '24/7 financial support and guidance from our expert team',
  },
];

const highlights = [
  { label: 'Monthly Returns', value: '6%', color: 'text-green-500' },
  { label: 'Funds Managed', value: '₹50Cr+', color: 'text-blue-500' },
];

const included = [
  { label: 'Professional Management', status: 'Included' },
  { label: 'SMS Updates', status: 'Included' },
  { label: '24/7 Support', status: 'Included' },
  { label: 'Capital Safety', status: 'Priority' },
];

const AccountHandling = ({ isDarkMode }) => (
  <section className={`py-16 px-2 sm:px-6 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <span className={`px-4 py-1 rounded-full text-xs font-semibold border mb-4 transition-colors ${isDarkMode ? 'border-blue-400 text-blue-300 bg-slate-800' : 'border-blue-200 text-blue-600 bg-blue-50'}`}>Professional Fund Management</span>
        <h1 className={`text-3xl sm:text-4xl font-extrabold mb-2 text-center transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Handling Services</h1>
        <p className={`text-lg text-center max-w-2xl transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Let our experts manage your trading account with guaranteed returns and complete transparency</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Features */}
        <div className="space-y-6">
          <div className={`font-bold text-xl mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why Choose Our Account Handling?</div>
          {features.map((f, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? f.darkBg : f.bg}`}>{f.icon}</div>
              <div>
                <div className={`font-semibold text-base mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{f.title}</div>
                <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Right: Highlights Card */}
        <div className={`rounded-2xl border shadow-sm p-8 flex flex-col items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br from-blue-400 via-yellow-200 to-yellow-400">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <div className={`font-bold text-xl mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Service Highlights</div>
          <div className="flex w-full gap-4 mb-6">
            {highlights.map((h, i) => (
              <div key={i} className={`flex-1 rounded-xl p-4 text-center font-bold text-lg transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-blue-50 text-slate-900'}`}>
                <div className={`${h.color} text-2xl mb-1`}>{h.value}</div>
                <div className={`text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{h.label}</div>
              </div>
            ))}
          </div>
          <ul className="w-full mb-6">
            {included.map((inc, i) => (
              <li key={i} className="flex justify-between items-center py-1 text-sm">
                <span className={`transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{inc.label}</span>
                <span className={`font-semibold ${inc.status === 'Priority' ? 'text-yellow-500' : 'text-green-500'}`}>✓ {inc.status}</span>
              </li>
            ))}
          </ul>
          <button
            className="w-full py-3 rounded-lg font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] transition flex items-center justify-center gap-2"
            as="a"
            onClick={() => window.open('https://wa.me/919339973793', '_blank')}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.646.86 5.09 2.33 7.09L4.06 29.25a1 1 0 0 0 1.25 1.25l7.16-2.27A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.77 0-3.47-.36-5.01-1.01l-.36-.15-4.25 1.35 1.36-4.18-.18-.37A9.97 9.97 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.21 3.05.15.19 2.09 3.19 5.07 4.35.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
            💬 Enquire on WhatsApp
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default AccountHandling; 