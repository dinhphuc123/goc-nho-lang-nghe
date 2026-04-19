'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ARTICLE_CATEGORY_LABELS } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';

type ArticleDraft = { title: string; summary: string; content: string; parseError?: boolean };

const CATEGORIES = Object.entries(ARTICLE_CATEGORY_LABELS) as [string, string][];
const TARGETS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'thcs', label: 'THCS' },
    { value: 'thpt', label: 'THPT' },
];

export default function AdminCamNangEditPage() {
    const { id } = useParams();
    const router = useRouter();

    const isNew = id === 'new';

    const [category, setCategory] = useState('stress');
    const [titleHint, setTitleHint] = useState('');
    const [target, setTarget] = useState('all');

    const [generating, setGenerating] = useState(false);
    const [draft, setDraft] = useState<ArticleDraft | null>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(!isNew);

    useEffect(() => {
        if (!isNew) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        if (data && !error) {
            setCategory(data.category);
            setTarget(data.target);
            setDraft({
                title: data.title,
                summary: data.summary,
                content: data.content,
            });
        }
        setLoading(false);
    }

    const handleGenerate = async () => {
        setGenerating(true);
        setDraft(null);
        setMsg('');
        try {
            const res = await fetch('/api/handbooks/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, titleHint, target }),
            });
            const data = await res.json();
            if (data.error) { setMsg('⚠️ ' + data.error); return; }
            setDraft(data);
            if (data.parseError) setMsg('⚠️ AI trả về không đúng định dạng JSON, vui lòng chỉnh sửa thủ công.');
        } catch {
            setMsg('⚠️ Không thể kết nối AI. Thử lại sau.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async (publish: boolean) => {
        if (!draft) return;
        setSaving(true);
        setMsg('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/admin/login'); return; }

            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    id: isNew ? undefined : id,
                    title: draft.title, summary: draft.summary, content: draft.content,
                    category, target, status: publish ? 'published' : 'draft', ai_generated: true,
                }),
            });
            const data = await res.json();
            if (data.error) { setMsg('⚠️ ' + data.error); return; }
            setMsg(publish ? '✅ Đã xuất bản thành công!' : '✅ Đã lưu nháp!');
            if (publish) setTimeout(() => router.push('/admin/cam-nang'), 1500);
        } catch {
            setMsg('⚠️ Lỗi khi lưu. Thử lại sau.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Đang nạp bài viết...</div>;
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
            <button onClick={() => router.push('/admin/cam-nang')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} /> Quay lại danh sách
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>
                {isNew ? '📝 Thêm Bài Cẩm Nang' : '📝 Chỉnh Sửa Cẩm Nang'}
            </h1>
            <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>
                Bạn có thể dùng AI gợi ý, hoặc soạn tay và xuất bản.
            </p>

            {/* Input form */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Chủ đề *</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                            {CATEGORIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Đối tượng</label>
                        <select value={target} onChange={e => setTarget(e.target.value)} style={inputStyle}>
                            {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Gợi ý tiêu đề (không bắt buộc)</label>
                        <input type="text" placeholder="VD: Vượt qua áp lực thi cử..."
                            value={titleHint} onChange={e => setTitleHint(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleGenerate} disabled={generating} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        {generating ? '⟳ Đang soạn nháp...' : '✨ Dùng AI để tạo nội dung'}
                    </button>
                    {!draft && (
                        <button onClick={() => setDraft({ title: '', summary: '', content: '' })} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                            ✍️ Tự viết bài mới
                        </button>
                    )}
                </div>
            </div>

            {/* Editor */}
            {draft && (
                <div className="card animate-fade-in">
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Tiêu đề</label>
                        <input type="text" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
                            style={{ ...inputStyle, fontSize: 16, fontWeight: 600 }} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Tóm tắt (hiện ở trang danh sách)</label>
                        <textarea value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })}
                            rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Nội dung (Markdown)</label>
                        <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })}
                            rows={18} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical', lineHeight: 1.6 }} />
                    </div>

                    {msg && <p style={{ color: msg.startsWith('✅') ? '#2e7d32' : '#c62828', marginBottom: 12, fontSize: 14 }}>{msg}</p>}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handleGenerate} disabled={generating || saving} className="btn btn-outline" style={{ fontSize: 13 }}>
                            ↺ AI Viết lại
                        </button>
                        <button onClick={() => handleSave(false)} disabled={saving} className="btn" style={{ background: '#666', color: 'white', fontSize: 13 }}>
                            {saving ? 'Đang lưu...' : '💾 Lưu nháp'}
                        </button>
                        <button onClick={() => handleSave(true)} disabled={saving || !draft.title.trim()} className="btn btn-primary" style={{ fontSize: 13 }}>
                            {saving ? 'Đang xuất bản...' : '🚀 Xuất bản'}
                        </button>
                    </div>
                </div>
            )}

            <style>{`@media(max-width:640px){div[style*="grid-template-columns"]{grid-template-columns:1fr!important;}}`}</style>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5, color: '#555' };
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    borderRadius: 'var(--radius-sm)', border: '1.5px solid #ddd',
    fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none',
};
