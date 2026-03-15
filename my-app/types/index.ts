// ─── Auth ─────────────────────────────────────────────────
export interface User {
  id: string;
  firstName: string;
  email: string;
  comfortLevel: 'beginner' | 'medium' | 'advanced';
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// ─── Modules & Content ────────────────────────────────────
export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  tips?: string[];
}

export interface QuizOption {
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

// ─── Progress ─────────────────────────────────────────────
export interface UserProgress {
  userId: string;
  moduleId: string;
  completionPercentage: number;
  currentDifficulty: number;
  isCompleted: boolean;
  lastAccessed: string | null;
}

// ─── Attempts ─────────────────────────────────────────────
export interface Attempt {
  lessonId: string;
  moduleId: string;
  score: number;
  attemptsCount: number;
  passed: boolean;
}

export interface AdaptiveResult {
  action: 'increase' | 'decrease' | 'repeat';
  message: string;
}

// ─── Mentorship ───────────────────────────────────────────
export interface MentorPost {
  _id: string;
  userId: { _id: string; firstName: string } | string;
  moduleContext: string;
  message: string;
  isModerated: boolean;
  createdAt: string;
}

export interface MentorReply {
  _id: string;
  postId: string;
  userId: { _id: string; firstName: string } | string;
  reply: string;
  createdAt: string;
}

// ─── API Wrapper ──────────────────────────────────────────
export interface ApiError {
  success: false;
  message: string;
}
