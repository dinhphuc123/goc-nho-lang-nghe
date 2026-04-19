import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipient, message, sender_name, school_id } = body;

        if (!recipient || !message || !school_id) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from('gratitude_letters').insert({
            recipient: recipient.trim(),
            message: message.trim(),
            sender_name: sender_name ? sender_name.trim() : null,
            school_id
        });

        if (error) {
            console.error('Supabase Admin Gratitude Insert Error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API /api/gratitude error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
