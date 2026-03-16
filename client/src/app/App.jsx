import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../features/dashboard/Dashboard';
import PolicyRoutes from '../routes/PolicyRoutes';
import ClaimsRoutes from '../routes/ClaimsRoutes';
import ReinsuranceRoutes from '../routes/ReinsuranceRoutes';
import AdminRoutes from '../routes/AdminRoutes';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../layout/ProtectedRoute';
import Navigation from '../layout/Navigation';
import RegisterPage from '../features/auth/RegisterPage';
import LandingPage from "../features/public/LandingPage";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navigation />}
     <Routes>

  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Dashboard */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        {user?.role === "UNDERWRITER" ? (
          <Navigate to="/policy" />
        ) : user?.role === "CLAIMS_ADJUSTER" ? (
          <Navigate to="/claims" />
        ) : (
          <Dashboard />
        )}
      </ProtectedRoute>
    }
  />

  {/* Feature routes */}
  <Route path="/policy/*" element={<ProtectedRoute><PolicyRoutes /></ProtectedRoute>} />
  <Route path="/claims/*" element={<ProtectedRoute><ClaimsRoutes /></ProtectedRoute>} />
  <Route path="/reinsurance/*" element={<ProtectedRoute><ReinsuranceRoutes /></ProtectedRoute>} />
  <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />

</Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
