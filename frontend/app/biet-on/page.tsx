'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SCHOOL_ID } from '@/lib/constants';

export default function BietOnPage() {
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!recipient.trim() || !message.trim()) {
            setError('Em cần điền người nhận và lời nhắn nhé!');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/gratitude', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient: recipient.trim(),
                    message: message.trim(),
                    sender_name: senderName.trim(),
                    school_id: SCHOOL_ID,
                })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Server lỗi');

            setSubmitted(true);
        } catch (err: any) {
            console.error('Gratitude Error:', err);
            setError(`Lỗi: ${err.message || 'Hệ thống bận, em thử lại sau!'}`);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div className="card animate-fade-in" style={{ maxWidth: 440, width: '100%', textAlign: 'center', background: 'var(--color-gratitude-bg)' }}>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>💌</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 12 }}>
                        Đã gửi yêu thương!
                    </h2>
                    <p style={{ color: '#555', lineHeight: 1.7 }}>
                        Lời biết ơn của em đã được ghi lại. Cảm ơn em đã lan tỏa năng lượng tích cực! 🌸
                    </p>
                    <button onClick={() => { setSubmitted(false); setRecipient(''); setMessage(''); setSenderName(''); }} style={{
                        marginTop: 20, padding: '10px 24px', borderRadius: 'var(--radius-md)',
                        background: 'var(--color-gratitude-accent)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600,
                    }}>
                        Gửi thêm lời biết ơn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 580, margin: '48px auto', padding: '0 24px' }}>
            <div className="animate-fade-in">
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 8 }}>
                    💗 Hộp Thư Biết Ơn
                </h1>
                <p style={{ color: '#666', marginBottom: 32, lineHeight: 1.7 }}>
                    Gửi lời cảm ơn ẩn danh hoặc có tên đến thầy cô, bạn bè, hay bất kỳ ai đã tạo ra sự khác biệt trong cuộc sống của em.
                </p>

                <div className="card" style={{ background: 'var(--color-gratitude-bg)', border: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Gửi đến ai? *</label>
                            <input
                                type="text"
                                placeholder="VD: Cô Lan dạy Toán, Bạn Minh lớp 10A1..."
                                value={recipient}
                                onChange={e => setRecipient(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Lời nhắn của em *</label>
                            <textarea
                                placeholder="Em muốn cảm ơn vì điều gì..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={5}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Người gửi (không bắt buộc)</label>
                            <input
                                type="text"
                                placeholder="Tên của em (hoặc để trống nếu muốn ẩn danh)"
                                value={senderName}
                                onChange={e => setSenderName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#c62828', fontSize: 13, marginTop: 10 }}>{error}</p>}

                    <button onClick={handleSubmit} disabled={loading || !recipient.trim() || !message.trim()} style={{
                        marginTop: 20, width: '100%', padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-gratitude-accent)', color: 'white',
                        border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15,
                        opacity: (loading || !recipient.trim() || !message.trim()) ? 0.6 : 1,
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                        ✈️ {loading ? 'Đang gửi...' : 'Gửi đi yêu thương'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' };
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid rgba(233,30,140,0.2)', background: 'white',
    fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none',
};
