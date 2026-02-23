import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { recuperarPassword } from '../api/services';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { HeartPulse, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            await recuperarPassword(data.email);
            setIsSuccess(true);
        } catch (err) {
            console.warn("Backend failed on password recovery...", err);
            // MOCK DEV FALLBACK
            if (err.code === "ERR_NETWORK" || err.response?.status >= 500) {
                setIsSuccess(true);
            } else {
                setServerError('Hubo un error al procesar la solicitud.');
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

                    {!isSuccess ? (
                        <>
                            <h2 className="text-2xl font-bold text-center text-[#2E2E2E] mb-2">Recuperar Contraseña</h2>
                            <p className="text-center text-[#6B7280] mb-8 text-sm leading-relaxed">
                                Ingresa el correo electrónico asociado a tu cuenta y te enviaremos instrucciones para restablecer tu acceso.
                            </p>

                            {serverError && (
                                <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                    Enviar Instrucciones
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <CheckCircle2 className="h-16 w-16 text-[#A8D5BA] mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4">Revisa tu bandeja</h2>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                Hemos enviado un enlace de recuperación seguro. Por favor verifica también tu carpeta de spam.
                            </p>
                            <Link to="/login">
                                <Button variant="outline" className="w-full text-[#4A90E2] border-[#4A90E2] hover:bg-[#F4F8FB]">
                                    Volver al inicio de sesión
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {!isSuccess && (
                    <div className="bg-gray-50 border-t border-gray-100 py-6 text-center text-sm">
                        <Link to="/login" className="font-semibold text-[#6B7280] hover:text-[#2E2E2E] hover:underline transition-colors">
                            ← Volver atrás
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
