import React from 'react';
import { motion } from 'framer-motion';

const Features = ({ isDarkMode, features }) => (
  <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-colors ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Why Choose Khans Trading Platform?
        </h2>
        <p className={`text-xl max-w-2xl mx-auto transition-colors ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Built for traders, by traders. Experience the difference with our 
          professional-grade trading platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-6 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-slate-800/70 border-slate-700 hover:border-slate-600' 
                : 'bg-white/50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {feature.title}
            </h3>
            <p className={`transition-colors ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features; 