'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wraps any page that requires authentication.
 * Shows a loading state while the auth context is initialising,
 * then redirects to /auth/login if no authenticated user is found.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                role="status"
                aria-label="Checking your login status"
            >
                <div className="text-center">
                    <div
                        className="inline-block w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"
                        aria-hidden="true"
                    />
                    <p className="text-xl text-gray-600 font-medium">Loading your account…</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
