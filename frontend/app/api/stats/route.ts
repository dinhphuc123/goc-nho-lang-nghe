import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// ✅ Bảo vệ endpoint stats bằng xác thực Supabase JWT
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

export async function GET(request: NextRequest) {
    // ✅ Auth check — chỉ admin mới được xem thống kê
    const user = await verifyAdmin(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const threshold48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        const [todayRes, urgentRes, overdueRes, resolvedRes, weeklyRes] = await Promise.all([
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .gte('created_at', startOfDay),
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('risk_level', 'urgent').neq('status', 'resolved'),
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('status', 'pending').lt('created_at', threshold48h),
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('status', 'resolved').gte('created_at', startOfMonth),
            supabaseAdmin.rpc('get_weekly_stats'),
        ]);

        const weeklyData = weeklyRes.data ?? [];
        const chartData: { day: string; count: number; label: string }[] = [];
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = weeklyData.find((r: { day: string; count: number }) => r.day === dateStr);
            chartData.push({ day: dateStr, count: found ? Number(found.count) : 0, label: dayNames[d.getDay()] });
        }

        return NextResponse.json({
            today: todayRes.count ?? 0,
            urgent: urgentRes.count ?? 0,
            overdue: overdueRes.count ?? 0,
            resolved: resolvedRes.count ?? 0,
            weeklyChart: chartData,
        });
    } catch (err) {
        console.error('Stats API error:', err);
        return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu thống kê.' }, { status: 500 });
    }
}
