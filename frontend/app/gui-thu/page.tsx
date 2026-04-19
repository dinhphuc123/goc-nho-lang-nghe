'use client';

import { useState } from 'react';
import { Send, Shield, AlertTriangle } from 'lucide-react';
import { ATTENTION_KEYWORDS, URGENT_KEYWORDS, SCHOOL_ID } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

function detectEmotion(text: string): string {
    if (!text) return '';
    const lower = text.toLowerCase();
    if (URGENT_KEYWORDS.some(k => lower.includes(k))) return 'Lo lắng nghiêm trọng';
    if (ATTENTION_KEYWORDS.some(k => lower.includes(k))) return 'Cần quan tâm';
    return 'Bình thường';
}

function generateTracking(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateAnonymousId() {
    return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function GuiThuPage() {
    const [identity, setIdentity] = useState<'anonymous' | 'named'>('anonymous');
    const [anonId] = useState(generateAnonymousId);
    const [name, setName] = useState('');
    const [className, setClassName] = useState('');
    const [content, setContent] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emotion = detectEmotion(content);
    const displayName = identity === 'anonymous' ? `Học sinh ẩn danh ${anonId}` : (name || 'Chưa điền tên');

    const handleSubmit = async () => {
        if (content.trim().length < 10) {
            setError('Bạn muốn kể thêm không? Góc Nhỏ đang lắng nghe...');
            return;
        }
        setError('');
        setLoading(true);

        const code = generateTracking();
        const lower = content.toLowerCase();
        const riskLevel = URGENT_KEYWORDS.some(k => lower.includes(k))
            ? 'urgent'
            : ATTENTION_KEYWORDS.some(k => lower.includes(k))
                ? 'attention'
                : 'normal';

        try {
            const res = await fetch('/api/letters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tracking_code: code,
                    category: 'anxiety',
                    content: content.trim(),
                    sender_name: identity === 'named' ? name || null : null,
                    sender_class: identity === 'named' ? className || null : null,
                    contact_info: null,
                    is_anonymous: identity === 'anonymous',
                    risk_level: riskLevel,
                    ai_flags: [],
                    status: 'pending',
                    school_id: SCHOOL_ID,
                }),
            });

            if (!res.ok) throw new Error('API Error');
            setTrackingCode(code);
            setSubmitted(true);
        } catch {
            setError('Có lỗi khi gửi thư. Em thử lại sau nhé!');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div className="card animate-fade-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>💌</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 12 }}>
                        Thư đã được gửi đi!
                    </h2>
                    <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 24 }}>
                        Cảm ơn em đã chia sẻ. Thầy cô sẽ đọc và phản hồi sớm nhất có thể.
                        Hãy lưu lại mã theo dõi để kiểm tra kết quả nhé.
                    </p>
                    <div style={{
                        background: '#f5f5f8', borderRadius: 'var(--radius-md)',
                        padding: '20px', marginBottom: 24,
                    }}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Mã theo dõi của em</div>
                        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-primary)' }}>
                            {trackingCode}
                        </div>
                    </div>
                    <a href="/tra-cuu" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                        Tra cứu trạng thái thư
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
            <div className="animate-fade-in">
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 8 }}>
                    ✉️ Gửi Thư Hỗ Trợ
                </h1>
                <p style={{ color: '#666', marginBottom: 32 }}>
                    Chia sẻ điều em đang gặp phải — thầy cô sẽ đọc và lên tiếng giúp em.
                </p>

                {/* Identity selector */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {(['anonymous', 'named'] as const).map(type => (
                        <button key={type} onClick={() => setIdentity(type)} style={{
                            flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                            border: `2px solid ${identity === type ? 'var(--color-primary)' : '#ddd'}`,
                            background: identity === type ? '#f5f5f8' : 'white',
                            fontWeight: identity === type ? 600 : 400,
                            cursor: 'pointer', fontSize: 14,
                            transition: 'all 0.15s',
                        }}>
                            {type === 'anonymous' ? '👻 Ẩn danh' : '👤 Để lại tên'}
                        </button>
                    ))}
                </div>

                {identity === 'named' && (
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                        <input type="text" placeholder="Tên của em" value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                        <input type="text" placeholder="Lớp" value={className} onChange={e => setClassName(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                )}

                {/* Header */}
                <div style={{
                    background: '#f5f5f8', borderRadius: 'var(--radius-sm)', padding: '10px 16px',
                    marginBottom: 12, fontSize: 13, color: '#555',
                    display: 'flex', gap: 12, alignItems: 'center',
                }}>
                    <span>Danh tính: <strong>{displayName}</strong></span>
                    {emotion && <span>• Cảm xúc phát hiện: <strong>{emotion}</strong></span>}
                </div>

                {/* Security banner */}
                <div style={{
                    background: '#e8f5e9', borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                    marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                    <Shield size={16} style={{ color: '#388e3c', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#2e7d32', lineHeight: 1.5, margin: 0 }}>
                        Mọi thông tin em gửi ở đây sẽ được bảo mật. Sau khi gửi, em sẽ nhận được một <strong>Mã theo dõi</strong> để kiểm tra trạng thái xử lý.
                    </p>
                </div>

                {/* Content */}
                <textarea
                    placeholder="Em hãy kể lại sự việc ở đây nhé... Dù là áp lực học tập, mâu thuẫn bạn bè, hay điều gì khác — Góc Nhỏ luôn lắng nghe."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={8}
                    style={{
                        ...inputStyle,
                        resize: 'vertical', minHeight: 160,
                        marginBottom: 8,
                    }}
                />
                <div style={{ textAlign: 'right', fontSize: 12, color: content.length < 10 ? '#e53935' : '#999', marginBottom: 16 }}>
                    {content.length} ký tự {content.length < 10 && '(cần ít nhất 10)'}
                </div>

                {error && (
                    <div style={{
                        background: '#fff8e1', border: '1px solid #ffe082',
                        borderRadius: 'var(--radius-sm)', padding: '10px 16px',
                        marginBottom: 16, fontSize: 13, color: '#e65100',
                        display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}

                <button onClick={handleSubmit} disabled={loading || content.trim().length < 10} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                    {loading ? 'Đang gửi...' : <><Send size={16} /> Gửi thư hỗ trợ</>}
                </button>
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid #ddd',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
    background: 'white',
};
