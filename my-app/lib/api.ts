/**
 * API utility — centralised fetch wrapper for SilverTech backend.
 *
 * - Reads token from localStorage (compatible with SSR via guards)
 * - Automatically sets Authorization header
 * - Throws structured errors for consumer to handle
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('silvertech_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('silvertech_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('silvertech_token');
};

// ─── Core fetch wrapper ───────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean; // whether to attach JWT header
}

async function request<T>(
  endpoint: string,
  { method = 'GET', body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────

export const authApi = {
  register: (payload: {
    firstName: string;
    email: string;
    password: string;
    comfortLevel?: string;
  }) => request('/auth/register', { method: 'POST', body: payload, auth: false }),

  login: (payload: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: payload, auth: false }),
};

// ─── Users ────────────────────────────────────────────────

export const userApi = {
  getMe: () => request('/users/me'),

  updateMe: (payload: { firstName?: string; comfortLevel?: string }) =>
    request('/users/me', { method: 'PUT', body: payload }),

  deleteMe: () => request('/users/me', { method: 'DELETE' }),
};

// ─── Progress ─────────────────────────────────────────────

export const progressApi = {
  getProgress: (moduleId: string) => request(`/progress/${moduleId}`),

  updateProgress: (payload: {
    moduleId: string;
    completionPercentage: number;
    currentDifficulty?: number;
    isCompleted?: boolean;
  }) => request('/progress/update', { method: 'POST', body: payload }),
};

// ─── Attempts ─────────────────────────────────────────────

export const attemptApi = {
  record: (payload: {
    lessonId: string;
    moduleId: string;
    score: number;
    attemptsCount: number;
    passed: boolean;
  }) => request('/attempts', { method: 'POST', body: payload }),
};

// ─── Mentorship ───────────────────────────────────────────

export const mentorApi = {
  getPosts: (moduleId: string) => request(`/mentor/posts/${moduleId}`),

  createPost: (payload: { moduleContext: string; message: string }) =>
    request('/mentor/posts', { method: 'POST', body: payload }),

  createReply: (payload: { postId: string; reply: string }) =>
    request('/mentor/replies', { method: 'POST', body: payload }),

  getReplies: (postId: string) => request(`/mentor/replies/${postId}`),
};
