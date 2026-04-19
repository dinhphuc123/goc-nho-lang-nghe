'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
            setError('Email hoặc mật khẩu không đúng.');
        } else {
            router.push('/admin');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f8', padding: 24 }}>
            <div className="card animate-fade-in" style={{ maxWidth: 400, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <Heart size={22} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 4 }}>Đăng nhập Admin</h1>
                    <p style={{ fontSize: 13, color: '#888' }}>Góc Nhỏ Lắng Nghe — Quản trị viên</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            placeholder="email@truong.edu.vn"
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Mật khẩu</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                    </div>
                    {error && <p style={{ color: '#c62828', fontSize: 13 }}>{error}</p>}
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
