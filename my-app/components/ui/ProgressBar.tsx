interface ProgressBarProps {
    value: number;       // 0–100
    label?: string;
    showValue?: boolean;
    color?: 'blue' | 'green' | 'amber';
}

const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
};

const glowMap: Record<string, string> = {
    blue: 'shadow-blue-300/50',
    green: 'shadow-emerald-300/50',
    amber: 'shadow-amber-300/50',
};

export default function ProgressBar({
    value,
    label,
    showValue = true,
    color = 'blue',
}: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-semibold text-slate-600">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-sm font-bold text-blue-600 tabular-nums">{clamped}%</span>
                    )}
                </div>
            )}
            <div
                role="progressbar"
                aria-valuenow={clamped}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label || `Progress: ${clamped}%`}
                className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
            >
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} shadow-sm ${glowMap[color]} transition-all duration-700 ease-out`}
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
