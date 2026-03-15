import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
}

export default function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label
                htmlFor={inputId}
                className="text-sm font-semibold text-slate-700 tracking-wide uppercase"
            >
                {label}
                {props.required && (
                    <span className="text-red-500 ml-1" aria-label="required">*</span>
                )}
            </label>

            {hint && (
                <p id={`${inputId}-hint`} className="text-sm text-slate-500 -mt-0.5">
                    {hint}
                </p>
            )}

            <input
                id={inputId}
                aria-describedby={
                    [hint ? `${inputId}-hint` : '', error ? `${inputId}-error` : '']
                        .filter(Boolean)
                        .join(' ') || undefined
                }
                aria-invalid={!!error}
                className={[
                    'w-full rounded-xl border px-4 py-3 text-base text-slate-900',
                    'placeholder:text-slate-400 bg-white',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-3 focus:ring-offset-0',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100',
                    'shadow-sm hover:border-slate-300',
                    className,
                ].join(' ')}
                {...props}
            />

            {error && (
                <p id={`${inputId}-error`} role="alert" className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <span aria-hidden="true">⚠</span> {error}
                </p>
            )}
        </div>
    );
}
