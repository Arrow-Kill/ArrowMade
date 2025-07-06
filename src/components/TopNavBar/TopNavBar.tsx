'use client';

import { useAuth } from '@/lib/AuthContext/auth-context';
import { Activity, BarChart2, ChevronDown, Home, LogOut, MessageCircle, Search, Settings, User } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

// Add keyframes for gradient animation
const gradientAnimation = `
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;

// Add style tag to head
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = gradientAnimation;
    document.head.appendChild(style);
}

interface TopNavBarProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        button: string;
        buttonText: string;
        input: string;
        secondaryText: string;
    };
}

export default function TopNavBar({ theme, themeClasses }: TopNavBarProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const menuItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Markets', icon: Activity, href: '/markets' },
        { name: 'Analytics', icon: BarChart2, href: '/analytics', badge: 'AI' },
        ...(user ? [{ name: 'Chat', icon: MessageCircle, href: '/chat' }] : []),
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40">
            <div className="max-w-[90rem] mx-auto">
                <div className="flex items-center justify-between h-16 px-6">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-10">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 group"
                        >
                            <div className="relative mb-1">
                                <div className="absolute -inset-2 bg-white/5 rounded-lg blur-sm transition-all duration-300 group-hover:bg-white/10 group-hover:blur-md" />
                                <NextImage src="/img/logi.png" alt="NeuroCap" className="h-10 w-10 relative" width={64} height={64} />
                            </div>
                            <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                NeuroCap
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-white/10 rounded-lg" />
                                        )}
                                        <item.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                                            }`} />
                                        <span className="relative">
                                            {item.name}
                                            {item.badge && (
                                                <span className="absolute -top-2.5 -right-1 text-[10px] font-semibold">
                                                    <span className="relative">
                                                        <span className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-pink-600/20 blur-sm rounded-full animate-pulse" />
                                                        <span className="relative bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-[gradient_3s_ease-in-out_infinite]">
                                                            {item.badge}
                                                        </span>
                                                    </span>
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Search and User */}
                    <div className="flex items-center space-x-6">
                        {/* Search */}
                        <div className={`hidden md:flex items-center relative transition-all duration-200 ${searchFocused ? 'w-72' : 'w-56'
                            }`}>
                            <div className={`absolute inset-0 rounded-xl ${searchFocused
                                ? 'bg-zinc-900'
                                : 'bg-zinc-900/70'
                                }`} />
                            <div className="relative flex items-center w-full px-4 py-2">
                                <Search className={`h-5 w-5 transition-colors duration-200 ${searchFocused ? 'text-white' : 'text-zinc-400'
                                    }`} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="ml-3 bg-transparent focus:outline-none text-white placeholder-zinc-400 w-full text-[15px]"
                                />
                            </div>
                        </div>

                        {/* User Menu or Sign In Button */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-3 group"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-white/10 rounded-full blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:blur-md" />
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center relative ring-2 ring-white/10">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name || 'User avatar'}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-sm font-medium">
                                                    {user.name?.charAt(0) || 'G'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-[15px] font-medium text-white">{user.name || 'Guest'}</div>
                                        <div className="text-sm text-zinc-400">
                                            {user.type === 'google' ? 'Google User' : 'Pro Member'}
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 py-2">
                                        <div className="absolute inset-0 rounded-xl bg-zinc-900 shadow-xl ring-1 ring-white/10" />
                                        <div className="relative flex flex-col">
                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-3 px-4 py-3 text-[15px] text-zinc-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <User className="h-5 w-5" />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="flex items-center space-x-3 px-4 py-3 text-[15px] text-zinc-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <Settings className="h-5 w-5" />
                                                <span>Settings</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    router.push('/auth');
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-[15px] text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth"
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 