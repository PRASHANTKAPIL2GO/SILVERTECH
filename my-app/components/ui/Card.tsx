import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    accent?: boolean;
    as?: 'div' | 'section' | 'article';
    hover?: boolean;
}

export default function Card({
    children,
    className = '',
    accent = false,
    hover = false,
    as: Tag = 'div',
}: CardProps) {
    return (
        <Tag
            className={[
                'bg-white rounded-2xl p-6 border border-slate-100',
                'shadow-[0_1px_3px_rgb(0_0_0/0.04),_0_8px_32px_rgb(0_0_0/0.07)]',
                hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgb(0_0_0/0.04),_0_20px_48px_rgb(0_0_0/0.12)]' : '',
                accent ? 'border-l-4 border-l-blue-600' : '',
                className,
            ].join(' ')}
        >
            {children}
        </Tag>
    );
}
