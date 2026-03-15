'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex animate-fadein">
            {/* ── Left panel — branding ─────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 mesh-bg text-white flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
                </div>
                <div className="relative text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-900/50 mb-8 animate-float">
                        <span className="text-5xl">💡</span>
                    </div>
                    <h2 className="font-display text-4xl font-extrabold mb-4">Welcome back!</h2>
                    <p className="text-blue-200 text-lg leading-relaxed">
                        Continue your digital literacy journey with SilverTech — designed just for you.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4 text-left">
                        {[
                            ['📧', 'Email Skills'],
                            ['🛡️', 'Scam Protection'],
                            ['📹', 'Video Calls'],
                            ['🤝', 'Mentorship'],
                        ].map(([icon, label]) => (
                            <div key={label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                                <span aria-hidden="true">{icon}</span>
                                <span className="text-sm font-semibold text-white/90">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right panel — form ────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-16">
                <div className="w-full max-w-md animate-scale-in">
                    <div className="text-center mb-10">
                        <div className="lg:hidden text-5xl mb-4" aria-hidden="true">💡</div>
                        <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-2">Log In</h1>
                        <p className="text-slate-500">Enter your details to continue your journey.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgb(0_0_0/0.04),_0_16px_48px_rgb(0_0_0/0.1)] border border-slate-100 p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                            {error && (
                                <div
                                    role="alert"
                                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium flex items-center gap-2"
                                >
                                    <span aria-hidden="true">⚠</span> {error}
                                </div>
                            )}

                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourname@email.com"
                                required
                                autoComplete="email"
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />

                            <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="mt-1">
                                Log In →
                            </Button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            New to SilverTech?{' '}
                            <Link
                                href="/auth/register"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Create a free account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
