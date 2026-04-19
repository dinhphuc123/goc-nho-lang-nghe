import Link from 'next/link';
import { Heart, Shield, Phone, Users } from 'lucide-react';

export default function GioiThieuPage() {
    return (
        <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px 80px' }}>
            <div className="animate-fade-in">
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 12 }}>
                    Về Góc Nhỏ Lắng Nghe
                </h1>
                <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 40 }}>
                    Một dự án nhỏ nhưng chứa đựng tâm huyết lớn — dành cho học sinh TRƯỜNG PHỔ THÔNG DÂN TỘC NỘI TRÚ, PHƯỜNG HÀM THẮNG, LÂM ĐỒNG.
                </p>

                {/* Why */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: 16 }}>Tại sao có Góc Nhỏ?</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        Nhiều học sinh không dám bước vào phòng tư vấn tâm lý vì sợ bị nhìn thấy, sợ bị đánh giá,
                        hoặc sợ bị trả thù khi báo cáo bạo lực. Góc Nhỏ ra đời để phá vỡ rào cản đó —
                        tạo ra một không gian <strong>ẩn danh hoàn toàn, an toàn tuyệt đối</strong>,
                        luôn sẵn sàng 24/7.
                    </p>
                </div>

                {/* Principles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: <Shield size={24} />, title: 'Bảo mật tuyệt đối', desc: 'Không lưu IP, không theo dõi danh tính. Ẩn danh là lựa chọn mặc định.' },
                        { icon: <Heart size={24} />, title: 'Không phán xét', desc: 'Mọi vấn đề đều xứng đáng được lắng nghe, dù lớn hay nhỏ.' },
                        { icon: <Phone size={24} />, title: 'Kết nối người thật', desc: 'AI hỗ trợ vòng ngoài; các tình huống nghiêm trọng sẽ đến tay thầy cô ngay.' },
                        { icon: <Users size={24} />, title: 'Cho cả gia đình', desc: 'Góc Phụ Huynh giúp cha mẹ đồng hành cùng con tốt hơn.' },
                    ].map(p => (
                        <div key={p.title} className="card" style={{ background: '#f8f9fa' }}>
                            <div style={{ color: 'var(--color-primary)', marginBottom: 10 }}>{p.icon}</div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: 6 }}>{p.title}</h3>
                            <p style={{ fontSize: 13.5, color: '#666', lineHeight: 1.6 }}>{p.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Emergency */}
                <div style={{ background: '#ffebee', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', marginBottom: 32 }}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>📞 Cần hỗ trợ khẩn cấp?</p>
                    <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
                        Tổng đài Quốc gia Bảo vệ Trẻ em — hoạt động 24/7, hoàn toàn miễn phí
                    </p>
                    <a href="tel:111" className="btn btn-danger">Gọi ngay 111</a>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href="/" className="btn btn-primary" style={{ color: 'white' }}>← Về trang chủ</Link>
                </div>

                <blockquote style={{
                    marginTop: 48, borderLeft: '3px solid var(--color-primary)',
                    paddingLeft: 20, color: '#555', fontStyle: 'italic', lineHeight: 1.8,
                }}>
                    &ldquo;Mỗi thư gửi đến là một học sinh đang dũng cảm lên tiếng — hệ thống này là cách chúng ta đáp lại sự dũng cảm đó.&rdquo;
                </blockquote>
            </div>

            <style>{`@media (max-width: 640px) { .animate-fade-in > div[style*="grid"] { grid-template-columns: 1fr !important; } }`}</style>
        </div>
    );
}
