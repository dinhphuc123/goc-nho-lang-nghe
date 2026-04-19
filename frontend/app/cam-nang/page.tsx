'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Article, ArticleCategory } from '@/lib/types';
import { ARTICLE_CATEGORY_LABELS } from '@/lib/constants';
import Link from 'next/link';

const TABS: { key: ArticleCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'stress', label: 'Áp lực học tập' },
    { key: 'relationship', label: 'Quan hệ bạn bè' },
    { key: 'bullying', label: 'Bạo lực học đường' },
    { key: 'emotion', label: 'Cảm xúc & Sức khỏe' },
    { key: 'nutrition', label: 'Tư vấn Dinh dưỡng' },
];

export default function CamNangPage() {
    const [activeTab, setActiveTab] = useState<ArticleCategory | 'all'>('all');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            let query = supabase.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false });
            if (activeTab !== 'all') query = query.eq('category', activeTab);
            const { data } = await query;
            setArticles(data ?? []);
            setLoading(false);
        };
        fetchArticles();
    }, [activeTab]);

    return (
        <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 24px' }}>
            <div className="animate-fade-in">
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 8 }}>
                    📚 Cẩm Nang Tâm Lý
                </h1>
                <p style={{ color: '#666', marginBottom: 28 }}>
                    Bài viết, mẹo vặt giúp em cân bằng cảm xúc và quản lý cuộc sống học đường.
                </p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: '8px 18px', borderRadius: 999,
                            border: `1.5px solid ${activeTab === tab.key ? 'var(--color-primary)' : '#ddd'}`,
                            background: activeTab === tab.key ? 'var(--color-primary)' : 'white',
                            color: activeTab === tab.key ? 'white' : '#444',
                            fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>Đang tải bài viết...</div>
                ) : articles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                        <p>Chưa có bài viết nào. Thầy cô đang soạn!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="articles-grid">
                        {articles.map(article => (
                            <Link key={article.id} href={`/cam-nang/${article.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                                    <span className={`tag tag-${article.category}`} style={{ marginBottom: 12, display: 'inline-block' }}>
                                        {ARTICLE_CATEGORY_LABELS[article.category]}
                                    </span>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', marginBottom: 10, lineHeight: 1.4 }}>
                                        {article.title}
                                    </h3>
                                    <p style={{ fontSize: 13.5, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
                                        {article.summary}
                                    </p>
                                    <div style={{ fontSize: 12, color: '#aaa' }}>
                                        {article.published_at ? new Date(article.published_at).toLocaleDateString('vi-VN') : ''}
                                        {article.ai_generated && <span style={{ marginLeft: 8 }}>✨ AI soạn nháp</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
