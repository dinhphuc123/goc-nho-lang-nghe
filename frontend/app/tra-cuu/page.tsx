'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Letter, LetterResponse } from '@/lib/types';

const STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
    pending: { label: 'Chờ xử lý', color: '#b71c1c', dot: '#e53935' },
    in_progress: { label: 'Đang xử lý', color: '#e65100', dot: '#f9a825' },
    resolved: { label: 'Đã giải quyết', color: '#2e7d32', dot: '#43a047' },
};

const RISK_LABELS: Record<string, string> = {
    normal: '🟢 Bình thường',
    attention: '🟡 Cần chú ý',
    urgent: '🔴 Khẩn cấp',
};

export default function TraCuuPage() {
    const [code, setCode] = useState('');
    const [searching, setSearching] = useState(false);
    const [result, setResult] = useState<{ letter: Letter; responses: LetterResponse[] } | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = async () => {
        if (code.trim().length < 4) return;
        setSearching(true);
        setNotFound(false);
        setResult(null);

        try {
            const { data: letter } = await supabase
                .from('letters')
                .select('*')
                .eq('tracking_code', code.trim().toUpperCase())
                .single();

            if (!letter) { setNotFound(true); return; }

            const { data: responses } = await supabase
                .from('responses')
                .select('*, admin:admins(full_name)')
                .eq('letter_id', letter.id)
                .eq('is_internal_note', false)
                .order('created_at');

            setResult({ letter, responses: responses ?? [] });
        } catch {
            setNotFound(true);
        } finally {
            setSearching(false);
        }
    };

    const statusInfo = result ? STATUS_LABELS[result.letter.status] : null;

    return (
        <div style={{ maxWidth: 580, margin: '48px auto', padding: '0 24px' }}>
            <div className="animate-fade-in">
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 8 }}>
                    🔍 Tra Cứu Báo Cáo
                </h1>
                <p style={{ color: '#666', marginBottom: 32 }}>
                    Nhập mã theo dõi 6 ký tự đã nhận sau khi gửi thư.
                </p>

                <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                    <input
                        type="text"
                        placeholder="VD: AB12CD"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        maxLength={6}
                        style={{
                            flex: 1, padding: '14px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid #ddd',
                            fontSize: 18, letterSpacing: '0.15em', fontWeight: 600,
                            textTransform: 'uppercase', outline: 'none',
                            fontFamily: 'var(--font-sans)',
                        }}
                    />
                    <button onClick={handleSearch} disabled={searching || code.trim().length < 4} className="btn btn-primary" style={{ padding: '0 24px' }}>
                        {searching ? '...' : <Search size={18} />}
                    </button>
                </div>

                {notFound && (
                    <div className="card animate-fade-in" style={{ textAlign: 'center', color: '#888' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                        <p>Mã <strong>{code}</strong> không tồn tại. Em kiểm tra lại nhé!</p>
                    </div>
                )}

                {result && statusInfo && (
                    <div className="card animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Mã thư</div>
                                <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: '0.1em' }}>{result.letter.tracking_code}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusInfo.dot, display: 'inline-block' }} />
                                    <span style={{ fontWeight: 600, color: statusInfo.color, fontSize: 14 }}>{statusInfo.label}</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                                    {new Date(result.letter.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Mức độ</div>
                            <span>{RISK_LABELS[result.letter.risk_level]}</span>
                        </div>

                        <div style={{ background: '#f8f9fa', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Nội dung thư</div>
                            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333' }}>{result.letter.content}</p>
                        </div>

                        {result.responses.length > 0 ? (
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Phản hồi từ thầy cô:</div>
                                {result.responses.map((r) => (
                                    <div key={r.id} style={{
                                        background: '#e8f5e9', borderRadius: 'var(--radius-sm)',
                                        padding: 14, marginBottom: 10,
                                    }}>
                                        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{r.content}</p>
                                        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                                            {new Date(r.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888', padding: '16px 0', fontSize: 14 }}>
                                ⏳ Thầy cô đang xem xét và sẽ phản hồi sớm...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
