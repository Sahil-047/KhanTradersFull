import React from 'react';

const reasons = [
  {
    title: 'Proven Business Model',
    desc: 'Leverage our tested and successful trading consultancy framework',
  },
  {
    title: 'Complete Training',
    desc: 'Comprehensive training program to get you started quickly',
  },
  {
    title: 'Marketing Support',
    desc: 'Full marketing materials and ongoing promotional support',
  },
  {
    title: 'Technology Platform',
    desc: 'Access to our proprietary trading tools and client management system',
  },
];

const stats = [
  { value: '₹5L+', label: 'Average Monthly Revenue Potential', color: 'text-blue-500' },
  { value: '30+', label: 'Successful Franchises', color: 'text-yellow-500' },
  { value: '6', label: 'Months ROI Timeline', color: 'text-blue-500' },
  { value: '24/7', label: 'Ongoing Support', color: 'text-yellow-500' },
];

const FranchiseOpportunity = ({ isDarkMode }) => (
  <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Franchise Opportunity</h2>
        <p className={`text-lg max-w-2xl mx-auto transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Join the Khan Trading World family and build your own successful trading consultancy business with our proven system and comprehensive support.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Why Partner With Us */}
        <div>
          <div className={`font-bold text-2xl mb-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why Partner With Us?</div>
          <p className={`mb-6 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Starting your own trading consultancy can be challenging, but with Khan Trading World's franchise program, you get all the tools, knowledge, and support needed to succeed in this lucrative industry.</p>
          <ul className="mb-8 space-y-4">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100"><svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>
                <div>
                  <div className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.title}</div>
                  <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{r.desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-2 px-8 py-3 rounded-lg font-semibold text-slate-900 bg-yellow-400 hover:bg-yellow-500 transition">Get Franchise Information</button>
        </div>
        {/* Right: Stats */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl border shadow-sm p-8 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`font-extrabold text-2xl mb-1 ${s.color}`}>{s.value}</div>
              <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA Section */}
      <div className={`max-w-6xl mx-auto mt-16 rounded-2xl border shadow-sm p-8 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} px-4 sm:px-6 lg:px-8`}>
        <h3 className={`text-2xl font-bold mb-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ready to Start Your Journey?</h3>
        <p className={`mb-6 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Take the first step towards financial independence. Contact us today to learn more about our franchise opportunities and how we can help you build a successful trading consultancy business.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className={`px-8 py-3 rounded-lg font-semibold border transition-colors duration-200 ${isDarkMode ? 'border-blue-400 text-blue-300 bg-transparent hover:bg-blue-900/20' : 'border-blue-500 text-slate-900 bg-white hover:bg-blue-50'}`}>Request Information</button>
          <button className={`px-8 py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200`}>Schedule a Call</button>
        </div>
      </div>
    </div>
  </section>
);

export default FranchiseOpportunity;