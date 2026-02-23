import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RoleGuard = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-[#4A90E2]">Cargando plataforma...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        // Redirige al dashboard por defecto que le corresponda, o vuelve a home
        if (user.rol === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (user.rol === 'PSICOLOGO') return <Navigate to="/psicologo/dashboard" replace />;
        return <Navigate to="/citas" replace />; // Default paciente
    }

    return children;
};
