import { BarChart2, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingCoin {
    symbol: string;
    name: string;
    price: string;
    priceChangePercent: string;
    image?: string;
    volume24h: string;
}

interface TrendingCoinsProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        secondaryText: string;
    };
    trendingCoins: TrendingCoin[];
    dexTrending: TrendingCoin[];
}

export default function TrendingCoins({ theme, themeClasses, trendingCoins, dexTrending }: TrendingCoinsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Gainers */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 p-4 sm:p-6">
                <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
                    <div className="absolute inset-0 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-500/10 rounded-xl p-2.5">
                                <TrendingUp className="h-6 w-6 text-green-400" />
                            </div>
                            <h2 className="font-semibold text-lg">Top Gainers</h2>
                        </div>
                        <Link href="/gainers" className={`text-sm ${themeClasses.secondaryText} hover:text-green-400 transition-colors duration-200`}>
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {trendingCoins.map((coin) => (
                            <div key={coin.symbol} className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-green-500/5 hover:scale-[1.02] cursor-pointer`}>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur group-hover:bg-green-500/30 transition-colors duration-300"></div>
                                        <Image
                                            src={coin.image || '/placeholder.png'}
                                            alt={coin.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full relative z-10"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-base">{coin.name}</span>
                                        <span className={`text-sm ${themeClasses.secondaryText}`}>{coin.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-base">${coin.price}</span>
                                    <span className="text-sm text-green-400">+{coin.priceChangePercent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Most Volume */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-violet-500/5 p-4 sm:p-6">
                <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
                    <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-500/10 rounded-xl p-2.5">
                                <BarChart2 className="h-6 w-6 text-blue-400" />
                            </div>
                            <h2 className="font-semibold text-lg">Most Volume</h2>
                        </div>
                        <Link href="/volume" className={`text-sm ${themeClasses.secondaryText} hover:text-blue-400 transition-colors duration-200`}>
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dexTrending.map((coin) => (
                            <div key={coin.symbol} className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-blue-500/5 hover:scale-[1.02] cursor-pointer`}>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur group-hover:bg-blue-500/30 transition-colors duration-300"></div>
                                        <Image
                                            src={coin.image || '/placeholder.png'}
                                            alt={coin.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full relative z-10"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-base">{coin.name}</span>
                                        <span className={`text-sm ${themeClasses.secondaryText}`}>{coin.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-base">${coin.volume24h}</span>
                                    <span className={`text-sm ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {parseFloat(coin.priceChangePercent) >= 0 ? '+' : ''}{coin.priceChangePercent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 