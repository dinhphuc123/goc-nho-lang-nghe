-- ============================================
-- SQL BỔ SUNG — Admins & Weekly Stats
-- Chạy RIÊNG block này trong Supabase SQL Editor
-- ============================================

-- 5. ADMINS — Profile giáo viên tư vấn
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'counselor'
    CHECK (role IN ('counselor', 'admin', 'viewer')),
  school_id TEXT NOT NULL DEFAULT 'ptdtnt-hm-lamdong',
  notify_urgent BOOLEAN NOT NULL DEFAULT TRUE,
  notify_daily BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own profile"
  ON admins FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can update own profile"
  ON admins FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Auto-create admin profile khi user mới đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.admins (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin();

-- ============================================
-- 6. FUNCTION: Weekly Stats cho Dashboard
-- ============================================
CREATE OR REPLACE FUNCTION get_weekly_stats()
RETURNS TABLE(day DATE, count BIGINT) AS $$
  SELECT 
    DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS day,
    COUNT(*) AS count
  FROM letters
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
  ORDER BY day;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute to service_role
GRANT EXECUTE ON FUNCTION get_weekly_stats() TO service_role;
GRANT EXECUTE ON FUNCTION get_weekly_stats() TO authenticated;

-- ============================================
-- 7. Thêm INDEX responses để truy vấn nhanh
-- ============================================
CREATE INDEX IF NOT EXISTS idx_responses_letter ON responses(letter_id);
CREATE INDEX IF NOT EXISTS idx_responses_internal ON responses(is_internal_note);
