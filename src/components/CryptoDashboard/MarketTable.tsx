import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sparkline from './Sparkline';

interface MarketTableProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        secondaryText: string;
    };
    coins: {
        symbol: string;
        name: string;
        price: string;
        priceChangePercent: string;
        volume24h: string;
        marketCap: string;
        circulatingSupply: string;
        rank: number;
        image?: string;
        sparkline_in_7d?: {
            price: number[];
        };
    }[];
    favorites: string[];
    onToggleFavorite: (symbol: string) => void;
}

export default function MarketTable({ theme, themeClasses, coins, favorites, onToggleFavorite }: MarketTableProps) {
    return (
        <div className={`${themeClasses.card} rounded-xl overflow-hidden border border-zinc-800`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="px-4 py-4 text-left">
                                <span className="flex items-center space-x-2">
                                    <Star className="h-4 w-4 text-white/40" />
                                    <span className="font-medium text-sm text-white/60">Rank</span>
                                </span>
                            </th>
                            <th className="px-4 py-4 text-left">
                                <span className="font-medium text-sm text-white/60">Name</span>
                            </th>
                            <th className="px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">Price</span>
                            </th>
                            <th className="hidden sm:table-cell px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">24h Change</span>
                            </th>
                            <th className="hidden md:table-cell px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">Market Cap</span>
                            </th>
                            <th className="hidden lg:table-cell px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">Volume (24h)</span>
                            </th>
                            <th className="hidden xl:table-cell px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">Circulating Supply</span>
                            </th>
                            <th className="px-4 py-4 text-right">
                                <span className="font-medium text-sm text-white/60">Last 7 Days</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {coins.map((coin) => (
                            <tr key={coin.symbol} className="transition-colors duration-150 hover:bg-white/[0.02]">
                                <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite(coin.symbol);
                                            }}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-4 w-4 ${favorites.includes(coin.symbol)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-zinc-600 hover:text-zinc-400'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-sm text-white/80">{coin.rank}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-white/10 rounded-full blur"></div>
                                                <Image
                                                    src={coin.image || '/placeholder.png'}
                                                    alt={coin.name}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full relative z-10"
                                                />
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                <span className="text-sm font-medium text-white">{coin.name}</span>
                                                <span className="text-xs text-zinc-400">{coin.symbol}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-sm font-medium text-white">${coin.price}</span>
                                    </Link>
                                </td>
                                <td className="hidden sm:table-cell px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className={`text-sm ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {parseFloat(coin.priceChangePercent) >= 0 ? '+' : ''}{coin.priceChangePercent}%
                                        </span>
                                    </Link>
                                </td>
                                <td className="hidden md:table-cell px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-sm text-white/80">${coin.marketCap}</span>
                                    </Link>
                                </td>
                                <td className="hidden lg:table-cell px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-sm text-white/80">${coin.volume24h}</span>
                                    </Link>
                                </td>
                                <td className="hidden xl:table-cell px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-sm text-white/80">{coin.circulatingSupply}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        {coin.sparkline_in_7d?.price && (
                                            <div className="h-[30px] w-[120px] sm:h-[40px] sm:w-[160px] ml-auto">
                                                <Sparkline
                                                    data={coin.sparkline_in_7d.price}
                                                    color={parseFloat(coin.priceChangePercent) >= 0 ? '#34d399' : '#f87171'}
                                                />
                                            </div>
                                        )}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 