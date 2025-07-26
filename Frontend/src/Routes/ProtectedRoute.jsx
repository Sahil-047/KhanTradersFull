import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

export function ProtectedRoute({ children }) {
  const token = AuthService.getAuthToken();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
} 