-- ============================================
-- SUPABASE SQL SCHEMA — Góc Nhỏ Lắng Nghe
-- Project: tuvantamly (xkpoymudyomrhnhntfly)
-- Chạy từng block trong Supabase SQL Editor
-- ============================================

-- ⚠️ Cập nhật default school_id mới
-- Nếu đã có bảng rồi, chạy lệnh này để đổi default:
-- ALTER TABLE letters ALTER COLUMN school_id SET DEFAULT 'ptdtnt-hm-lamdong';
-- ALTER TABLE gratitude_letters ALTER COLUMN school_id SET DEFAULT 'ptdtnt-hm-lamdong';
-- ALTER TABLE articles ALTER COLUMN school_id SET DEFAULT 'ptdtnt-hm-lamdong';

-- 1. LETTERS — Thư gửi đến từ học sinh
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code VARCHAR(6) NOT NULL UNIQUE,
  category VARCHAR(20) NOT NULL DEFAULT 'anxiety'
    CHECK (category IN ('anxiety','relationship','bullying','mental_health','report','chat')),
  content TEXT NOT NULL,
  contact_info TEXT,
  sender_name TEXT,
  sender_class TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  risk_level VARCHAR(10) NOT NULL DEFAULT 'normal'
    CHECK (risk_level IN ('normal','attention','urgent')),
  ai_flags TEXT[] DEFAULT '{}',
  status VARCHAR(15) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  school_id TEXT NOT NULL DEFAULT 'sa-binh-quang-ngai'
);

-- 2. RESPONSES — Phản hồi từ thầy cô
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id UUID NOT NULL REFERENCES letters(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. GRATITUDE_LETTERS — Hộp Thư Biết Ơn
CREATE TABLE IF NOT EXISTS gratitude_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  school_id TEXT NOT NULL DEFAULT 'sa-binh-quang-ngai'
);

-- 4. ARTICLES — Cẩm Nang Tâm Lý
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(20) NOT NULL
    CHECK (category IN ('stress','relationship','bullying','emotion')),
  target VARCHAR(10) NOT NULL DEFAULT 'all'
    CHECK (target IN ('thcs','thpt','all')),
  status VARCHAR(10) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published')),
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  school_id TEXT NOT NULL DEFAULT 'sa-binh-quang-ngai'
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Letters: học sinh có thể INSERT (anon), admin có thể đọc tất cả
CREATE POLICY "Students can insert letters"
  ON letters FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins can read all letters"
  ON letters FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update letters"
  ON letters FOR UPDATE TO authenticated USING (true);

-- Lookup by tracking code (for students)
CREATE POLICY "Anyone can lookup by tracking code"
  ON letters FOR SELECT TO anon
  USING (tracking_code IS NOT NULL);

-- Responses: học sinh chỉ đọc phản hồi public
CREATE POLICY "Students can read public responses"
  ON responses FOR SELECT TO anon
  USING (is_internal_note = FALSE);

CREATE POLICY "Admins can manage responses"
  ON responses FOR ALL TO authenticated USING (true);

-- Gratitude: anon insert
CREATE POLICY "Anyone can send gratitude"
  ON gratitude_letters FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins can read gratitude"
  ON gratitude_letters FOR SELECT TO authenticated USING (true);

-- Articles: published articles are public
CREATE POLICY "Published articles are public"
  ON articles FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Admins can manage articles"
  ON articles FOR ALL TO authenticated USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_letters_tracking ON letters(tracking_code);
CREATE INDEX IF NOT EXISTS idx_letters_status ON letters(status);
CREATE INDEX IF NOT EXISTS idx_letters_risk ON letters(risk_level);
CREATE INDEX IF NOT EXISTS idx_letters_created ON letters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, category);

-- ============================================
-- SAMPLE DATA (optional)
-- ============================================
-- INSERT INTO articles (title, summary, content, category, status, ai_generated)
-- VALUES (
--   'Khi điểm thi không như mong đợi, em nên làm gì?',
--   'Áp lực điểm số là điều nhiều bạn gặp phải. Dưới đây là cách để vượt qua.',
--   '## Bình thường thôi, bạn nhé! ...',
--   'stress', 'published', false
-- );
