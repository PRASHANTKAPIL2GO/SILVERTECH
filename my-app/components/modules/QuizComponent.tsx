'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QuizComponentProps {
    questions: QuizQuestion[];
    onComplete: (score: number) => void;
}

export default function QuizComponent({ questions, onComplete }: QuizComponentProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Guard against undefined or empty questions
    if (!questions || questions.length === 0) {
        return (
            <Card className="text-center py-10" as="section">
                <div className="text-4xl mb-4" aria-hidden="true">
                    ⚠️
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
                <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet. Please try another module.</p>
            </Card>
        );
    }

    const question = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    const handleSelect = (index: number) => {
        if (answered) return;
        setSelected(index);
        setAnswered(true);
        if (question.options[index].isCorrect) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (isLast) {
            const finalScore = Math.round(((score + (question.options[selected!]?.isCorrect ? 1 : 0)) / questions.length) * 100);
            // Wait for state to stabilise - use already-updated score
            const totalCorrect = score + (selected !== null && question.options[selected].isCorrect ? 0 : 0);
            const percentage = Math.round((score / questions.length) * 100);
            setFinished(true);
            onComplete(percentage);
        } else {
            setCurrentIndex((prev) => prev + 1);
            setSelected(null);
            setAnswered(false);
        }
    };

    const finalPercent = Math.round((score / questions.length) * 100);

    if (finished) {
        return (
            <Card className="text-center py-10" as="section" aria-label="Quiz results">
                <div className="text-6xl mb-4" aria-hidden="true">
                    {finalPercent >= 80 ? '🏆' : finalPercent >= 50 ? '👍' : '💪'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-xl text-gray-600 mb-6">
                    You scored <strong className="text-blue-700">{finalPercent}%</strong> — {score} out of{' '}
                    {questions.length} correct.
                </p>
                {finalPercent >= 80 ? (
                    <p className="text-emerald-700 font-semibold text-lg">Excellent work! You are ready for the next level.</p>
                ) : finalPercent >= 50 ? (
                    <p className="text-amber-700 font-semibold text-lg">Good effort! Keep practising to improve your score.</p>
                ) : (
                    <p className="text-red-600 font-semibold text-lg">Do not worry — reviewing the lessons will help you improve.</p>
                )}
            </Card>
        );
    }

    return (
        <Card as="section" aria-label={`Question ${currentIndex + 1} of ${questions.length}`}>
            {/* Progress */}
            <p className="text-base font-semibold text-blue-700 mb-2" aria-live="polite">
                Question {currentIndex + 1} of {questions.length}
            </p>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>

            {/* Options */}
            <ul className="flex flex-col gap-3 mb-6 list-none" role="list">
                {question.options.map((option, i) => {
                    let optionStyle = 'bg-gray-50 border-2 border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50';
                    if (answered) {
                        if (option.isCorrect) {
                            optionStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800';
                        } else if (selected === i) {
                            optionStyle = 'bg-red-50 border-2 border-red-500 text-red-800';
                        } else {
                            optionStyle = 'bg-gray-50 border-2 border-gray-200 text-gray-500';
                        }
                    }

                    return (
                        <li key={i}>
                            <button
                                onClick={() => handleSelect(i)}
                                disabled={answered}
                                className={[
                                    'w-full text-left px-5 py-4 rounded-xl text-lg font-medium transition-all duration-150',
                                    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-700',
                                    'disabled:cursor-default',
                                    optionStyle,
                                ].join(' ')}
                                aria-pressed={selected === i}
                            >
                                {answered && option.isCorrect && <span className="mr-2" aria-hidden="true">✓</span>}
                                {answered && !option.isCorrect && selected === i && <span className="mr-2" aria-hidden="true">✕</span>}
                                {option.label}
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Explanation */}
            {answered && (
                <div
                    className="bg-blue-50 border-l-4 border-blue-700 rounded-xl p-4 mb-6"
                    role="note"
                    aria-label="Explanation"
                >
                    <p className="text-base font-semibold text-blue-800">💡 {question.explanation}</p>
                </div>
            )}

            {answered && (
                <Button onClick={handleNext} size="lg" fullWidth>
                    {isLast ? 'See My Results →' : 'Next Question →'}
                </Button>
            )}
        </Card>
    );
}
