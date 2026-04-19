'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const QUICK_TOPICS = [
    'Con tôi dạo này hay cáu gắt và đóng cửa phòng, tôi nên làm gì?',
    'Làm sao để khuyên con bớt chơi game mà không xảy ra cãi vã?',
    'Tôi muốn hiểu thêm về tâm lý tuổi dậy thì của các cháu...',
    'Con tôi đang gặp áp lực điểm số nhưng cháu không chịu chia sẻ...',
];

export default function PhuHuynhPage() {
    const [messages, setMessages] = useState<Message[]>([{
        role: 'assistant',
        content: 'Chào anh/chị, tôi là Chuyên gia Tâm lý Phương. Tại đây, tôi sẽ đồng hành cùng gia đình mình từng bước tháo gỡ những vướng mắc và thấu hiểu con hơn. Hôm nay anh/chị đang có điều gì băn khoăn về con, hãy kể cho tôi nghe nhé!',
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
                body: JSON.stringify({ messages: newMessages, mode: 'parent' }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Tôi đang gặp sự cố kết nối. Anh/chị thử lại sau nhé.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Không thể kết nối lúc này. Vui lòng thử lại sau.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - var(--nav-height))', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid #eee', padding: '14px 24px', background: 'var(--color-parent-bg)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    👩‍💼
                </div>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: 2, color: 'var(--color-parent-accent)' }}>
                        Chuyên gia Tâm lý Phương
                    </h1>
                    <p style={{ fontSize: 13, color: '#555' }}>Cố vấn hành vi và thấu hiểu tuổi teen</p>
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.length === 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {QUICK_TOPICS.map(t => (
                            <button key={t} onClick={() => sendMessage(t)} style={{
                                padding: '8px 14px', borderRadius: 999,
                                border: '1px solid #b0c4e8', background: 'white',
                                fontSize: 13, cursor: 'pointer', color: '#444', lineHeight: 1.4, textAlign: 'left',
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                            maxWidth: '75%', padding: '12px 16px',
                            borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            background: msg.role === 'user' ? 'var(--color-parent-accent)' : 'white',
                            color: msg.role === 'user' ? 'white' : '#1a1a2e',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: 14.5, lineHeight: 1.6,
                            border: msg.role === 'assistant' ? '1px solid #dee8f8' : 'none',
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', gap: 6, padding: '12px 16px', background: 'white', borderRadius: '20px 20px 20px 4px', border: '1px solid #dee8f8', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ borderTop: '1px solid #eee', padding: '16px 24px', background: 'white', display: 'flex', gap: 10 }}>
                <input
                    type="text"
                    placeholder="Nhập câu hỏi của anh/chị..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn" style={{ background: 'var(--color-parent-accent)', color: 'white', padding: '0 20px' }}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
