import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-[#1a2333] px-4 py-16 text-gray-300 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">

                {/* Brand */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <Link to="/" className="flex items-center gap-2 text-[#4A90E2]">
                        <HeartPulse className="h-8 w-8 stroke-[2.5]" />
                        <span className="text-2xl font-bold tracking-tight text-white">Psicología<span className="font-light text-gray-400"> a tu Alcance</span></span>
                    </Link>
                    <p className="max-w-md text-sm leading-relaxed text-gray-400">
                        Acompañamiento psicológico profesional para cuidar de tu bienestar mental y emocional en un entorno seguro, moderno y estrictamente confidencial.
                    </p>
                    <div className="flex items-center gap-5 text-gray-400 pt-2">
                        <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><Facebook className="h-6 w-6" /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="h-6 w-6" /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram className="h-6 w-6" /></a>
                    </div>
                </div>

                {/* Links: Platform */}
                <div>
                    <h3 className="mb-5 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">La Plataforma</h3>
                    <ul className="space-y-4">
                        <li><Link to="/profesionales" className="text-sm font-medium hover:text-white transition-colors">Nuestros Profesionales</Link></li>
                        <li><a href="/#servicios" className="text-sm font-medium hover:text-white transition-colors">Especialidades</a></li>
                        <li><Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Agendar Cita</Link></li>
                        <li><Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Portal de Pacientes</Link></li>
                    </ul>
                </div>

                {/* Links: Contact */}
                <div>
                    <h3 className="mb-5 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">Contacto</h3>
                    <ul className="space-y-4">
                        <li className="text-sm font-medium text-gray-400">Av. La Paz 1234, Lima</li>
                        <li className="text-sm font-medium text-gray-400">+51 987 654 321</li>
                        <li className="text-sm font-medium hover:text-white transition-colors"><a href="mailto:contacto@psicologia.pe">contacto@psicologia.pe</a></li>
                    </ul>
                </div>

            </div>

            <div className="mx-auto max-w-7xl mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Psicología a tu Alcance. Todos los derechos reservados.</p>
                <div className="mt-4 md:mt-0 space-x-6">
                    <a href="#" className="hover:text-white transition-colors font-medium">Políticas de Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors font-medium">Términos del Servicio</a>
                </div>
            </div>
        </footer>
    );
};
