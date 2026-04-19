import Link from 'next/link';
import { Bot, Mail, Search, Heart, BookOpen, Users, PhoneCall, Shield } from 'lucide-react';

const features = [
  {
    icon: <Bot size={32} />,
    title: 'Phòng Tư Vấn AI',
    desc: 'Trò chuyện an toàn, riêng tư về áp lực học tập, bạn bè hay cảm xúc cùng Thầy Phúc.',
    href: '/tu-van-ai',
    bg: '#1a1a2e',
    textColor: '#ffffff',
    btnBg: 'rgba(255,255,255,0.15)',
    featured: true,
  },
  {
    icon: <Mail size={32} />,
    title: 'Gửi Thư Hỗ Trợ',
    desc: 'Báo cáo ẩn danh các vấn đề nghiêm trọng để nhà trường kịp thời can thiệp.',
    href: '/gui-thu',
    bg: '#ffffff',
    textColor: '#1a1a2e',
    btnBg: '#1a1a2e',
  },
  {
    icon: <Search size={32} />,
    title: 'Tra Cứu Báo Cáo',
    desc: 'Nhập mã theo dõi để xem trạng thái xử lý thư hỗ trợ đã gửi.',
    href: '/tra-cuu',
    bg: '#ffffff',
    textColor: '#1a1a2e',
    btnBg: '#1a1a2e',
  },
  {
    icon: <Heart size={32} />,
    title: 'Hộp Thư Biết Ơn',
    desc: 'Gửi lời cảm ơn ẩn danh hoặc có tên để lan tỏa năng lượng tích cực.',
    href: '/biet-on',
    bg: '#fce4ec',
    textColor: '#1a1a2e',
    btnBg: '#e91e8c',
  },
  {
    icon: <BookOpen size={32} />,
    title: 'Cẩm Nang Tâm Lý',
    desc: 'Đọc bài viết, mẹo vặt giúp cân bằng cảm xúc và quản lý thời gian.',
    href: '/cam-nang',
    bg: '#e8f5e9',
    textColor: '#1a1a2e',
    btnBg: '#388e3c',
  },
  {
    icon: <Users size={32} />,
    title: 'Góc Phụ Huynh',
    desc: 'Không gian cho cha mẹ tìm lời khuyên, thấu hiểu tâm lý tuổi dậy thì.',
    href: '/phu-huynh',
    bg: '#e3f2fd',
    textColor: '#1a1a2e',
    btnBg: '#1976d2',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 50%, #1a1a3e 100%)',
        color: 'white',
        padding: '80px 0 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(233,30,140,0.1)',
        }} />

        <div className="container-app" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            {/* Text */}
            <div className="animate-fade-in">
              <div style={{
                display: 'inline-block', marginBottom: 16,
                padding: '6px 16px', borderRadius: 999,
                background: 'rgba(255,255,255,0.1)',
                fontSize: 13, fontWeight: 500, letterSpacing: '0.05em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
              }}>
                🏫 TRƯỜNG PHỔ THÔNG DÂN TỘC NỘI TRÚ, PHƯỜNG HÀM THẮNG, LÂM ĐỒNG
              </div>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
              }}>
                Góc Nhỏ<br />
                <em style={{ color: '#fce4ec', fontStyle: 'italic' }}>Lắng Nghe</em>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 480,
              }}>
                Không gian an toàn, kín đáo và ẩn danh để em chia sẻ những điều khó nói nhất.
                Góc Nhỏ luôn ở đây, <strong style={{ color: '#fce4ec' }}>24/7</strong>.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/tu-van-ai" className="btn" style={{
                  background: 'white', color: '#1a1a2e',
                  padding: '14px 28px', fontSize: 15,
                }}>
                  <Bot size={18} /> Trò chuyện với Thầy Phúc
                </Link>
                <Link href="/gui-thu" className="btn btn-outline" style={{
                  borderColor: 'rgba(255,255,255,0.5)', color: 'white', padding: '14px 24px',
                }}>
                  <Mail size={18} /> Gửi thư ẩn danh
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
                {[
                  { icon: <Shield size={14} />, label: 'Hoàn toàn ẩn danh' },
                  { icon: <PhoneCall size={14} />, label: 'Đường dây 111 miễn phí' },
                  { icon: <Heart size={14} />, label: 'Không phán xét' },
                ].map(({ icon, label }) => (
                  <span key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, color: 'rgba(255,255,255,0.7)',
                  }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration placeholder */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 340,
            }} className="hidden md:flex">
              <div style={{
                width: 280, height: 280, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 80,
              }}>
                💙
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 12 }}>
              Em cần điều gì hôm nay?
            </h2>
            <p style={{ color: '#666', fontSize: 16 }}>
              Chọn một tính năng phù hợp với em nhé
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }} className="grid-features">
            {features.map((f) => (
              <div key={f.href} className="card animate-fade-in" style={{
                background: f.bg,
                color: f.textColor,
                display: 'flex',
                flexDirection: 'column',
                border: f.featured ? 'none' : '1px solid #eee',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {f.featured && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '2px 10px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                  }}>
                    ⭐ Nổi bật
                  </div>
                )}
                <div style={{
                  marginBottom: 16,
                  opacity: f.featured ? 0.9 : 0.7,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                  fontWeight: 700, marginBottom: 10,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  opacity: f.featured ? 0.85 : 0.7,
                  flex: 1, marginBottom: 20,
                }}>
                  {f.desc}
                </p>
                <Link href={f.href} className="btn" style={{
                  background: f.btnBg,
                  color: f.featured ? 'rgba(255,255,255,0.9)' : 'white',
                  fontSize: 13, padding: '10px 20px', alignSelf: 'flex-start',
                }}>
                  Vào ngay →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section style={{
        background: '#fff8e1',
        borderTop: '1px solid #ffe082',
        borderBottom: '1px solid #ffe082',
        padding: '20px 0',
      }}>
        <div className="container-app" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 24 }}>📞</span>
          <div>
            <strong style={{ fontSize: 15 }}>Cần hỗ trợ khẩn cấp?</strong>
            <span style={{ marginLeft: 8, color: '#555', fontSize: 14 }}>
              Gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em
            </span>
          </div>
          <a href="tel:111" className="btn" style={{
            background: 'var(--color-danger-btn)', color: 'white',
            padding: '8px 20px', fontSize: 14, marginLeft: 'auto',
          }}>
            📞 111 — Miễn phí 24/7
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
        <div className="container-app">
          <p>💙 Góc Nhỏ Lắng Nghe — TRƯỜNG PHỔ THÔNG DÂN TỘC NỘI TRÚ, PHƯỜNG HÀM THẮNG, LÂM ĐỒNG</p>
          <p style={{ marginTop: 6 }}>
            &quot;Mỗi thư gửi đến là một học sinh đang dũng cảm lên tiếng.&quot;
          </p>
        </div>
      </footer>

      {/* Responsive grid mobile */}
      <style>{`
        @media (max-width: 768px) {
          .grid-features { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-features { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
