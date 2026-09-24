import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CitizenLayout from './components/layout/CitizenLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Citizen Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import MyReports from './pages/MyReports';
import IssueDetails from './pages/IssueDetails';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIssues from './pages/admin/AdminIssues';
import AdminIssueDetails from './pages/admin/AdminIssueDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Error Pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

export const App = () => {
  return (
    <Routes>
      {/* 1. Public & Citizen Routes (Wrapped in CitizenLayout) */}
      <Route element={<CitizenLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/issues/:id" element={<IssueDetails />} />

        {/* Protected Citizen Routes */}
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin']} redirectPath="/login">
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin']} redirectPath="/login">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Informational Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 2. Standalone Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 3. Protected Admin Routes (Wrapped in AdminLayout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="issues" element={<AdminIssues />} />
        <Route path="issues/:id" element={<AdminIssueDetails />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default App;
