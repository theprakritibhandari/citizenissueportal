import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

export const ProtectedRoute = ({ children, allowedRoles = [], redirectPath }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying security credentials..." fullHeight />;
  }

  const isAdminRoute =
    (allowedRoles.length === 1 && allowedRoles[0] === 'admin') ||
    location.pathname.startsWith('/admin');

  const defaultRedirect = isAdminRoute ? '/admin/login' : '/login';
  const targetRedirect = redirectPath || defaultRedirect;

  // Unauthenticated visitors
  if (!isAuthenticated) {
    return <Navigate to={targetRedirect} state={{ from: location }} replace />;
  }

  // Role validation
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (isAdminRoute) {
      // Non-admin attempting to access any admin-protected page -> redirect to admin login
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
