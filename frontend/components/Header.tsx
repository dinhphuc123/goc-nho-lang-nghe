'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Download, Heart } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
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

                {/* CTA + Hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div style={{
                    position: 'absolute', top: 'var(--nav-height)', left: 0, right: 0,
                    background: 'white',
                    borderBottom: '1px solid #eee',
                    padding: '12px 0',
                    boxShadow: 'var(--shadow-md)',
                    animation: 'fadeIn 0.2s ease',
                }}>
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'block',
                                padding: '10px 24px',
                                fontSize: '15px',
                                fontWeight: pathname === item.href ? 600 : 400,
                                color: pathname === item.href ? 'var(--color-primary)' : '#444',
                                background: pathname === item.href ? '#f5f5f8' : 'transparent',
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}

                </div>
            )}
        </header>
    );
}
