'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LessonCard from '@/components/modules/LessonCard';
import { progressApi } from '@/lib/api';
import { UserProgress } from '@/types';

const modules = [
    {
        id: 'email-module',
        title: 'Using Email Safely',
        description: 'Send, receive, and manage emails securely.',
        icon: '✉️',
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'scam-module',
        title: 'Recognising Online Scams',
        description: 'Protect yourself from common internet fraud.',
        icon: '🛡️',
        color: 'from-violet-500 to-violet-600',
    },
    {
        id: 'video-call-module',
        title: 'Making Video Calls',
        description: 'Stay connected with family through video.',
        icon: '📹',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'social-media-module',
        title: 'Social Media Basics',
        description: 'Use Facebook and other platforms safely.',
        icon: '📱',
        color: 'from-pink-500 to-rose-500',
    },
    {
        id: 'online-shopping-module',
        title: 'Safe Online Shopping',
        description: 'Buy online confidently and avoid scams.',
        icon: '🛒',
        color: 'from-orange-500 to-amber-500',
    },
    {
        id: 'password-security-module',
        title: 'Passwords & Account Security',
        description: 'Create strong passwords and stay secure.',
        icon: '🔐',
        color: 'from-slate-600 to-slate-800',
    },
    {
        id: 'smartphone-basics-module',
        title: 'Smartphone Basics',
        description: 'Get confident using your smartphone every day.',
        icon: '📲',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        id: 'web-search-module',
        title: 'Searching the Web Safely',
        description: 'Find reliable information and browse safely.',
        icon: '🔍',
        color: 'from-indigo-500 to-purple-600',
    },
    {
        id: 'digital-banking-module',
        title: 'Digital Banking Safely',
        description: 'Manage your money online with confidence.',
        icon: '🏦',
        color: 'from-green-600 to-emerald-600',
    },
    {
        id: 'health-online-module',
        title: 'Finding Health Info Online',
        description: 'Access NHS services and reliable health advice.',
        icon: '🏥',
        color: 'from-red-500 to-rose-600',
    },
    {
        id: 'streaming-module',
        title: 'Streaming & Entertainment',
        description: 'Watch TV, films, and YouTube at any time.',
        icon: '🎬',
        color: 'from-fuchsia-500 to-pink-600',
    },
    {
        id: 'messaging-apps-module',
        title: 'Messaging Apps',
        description: 'Send messages and photos with WhatsApp.',
        icon: '💬',
        color: 'from-teal-500 to-green-500',
    },
    {
        id: 'gov-services-module',
        title: 'Government Services Online',
        description: 'Access GOV.UK, benefits, and council services.',
        icon: '🏛️',
        color: 'from-yellow-600 to-orange-500',
    },
];

const levelConfig = {
    beginner: { emoji: '🌱', label: 'Beginner', color: 'bg-emerald-100 text-emerald-700' },
    medium: { emoji: '🌿', label: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
    advanced: { emoji: '🌳', label: 'Advanced', color: 'bg-violet-100 text-violet-700' },
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // wait until auth is ready
        const fetchAllProgress = async () => {
            setIsLoading(true);
            const results = await Promise.allSettled(
                modules.map((m) => progressApi.getProgress(m.id))
            );
            const map: Record<string, UserProgress> = {};
            results.forEach((result, i) => {
                if (result.status === 'fulfilled') {
                    const data = result.value as any;
                    if (data?.progress) {
                        map[modules[i].id] = data.progress;
                    }
                }
            });
            setProgressMap(map);
            setIsLoading(false);
        };
        fetchAllProgress();
    }, [user]);

    const totalCompleted = Object.values(progressMap).filter((p) => p?.isCompleted).length;
    const overallPct = modules.length > 0
        ? Math.round(
            Object.values(progressMap).reduce((sum, p) => sum + (p?.completionPercentage ?? 0), 0) /
            modules.length
        )
        : 0;
    const level = user?.comfortLevel as keyof typeof levelConfig | undefined;
    const levelInfo = level ? levelConfig[level] : levelConfig.beginner;

    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                {/* ── Welcome Banner ─────────────────────────────── */}
                <div className="bg-slate-900 text-white py-12 px-4">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${levelInfo.color}`}
                                    >
                                        {levelInfo.emoji} {levelInfo.label}
                                    </span>
                                </div>
                                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-2">
                                    Welcome back, {user?.firstName}! 👋
                                </h1>
                                <p className="text-blue-200 text-lg">
                                    {totalCompleted === modules.length
                                        ? '🏆 Amazing — you have completed all modules!'
                                        : `Keep going — you are doing great!`}
                                </p>
                            </div>

                            <div className="flex items-center flex-col sm:flex-row gap-6 bg-white/5 p-4 rounded-3xl border border-white/10 w-full lg:w-auto">
                                <div className="text-center sm:text-left">
                                    <div className="text-blue-200 text-sm font-medium mb-1">Learning Track</div>
                                    <div className="text-2xl font-extrabold font-display text-white">
                                        {modules.length} Modules
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px h-16 bg-white/20"></div>

                                {/* Progress Ring Area */}
                                <div className="flex-shrink-0 text-center w-full sm:w-auto">
                                    <div className="text-blue-200 text-sm font-medium mb-3">Overall Progress</div>
                                    <div className="w-full sm:w-40 h-3 bg-white/20 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-700"
                                            style={{ width: `${overallPct}%` }}
                                        />
                                    </div>
                                    <div className="text-white font-bold text-sm mt-2">{overallPct}% Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Modules Grid ───────────────────────────────── */}
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
                            Your Learning Modules
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Choose any module below to continue your learning journey.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="skeleton h-72 rounded-2xl" aria-hidden="true" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((mod) => {
                                const progress = progressMap[mod.id];
                                return (
                                    <LessonCard
                                        key={mod.id}
                                        moduleId={mod.id}
                                        title={mod.title}
                                        description={mod.description}
                                        icon={mod.icon}
                                        color={mod.color}
                                        completionPercentage={progress?.completionPercentage ?? 0}
                                        isCompleted={progress?.isCompleted ?? false}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── AI Assistant Chatbot ────────────────────────── */}
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
                            AI Learning Assistant
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Get help with your learning journey from our AI assistant.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                        <iframe
                            src="https://www.chatbase.co/chatbot-iframe/78nPOWm_QtY-3PNL8HH3W"
                            width="100%"
                            style={{ height: '100%', minHeight: '700px' }}
                            frameBorder="0"
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
