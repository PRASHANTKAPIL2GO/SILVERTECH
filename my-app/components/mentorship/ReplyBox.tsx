'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ReplyBoxProps {
    postId: string;
    onSubmit: (postId: string, reply: string) => Promise<void>;
    onCancel: () => void;
}

export default function ReplyBox({ postId, onSubmit, onCancel }: ReplyBoxProps) {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim().length < 2) {
            setError('Your reply must be at least 2 characters.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await onSubmit(postId, text.trim());
            setText('');
        } catch (err: any) {
            setError(err.message || 'Failed to send reply. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-blue-50 rounded-2xl p-5 mt-3 border-2 border-blue-200"
            aria-label="Write a reply"
        >
            <label
                htmlFor={`reply-${postId}`}
                className="block text-base font-semibold text-gray-800 mb-2"
            >
                Your Reply
            </label>
            <textarea
                id={`reply-${postId}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Type your reply here…"
                className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg text-gray-900 bg-white resize-none focus:outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-100"
                aria-describedby={error ? `reply-error-${postId}` : undefined}
                aria-invalid={!!error}
                required
                minLength={2}
            />
            {error && (
                <p
                    id={`reply-error-${postId}`}
                    role="alert"
                    className="mt-2 text-base text-red-600 font-medium"
                >
                    ⚠ {error}
                </p>
            )}
            <div className="flex gap-3 mt-3">
                <Button type="submit" isLoading={isSubmitting} size="md">
                    Send Reply
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
