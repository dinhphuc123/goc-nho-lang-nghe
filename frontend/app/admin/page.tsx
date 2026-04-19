'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Letter } from '@/lib/types';
import { useRouter } from 'next/navigation';

const STATUS_LABELS: Record<string, { label: string; dot: string }> = {
    pending: { label: 'Chờ xử lý', dot: '#e53935' },
    in_progress: { label: 'Đang xử lý', dot: '#f9a825' },
    resolved: { label: 'Đã xong', dot: '#43a047' },
};

const RISK_CONFIG: Record<string, { class: string; label: string }> = {
    urgent: { class: 'badge-urgent', label: '🔴 Khẩn cấp' },
    attention: { class: 'badge-attention', label: '🟡 Cần chú ý' },
    normal: { class: 'badge-normal', label: '🟢 Bình thường' },
};

const SIDEBAR_ITEMS = [
    { key: 'urgent', label: '🔴 Thư khẩn cấp' },
    { key: 'attention', label: '🟡 Cần chú ý' },
    { key: 'all', label: '📬 Tất cả thư' },
    { key: 'stats', label: '📊 Thống kê' },
    { key: 'cam-nang', label: '📝 Cẩm Nang', href: '/admin/cam-nang' },
    { key: 'biet-on', label: '💗 Biết Ơn', href: '/admin/biet-on' },
];


export default function AdminDashboard() {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [selected, setSelected] = useState<Letter | null>(null);
    const [filter, setFilter] = useState<'all' | 'urgent' | 'attention'>('all');
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [metrics, setMetrics] = useState({ today: 0, urgent: 0, overdue: 0, resolved: 0 });
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        fetchLetters();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) router.push('/admin/login');
    };

    const fetchLetters = async () => {
        setLoading(true);
        const { data } = await supabase.from('letters').select('*').order('created_at', { ascending: false });
        const all = data ?? [];
        setLetters(all);

        const today = new Date().toDateString();
        const oneDayAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        setMetrics({
            today: all.filter(l => new Date(l.created_at).toDateString() === today).length,
            urgent: all.filter(l => l.risk_level === 'urgent' && l.status !== 'resolved').length,
            overdue: all.filter(l => l.status === 'pending' && new Date(l.created_at) < oneDayAgo).length,
            resolved: all.filter(l => l.status === 'resolved' && new Date(l.created_at).getMonth() === new Date().getMonth()).length,
        });
        setLoading(false);
    };

    const handleStatus = async (letterId: string, status: string) => {
        await supabase.from('letters').update({ status }).eq('id', letterId);
        await fetchLetters();
        setSelected(prev => prev ? { ...prev, status: status as any } : null);
    };

    const handleReply = async () => {
        if (!selected || !reply.trim()) return;
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from('responses').insert({
            letter_id: selected.id,
            admin_id: session?.user.id,
            content: reply.trim(),
            is_internal_note: false,
        });
        await handleStatus(selected.id, 'in_progress');
        setReply('');
        alert('Đã gửi phản hồi!');
    };

    const filteredLetters = filter === 'all' ? letters : letters.filter(l => l.risk_level === filter);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-height))' }}>
            {/* Sidebar */}
            <aside style={{ width: 220, borderRight: '1px solid #eee', background: 'white', padding: '20px 0', flexShrink: 0, overflowY: 'auto' }}>
                <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #eee', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bảng điều khiển</div>
                </div>

                {SIDEBAR_ITEMS.map(item => (
                    item.href ? (
                        <Link key={item.key} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 16px', textDecoration: 'none',
                            fontSize: 14, color: '#444', fontWeight: 400,
                            borderLeft: '3px solid transparent',
                        }}>
                            {item.label}
                        </Link>
                    ) : (
                        <button key={item.key} onClick={() => item.key !== 'stats' && setFilter(item.key as any)} style={{
                            width: '100%', textAlign: 'left', padding: '10px 16px',
                            border: 'none', background: filter === item.key ? '#f5f5f8' : 'transparent',
                            fontWeight: filter === item.key ? 600 : 400, fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, borderLeft: filter === item.key ? '3px solid var(--color-primary)' : '3px solid transparent',
                        }}>
                            {item.label}
                            {item.key === 'urgent' && metrics.urgent > 0 && (
                                <span style={{ marginLeft: 'auto', background: '#e53935', color: 'white', borderRadius: 999, fontSize: 11, fontWeight: 700, padding: '1px 7px' }}>{metrics.urgent}</span>
                            )}
                        </button>
                    )
                ))}



                <div style={{ marginTop: 16, padding: '16px', borderTop: '1px solid #eee' }}>
                    <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }}
                        style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Metrics */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', gap: 12, background: 'white', flexShrink: 0 }}>
                    {[
                        { label: 'Thư hôm nay', value: metrics.today, color: '#1a1a2e' },
                        { label: 'Thư khẩn', value: metrics.urgent, color: '#b71c1c' },
                        { label: 'Quá 48h', value: metrics.overdue, color: '#e65100' },
                        { label: 'Đã xử lý tháng này', value: metrics.resolved, color: '#2e7d32' },
                    ].map(m => (
                        <div key={m.label} style={{ flex: 1, background: '#f8f9fa', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
                            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{m.label}</div>
                        </div>
                    ))}
                </div>

                {/* Letter list + Detail */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* List */}
                    <div style={{ width: 340, borderRight: '1px solid #eee', overflowY: 'auto', background: '#fafafa' }}>
                        {loading ? (
                            <div style={{ padding: 24, color: '#888', textAlign: 'center' }}>Đang tải...</div>
                        ) : filteredLetters.length === 0 ? (
                            <div style={{ padding: 24, color: '#888', textAlign: 'center' }}>Không có thư nào</div>
                        ) : (
                            filteredLetters.map(letter => {
                                const risk = RISK_CONFIG[letter.risk_level];
                                const status = STATUS_LABELS[letter.status];
                                return (
                                    <div key={letter.id} onClick={() => setSelected(letter)} style={{
                                        padding: '14px 16px', borderBottom: '1px solid #eee', cursor: 'pointer',
                                        background: selected?.id === letter.id ? '#f0f0f5' : 'white',
                                        transition: 'background 0.1s',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                            <span className={`badge ${risk.class}`} style={{ fontSize: 11 }}>{risk.label}</span>
                                            <span style={{ fontSize: 11, color: '#aaa' }}>{new Date(letter.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                                            #{letter.tracking_code} • {letter.is_anonymous ? '👻 Ẩn danh' : letter.sender_name}
                                        </div>
                                        <p style={{ fontSize: 13, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {letter.content}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
                                            <span style={{ fontSize: 11, color: '#888' }}>{status.label}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Detail */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                        {!selected ? (
                            <div style={{ textAlign: 'center', color: '#aaa', marginTop: 80 }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                                <p>Chọn một thư để xem chi tiết</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>#{selected.tracking_code}</div>
                                        <span className={`badge ${RISK_CONFIG[selected.risk_level].class}`}>
                                            {RISK_CONFIG[selected.risk_level].label}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#888' }}>
                                        {new Date(selected.created_at).toLocaleString('vi-VN')}
                                    </div>
                                </div>

                                <div style={{ background: '#f8f9fa', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                                        Từ: {selected.is_anonymous ? `Học sinh ẩn danh` : `${selected.sender_name} ${selected.sender_class ? `(${selected.sender_class})` : ''}`}
                                    </div>
                                    <p style={{ fontSize: 14.5, lineHeight: 1.7 }}>{selected.content}</p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                                    {['pending', 'in_progress', 'resolved'].map(s => (
                                        <button key={s} onClick={() => handleStatus(selected.id, s)} style={{
                                            padding: '7px 14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid',
                                            borderColor: selected.status === s ? 'var(--color-primary)' : '#ddd',
                                            background: selected.status === s ? 'var(--color-primary)' : 'white',
                                            color: selected.status === s ? 'white' : '#444',
                                            fontSize: 12, cursor: 'pointer', fontWeight: 500,
                                        }}>
                                            {s === 'pending' ? '⏳ Chờ xử lý' : s === 'in_progress' ? '🔄 Đang xử lý' : '✅ Đã xong'}
                                        </button>
                                    ))}
                                </div>

                                {/* Reply */}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Phản hồi cho học sinh</label>
                                    <textarea
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        placeholder="Nhập phản hồi gửi đến học sinh..."
                                        rows={5}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', marginBottom: 10 }}
                                    />
                                    <button onClick={handleReply} disabled={!reply.trim()} className="btn btn-primary" style={{ fontSize: 13 }}>
                                        Gửi phản hồi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
