'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Phone, Mail, Home, ArrowLeft } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
type Identity = { type: 'anonymous' | 'named'; displayName: string; className?: string };
type Screen = 'identity' | 'chat' | 'safety';

function generateAnonymousId() {
    return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

const QUICK_TOPICS = [
    'Em đang cảm thấy áp lực vì kỳ thi sắp tới...',
    'Em có mâu thuẫn với bạn và không biết phải làm sao',
    'Em hay lo lắng và không ngủ được dạo này',
    'Em cảm thấy buồn mà không rõ lý do...',
];

export default function TuVanAIPage() {
    const [screen, setScreen] = useState<Screen>('identity');
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [tempName, setTempName] = useState('');
    const [tempClass, setTempClass] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAnonymous = () => {
        const id = generateAnonymousId();
        setIdentity({ type: 'anonymous', displayName: `Học sinh ẩn danh ${id}` });
        initChat();
    };

    const handleNamed = () => {
        if (!tempName.trim()) return;
        setIdentity({ type: 'named', displayName: tempName.trim(), className: tempClass.trim() });
        initChat();
    };

    const initChat = () => {
        setMessages([{
            role: 'assistant',
            content: 'Xin chào em! Thầy Phúc rất vui được lắng nghe em chia sẻ. Em đang gặp khó khăn gì, hãy kể cho thầy nghe nhé — ở đây hoàn toàn an toàn và bảo mật. 💙',
        }]);
        setScreen('chat');
    };

    const sendMessage = async (text?: string) => {
        const content = text ?? input.trim();
        if (!content || loading) return;

        const newMessages: Message[] = [...messages, { role: 'user', content }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, mode: 'student' }),
            });
            const data = await res.json();

            if (data.danger) {
                setScreen('safety');
                return;
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Cô đang gặp sự cố kết nối. Em thử lại sau một chút nhé! 🙏',
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (screen === 'identity') {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div className="card animate-fade-in" style={{ maxWidth: 460, width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>
                            Phòng Tư Vấn AI
                        </h1>
                        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
                            Trò chuyện cùng <strong>Thầy Phúc</strong> — hoàn toàn bảo mật, không lưu lại
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <button onClick={handleAnonymous} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                            👻 Tiếp tục ẩn danh
                        </button>

                        <div style={{ textAlign: 'center', color: '#999', fontSize: 13 }}>— hoặc —</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input
                                type="text"
                                placeholder="Tên của em (VD: Minh, An...)"
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="Lớp (VD: 10A1) — không bắt buộc"
                                value={tempClass}
                                onChange={e => setTempClass(e.target.value)}
                                style={inputStyle}
                            />
                            <button onClick={handleNamed} disabled={!tempName.trim()} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                                👤 Để lại tên & lớp
                            </button>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#aaa' }}>
                        🔒 Không lưu IP, không theo dõi danh tính
                    </p>
                </div>
            </div>
        );
    }

    if (screen === 'safety') {
        return (
            <div style={{
                minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-danger-bg)', padding: 24,
            }}>
                <div className="animate-fade-in" style={{
                    maxWidth: 500, width: '100%',
                    background: '#7f0000', borderRadius: 'var(--radius-lg)',
                    padding: 40, textAlign: 'center', color: 'white',
                }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: 16, color: '#ffcdd2' }}>
                        CẢNH BÁO AN TOÀN
                    </h2>
                    <p style={{ lineHeight: 1.7, marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>
                        Thầy Phúc nhận thấy em đang trải qua một cảm xúc rất khó khăn và có những suy nghĩ gây hại cho bản thân.
                        <strong style={{ display: 'block', marginTop: 8, color: '#ffcdd2' }}>
                            Trí tuệ nhân tạo không được phép tư vấn trong tình huống này.
                        </strong>
                    </p>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 28, lineHeight: 1.6 }}>
                        Xin em hãy dừng lại, hít thở sâu và liên hệ ngay với người có thể thực sự giúp em.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <a href="tel:111" className="btn btn-danger" style={{
                            width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px',
                            background: '#d32f2f', borderRadius: 'var(--radius-md)',
                        }}>
                            <Phone size={20} /> Gọi ngay 111 — Miễn phí 24/7
                        </a>
                        <Link href="/gui-thu" className="btn" style={{
                            width: '100%', justifyContent: 'center', background: '#f9a825', color: '#1a1a2e',
                            padding: '13px',
                        }}>
                            <Mail size={18} /> Gửi thư cho thầy cô
                        </Link>
                        <Link href="/" className="btn" style={{
                            width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)', padding: '13px',
                        }}>
                            <Home size={18} /> Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── CHAT SCREEN ──
    return (
        <div style={{ height: 'calc(100dvh - var(--nav-height))', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{
                borderBottom: '1px solid #eee', padding: '12px 20px',
                background: 'white', display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <button onClick={() => setScreen('identity')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>🤖</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Thầy Phúc</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Chuyên viên tư vấn tâm lý AI • 🔒 Bảo mật</div>
                </div>
                {identity && (
                    <div style={{
                        fontSize: 12, color: '#666', background: '#f5f5f5',
                        padding: '4px 10px', borderRadius: 999,
                    }}>
                        {identity.displayName}
                    </div>
                )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Quick topics — show only when 1 message */}
                {messages.length === 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        {QUICK_TOPICS.map(topic => (
                            <button key={topic} onClick={() => sendMessage(topic)} style={{
                                padding: '8px 14px', borderRadius: 999,
                                border: '1px solid #ddd', background: 'white',
                                fontSize: 13, cursor: 'pointer', color: '#444',
                                transition: 'all 0.15s',
                            }}>
                                {topic}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                        {msg.role === 'assistant' && (
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'var(--color-primary)', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, marginRight: 8, alignSelf: 'flex-end',
                            }}>🤖</div>
                        )}
                        <div style={{
                            maxWidth: '72%',
                            padding: '12px 16px',
                            borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            background: msg.role === 'user' ? 'var(--color-primary)' : 'white',
                            color: msg.role === 'user' ? 'white' : '#1a1a2e',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: 14.5, lineHeight: 1.6,
                            border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--color-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                        }}>🤖</div>
                        <div style={{
                            padding: '12px 18px', background: 'white', borderRadius: '20px 20px 20px 4px',
                            border: '1px solid #eee', boxShadow: 'var(--shadow-sm)',
                            display: 'flex', gap: 4, alignItems: 'center',
                        }}>
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '16px 24px', borderTop: '1px solid #eee',
                background: 'white', display: 'flex', gap: 10,
            }}>
                <input
                    type="text"
                    placeholder="Nhắn tin với Thầy Phúc..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={loading}
                    style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ padding: '0 20px', flexShrink: 0 }}>
                    <Send size={18} />
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
};
