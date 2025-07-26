import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';
import { toast } from 'sonner';

export function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const token = AuthService.getAuthToken();
        if (!token) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        const profile = await AuthService.getProfile();
        console.log('AdminProtectedRoute profile:', profile);
        if (profile.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error('You are not an admin!');
          setShowBlocked(true);
        }
      } catch {
        setIsAdmin(false);
        toast.error('You are not an admin!');
        setShowBlocked(true);
      } finally {
        setLoading(false);
      }
    }
    checkRole();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-blue-400">Checking admin access...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (showBlocked) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Access denied. You are not an admin.</div>;
  }

  return children;
} 