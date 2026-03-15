'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/mentorship', label: 'Mentorship', icon: '🤝' },
    { href: '/profile', label: 'My Profile', icon: '👤' },
];

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
            role="banner"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group"
                    aria-label="SilverTech Home"
                    onClick={closeMobileMenu}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-blue-300/50 transition-shadow duration-300">
                        <span className="text-lg" aria-hidden="true">💡</span>
                    </div>
                    <span className="text-xl font-extrabold font-display bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                        SilverTech
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav aria-label="Main navigation" className="hidden md:block">
                    {!isLoading && user ? (
                        <ul className="flex items-center gap-1 list-none">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={[
                                            'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                                            pathname === link.href
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                                        ].join(' ')}
                                        aria-current={pathname === link.href ? 'page' : undefined}
                                    >
                                        <span aria-hidden="true">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="ml-2">
                                <button
                                    onClick={logout}
                                    aria-label="Log out of SilverTech"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                >
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    ) : !isLoading ? (
                        <ul className="flex items-center gap-2 list-none">
                            <li>
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                                >
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/register">
                                    <Button size="sm">Get Started →</Button>
                                </Link>
                            </li>
                        </ul>
                    ) : null}
                </nav>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-sm px-4 pt-2 pb-4 space-y-1 sm:px-3">
                    {!isLoading && user ? (
                        <ul className="flex flex-col gap-2 list-none">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={closeMobileMenu}
                                        className={[
                                            'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center gap-2',
                                            pathname === link.href
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                                        ].join(' ')}
                                        aria-current={pathname === link.href ? 'page' : undefined}
                                    >
                                        <span aria-hidden="true">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <button
                                    onClick={() => {
                                        closeMobileMenu();
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                                >
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    ) : !isLoading ? (
                        <ul className="flex flex-col gap-2 list-none">
                            <li>
                                <Link
                                    href="/auth/login"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 text-center border border-slate-200"
                                >
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/register" onClick={closeMobileMenu}>
                                    <Button className="w-full justify-center">Get Started →</Button>
                                </Link>
                            </li>
                        </ul>
                    ) : null}
                </div>
            )}
        </header>
    );
}
