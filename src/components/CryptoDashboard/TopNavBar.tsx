import { Briefcase, Search, Star } from 'lucide-react';
import Link from 'next/link';

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
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.background} border-b ${themeClasses.border}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left section */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/images/logo.svg" alt="Logo" className="h-8 w-8" />
                            <span className="font-bold text-xl">NeuroCap</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/cryptocurrencies" className={`${themeClasses.text} hover:text-indigo-500`}>
                                Cryptocurrencies
                            </Link>
                            <Link href="/exchanges" className={`${themeClasses.text} hover:text-indigo-500`}>
                                Exchanges
                            </Link>
                            <Link href="/community" className={`${themeClasses.text} hover:text-indigo-500`}>
                                Community
                            </Link>
                            <Link href="/products" className={`${themeClasses.text} hover:text-indigo-500`}>
                                Products
                            </Link>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.secondaryText} w-4 h-4`} />
                            <input
                                type="text"
                                placeholder="Search"
                                className={`w-48 pl-10 pr-4 py-1.5 text-sm ${themeClasses.input} rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                            />
                        </div>
                        <button className={`${themeClasses.button} ${themeClasses.buttonText} px-4 py-1.5 rounded-lg text-sm flex items-center space-x-2`}>
                            <Briefcase className="w-4 h-4" />
                            <span>Portfolio</span>
                        </button>
                        <button className={`${themeClasses.button} ${themeClasses.buttonText} px-4 py-1.5 rounded-lg text-sm flex items-center space-x-2`}>
                            <Star className="w-4 h-4" />
                            <span>Watchlist</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 