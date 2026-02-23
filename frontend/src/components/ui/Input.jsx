import React from 'react';
import { cn } from '../../utils/clsx';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(
    ({ className, type = 'text', error, label, helperText, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-sm font-medium text-[#2E2E2E]"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            'flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-[#2E2E2E] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500 pr-10',
                            className
                        )}
                        ref={ref}
                        aria-invalid={error ? 'true' : 'false'}
                        {...props}
                    />
                    {error && (
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={cn(
                            'mt-1.5 text-sm',
                            error ? 'text-red-500 font-medium' : 'text-gray-500'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
