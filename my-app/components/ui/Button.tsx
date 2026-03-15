import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
    primary:
        'relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] focus-visible:ring-blue-600',
    secondary:
        'bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 shadow-sm focus-visible:ring-blue-600',
    danger:
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] focus-visible:ring-red-500',
    ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
    success:
        'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] focus-visible:ring-emerald-500',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
    md: 'px-6 py-3 text-base rounded-xl gap-2',
    lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={[
                'inline-flex items-center justify-center font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                variantClasses[variant],
                sizeClasses[size],
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {/* Shine effect for primary */}
            {variant === 'primary' && (
                <span
                    className="absolute top-0 left-[-75%] w-1/2 h-full bg-white/20 skew-x-[-20deg] pointer-events-none transition-all duration-500 hover:left-[125%]"
                    aria-hidden="true"
                />
            )}
            {isLoading ? (
                <>
                    <span
                        className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    />
                    <span>Loading…</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
