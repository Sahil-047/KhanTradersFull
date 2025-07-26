import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "sonner"
import './index.css'
import LandingPage from './pages/LandingPage'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import Dashboard from './components/Dashboard/Dashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { ProtectedRoute } from './Routes/ProtectedRoute'
import { AdminProtectedRoute } from './Routes/AdminProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ForgotPassword from './components/Auth/ForgotPassword';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster 
          richColors 
          position="top-right"
          duration={1250}
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                color: '#e2e8f0',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#e2e8f0',
              },
            },
            error: {
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#e2e8f0',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#e2e8f0',
              },
            },
            warning: {
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#e2e8f0',
              },
              iconTheme: {
                primary: '#f59e0b',
                secondary: '#e2e8f0',
              },
            },
            info: {
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: '#e2e8f0',
              },
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#e2e8f0',
              },
            },
          }}
          closeButton={{
            style: {
              background: 'rgba(51, 65, 85, 0.8)',
              color: '#e2e8f0',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '6px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
