'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-close khi chuyển trang (Mobile-first UX)
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Khoá scroll body khi menu đang mở
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <>
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #eee',
                height: 'var(--nav-height)',
            }}>
                <div className="container-app h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'var(--color-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Heart size={18} color="white" fill="white" />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-serif)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'var(--color-primary)',
                            lineHeight: 1.2,
                        }}>
                            Góc Nhỏ<br />
                            <span style={{ fontSize: '0.75rem', fontWeight: 400, fontStyle: 'italic' }}>Lắng Nghe</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '13.5px',
                                fontWeight: pathname === item.href ? 600 : 400,
                                color: pathname === item.href ? 'var(--color-primary)' : '#555',
                                background: pathname === item.href ? '#f0f0f5' : 'transparent',
                                transition: 'all 0.15s',
                            }}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Hamburger */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                            className="md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                            aria-expanded={mobileOpen}
                        >
                            <span style={{
                                display: 'inline-block',
                                transition: 'transform 0.25s ease',
                                transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}>
                                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu — Slide Down Animation */}
                <div style={{
                    position: 'absolute', top: 'var(--nav-height)', left: 0, right: 0,
                    background: 'white',
                    borderBottom: mobileOpen ? '1px solid #eee' : 'none',
                    boxShadow: mobileOpen ? 'var(--shadow-md)' : 'none',
                    maxHeight: mobileOpen ? '400px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                    zIndex: 51,
                }}>
                    <div style={{ padding: '8px 0 12px' }}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: pathname === item.href ? 600 : 400,
                                    color: pathname === item.href ? 'var(--color-primary)' : '#444',
                                    background: pathname === item.href ? '#f5f5f8' : 'transparent',
                                    borderLeft: pathname === item.href
                                        ? '3px solid var(--color-primary)'
                                        : '3px solid transparent',
                                    transition: 'background 0.15s',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Backdrop — bấm ra ngoài để tắt menu */}
            <div
                className="md:hidden"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
                style={{
                    position: 'fixed', inset: 0,
                    zIndex: 40,
                    background: 'rgba(0,0,0,0.25)',
                    backdropFilter: 'blur(2px)',
                    opacity: mobileOpen ? 1 : 0,
                    pointerEvents: mobileOpen ? 'auto' : 'none',
                    transition: 'opacity 0.25s ease',
                }}
            />
        </>
    );
}
