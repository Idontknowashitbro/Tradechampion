import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while we check authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly is true, check if user is an admin
  if (adminOnly && user.role !== "admin") {
    console.log('User is not admin, redirecting to dashboard', {
      userRole: user.role,
      isAdmin: user.role === 'admin',
      user
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Log successful admin access
  if (adminOnly && user.role === "admin") {
    console.log('Admin access granted', {
      userRole: user.role,
      isAdmin: user.role === 'admin',
      user
    });
  }

  // If authenticated and passes admin check (if applicable), show the protected content
  return <>{children}</>;
}

export default ProtectedRoute;