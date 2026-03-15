'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import MentorPostCard from '@/components/mentorship/MentorPostCard';
import ReplyBox from '@/components/mentorship/ReplyBox';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { mentorApi } from '@/lib/api';
import { MentorPost } from '@/types';
import { useAuth } from '@/context/AuthContext';

const MODULE_OPTIONS = [
    { value: 'email-module', label: '✉️ Email' },
    { value: 'scam-module', label: '🛡️ Scam Awareness' },
    { value: 'video-call-module', label: '📹 Video Calls' },
    { value: 'social-media-module', label: '📱 Social Media' },
    { value: 'online-shopping-module', label: '🛒 Online Shopping' },
    { value: 'password-security-module', label: '🔐 Passwords' },
    { value: 'smartphone-basics-module', label: '📲 Smartphone' },
    { value: 'web-search-module', label: '🔍 Web Search' },
    { value: 'digital-banking-module', label: '🏦 Digital Banking' },
    { value: 'health-online-module', label: '🏥 Health Online' },
    { value: 'streaming-module', label: '🎬 Streaming' },
    { value: 'messaging-apps-module', label: '💬 Messaging Apps' },
    { value: 'gov-services-module', label: '🏛️ Gov Services' },
];

export default function MentorshipPage() {
    const { user } = useAuth();
    const [activeModule, setActiveModule] = useState('email-module');
    const [posts, setPosts] = useState<MentorPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    // New post form
    const [showNewPost, setShowNewPost] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [postError, setPostError] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchPosts = async (moduleId: string) => {
        setIsLoading(true);
        try {
            const res: any = await mentorApi.getPosts(moduleId);
            setPosts(res.posts ?? []);
        } catch {
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(activeModule);
    }, [activeModule]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim().length < 5) {
            setPostError('Your message must be at least 5 characters.');
            return;
        }
        setPostError('');
        setIsPosting(true);
        try {
            await mentorApi.createPost({ moduleContext: activeModule, message: newMessage.trim() });
            setNewMessage('');
            setShowNewPost(false);
            setSuccessMsg('✅ Your post has been posted successfully!');
            setTimeout(() => setSuccessMsg(''), 5000);
            await fetchPosts(activeModule); // Re-fetch so the new post appears immediately
        } catch (err: any) {
            setPostError(err.message || 'Failed to post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleReply = async (postId: string, reply: string) => {
        await mentorApi.createReply({ postId, reply });
        setReplyingTo(null);
        await fetchPosts(activeModule); // Refresh so reply counts update
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 animate-fadein max-w-3xl">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Mentorship Community</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Ask questions and share experiences with fellow learners.
                </p>

                {/* Module filter tabs */}
                <nav
                    aria-label="Filter posts by module"
                    className="relative mb-8"
                >
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {MODULE_OPTIONS.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setActiveModule(m.value)}
                                aria-pressed={activeModule === m.value}
                                className={[
                                    'snap-start flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150',
                                    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-700',
                                    activeModule === m.value
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400',
                                ].join(' ')}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Success message */}
                {successMsg && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="bg-emerald-50 border-2 border-emerald-400 text-emerald-800 px-5 py-4 rounded-xl text-lg font-semibold mb-6"
                    >
                        {successMsg}
                    </div>
                )}

                {/* New Post Button / Form */}
                <div className="mb-8">
                    {!showNewPost ? (
                        <Button size="lg" onClick={() => setShowNewPost(true)}>
                            ✏️ Ask a Question
                        </Button>
                    ) : (
                        <Card>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ask the Community</h2>
                            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                                <div>
                                    <label
                                        htmlFor="newPostMessage"
                                        className="block text-base font-semibold text-gray-800 mb-2"
                                    >
                                        Your Question or Message
                                    </label>
                                    <textarea
                                        id="newPostMessage"
                                        rows={4}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your question here…"
                                        className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg text-gray-900 bg-white resize-none focus:outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-100"
                                        required
                                        minLength={5}
                                        aria-describedby={postError ? 'post-error' : undefined}
                                        aria-invalid={!!postError}
                                    />
                                    {postError && (
                                        <p id="post-error" role="alert" className="mt-2 text-red-600 font-medium text-base">
                                            ⚠ {postError}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" isLoading={isPosting}>Submit Post</Button>
                                    <Button type="button" variant="ghost" onClick={() => { setShowNewPost(false); setPostError(''); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>

                {/* Posts List */}
                {isLoading ? (
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-36 rounded-2xl" aria-hidden="true" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-5xl mb-4" aria-hidden="true">💬</div>
                        <p className="text-xl font-semibold">No posts yet in this module.</p>
                        <p className="text-lg mt-2">Be the first to ask a question!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                            <div key={post._id}>
                                <MentorPostCard
                                    post={post}
                                    currentUserId={user?.id}
                                    onReply={(id) =>
                                        setReplyingTo((prev) => (prev === id ? null : id))
                                    }
                                />
                                {replyingTo === post._id && (
                                    <ReplyBox
                                        postId={post._id}
                                        onSubmit={handleReply}
                                        onCancel={() => setReplyingTo(null)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
