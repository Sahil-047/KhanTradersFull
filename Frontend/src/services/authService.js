import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Change to your backend port
const TOKEN_KEY = 'auth_token';

// Set up axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include token in Authorization header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401/403 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Optionally, show a toast or redirect to login
      toast.error('Session expired. Please log in again.');
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to set token in cookies
export function setAuthToken(token) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // expires in 7 days
}

// Helper to get token from cookies
export function getAuthToken() {
  return Cookies.get(TOKEN_KEY);
}

// Helper to remove token from cookies
export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY);
}

// Logout user: remove token
export function logout() {
  removeAuthToken();
}

// Login user
export async function loginUser(email, password, role) {
  const endpoint = role === 'admin' ? '/api/admin/login' : '/api/user/login';
  const response = await api.post(endpoint, { email, password, role });
  const { token } = response.data;
  setAuthToken(token);
  return response.data;
}

// Register user (after OTP)
export async function registerUser(userData) {
  const endpoint = userData.role === 'admin' ? '/api/admin/register' : '/api/user/register';
  const response = await api.post(endpoint, userData);
  const { token } = response.data;
  setAuthToken(token);
  return response.data;
}

// Request OTP for registration
export async function requestRegisterOtp(email, username, password) {
  return api.post('/api/user/register/request-otp', { email, username, password });
}

// Update user's premium status
export async function updatePremiumStatus(userId, isPremium, premiumExpiry) {
  console.log('Updating premium status for user ID:', userId, isPremium, premiumExpiry);
  const res = await api.post('/api/user/premium', { userId, is_premium: isPremium, premium_expiry: premiumExpiry });
  return res.data;
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken();
}

// Get the current user's profile
export async function getProfile() {
  const role = localStorage.getItem('user_role');
  if (role === 'admin') {
    console.log('Requesting admin profile:', api.defaults.baseURL + '/api/admin/profile');
    const response = await api.get('/api/admin/profile');
    return response.data;
  } else {
    console.log('Requesting user profile:', api.defaults.baseURL + '/api/user/profile');
    const response = await api.get('/api/user/profile');
    return response.data;
  }
}

// Update the current user's profile
export async function updateProfile(userId, profileData) {
  const response = await api.put(`/api/user/${userId}`, profileData); // <-- plural 'users'
  return response.data;
}

// Create bank details for the current user
export async function createBank(bankData) {
  const response = await api.post('/api/banks', bankData);
  return response.data;
}

// Update bank details
export async function updateBank(bankId, bankData) {
  const response = await api.put(`/api/banks/${bankId}`, bankData);
  return response.data;
}

// deleteBank
export async function deleteBank(bankId) {
  const response = await api.delete(`/api/banks/${bankId}`);
  return response.data;
}

// Get all users (admin only)
export async function getAllUsers() {
  const response = await api.get('/api/user');
  return response.data;
}

// Fetch all banks for a user
async function getUserBanks(userId) {
  const res = await api.get(`/api/user/${userId}/banks`);
  return res.data;
}

// Replace a bank account for a user
export async function replaceBank({ user_id, old_bank_id, new_bank }) {
  const token = Cookies.get('auth_token');
  const response = await api.post(
    `${API_BASE_URL}/api/banks/replace`,
    { user_id, old_bank_id, new_bank },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// Change password (authenticated)
export async function changePassword(newPassword, currentPassword) {
  // Backend expects { currentPassword, newPassword }
  const payload = { currentPassword, newPassword };
  const response = await api.post('/api/user/change-password', payload);
  return response.data;
}

// Forgot password OTP flow
export async function requestPasswordResetOTP(email) {
  const response = await api.post('/forgot-password', { email });
  return response.data;
}
export async function verifyResetOTP(email, otp) {
  const response = await api.post('/verify-reset-otp', { email, otp });
  return response.data;
}
export async function resetPasswordWithOTP(email, otp, newPassword) {
  const response = await api.post('/reset-password', { email, otp, newPassword });
  return response.data;
}

export default {
  api,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  loginUser,
  registerUser,
  requestRegisterOtp,
  logout,
  isAuthenticated,
  getProfile,
  updateProfile,
  createBank,
  updateBank,
  deleteBank,
  getAllUsers,
  getUserBanks,
  updatePremiumStatus,
  replaceBank,
  changePassword,
  requestPasswordResetOTP,
  verifyResetOTP,
  resetPasswordWithOTP,
};
