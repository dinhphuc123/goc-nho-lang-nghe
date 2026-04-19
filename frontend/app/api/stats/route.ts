import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const threshold48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        // Parallel queries
        const [todayRes, urgentRes, overdueRes, resolvedRes, weeklyRes] = await Promise.all([
            // Thư hôm nay
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .gte('created_at', startOfDay),

            // Thư khẩn chưa xử lý
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('risk_level', 'urgent').neq('status', 'resolved'),

            // Thư chưa phản hồi quá 48h
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('status', 'pending').lt('created_at', threshold48h),

            // Đã giải quyết trong tháng
            supabaseAdmin.from('letters').select('id', { count: 'exact', head: true })
                .eq('status', 'resolved').gte('created_at', startOfMonth),

            // 7 ngày gần nhất — raw query
            supabaseAdmin.rpc('get_weekly_stats'),
        ]);

        // Build 7-day chart từ SQL function
        const weeklyData = weeklyRes.data ?? [];
        const chartData: { day: string; count: number; label: string }[] = [];
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = weeklyData.find((r: { day: string; count: number }) => r.day === dateStr);
            chartData.push({
                day: dateStr,
                count: found ? Number(found.count) : 0,
                label: dayNames[d.getDay()],
            });
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
