'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
    const { user, updateUser, deleteAccount } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName ?? '');
    const [comfortLevel, setComfortLevel] = useState(user?.comfortLevel ?? 'beginner');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError('');
        setSaveSuccess(false);
        setIsSaving(true);
        try {
            await updateUser({ firstName, comfortLevel });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 4000);
        } catch (err: any) {
            setSaveError(err.message || 'Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError('');
        try {
            await deleteAccount();
        } catch (err: any) {
            setDeleteError(err.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-12 animate-fadein">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Profile</h1>
                <p className="text-lg text-gray-600 mb-8">Update your name, comfort level, or account settings.</p>

                {/* Profile Info Card */}
                <Card className="mb-8">
                    {/* Avatar */}
                    <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-200">
                        <div
                            className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-4xl font-bold flex-shrink-0"
                            aria-hidden="true"
                        >
                            {user?.firstName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{user?.firstName}</p>
                            <p className="text-lg text-gray-500">{user?.email}</p>
                            {user?.isVerified && (
                                <span className="inline-flex items-center gap-1 mt-1 text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                    ✓ Verified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        {saveSuccess && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="bg-emerald-50 border-2 border-emerald-400 text-emerald-800 px-5 py-4 rounded-xl text-lg font-semibold"
                            >
                                ✅ Profile updated successfully!
                            </div>
                        )}
                        {saveError && (
                            <div role="alert" className="bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl text-lg font-medium">
                                ⚠ {saveError}
                            </div>
                        )}

                        <Input
                            label="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />

                        {/* Email is read-only — changing email requires re-verification */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-base font-semibold text-gray-800">Email Address</label>
                            <div className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-lg text-gray-500">
                                {user?.email}
                                <span className="ml-3 text-sm text-gray-400">(cannot be changed)</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="comfortLevel" className="text-base font-semibold text-gray-800">
                                Comfort Level with Technology
                            </label>
                            <select
                                id="comfortLevel"
                                value={comfortLevel}
                                onChange={(e) => setComfortLevel(e.target.value as any)}
                                className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:border-blue-700 focus:ring-3 focus:ring-blue-100"
                            >
                                <option value="beginner">🌱 Beginner — I am just getting started</option>
                                <option value="medium">🌿 Intermediate — I know a few things</option>
                                <option value="advanced">🌳 Advanced — I am fairly confident</option>
                            </select>
                        </div>

                        <Button type="submit" size="lg" isLoading={isSaving}>
                            Save Changes
                        </Button>
                    </form>
                </Card>

                {/* Danger Zone */}
                <Card className="border-2 border-red-200">
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Danger Zone</h2>
                    <p className="text-lg text-gray-600 mb-5">
                        Deleting your account is permanent and cannot be undone. All your progress and posts will be
                        removed.
                    </p>

                    {deleteError && (
                        <div role="alert" className="mb-4 bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl text-base font-medium">
                            ⚠ {deleteError}
                        </div>
                    )}

                    {!showDeleteConfirm ? (
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            🗑 Delete My Account
                        </Button>
                    ) : (
                        <div className="bg-red-50 rounded-xl p-5 border-2 border-red-300">
                            <p className="text-lg font-bold text-red-800 mb-4">
                                Are you absolutely sure? This cannot be undone.
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                <Button
                                    variant="danger"
                                    size="lg"
                                    onClick={handleDelete}
                                    isLoading={isDeleting}
                                >
                                    Yes, Delete My Account
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </ProtectedRoute>
    );
}
