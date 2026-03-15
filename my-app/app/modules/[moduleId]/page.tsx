'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import QuizComponent from '@/components/modules/QuizComponent';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Module, Lesson } from '@/types';
import { progressApi, attemptApi } from '@/lib/api';
import { evaluatePerformance, getDifficultyLabel } from '@/lib/adaptiveLogic';

export default function ModulePage() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const router = useRouter();
    const [moduleData, setModuleData] = useState<Module | null>(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [attemptsCount, setAttemptsCount] = useState(1);
    const [difficulty, setDifficulty] = useState(1);
    const [completionPercent, setCompletionPercent] = useState(0);
    const [adaptive, setAdaptive] = useState<{ message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load module content from local JSON
    useEffect(() => {
        const loadModule = async () => {
            try {
                const data = await import(`@/content/${moduleId}.json`);
                setModuleData(data.default as Module);

                // Fetch existing progress
                const progressRes: any = await progressApi.getProgress(moduleId);
                if (progressRes.progress) {
                    setDifficulty(progressRes.progress.currentDifficulty ?? 1);
                    setCompletionPercent(progressRes.progress.completionPercentage ?? 0);
                }
            } catch {
                router.replace('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        if (moduleId) loadModule();
    }, [moduleId, router]);

    const lessons = moduleData?.lessons ?? [];
    const currentLesson = lessons[currentLessonIndex];
    const totalSteps = lessons.length + 1; // lessons + quiz

    const progressValue = showQuiz
        ? 100
        : Math.round(((currentLessonIndex + 1) / totalSteps) * 100);

    const handleNextLesson = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex((prev) => prev + 1);
            setAdaptive(null);
        } else {
            setShowQuiz(true);
        }
    };

    const handlePrevLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex((prev) => prev - 1);
            setAdaptive(null);
        }
    };

    const handleQuizComplete = async (score: number) => {
        setIsSaving(true);
        const result = evaluatePerformance(score, attemptsCount);
        setAdaptive(result);

        const newDifficulty =
            result.action === 'increase'
                ? difficulty + 1
                : result.action === 'decrease'
                    ? Math.max(1, difficulty - 1)
                    : difficulty;
        setDifficulty(newDifficulty);

        try {
            await Promise.all([
                attemptApi.record({
                    lessonId: currentLesson?.id ?? moduleId,
                    moduleId,
                    score,
                    attemptsCount,
                    passed: score >= 60,
                }),
                progressApi.updateProgress({
                    moduleId,
                    completionPercentage: 100,
                    currentDifficulty: newDifficulty,
                    isCompleted: score >= 60,
                }),
            ]);
            setCompletionPercent(100);
        } finally {
            setIsSaving(false);
            setAttemptsCount((prev) => prev + 1);
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
                    <div className="skeleton h-10 w-1/3 mb-6 rounded-xl" />
                    <div className="skeleton h-64 rounded-2xl" />
                </div>
            </ProtectedRoute>
        );
    }

    if (!moduleData) return null;

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 animate-fadein max-w-3xl">
                {/* Back */}
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="mb-6">
                    ← Back to Dashboard
                </Button>

                {/* Module header */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl" aria-hidden="true">{moduleData.icon}</span>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{moduleData.title}</h1>
                        <p className="text-base text-gray-500 mt-1">
                            Difficulty: <strong>{getDifficultyLabel(difficulty)}</strong>
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <ProgressBar
                        value={progressValue}
                        label={showQuiz ? 'Quiz' : `Lesson ${currentLessonIndex + 1} of ${lessons.length}`}
                    />
                </div>

                {/* Adaptive feedback */}
                {adaptive && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="bg-blue-50 border-l-4 border-blue-700 rounded-xl p-5 mb-6 text-lg font-semibold text-blue-800"
                    >
                        🎯 {adaptive.message}
                    </div>
                )}

                {/* Lesson Viewer */}
                {!showQuiz && currentLesson && (
                    <Card as="section" aria-label={`Lesson: ${currentLesson.title}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">{currentLesson.title}</h2>
                        <div className="text-lg text-gray-800 whitespace-pre-line leading-relaxed mb-6">
                            {currentLesson.content}
                        </div>

                        {currentLesson.tips && currentLesson.tips.length > 0 && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-yellow-800 text-lg mb-3">💡 Helpful Tips</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {currentLesson.tips.map((tip) => (
                                        <li key={tip} className="text-yellow-900 text-base">
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-4 flex-wrap">
                            {currentLessonIndex > 0 && (
                                <Button variant="secondary" size="lg" onClick={handlePrevLesson}>
                                    ← Previous
                                </Button>
                            )}
                            <Button size="lg" onClick={handleNextLesson} className="flex-1">
                                {currentLessonIndex < lessons.length - 1 ? 'Next Lesson →' : 'Take the Quiz →'}
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Quiz */}
                {showQuiz && (
                    <div>
                        <QuizComponent
                            questions={moduleData.quiz}
                            onComplete={handleQuizComplete}
                        />
                        {isSaving && (
                            <p className="text-center text-gray-500 mt-4 animate-pulse" aria-live="polite">
                                Saving your progress…
                            </p>
                        )}
                        <div className="text-center mt-8">
                            <Button variant="secondary" size="lg" onClick={() => router.push('/dashboard')}>
                                ← Return to Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
