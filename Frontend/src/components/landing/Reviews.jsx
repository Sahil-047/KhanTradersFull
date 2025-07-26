import React from 'react';
import { motion } from 'framer-motion';

const Reviews = ({ isDarkMode, reviews }) => (
  <section id="reviews" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors ${
    isDarkMode ? 'bg-slate-900' : 'bg-slate-100/50'
  }`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Client Reviews
        </h2>
        <p className={`text-xl max-w-2xl mx-auto transition-colors ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          See what our clients say about their trading experience with Khan Trading World
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-6 transition-all duration-500 hover:scale-105 rounded-2xl backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-gradient-to-br from-slate-50/60 to-white/60 hover:from-slate-50/80 hover:to-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                {review.avatar}
              </div>
              <div>
                <h4 className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {review.name}
                </h4>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {review.role}
                </p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className={`text-sm leading-relaxed transition-colors ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              "{review.review}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews; 