import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as loginService } from '../api/services';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { HeartPulse } from 'lucide-react';

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            const res = await loginService(data);
            if (res.token) {
                login(res.user, res.token);
                navigate('/citas');
            }
        } catch (err) {
            console.warn("Backend failed, mocking login...", err);
            if (err.code === "ERR_NETWORK" || err.response?.status >= 500) {
                // MOCK DEV FALLBACK
                login({ nombre: 'Usuario Prueba', rol: 'PACIENTE' }, 'mock-jwt-token-777');
                navigate('/citas');
            } else {
                setServerError('Credenciales inválidas o error de conexión.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F4F8FB] items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-8 sm:p-12">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center gap-2 text-[#4A90E2]">
                            <HeartPulse className="h-10 w-10 stroke-[2.5]" />
                        </Link>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-[#2E2E2E] mb-2">Portal de Pacientes</h2>
                    <p className="text-center text-[#6B7280] mb-8 text-sm leading-relaxed">
                        Ingresa para gestionar tus citas médicas e historial confidencial.
                    </p>

                    {serverError && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            placeholder="tu@correo.com"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'El correo es requerido',
                                pattern: { value: /^\S+@\S+$/i, message: 'Formato inválido' }
                            })}
                        />

                        <div className="space-y-1">
                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password', { required: 'La contraseña es requerida' })}
                            />
                            <div className="flex justify-end pt-2">
                                <Link to="/recuperar" className="text-sm font-medium text-[#4A90E2] hover:text-[#3b76bb] transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                            Ingresar
                        </Button>
                    </form>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 py-6 text-center text-sm">
                    <span className="text-[#6B7280]">¿No tienes cuenta?</span>{' '}
                    <Link to="/registro" className="font-semibold text-[#4A90E2] hover:underline">Regístrate ahora</Link>
                </div>
            </div>
        </div>
    );
};
