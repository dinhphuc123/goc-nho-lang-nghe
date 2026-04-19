import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SCHOOL_ID } from '@/lib/constants';

const VALID_CATEGORIES = ['anxiety', 'relationship', 'bullying', 'mental_health', 'report', 'chat'] as const;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ✅ Whitelist fields — không insert thẳng body (chống Mass Assignment)
        const { content, category, contact_info, sender_name, sender_class, is_anonymous } = body;

        // Basic validation
        if (!content || typeof content !== 'string' || content.trim().length < 5) {
            return NextResponse.json({ error: 'Nội dung thư quá ngắn.' }, { status: 400 });
        }
        if (content.length > 5000) {
            return NextResponse.json({ error: 'Nội dung thư quá dài (tối đa 5000 ký tự).' }, { status: 400 });
        }
        if (category && !VALID_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: 'Loại thư không hợp lệ.' }, { status: 400 });
        }

        // Tạo tracking_code 6 ký tự ngẫu nhiên
        const tracking_code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // ✅ Chỉ insert whitelist fields — không phải raw body
        const letterData = {
            content: content.trim(),
            category: category ?? 'chat',
            contact_info: contact_info ? String(contact_info).slice(0, 100) : null,
            sender_name: sender_name ? String(sender_name).slice(0, 50) : null,
            sender_class: sender_class ? String(sender_class).slice(0, 20) : null,
            is_anonymous: Boolean(is_anonymous ?? true),
            tracking_code,
            school_id: SCHOOL_ID,       // ✅ Luôn từ server, không từ client
            risk_level: 'normal',        // ✅ Bắt đầu normal, AI phân loại sau
            status: 'pending',           // ✅ Bắt đầu pending
            ai_flags: [],
        };

        const { error } = await supabaseAdmin.from('letters').insert(letterData);

        if (error) {
            console.error('Error inserting letter:', error.message);
            return NextResponse.json({ error: 'Không thể gửi thư. Thử lại sau.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, tracking_code });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Letters POST error:', msg);
        return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
    }
}
