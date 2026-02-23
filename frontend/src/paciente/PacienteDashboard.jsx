import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { listarCitas, crearCita, listarPsicologos } from '../api/services';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Calendar, Clock, CreditCard, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Appointments = () => {
    const { user } = useAuth();
    const [citas, setCitas] = useState([]);
    const [psicologos, setPsicologos] = useState([]);

    const [isLoadingCitas, setIsLoadingCitas] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Load Initial Data
    useEffect(() => {
        fetchCitas();
        fetchPsicologos();
    }, []);

    const fetchCitas = async () => {
        try {
            const data = await listarCitas();
            setCitas(data || []);
        } catch (err) {
            console.error(err);
            setGlobalError('No se pudieron cargar tus citas actuales.');
        } finally {
            setIsLoadingCitas(false);
        }
    };

    const fetchPsicologos = async () => {
        try {
            const data = await listarPsicologos();
            setPsicologos(data || []);
        } catch (err) {
            console.warn("Fallo carga de psicólogos", err);
        }
    };

    const onSubmit = async (data) => {
        setGlobalError(null);
        setSuccessMsg(null);
        setIsSubmitting(true);

        try {
            // payload for CitaRequest object mapped to native input fields
            const payload = {
                psicologoId: parseInt(data.psicologoId, 10),
                fechaCita: data.fechaCita, // "yyyy-MM-ddTHH:mm" format direct from input type="datetime-local"
                motivo: data.motivo,
                edadPaciente: parseInt(data.edadPaciente, 10),
                tipoPago: data.tipoPago
            };

            await crearCita(payload);

            setSuccessMsg('¡Cita reservada con éxito!');
            reset(); // clear form
            fetchCitas(); // Refresh list

            setTimeout(() => setSuccessMsg(null), 5000); // clear success msg after 5s

        } catch (err) {
            const backendMsg = err.response?.data?.error || 'Error al conectar con el servidor. Intente más tarde.';
            setGlobalError(backendMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Date limiters for HTML5 input
    const now = new Date();
    const minDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F8FB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-gray-100">

                {/* Left Column: Booking Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Reservar nueva cita</h2>

                        {globalError && (
                            <div className="mb-6 rounded-xl bg-red-50 p-4 flex items-start gap-3 text-red-700 border border-red-100 text-sm">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{globalError}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-6 rounded-xl bg-emerald-50 p-4 flex items-start gap-3 text-emerald-700 border border-emerald-100 text-sm font-medium">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                <p>{successMsg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Psicologo Selection */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#2E2E2E]">Especialista</label>
                                <select
                                    className={`flex h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#2E2E2E] shadow-sm transition-colors focus-visible:outline-none focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2] ${errors.psicologoId ? 'border-red-500' : 'border-gray-200'}`}
                                    {...register('psicologoId', { required: 'Debe seleccionar un psicólogo' })}
                                >
                                    <option value="">Seleccione un profesional</option>
                                    {psicologos.map(psi => (
                                        <option key={psi.id} value={psi.id}>{psi.nombre} - {psi.especialidad}</option>
                                    ))}
                                </select>
                                {errors.psicologoId && <span className="text-red-500 text-xs mt-1 block">{errors.psicologoId.message}</span>}
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#2E2E2E]">Fecha y Hora de la Sesión</label>
                                <input
                                    type="datetime-local"
                                    min={minDateTime}
                                    className={`flex h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#2E2E2E] shadow-sm transition-colors focus-visible:outline-none focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2] ${errors.fechaCita ? 'border-red-500' : 'border-gray-200'}`}
                                    {...register('fechaCita', {
                                        required: 'La fecha es obligatoria',
                                        validate: (value) => {
                                            const date = new Date(value);
                                            const hour = date.getHours();
                                            // Allow 9AM to Midnight (0 means midnight start/end depends on timezone parsing, strictly < 9 except 0 is denied)
                                            if (hour > 0 && hour < 9) return "El horario de atención es de 9:00 AM a 12:00 AM";
                                            return true;
                                        }
                                    })}
                                />
                                {errors.fechaCita && <span className="text-red-500 text-xs mt-1 block">{errors.fechaCita.message}</span>}
                            </div>

                            {/* Patient Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Edad"
                                    type="number"
                                    min="1"
                                    max="120"
                                    error={errors.edadPaciente?.message}
                                    {...register('edadPaciente', { required: 'Requerida' })}
                                />
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[#2E2E2E]">Modalidad / Pago</label>
                                    <select
                                        className={`flex h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#2E2E2E] shadow-sm transition-colors focus-visible:outline-none focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2] ${errors.tipoPago ? 'border-red-500' : 'border-gray-200'}`}
                                        {...register('tipoPago', { required: 'Seleccione modalidad' })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="ONLINE">Online (Pagado)</option>
                                        <option value="PRESENCIAL">Presencial (En Clínica)</option>
                                    </select>
                                    {errors.tipoPago && <span className="text-red-500 text-xs mt-1 block">{errors.tipoPago.message}</span>}
                                </div>
                            </div>

                            {/* Reason */}
                            <Input
                                label="Motivo de Consulta (Breve)"
                                type="text"
                                error={errors.motivo?.message}
                                {...register('motivo', { required: 'Describa el motivo brevemente' })}
                            />

                            <Button type="submit" size="lg" className="w-full mt-4" isLoading={isSubmitting}>
                                Confirmar Reserva
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Appointment List */}
                <div className="lg:col-span-7">
                    <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Mis Citas Programadas</h2>

                    {isLoadingCitas ? (
                        <div className="flex justify-center p-12 text-[#4A90E2]">Cargando historia médica...</div>
                    ) : citas.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-[#4A90E2]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#2E2E2E]">No tienes citas pendientes</h3>
                            <p className="text-[#6B7280] mt-2 max-w-sm">
                                Utiliza el formulario para agendar tu primera sesión con nuestros especialistas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {citas.map((cita) => {
                                const formattedDate = new Date(cita.fecha).toLocaleDateString('es-ES', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                });
                                const formattedTime = new Date(cita.fecha).toLocaleTimeString('es-ES', {
                                    hour: '2-digit', minute: '2-digit'
                                });

                                return (
                                    <div key={cita.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between transition hover:border-blue-100">

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-[#4A90E2]" />
                                                <span className="font-semibold text-[#2E2E2E] capitalize">{formattedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formattedTime} Hrs</span>
                                                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Dr(a). (ID: {cita.psicologoId})</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                                                    {cita.tipoPago}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full font-medium border ${cita.estadoPago === 'PAGADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                    PAGO {cita.estadoPago}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto mt-4 sm:mt-0 flex gap-2">
                                            <Button variant="outline" size="sm" className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50" onClick={async () => {
                                                try {
                                                    const { cancelarCita } = await import('../api/services');
                                                    await cancelarCita(cita.id);
                                                    fetchCitas();
                                                } catch (err) {
                                                    setGlobalError("No se pudo cancelar la cita.");
                                                }
                                            }}>Cancelar Cita</Button>
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
