import React from 'react';
import { cn } from '../../utils/clsx';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
    ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
        // Note: Tailwind config translates custom colors, but since Vite handles @theme, 
        // we use arbitrary values to ensure precision without breaking the v4 utility setup
        const variants = {
            primary: 'bg-[#4A90E2] text-white hover:bg-[#3b76bb] shadow-sm',
            secondary: 'bg-[#F4F8FB] text-[#4A90E2] hover:bg-blue-100 border border-blue-100',
            outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-[#2E2E2E]',
            ghost: 'bg-transparent hover:bg-gray-100 text-[#6B7280]',
            danger: 'bg-red-50 text-red-600 hover:bg-red-100',
        };

        const sizes = {
            default: 'h-12 px-6 py-2 text-base', // Larger hit area for clinical accessibility
            sm: 'h-9 px-4 text-sm',
            lg: 'h-14 px-8 text-lg font-semibold',
            icon: 'h-12 w-12',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
