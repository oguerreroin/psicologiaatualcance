import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Brain, Heart, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export const Home = () => {
    const { user } = useAuth();
    // Determine CTA routing based on auth state
    const ctaRoute = user ? '/citas' : '/login';

    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FB] to-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#4A90E2] shadow-sm mb-8 border border-gray-100">
                            <span className="flex h-2 w-2 rounded-full bg-[#A8D5BA] animate-pulse"></span>
                            Atención psicológica online y presencial
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#2E2E2E] sm:text-5xl lg:text-6xl">
                            Tu salud mental merece un <span className="text-[#4A90E2]">espacio seguro</span>
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-[#6B7280]">
                            Ofrecemos un entorno confidencial, profesional y empático. Descubre cómo nuestros especialistas pueden ayudarte a encontrar el equilibrio y bienestar que buscas.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to={ctaRoute} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full shadow-md  hover:shadow-lg">
                                    Reservar tu cita <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/profesionales" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full">
                                    Conoce al equipo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-[#2E2E2E]">Cuidado integral para ti</h2>
                        <p className="mt-4 text-base text-[#6B7280]">Nuestros profesionales emplean enfoques terapéuticos modernos, diseñados a tu medida.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="group rounded-xl bg-[#F4F8FB] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-blue-100 hover:bg-white text-center md:text-left">
                            <div className="mx-auto md:mx-0 h-14 w-14 rounded-2xl bg-[#4A90E2]/10 flex items-center justify-center mb-6">
                                <Brain className="h-7 w-7 text-[#4A90E2]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">Terapia Individual</h3>
                            <p className="text-[#6B7280] leading-relaxed">Trabajamos juntos en un ambiente seguro para superar la ansiedad, estrés, y potenciar tu desarrollo personal.</p>
                        </div>
                        {/* Service 2 */}
                        <div className="group rounded-xl bg-[#F4F8FB] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-blue-100 hover:bg-white text-center md:text-left">
                            <div className="mx-auto md:mx-0 h-14 w-14 rounded-2xl bg-[#A8D5BA]/20 flex items-center justify-center mb-6">
                                <Heart className="h-7 w-7 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">Terapia de Pareja</h3>
                            <p className="text-[#6B7280] leading-relaxed">Mejora la comunicación y fortalece vínculos afectivos resolviendo conflictos de forma guiada y constructiva.</p>
                        </div>
                        {/* Service 3 */}
                        <div className="group rounded-xl bg-[#F4F8FB] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-blue-100 hover:bg-white text-center md:text-left">
                            <div className="mx-auto md:mx-0 h-14 w-14 rounded-2xl bg-[#4A90E2]/10 flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-[#4A90E2]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">Terapia Familiar</h3>
                            <p className="text-[#6B7280] leading-relaxed">Intervención diseñada para sanar dinámicas familiares y fomentar un entorno de convivencia equilibrado.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="bg-[#F4F8FB] py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                {/* Placeholder modern clean clinic image */}
                                <img src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=1000" alt="Profesional en consulta" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="h-6 w-6 text-[#A8D5BA]" />
                                <span className="font-semibold text-[#4A90E2] uppercase tracking-wide text-sm">Nuestra Promesa</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-[#2E2E2E] sm:text-4xl mb-6">
                                Cuidado Ético y Confidencial
                            </h2>
                            <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">
                                Creemos en una psicología basada en la evidencia científica, aplicada con sensibilidad y un respeto absoluto por la persona. Cada sesión es un puente hacia tu tranquilidad, respaldado por profesionales colegiados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
