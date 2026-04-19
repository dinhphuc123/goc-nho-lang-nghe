// ============================================
// TYPE DEFINITIONS — Góc Nhỏ Lắng Nghe
// ============================================

export type RiskLevel = 'normal' | 'attention' | 'urgent';
export type LetterStatus = 'pending' | 'in_progress' | 'resolved';
export type UserRole = 'counselor' | 'admin' | 'viewer';
export type ArticleCategory = 'stress' | 'relationship' | 'bullying' | 'emotion';
export type ArticleTarget = 'thcs' | 'thpt' | 'all';
export type ArticleStatus = 'draft' | 'published';

export interface Letter {
    id: string;
    tracking_code: string;
    category: 'anxiety' | 'relationship' | 'bullying' | 'mental_health' | 'report' | 'chat';
    content: string;
    contact_info?: string | null;
    sender_name?: string | null;
    sender_class?: string | null;
    is_anonymous: boolean;
    risk_level: RiskLevel;
    ai_flags: string[];
    status: LetterStatus;
    created_at: string;
    school_id: string;
}

export interface LetterResponse {
    id: string;
    letter_id: string;
    admin_id: string;
    content: string;
    is_internal_note: boolean;
    created_at: string;
    admin?: Admin;
}

export interface Admin {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    school_id: string;
    notify_urgent: boolean;
    notify_daily: boolean;
    is_active: boolean;
}

export interface GratitudeMessage {
    id: string;
    recipient: string;
    message: string;
    sender_name?: string | null;
    created_at: string;
    school_id: string;
}

// Alias cho component dùng
export type GratitudeLetter = GratitudeMessage;


export interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: ArticleCategory;
    target: ArticleTarget;
    status: ArticleStatus;
    ai_generated: boolean;
    author_id?: string;
    published_at?: string;
    school_id: string;
    created_at: string;
}

// Chat types
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface UserIdentity {
    type: 'anonymous' | 'named';
    displayName: string;
    className?: string;
}

// Tracking
export interface TrackingResult {
    letter: Letter;
    responses: LetterResponse[];
}

// Admin dashboard metrics
export interface DashboardMetrics {
    todayCount: number;
    todayChange: number;
    urgentCount: number;
    overdueCount: number; // chưa phản hồi > 48h
    resolvedThisMonth: number;
    weeklyData: { day: string; count: number }[];
}
