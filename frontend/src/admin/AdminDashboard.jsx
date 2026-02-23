import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { listarUsuariosAdmin, crearPsicologoAdmin, seedDatabase } from '../api/services';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, UserPlus, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [globalError, setGlobalError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await listarUsuariosAdmin();
            setUsuarios(data || []);
        } catch (err) {
            console.error(err);
            setGlobalError('No se pudo cargar la lista de usuarios.');
        } finally {
            setIsLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 5000);
    }

    const handleSeed = async () => {
        setIsSeeding(true);
        setGlobalError(null);
        try {
            await seedDatabase();
            showSuccess("Base de datos alimentada con perfiles de prueba correctamente.");
            fetchUsers();
        } catch (err) {
            setGlobalError("Error al intentar levantar la data de prueba en MySQL.");
        } finally {
            setIsSeeding(false);
        }
    }

    const onSubmit = async (data) => {
        setGlobalError(null);
        setSuccessMsg(null);
        setIsSubmitting(true);

        try {
            await crearPsicologoAdmin(data);
            showSuccess(`Psicólogo ${data.nombre} creado con éxito.`);
            reset();
            fetchUsers();
        } catch (err) {
            setGlobalError(err.response?.data?.error || 'Error al conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F8FB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Header / Stats */}
                <div className="lg:col-span-12 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2E2E2E]">Panel de Administración</h1>
                        <p className="text-[#6B7280] text-sm mt-1">Gestión global de usuarios y configuración del sistema.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={handleSeed} isLoading={isSeeding} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                            <Database className="h-4 w-4 mr-2" /> Cargar Data Mock (Seed)
                        </Button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="lg:col-span-12">
                    {globalError && (
                        <div className="rounded-xl bg-red-50 p-4 flex items-start gap-3 text-red-700 border border-red-100 text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{globalError}</p>
                        </div>
                    )}
                    {successMsg && (
                        <div className="rounded-xl bg-emerald-50 p-4 flex items-start gap-3 text-emerald-700 border border-emerald-100 text-sm font-medium">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <p>{successMsg}</p>
                        </div>
                    )}
                </div>

                {/* Left Column: Create Psicologo */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
                        <div className="flex items-center gap-2 mb-6 text-[#2E2E2E]">
                            <UserPlus className="h-5 w-5 text-[#4A90E2]" />
                            <h2 className="text-xl font-bold">Crear Psicólogo</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                label="Nombre Completo"
                                type="text"
                                error={errors.nombre?.message}
                                {...register('nombre', { required: 'Requerido' })}
                            />
                            <Input
                                label="Correo Electrónico"
                                type="email"
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'Requerido',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Inválido' }
                                })}
                            />
                            <Input
                                label="Especialidad"
                                type="text"
                                error={errors.especialidad?.message}
                                {...register('especialidad', { required: 'Requerido' })}
                            />
                            <Input
                                label="Contraseña Temporal"
                                type="password"
                                error={errors.password?.message}
                                {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Min 6 chars' } })}
                            />

                            <Button type="submit" size="lg" className="w-full mt-4" isLoading={isSubmitting}>
                                Registrar Perfil
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: User List */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#4A90E2]" />
                                <h2 className="text-xl font-bold text-[#2E2E2E]">Directorio de Psicólogos</h2>
                            </div>
                        </div>

                        <div className="p-0">
                            {isLoading ? (
                                <div className="p-12 text-center text-[#4A90E2]">Cargando usuarios...</div>
                            ) : usuarios.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">No hay psicólogos registrados en el sistema.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Nombre</th>
                                                <th className="px-6 py-4 font-medium">Especialidad</th>
                                                <th className="px-6 py-4 font-medium">Email</th>
                                                <th className="px-6 py-4 font-medium">Rol</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map((usr) => (
                                                <tr key={usr.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 font-semibold text-[#2E2E2E]">{usr.nombre}</td>
                                                    <td className="px-6 py-4 text-gray-600">{usr.especialidad || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-gray-500">{usr.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-[#4A90E2]">
                                                            {usr.rol}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
