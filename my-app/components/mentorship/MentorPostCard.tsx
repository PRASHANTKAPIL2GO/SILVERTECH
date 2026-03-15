'use client';

import { useEffect, useState } from 'react';
import { MentorPost, MentorReply } from '@/types';
import Card from '@/components/ui/Card';
import { mentorApi } from '@/lib/api';

interface MentorPostCardProps {
    post: MentorPost;
    currentUserId: string | undefined;
    onReply: (postId: string) => void;
}

function getName(userId: MentorPost['userId']): string {
    if (typeof userId === 'string') return 'Member';
    return userId.firstName || 'Member';
}

function getReplyName(userId: MentorReply['userId']): string {
    if (typeof userId === 'string') return 'Member';
    return userId.firstName || 'Member';
}

function getPostUserId(userId: MentorPost['userId']): string {
    if (typeof userId === 'string') return userId;
    return userId._id;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function MentorPostCard({ post, currentUserId, onReply }: MentorPostCardProps) {
    const [replies, setReplies] = useState<MentorReply[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(true);

    const isOwnPost = !!currentUserId && getPostUserId(post.userId) === currentUserId;

    useEffect(() => {
        let cancelled = false;
        setLoadingReplies(true);
        (mentorApi.getReplies(post._id) as Promise<any>)
            .then((res) => { if (!cancelled) setReplies(res.replies ?? []); })
            .catch(() => { if (!cancelled) setReplies([]); })
            .finally(() => { if (!cancelled) setLoadingReplies(false); });
        return () => { cancelled = true; };
    }, [post._id]);

    return (
        <Card as="article" aria-label={`Post by ${getName(post.userId)}`}>
            {/* Post header */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold"
                    aria-hidden="true"
                >
                    {getName(post.userId)[0]?.toUpperCase()}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-lg">
                        {getName(post.userId)}
                        {isOwnPost && (
                            <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                You
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500">
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                        {' · '}
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {post.moduleContext}
                        </span>
                    </p>
                </div>
            </div>

            <p className="text-lg text-gray-800 leading-relaxed mb-4">{post.message}</p>

            {/* Replies */}
            {!loadingReplies && replies.length > 0 && (
                <div className="mt-2 mb-4 flex flex-col gap-3 border-l-4 border-blue-100 pl-4">
                    {replies.map((reply) => (
                        <div key={reply._id} className="flex items-start gap-2">
                            <div
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold"
                                aria-hidden="true"
                            >
                                {getReplyName(reply.userId)[0]?.toUpperCase()}
                            </div>
                            <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                    {getReplyName(reply.userId)}
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.reply}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(reply.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply button — hidden on own posts */}
            {!isOwnPost && (
                <button
                    onClick={() => onReply(post._id)}
                    className="text-base font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-700 rounded"
                    aria-label={`Reply to post by ${getName(post.userId)}`}
                >
                    💬 Reply
                </button>
            )}
        </Card>
    );
}
