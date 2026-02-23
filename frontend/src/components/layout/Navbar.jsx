import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, HeartPulse } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.rol === 'ADMIN') return '/admin/dashboard';
        if (user.rol === 'PSICOLOGO') return '/psicologo/dashboard';
        return '/citas';
    }

    // Links públicos para el landing page
    const publicLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/#servicios' },
        { name: 'Equipo', path: '/profesionales' },
        { name: 'Contacto', path: '/#contacto' },
    ];

    // En una App real, quizá esconderíamos links públicos si ya está logueado en su dashboard
    const navLinks = user ? [] : publicLinks;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-[#4A90E2] hover:text-[#3b76bb] transition">
                        <HeartPulse className="h-8 w-8 stroke-[2.5]" />
                        <span className="text-xl font-bold tracking-tight text-[#2E2E2E]">Psicología<span className="font-light text-[#6B7280]"> a tu Alcance</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 justify-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="px-2 py-2 text-sm font-medium text-[#6B7280] hover:text-[#4A90E2] transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-4 shrink-0">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-[#2E2E2E]">Hola, {user.nombre} <span className="text-xs text-[#4A90E2]">({user.rol})</span></span>
                                <Link to={getDashboardPath()}>
                                    <Button variant="primary" size="sm">Mi Panel</Button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-[#6B7280] hover:text-red-500 font-medium transition-colors"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#4A90E2] transition-colors">
                                    Ingresar
                                </Link>
                                <Link to="/login">
                                    <Button variant="primary">Reservar tu cita</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-[#6B7280] hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-md px-3 py-3 text-base font-medium text-[#2E2E2E] hover:bg-[#F4F8FB] hover:text-[#4A90E2]"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 pb-6 pt-4 px-4">
                        {user ? (
                            <div className="space-y-4">
                                <div className="text-base font-medium text-[#2E2E2E]">{user.nombre} ({user.rol})</div>
                                <div className="flex flex-col gap-3">
                                    <Link to={getDashboardPath()} onClick={() => setIsOpen(false)}>
                                        <Button variant="primary" className="w-full">Mi Panel</Button>
                                    </Link>
                                    <Button variant="outline" className="w-full" onClick={handleLogout}>Cerrar Sesión</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full">Ingresar</Button>
                                </Link>
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" className="w-full">Reservar tu cita</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
