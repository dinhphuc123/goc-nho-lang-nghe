'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ARTICLE_CATEGORY_LABELS } from '@/lib/constants';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Article = {
    id: string;
    title: string;
    category: string;
    target: string;
    status: string;
    created_at: string;
};

export default function AdminCamNangListPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin/login');
            return;
        }

        try {
            const res = await fetch('/api/articles?status=all', {
                headers: { 'Authorization': `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            if (data.articles) setArticles(data.articles);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn gỡ bài viết "${title}" không?`)) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            await fetch(`/api/articles?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.access_token}` },
            });
            fetchArticles();
        } catch (err) {
            alert('Có lỗi xảy ra khi xóa bài!');
        }
    };

    return (
        <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 4 }}>
                        📚 Quản lý Cẩm Nang
                    </h1>
                    <p style={{ color: '#666', fontSize: 14 }}>
                        Thêm, sửa, xóa và quản lý bài viết trên hệ thống.
                    </p>
                </div>
                <Link href="/admin/cam-nang/edit/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'white' }}>
                    <Plus size={18} /> Thêm bài viết mới
                </Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555' }}>Tiêu đề</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555' }}>Chủ đề</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555' }}>Đối tượng</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555' }}>Trạng thái</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555' }}>Ngày tạo</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: '#555', textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : articles.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                                    Chưa có bài viết nào. Hãy thêm mới!
                                </td>
                            </tr>
                        ) : (
                            articles.map(article => (
                                <tr key={article.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                                        {article.title}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#666' }}>
                                        {ARTICLE_CATEGORY_LABELS[article.category as keyof typeof ARTICLE_CATEGORY_LABELS] || article.category}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#666' }}>
                                        {article.target === 'all' ? 'Tất cả' : article.target.toUpperCase()}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {article.status === 'published' ? (
                                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Đã xuất bản</span>
                                        ) : (
                                            <span style={{ background: '#f5f5f5', color: '#666', padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Bản nháp</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>
                                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                            <button onClick={() => router.push(`/admin/cam-nang/edit/${article.id}`)} title="Sửa bài" style={{ background: '#f0f4f8', color: 'var(--color-primary)', border: 'none', padding: 8, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(article.id, article.title)} title="Gỡ / Xóa bài" style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: 8, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
