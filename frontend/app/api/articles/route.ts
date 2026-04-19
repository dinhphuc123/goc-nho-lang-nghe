import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';
import { SCHOOL_ID } from '@/lib/constants';

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return null;

    // 🔒 Security: Check role và is_active trong database
    const { data: adminData } = await supabaseAdmin
        .from('admins')
        .select('role')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

    if (!adminData || !['admin', 'counselor'].includes(adminData.role)) {
        return null; // Từ chối nếu bị khoá tải khoản hoặc sai role
    }

    return user;
}

// GET — list articles với filter (public: only published, admin: all)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') ?? 'published';
    const isAdmin = request.headers.get('authorization') ? true : false;

    let query = supabaseAdmin
        .from('articles')
        .select('id, title, summary, category, target, status, ai_generated, published_at, created_at')
        .order('published_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('status', 'published');
    } else if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (category && category !== 'all') query = query.eq('category', category);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: 'Lỗi tải bài viết.' }, { status: 500 });
    return NextResponse.json({ articles: data });
}

// POST — Admin tạo hoặc publish bài
export async function POST(request: NextRequest) {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, title, summary, content, category, target, status, ai_generated } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
        }

        const articleData = {
            title: title.trim(),
            summary: summary?.trim() ?? '',
            content: content.trim(),
            category,
            target: target ?? 'all',
            status: status ?? 'draft',
            ai_generated: ai_generated ?? false,
            author_id: user.id,
            published_at: status === 'published' ? new Date().toISOString() : null,
            school_id: SCHOOL_ID,
        };

        let result;
        if (id) {
            // Update existing
            const { data, error } = await supabaseAdmin
                .from('articles').update(articleData).eq('id', id).select().single();
            if (error) throw error;
            result = data;
        } else {
            // Insert new
            const { data, error } = await supabaseAdmin
                .from('articles').insert(articleData).select().single();
            if (error) throw error;
            result = data;
        }

        return NextResponse.json({ article: result });
    } catch (err) {
        console.error('Article POST error:', err);
        return NextResponse.json({ error: 'Không thể lưu bài viết.' }, { status: 500 });
    }
}

// DELETE — Admin gỡ bài (chuyển về draft)
export async function DELETE(request: NextRequest) {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Thiếu ID bài viết.' }, { status: 400 });

    const { error } = await supabaseAdmin
        .from('articles').update({ status: 'draft', published_at: null }).eq('id', id);

    if (error) return NextResponse.json({ error: 'Không thể gỡ bài.' }, { status: 500 });
    return NextResponse.json({ success: true });
}
