import { useAuth } from '@/lib/AuthContext/auth-context';
import { Activity, BarChart2, ChevronDown, Home, LogOut, MessageCircle, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const menuItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Markets', icon: Activity, href: '/crypto' },
        { name: 'Chat', icon: MessageCircle, href: '/chat' },
        { name: 'Analytics', icon: BarChart2, href: '/crypto/analytics' },
    ];

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.card} border-b ${themeClasses.border}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="NeuroCap" className="h-8 w-8" />
                            <span className="text-xl font-bold">NeuroCap</span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-indigo-600 text-white'
                                            : `${themeClasses.text} hover:bg-indigo-600 hover:text-white`
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Search and User */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className={`hidden md:flex items-center ${themeClasses.input} rounded-lg px-3 py-1.5`}>
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`ml-2 bg-transparent outline-none ${themeClasses.text} placeholder-gray-400`}
                            />
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`flex items-center space-x-2 ${themeClasses.card} rounded-lg px-3 py-2 ${themeClasses.cardHover}`}
                            >
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || 'User avatar'}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0) || 'G'}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-400">
                                        {user?.type === 'google' ? 'Google User' : 'Pro Member'}
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div
                                    className={`absolute right-0 mt-2 w-48 rounded-lg ${themeClasses.card} border ${themeClasses.border
                                        } shadow-lg py-1`}
                                >
                                    <Link
                                        href="/profile"
                                        className={`flex items-center space-x-2 px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.cardHover}`}
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className={`flex items-center space-x-2 px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.cardHover}`}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => logout()}
                                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-500 ${themeClasses.cardHover}`}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 