import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { listarCitas, actualizarEstadoCita } from '../api/services';
import { Button } from '../components/ui/Button';
import { Calendar, User, Clock, Activity, Check, XCircle } from 'lucide-react';

export const PsicologoDashboard = () => {
    const { user } = useAuth();
    const [citas, setCitas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        setIsLoading(true);
        try {
            // Backend automatically checks role via JWT and filters for the specific Psicologo
            const data = await listarCitas();
            setCitas(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (citaId, nuevoEstado) => {
        try {
            await actualizarEstadoCita(citaId, nuevoEstado);
            fetchCitas(); // Refresh grid
        } catch (err) {
            console.error("Hubo un error actualizando el estado de la cita.", err);
            alert("Error al actualizar la cita.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F8FB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Header */}
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Activity className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2E2E2E]">Panel del Especialista</h1>
                        <p className="text-[#6B7280] text-sm mt-1">Gestión de consultas y seguimiento clínico.</p>
                    </div>
                </div>

                {/* Appointment Grid */}
                <div className="lg:col-span-12 border-t border-gray-100 pt-8">
                    <h2 className="text-xl font-bold text-[#2E2E2E] mb-6">Próximas Sesiones Asignadas</h2>

                    {isLoading ? (
                        <div className="p-12 text-center text-[#4A90E2]">Sincronizando agenda...</div>
                    ) : citas.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-[#4A90E2]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#2E2E2E]">Horarios Libres</h3>
                            <p className="text-[#6B7280] mt-2 max-w-sm">
                                Actualmente no tienes pacientes asignados a tu nombre.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {citas.map((cita) => {
                                const dateObj = new Date(cita.fecha);
                                const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
                                const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={cita.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition">

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-gray-400" />
                                                <span className="font-bold text-[#2E2E2E]">Paciente (ID: {cita.pacienteId})</span>
                                            </div>
                                            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-blue-50 text-[#4A90E2]">
                                                {cita.tipoPago}
                                            </span>
                                        </div>

                                        <div className="mb-6 space-y-2">
                                            <p className="text-sm text-gray-700"><strong>Motivo:</strong> {cita.motivo}</p>
                                            <div className="flex gap-4 text-sm text-[#6B7280]">
                                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formattedDate}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formattedTime} H</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2"><strong>Estado Pago:</strong> {cita.estadoPago}</p>
                                        </div>

                                        <div className="flex gap-2 border-t border-gray-50 pt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                onClick={() => handleStatusUpdate(cita.id, 'ATENDIDA')}
                                            >
                                                <Check className="h-4 w-4 mr-1.5" /> Atendida
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                onClick={() => handleStatusUpdate(cita.id, 'CANCELADA')}
                                            >
                                                <XCircle className="h-4 w-4 mr-1.5" /> Cancelar
                                            </Button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
