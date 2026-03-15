import Link from 'next/link';
import ProgressBar from '@/components/ui/ProgressBar';

interface LessonCardProps {
    moduleId: string;
    title: string;
    description: string;
    icon: string;
    color?: string;
    completionPercentage: number;
    isCompleted: boolean;
}

export default function LessonCard({
    moduleId,
    title,
    description,
    icon,
    color = 'from-blue-500 to-blue-600',
    completionPercentage,
    isCompleted,
}: LessonCardProps) {
    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgb(0_0_0/0.04),_0_8px_32px_rgb(0_0_0/0.07)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_4px_8px_rgb(0_0_0/0.04),_0_20px_48px_rgb(0_0_0/0.12)] transition-all duration-300 flex flex-col">
            {/* Color bar top */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

            <div className="p-6 flex flex-col gap-5 flex-1">
                {/* Icon + Title row */}
                <div className="flex items-start gap-4">
                    <span
                        className={`inline-flex items-center justify-center w-14 h-14 text-3xl rounded-2xl bg-gradient-to-br ${color} shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">{title}</h3>
                            {isCompleted && (
                                <span
                                    className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full"
                                    aria-label="Module completed"
                                >
                                    ✓ Done
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* Progress */}
                <ProgressBar
                    value={completionPercentage}
                    label="Your Progress"
                    color={isCompleted ? 'green' : 'blue'}
                />

                {/* CTA */}
                <Link
                    href={`/modules/${moduleId}`}
                    className={[
                        'mt-auto w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 text-base',
                        isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-200 focus-visible:ring-emerald-500'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-200 focus-visible:ring-blue-600',
                    ].join(' ')}
                    aria-label={`${isCompleted ? 'Review' : 'Start'} ${title} module`}
                >
                    {isCompleted ? '🔄 Review Module' : '▶ Start Module'}
                </Link>
            </div>
        </div>
    );
}
