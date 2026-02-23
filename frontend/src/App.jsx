import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Role RBAC Views
import { RoleGuard } from './auth/RoleGuard';
import { AdminDashboard } from './admin/AdminDashboard';
import { PsicologoDashboard } from './psicologo/PsicologoDashboard';
import { Appointments as PacienteDashboard } from './paciente/PacienteDashboard';

// Route redirection logic helper for already authenticated users hitting public auth routes
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex flex-col items-center justify-center text-[#4A90E2]">Cargando plataforma...</div>;

  if (user) {
    if (user.rol === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.rol === 'PSICOLOGO') return <Navigate to="/psicologo/dashboard" replace />;
    return <Navigate to="/citas" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Public Entry Routes */}
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="recuperar" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* PACIENTE Protected Routes */}
          <Route path="citas" element={
            <RoleGuard allowedRoles={['PACIENTE']}>
              <PacienteDashboard />
            </RoleGuard>
          } />
          <Route path="agendar" element={
            <RoleGuard allowedRoles={['PACIENTE']}>
              <PacienteDashboard />
            </RoleGuard>
          } />

          {/* PSICOLOGO Protected Routes */}
          <Route path="psicologo/dashboard" element={
            <RoleGuard allowedRoles={['PSICOLOGO']}>
              <PsicologoDashboard />
            </RoleGuard>
          } />

          {/* ADMIN Protected Routes */}
          <Route path="admin/dashboard" element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
