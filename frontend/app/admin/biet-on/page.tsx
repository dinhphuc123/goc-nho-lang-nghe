'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GratitudeLetter } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function AdminBietOnPage() {
    const [letters, setLetters] = useState<GratitudeLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/admin/login'); return; }

            const { data } = await supabase
                .from('gratitude_letters')
                .select('*')
                .order('created_at', { ascending: false });
            setLetters(data ?? []);
            setLoading(false);
        };
        load();
    }, [router]);

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>
                💗 Hộp Thư Biết Ơn
            </h1>
            <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
                {loading ? 'Đang tải...' : `${letters.length} lời cảm ơn đã gửi`}
            </p>

            {!loading && letters.length === 0 && (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '48px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💌</div>
                    <p>Chưa có lời cảm ơn nào.</p>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {letters.map(letter => (
                    <div key={letter.id} className="card animate-fade-in" style={{ background: '#fce4ec', boxShadow: 'none', border: '1px solid #f8bbd9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>
                                    Gửi đến: <span style={{ color: '#880e4f' }}>{letter.recipient}</span>
                                </div>
                                {letter.sender_name && (
                                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                        Từ: {letter.sender_name}
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: 12, color: '#aaa', flexShrink: 0 }}>
                                {new Date(letter.created_at).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333', margin: 0 }}>
                            {letter.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
