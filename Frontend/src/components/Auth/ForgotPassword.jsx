import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import AuthService from '../../services/authService';
import { toast } from 'sonner';

export default function ForgotPassword({ isDarkMode = false }) {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password, 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setError('Email is required.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) return setError('Enter a valid email address.');
    setLoading(true);
    try {
      await AuthService.requestPasswordResetOTP(cleanEmail);
      toast.success('OTP sent to your email!');
      setEmail(cleanEmail); // update state to cleaned email
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    if (!cleanEmail) return setError('Email is required.');
    if (!cleanOtp) return setError('OTP is required.');
    if (!newPassword) return setError('New password is required.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await AuthService.resetPasswordWithOTP(cleanEmail, cleanOtp, newPassword);
      setEmail(cleanEmail);
      setOtp(cleanOtp);
      toast.success('Password reset successful!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Success
  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900 text-cyan-100' : 'bg-white text-slate-900'}`}>
      <form
        onSubmit={
          step === 1 ? handleRequestOTP :
          step === 2 ? handleResetPassword :
          undefined
        }
        className={`flex flex-col gap-6 p-6 rounded-2xl shadow-xl border transition-all duration-300 w-full max-w-xs ${isDarkMode ? 'bg-slate-900 border-cyan-900' : 'bg-white border-cyan-200'}`}
      >
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
            <p className={isDarkMode ? 'text-cyan-300 text-sm' : 'text-gray-600 text-sm'}>
              Enter your registered email address to receive a One-Time Password (OTP) for password reset.
            </p>
            {error && <div className={isDarkMode ? 'bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm' : 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'}>{error}</div>}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
              />
            </div>
            <Button type="submit" disabled={loading} className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className={isDarkMode ? 'text-cyan-300 text-sm' : 'text-gray-600 text-sm'}>
              An OTP has been sent to your email. Please enter the OTP and your new password below.
            </p>
            {error && <div className={isDarkMode ? 'bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm' : 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'}>{error}</div>}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
                className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
              />
            </div>
            <Button type="submit" disabled={loading} className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold mb-2">Success</h1>
            <p className={isDarkMode ? 'text-cyan-300 text-sm' : 'text-gray-600 text-sm'}>
              Your password has been reset successfully! You can now log in with your new password.
            </p>
            <Button type="button" onClick={handleGoToLogin} className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}>
              Go to Login
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
