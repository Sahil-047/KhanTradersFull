import React, { useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import AuthService from '../../services/authService';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          window.location.href = '/';
          return;
        }
        const profile = await AuthService.getProfile();
        setUser(profile);
        setRole(profile?.role || 'user');
      } catch (err) {
        setError(err.message || 'Failed to load user');
        console.log('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // Detect theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;
  }
  if (!role || !user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">No user data found.</div>;
  }

  return (
    <>
      {role === 'admin' ? (
        <AdminDashboard isDarkMode={isDarkMode} user={user} />
      ) : (
        <UserDashboard isDarkMode={isDarkMode} user={user} />
      )}
    </>
  );
};

export default Dashboard; 