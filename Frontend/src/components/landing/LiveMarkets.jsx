import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,tron,uniswap,bitcoin,ethereum,dogecoin&vs_currencies=inr&include_24hr_change=true';

const LiveMarkets = ({ isDarkMode }) => {
  const [liveMarket, setLiveMarket] = useState(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      setMarketLoading(true);
      setMarketError(null);
      try {
        const res = await fetch(COINGECKO_API);
        if (!res.ok) throw new Error('Failed to fetch market data');
        const data = await res.json();
        setLiveMarket([
          {
            symbol: 'AVAX/INR',
            price: `₹${data['avalanche-2'].inr.toLocaleString('en-IN')}`,
            change: `${data['avalanche-2'].inr_24h_change >= 0 ? '+' : ''}${data['avalanche-2'].inr_24h_change.toFixed(2)}%`,
            trend: data['avalanche-2'].inr_24h_change >= 0 ? 'up' : 'down',
          },
          {
            symbol: 'TRX/INR',
            price: `₹${data.tron.inr.toLocaleString('en-IN')}`,
            change: `${data.tron.inr_24h_change >= 0 ? '+' : ''}${data.tron.inr_24h_change.toFixed(2)}%`,
            trend: data.tron.inr_24h_change >= 0 ? 'up' : 'down',
          },
          {
            symbol: 'UNI/INR',
            price: `₹${data.uniswap.inr.toLocaleString('en-IN')}`,
            change: `${data.uniswap.inr_24h_change >= 0 ? '+' : ''}${data.uniswap.inr_24h_change.toFixed(2)}%`,
            trend: data.uniswap.inr_24h_change >= 0 ? 'up' : 'down',
          },
          {
            symbol: 'BTC/INR',
            price: `₹${data.bitcoin.inr.toLocaleString('en-IN')}`,
            change: `${data.bitcoin.inr_24h_change >= 0 ? '+' : ''}${data.bitcoin.inr_24h_change.toFixed(2)}%`,
            trend: data.bitcoin.inr_24h_change >= 0 ? 'up' : 'down',
          },
          {
            symbol: 'ETH/INR',
            price: `₹${data.ethereum.inr.toLocaleString('en-IN')}`,
            change: `${data.ethereum.inr_24h_change >= 0 ? '+' : ''}${data.ethereum.inr_24h_change.toFixed(2)}%`,
            trend: data.ethereum.inr_24h_change >= 0 ? 'up' : 'down',
          },
          {
            symbol: 'DOGE/INR',
            price: `₹${data.dogecoin.inr.toLocaleString('en-IN')}`,
            change: `${data.dogecoin.inr_24h_change >= 0 ? '+' : ''}${data.dogecoin.inr_24h_change.toFixed(2)}%`,
            trend: data.dogecoin.inr_24h_change >= 0 ? 'up' : 'down',
          },
        ]);
      } catch (err) {
        setMarketError('Could not load live market data.');
      } finally {
        setMarketLoading(false);
      }
    };
    fetchMarket();
  }, []);

  return (
    <section id="markets" className={`py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 transition-colors ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Live Market Data
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto transition-colors ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Real-time prices and market movements across multiple asset classes
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {marketLoading && (
            <div className="col-span-full text-center text-slate-400">Loading live market data...</div>
          )}
          {marketError && (
            <div className="col-span-full text-center text-red-500">{marketError}</div>
          )}
          {liveMarket && liveMarket.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl border transition-colors min-h-[120px] flex flex-col justify-center items-center shadow-md ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' 
                  : 'bg-white/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-xs sm:text-sm mb-1 transition-colors ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>{pair.symbol}</div>
              <div className={`text-lg sm:text-xl font-semibold mb-1 transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{pair.price}</div>
              <div className={`text-sm font-medium ${pair.trend === 'up' ? 'text-cyan-500' : 'text-red-500'}`}>{pair.change}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveMarkets; 