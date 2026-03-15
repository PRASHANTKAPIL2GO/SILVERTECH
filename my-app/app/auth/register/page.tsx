'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        firstName: '',
        email: '',
        password: '',
        comfortLevel: 'beginner' as 'beginner' | 'medium' | 'advanced',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const update = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await register(form);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex animate-fadein">
            {/* ── Left panel — branding ─────────────────────────── */}
            <div className="hidden lg:flex lg:w-6/12 mesh-bg text-white flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
                </div>
                <div className="relative text-center max-w-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl shadow-orange-900/40 mb-6 animate-float">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h2 className="font-display text-3xl font-extrabold mb-4">Join SilverTech</h2>
                    <p className="text-blue-200 text-base leading-relaxed">
                        Start your digital literacy journey. Free forever — no experience needed.
                    </p>
                    <div className="mt-8 space-y-3 text-left">
                        {[
                            '✅ Completely free to join',
                            '✅ Large, easy-to-read text',
                            '✅ Learn at your own pace',
                            '✅ Private & secure',
                        ].map((item) => (
                            <p key={item} className="text-sm text-blue-100 font-medium">{item}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right panel — form ────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-16 overflow-y-auto">
                <div className="w-full max-w-md animate-scale-in">
                    <div className="text-center mb-8">
                        <div className="lg:hidden text-5xl mb-4" aria-hidden="true">🚀</div>
                        <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500">It only takes a minute to get started.</p>
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
                                label="First Name"
                                type="text"
                                value={form.firstName}
                                onChange={(e) => update('firstName', e.target.value)}
                                placeholder="e.g. Margaret"
                                required
                                autoComplete="given-name"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="yourname@email.com"
                                required
                                autoComplete="email"
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                                placeholder="At least 6 characters"
                                required
                                hint="Choose something you will remember — at least 6 characters."
                                autoComplete="new-password"
                            />

                            {/* Comfort Level */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="comfortLevel" className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                                    Your tech comfort level
                                </label>
                                <select
                                    id="comfortLevel"
                                    value={form.comfortLevel}
                                    onChange={(e) =>
                                        update('comfortLevel', e.target.value as 'beginner' | 'medium' | 'advanced')
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 shadow-sm hover:border-slate-300 transition-all duration-200"
                                >
                                    <option value="beginner">🌱 Beginner — just getting started</option>
                                    <option value="medium">🌿 Intermediate — know a few things</option>
                                    <option value="advanced">🌳 Advanced — fairly confident</option>
                                </select>
                            </div>

                            <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="mt-1">
                                Create My Account →
                            </Button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
