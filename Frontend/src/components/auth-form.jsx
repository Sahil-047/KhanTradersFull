import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import AuthService from "../services/authService";
import { toast } from "sonner";

export function AuthForm({
  className,
  isSignUp = false,
  isDarkMode = false,
  ...props
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!otpSent) {
          // Send OTP
          await AuthService.requestRegisterOtp(formData.email, formData.name, formData.password);
          setOtpSent(true);
          setShowOTP(true);
          setCountdown(60);
          setError('');
          setLoading(false);
          toast.success('OTP sent to your email!');
          return;
        }
        // Complete registration
        const otpString = otp.join('');
        if (otpString.length !== 6) {
          throw new Error('Please enter the complete 6-digit OTP');
        }
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          otp: otpString,
          role: formData.role,
          ...(formData.role === 'admin' ? { username: formData.name } : {})
        };
        await AuthService.registerUser(userData);
        toast.success('Registration successful!');
        navigate(formData.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      } else {
        // Login
        const result = await AuthService.loginUser(formData.email, formData.password, formData.role);
        console.log('Login result:', result);
        toast.success('Login successful!');

        // Extract role from backend response or JWT if needed
        let backendRole = formData.role;
        if (result?.user?.role) {
          backendRole = result.user.role;
        } else if (result?.admin) {
          backendRole = result.admin.role || 'admin'; // fallback to 'admin' if admin object exists
        }
        // Store role in localStorage for getProfile()
        localStorage.setItem('user_role', backendRole);

        if (backendRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
      // Only show toast if there is a specific backend error message or custom error
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message && !error.message.startsWith('Request failed with status code')) {
        toast.error(error.message);
      }
      // Do not show toast for generic status code errors
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');
    try {
      await AuthService.requestRegisterOtp(formData.email, formData.name, formData.password);
      setCountdown(60);
      toast.success('OTP resent successfully!');
    } catch (error) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(
        "flex flex-col gap-6 p-6 rounded-2xl shadow-xl border transition-all duration-300",
        isDarkMode
          ? "bg-slate-900 border-cyan-900 text-cyan-100"
          : "bg-white border-cyan-200 text-slate-900",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{isSignUp ? 'Sign up to your account' : 'Login to your account'}</h1>
        <p className={isDarkMode ? "text-cyan-300 text-sm text-balance" : "text-gray-600 text-sm text-balance"}>
          {isSignUp ? 'Enter your details below to create your account' : 'Enter your email below to login to your account'}
        </p>
      </div>

      {error && (
        <div className={isDarkMode ? "bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" : "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"}>
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {isSignUp && (
          <div className="grid gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={handleInputChange}
              required 
              className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
            />
          </div>
        )}

        {/* Role Selection */}
        <div className="grid gap-3">
          <Label>Select Role</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.role === 'user'
                  ? (isDarkMode ? 'border-cyan-500 bg-cyan-900 text-cyan-200' : 'border-blue-500 bg-blue-50 text-blue-700')
                  : (isDarkMode ? 'border-cyan-900 bg-slate-900 text-cyan-400 hover:border-cyan-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400')
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">👤</div>
                <div className="font-semibold">User</div>
                <div className="text-xs text-cyan-400">Regular Trading Account</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.role === 'admin'
                  ? (isDarkMode ? 'border-green-400 bg-green-900 text-green-200' : 'border-green-500 bg-green-50 text-green-700')
                  : (isDarkMode ? 'border-cyan-900 bg-slate-900 text-cyan-400 hover:border-cyan-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400')
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="font-semibold">Admin</div>
                <div className="text-xs text-green-400">Administrative Access</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={formData.email}
            onChange={handleInputChange}
            required 
            className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
          />
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {!isSignUp && (
              <Link to="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            )}
          </div>
          <Input 
            id="password" 
            type="password" 
            value={formData.password}
            onChange={handleInputChange}
            required 
            className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
          />
        </div>
        
        {isSignUp && (
          <div className="grid gap-3">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required 
              className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
            />
          </div>
        )}

        {/* OTP Input Section */}
        {isSignUp && showOTP && (
          <div className="grid gap-3">
            <Label>Enter OTP</Label>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 text-center text-lg font-bold' : 'bg-slate-100 border-cyan-200 text-blue-900 text-center text-lg font-bold'}
                  required
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={isDarkMode ? "text-cyan-400" : "text-gray-600"}>
                Didn't receive OTP?
              </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`underline ${countdown > 0 ? 'text-gray-500' : isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={loading}
          className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
        >
          {loading ? 'Processing...' : (isSignUp ? (otpSent ? 'Complete Registration' : 'Send OTP') : 'Login')}
        </Button>
      </div>

      <div className="text-center text-sm">
        {isSignUp ? (
          <span className={isDarkMode ? "text-cyan-400" : "text-gray-600"}>
            Already have an account?{' '}
            <Link to="/login" className="underline hover:underline-offset-4">
              Login
            </Link>
          </span>
        ) : (
          <span className={isDarkMode ? "text-cyan-400" : "text-gray-600"}>
            Don't have an account?{' '}
            <Link to="/signup" className="underline hover:underline-offset-4">
              Sign up
            </Link>
          </span>
        )}
      </div>
    </form>
  )
} 