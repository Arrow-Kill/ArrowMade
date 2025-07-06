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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 border border-zinc-800">
                <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
                    <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/5 rounded-xl p-2.5">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="font-medium text-lg">Top Gainers</h2>
                        </div>
                        <Link href="/gainers" className={`text-sm ${themeClasses.secondaryText} hover:text-white transition-colors duration-200`}>
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {trendingCoins.map((coin) => (
                            <div key={coin.symbol} className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-zinc-700`}>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/10 rounded-full blur group-hover:bg-white/20 transition-colors duration-300"></div>
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
                                        <span className={themeClasses.secondaryText}>{coin.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-base">${coin.price}</span>
                                    <span className="text-sm text-emerald-400">+{coin.priceChangePercent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Most Volume */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 border border-zinc-800">
                <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
                    <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/5 rounded-xl p-2.5">
                                <BarChart2 className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="font-medium text-lg">Most Volume</h2>
                        </div>
                        <Link href="/volume" className={`text-sm ${themeClasses.secondaryText} hover:text-white transition-colors duration-200`}>
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dexTrending.map((coin) => (
                            <div key={coin.symbol} className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-zinc-700`}>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/10 rounded-full blur group-hover:bg-white/20 transition-colors duration-300"></div>
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
                                        <span className={themeClasses.secondaryText}>{coin.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-base">${coin.volume24h}</span>
                                    <span className={`text-sm ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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