import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = ({ isDarkMode }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await axios.post('https://api.khantrader.in/api/contact', form, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccess('Your message has been sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('There was an error sending your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contactUs" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl sm:text-4xl font-extrabold text-center mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Contact Us</h2>
        <p className={`text-center mb-10 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Get in touch with our team for any questions, support, or to learn more about our services.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-4">
            <div className={`rounded-xl p-5 flex items-start gap-4 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}> 
              <span className="mt-1">
                {/* Envelope Icon */}
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              </span>
              <div>
                <div className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email Us</div>
                <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>khantradingworld477@gmail.com</div>
              </div>
            </div>
          <div className={`rounded-xl p-5 flex items-start gap-4 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <span className="mt-1">
              {/* Mobile/Call Icon */}
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z" /></svg>
            </span>
            <div>
              <div className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Call Us</div>
              <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>+91-9339973793</div>
            </div>
          </div>
          <div className={`rounded-xl p-5 flex items-start gap-4 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <span className="mt-1">
              {/* Official WhatsApp Icon */}
              <svg className="w-6 h-6" viewBox="0 0 32 32"><g><circle fill="#25D366" cx="16" cy="16" r="16"/><path fill="#FFF" d="M25.47 22.29c-.38-.19-2.23-1.1-2.58-1.23-.35-.13-.6-.19-.85.19-.25.38-.97 1.23-1.19 1.48-.22.25-.44.28-.82.09-.38-.19-1.6-.59-3.05-1.88-1.13-1.01-1.89-2.25-2.11-2.63-.22-.38-.02-.58.17-.77.18-.18.38-.47.57-.7.19-.22.25-.38.38-.63.13-.25.06-.47 0-.66-.06-.19-.85-2.05-1.17-2.8-.31-.75-.63-.65-.85-.66-.22-.01-.47-.01-.72-.01-.25 0-.66.09-1.01.47-.35.38-1.33 1.3-1.33 3.16 0 1.86 1.36 3.66 1.55 3.91.19.25 2.68 4.1 6.5 5.59.91.31 1.62.5 2.18.64.92.23 1.76.2 2.42.12.74-.09 2.23-.91 2.54-1.79.31-.88.31-1.63.22-1.79-.09-.16-.34-.25-.72-.44z"/></g></svg>
            </span>
            <div>
              <div className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>WhatsApp</div>
              <div className={`text-sm transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Chat with us instantly</div>
            </div>
          </div>
          <div className={`rounded-xl p-5 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className={`font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Business Hours</div>
            <div className={`flex justify-between text-sm mb-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><span>Monday - Friday:</span><span>9:00 AM - 6:00 PM</span></div>
            <div className={`flex justify-between text-sm mb-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><span>Saturday:</span><span>10:00 AM - 4:00 PM</span></div>
            <div className={`flex justify-between text-sm mb-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><span>Sunday:</span><span>Closed</span></div>
            <div className="text-xs text-yellow-400 mt-2">WhatsApp support available 24/7</div>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className={`rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}> 
          <div className={`font-bold text-xl mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Send us a Message</div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
  <div>
    <label className={`block text-sm font-semibold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Full Name *</label>
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
      placeholder="Enter your full name"
      required
    />
  </div>
  <div>
    <label className={`block text-sm font-semibold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email Address *</label>
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
      placeholder="Enter your email address"
      required
    />
  </div>
  <div>
    <label className={`block text-sm font-semibold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Phone Number</label>
    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
      placeholder="Enter your phone number"
    />
  </div>
  <div>
    <label className={`block text-sm font-semibold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Message *</label>
    <textarea
      name="message"
      value={form.message}
      onChange={handleChange}
      className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
      rows={4}
      placeholder="Tell us how we can help you..."
      required
    />
  </div>
  {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
  {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
  <button type="submit" className="w-full py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition" disabled={loading}>
    {loading ? 'Sending...' : 'Send Message'}
  </button>
</form>
        </div>
      </div>
    </div>
  </section>
);

}

export default ContactUs;