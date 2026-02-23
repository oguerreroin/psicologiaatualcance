import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    HeartHandshake,
    Video,
    Menu,
    X,
    ArrowRight,
    CheckCircle2,
    Clock,
    ShieldCheck
} from 'lucide-react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 font-sans text-sky-900 selection:bg-sky-200 selection:text-sky-900">

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo */}
                        <div className="flex items-center gap-2.5 group cursor-pointer">
                            <div className="bg-sky-50 p-2 rounded-lg group-hover:bg-sky-100 transition-colors">
                                <Brain className="h-7 w-7 text-sky-500" />
                            </div>
                            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled || isMenuOpen ? 'text-sky-900' : 'text-sky-900 lg:text-sky-950'
                                }`}>
                                Psicología a tu Alcance
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Inicio', 'Servicios', 'Nosotros'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className={`text-sm font-medium hover:text-sky-500 transition-colors ${scrolled ? 'text-sky-700' : 'text-sky-800'
                                        }`}
                                >
                                    {item}
                                </a>
                            ))}
                            <a
                                href="http://localhost:8080/psicologia-a-tu-alcance/login.xhtml"
                                className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sky-600 active:bg-sky-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Iniciar Sesión
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-sky-700 hover:bg-sky-100 rounded-full transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-100"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-3">
                            {['Inicio', 'Servicios', 'Nosotros'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-sky-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="pt-4 px-4">
                                <a
                                    href="http://localhost:8080/psicologia-a-tu-alcance/login.xhtml"
                                    className="block w-full text-center bg-sky-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-sky-600 transition-colors shadow-sm"
                                >
                                    Iniciar Sesión
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* --- HERO SECTION (Placeholder if needed, or just start with Services/Why Choose Us) --- */}
            {/* You might want a Hero section here, but based on the code, we jump to Services/Why Choose Us. 
                Let's add the Services section first as it comes before "Nosotros" in the nav. */}

            {/* --- SERVICES SECTION --- */}
            <section id="servicios" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
                            Nuestros <span className="text-sky-500">Servicios</span>
                        </h2>
                        <p className="text-lg text-sky-700">
                            Ofrecemos un enfoque integral para tu bienestar mental, adaptado a tus necesidades específicas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={<Brain className="h-8 w-8 text-sky-600" />}
                            title="Terapia Individual"
                            description="Sesiones personalizadas para abordar ansiedad, depresión, estrés y crecimiento personal."
                            color="bg-sky-50"
                        />
                        <ServiceCard
                            icon={<HeartHandshake className="h-8 w-8 text-rose-600" />}
                            title="Terapia de Pareja"
                            description="Espacio seguro para mejorar la comunicación y fortalecer el vínculo afectivo."
                            color="bg-rose-50"
                        />
                        <ServiceCard
                            icon={<Video className="h-8 w-8 text-indigo-600" />}
                            title="Consulta Online"
                            description="Accede a terapia profesional desde la comodidad de tu hogar, con total privacidad."
                            color="bg-indigo-50"
                        />
                    </div>
                </div>
            </section>

            {/* --- WHY CHOOSE US SECTION --- */}
            <section id="nosotros" className="py-24 bg-sky-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Image Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative mb-12 lg:mb-0"
                        >
                            <div className="absolute -inset-4 bg-white rounded-2xl shadow-xl transform -rotate-2"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80"
                                alt="Psicóloga profesional sonriendo"
                                className="relative rounded-xl shadow-lg w-full object-cover h-64 lg:h-[600px]"
                            />
                            {/* Floating Badge - Positioned relatively on mobile to avoid overlap, absolute on desktop */}
                            <div className="relative mt-4 lg:absolute lg:bottom-8 lg:right-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-xs lg:animate-bounce-slow mx-auto lg:mx-0">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-sky-900">100% Confidencial</p>
                                    <p className="text-xs text-sky-600">Tu privacidad es sagrada</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Side */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6">
                                ¿Por qué elegir <span className="text-sky-500">Psicología a tu Alcance</span>?
                            </h2>
                            <p className="text-lg text-sky-700 mb-8 leading-relaxed">
                                Entendemos que dar el primer paso no es fácil. Por eso, hemos creado un entorno donde la empatía y la excelencia profesional se unen para acompañarte.
                            </p>

                            <div className="space-y-6">
                                <FeatureRow
                                    icon={<CheckCircle2 className="h-6 w-6 text-sky-500" />}
                                    title="Profesionales Certificados"
                                    description="Todos nuestros especialistas cuentan con colegiatura y amplia experiencia clínica."
                                />
                                <FeatureRow
                                    icon={<Clock className="h-6 w-6 text-sky-500" />}
                                    title="Horarios Flexibles"
                                    description="Agenda tu cita en el momento que mejor se adapte a tu rutina, incluyendo fines de semana."
                                />
                                <FeatureRow
                                    icon={<ShieldCheck className="h-6 w-6 text-sky-500" />}
                                    title="Plataforma Segura"
                                    description="Tus datos y sesiones están protegidos con los más altos estándares de seguridad."
                                />
                            </div>

                            <div className="mt-10">
                                <a
                                    href="http://localhost:8080/psicologia-a-tu-alcance/login.xhtml"
                                    className="text-sky-600 font-bold hover:text-sky-700 inline-flex items-center gap-2 group"
                                >
                                    Conoce a nuestro equipo
                                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-300 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <Brain className="h-8 w-8 text-sky-400" />
                                <span className="text-2xl font-bold text-white">Psicología a tu Alcance</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-sm">
                                Transformando vidas a través de la salud mental. Tu bienestar es el motor que nos impulsa a seguir creciendo.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6">Enlaces</h3>
                            <ul className="space-y-4">
                                <li><a href="#inicio" className="hover:text-sky-400 transition-colors">Inicio</a></li>
                                <li><a href="#servicios" className="hover:text-sky-400 transition-colors">Servicios</a></li>
                                <li><a href="#nosotros" className="hover:text-sky-400 transition-colors">Nosotros</a></li>
                                <li><a href="http://localhost:8080/psicologia-a-tu-alcance/login.xhtml" className="hover:text-sky-400 transition-colors">Área Pacientes</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6">Contacto</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-sky-500">Email:</span>
                                    contacto@psicologia.com
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-sky-500">Tel:</span>
                                    +51 999 999 999
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-sky-500">Ubicación:</span>
                                    Lima, Perú
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2023 Psicología a tu Alcance. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Términos</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Subcomponents ---

const ServiceCard = ({ icon, title, description, color }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 border border-slate-100 group"
    >
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-sky-900 mb-3 group-hover:text-sky-600 transition-colors">{title}</h3>
        <p className="text-sky-700 leading-relaxed">{description}</p>
    </motion.div>
);

const FeatureRow = ({ icon, title, description }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
            <div className="bg-sky-50 p-2 rounded-lg">
                {icon}
            </div>
        </div>
        <div>
            <h4 className="text-lg font-bold text-sky-900 mb-1">{title}</h4>
            <p className="text-sky-700">{description}</p>
        </div>
    </div>
);

export default LandingPage;
