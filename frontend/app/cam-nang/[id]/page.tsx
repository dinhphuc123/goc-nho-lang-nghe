import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ARTICLE_CATEGORY_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { marked } from 'marked';

export default async function ArticleDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .eq('status', 'published')
        .single();

    if (!article) notFound();

    const htmlContent = marked(article.content ?? '');

    return (
        <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px 80px' }}>
            <Link href="/cam-nang" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 14, marginBottom: 24 }}>
                ← Quay lại Cẩm nang
            </Link>

            <span className={`tag tag-${article.category}`} style={{ marginBottom: 16, display: 'inline-block' }}>
                {ARTICLE_CATEGORY_LABELS[article.category as keyof typeof ARTICLE_CATEGORY_LABELS]}
            </span>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', lineHeight: 1.3, marginBottom: 12 }}>
                {article.title}
            </h1>

            <div style={{ color: '#888', fontSize: 13, marginBottom: 32, display: 'flex', gap: 12 }}>
                {article.published_at && <span>📅 {new Date(article.published_at).toLocaleDateString('vi-VN')}</span>}
                {article.ai_generated && <span>✨ AI soạn nháp · đã duyệt</span>}
            </div>

            <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />

            {/* CTA Banner */}
            <div style={{
                marginTop: 48, background: 'var(--color-parent-bg)',
                borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center',
            }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💙</div>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Cần chia sẻ thêm?</p>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>
                    Góc Nhỏ Lắng Nghe luôn sẵn sàng — ẩn danh, an toàn, 24/7.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/tu-van-ai" className="btn btn-primary" style={{ fontSize: 13, color: 'white' }}>Trò chuyện với Thầy Phúc</Link>
                    <Link href="/gui-thu" className="btn btn-outline" style={{ fontSize: 13 }}>Gửi thư ẩn danh</Link>
                </div>
            </div>
        </div>
    );
}
