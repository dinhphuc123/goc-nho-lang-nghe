import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// Verify that caller is an authenticated admin
async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    return user;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await verifyAdmin(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const allowedFields: Record<string, unknown> = {};
        if (body.status && ['pending', 'in_progress', 'resolved'].includes(body.status)) {
            allowedFields.status = body.status;
        }
        if (body.risk_level && ['normal', 'attention', 'urgent'].includes(body.risk_level)) {
            allowedFields.risk_level = body.risk_level;
        }
        if (Object.keys(allowedFields).length === 0) {
            return NextResponse.json({ error: 'Không có trường hợp lệ để cập nhật.' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('letters')
            .update(allowedFields)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ letter: data });
    } catch (err) {
        console.error('Letter PATCH error:', err);
        return NextResponse.json({ error: 'Không thể cập nhật thư.' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
        .from('letters')
        .select('*, responses!responses_letter_id_fkey(*)')
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: 'Không tìm thấy thư.' }, { status: 404 });
    return NextResponse.json({ letter: data });
}
