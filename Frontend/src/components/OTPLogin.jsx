import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';

const OTPLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpConfig = AuthService.getOTPConfig();
  const securityStatus = AuthService.getSecurityStatus();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check security status first
      if (securityStatus.isLockedOut) {
        throw new Error(`Account temporarily locked. Try again in ${securityStatus.remainingLockoutTime} seconds.`);
      }

      const response = await AuthService.requestLoginOTP(email);
      setSuccess(response.message);
      setStep('otp');
      setCountdown(otpConfig.resendCooldown);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await AuthService.loginWithOTP(email, otp);
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await AuthService.requestLoginOTP(email);
      setSuccess(response.message);
      setCountdown(otpConfig.resendCooldown);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccess('');
  };

  if (securityStatus.isLockedOut) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-4">Account Locked</h2>
        <p className="text-red-600">
          Your account is temporarily locked due to too many failed attempts.
        </p>
        <p className="text-red-600 mt-2">
          Try again in {securityStatus.remainingLockoutTime} seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Admin Login
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600">
          {success}
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleRequestOTP}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLoginWithOTP}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
              pattern="[0-9]{6}"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit code sent to {email}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={handleBackToEmail}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0 || loading}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 
                ? `Resend OTP in ${countdown}s` 
                : 'Resend OTP'
              }
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p>Security Status:</p>
          <p>Login Attempts: {securityStatus.loginAttempts}/{securityStatus.maxAttempts}</p>
          {securityStatus.remainingLockoutTime > 0 && (
            <p>Lockout Time: {securityStatus.remainingLockoutTime}s</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;