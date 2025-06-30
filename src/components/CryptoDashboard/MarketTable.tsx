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
        <div className={`${themeClasses.card} rounded-lg overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${themeClasses.background} border-b ${themeClasses.border}`}>
                        <tr>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                                <span className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                                    <span>Rank</span>
                                </span>
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Name</th>
                            <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">Price</th>
                            <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">24h Change</th>
                            <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">Market Cap</th>
                            <th className="hidden lg:table-cell px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">Volume (24h)</th>
                            <th className="hidden xl:table-cell px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">Circulating Supply</th>
                            <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium">Last 7 Days</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {coins.map((coin) => (
                            <tr key={coin.symbol} className={`${themeClasses.cardHover} transition-colors duration-150 cursor-pointer`}>
                                <td className="px-2 sm:px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite(coin.symbol);
                                            }}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-3 w-3 sm:h-4 sm:w-4 ${favorites.includes(coin.symbol)
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-gray-400'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-xs sm:text-sm">{coin.rank}</span>
                                    </div>
                                </td>
                                <td className="px-2 sm:px-4 py-4">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={coin.image || '/placeholder.png'}
                                                alt={coin.name}
                                                width={20}
                                                height={20}
                                                className="rounded-full"
                                            />
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                <span className="text-xs sm:text-sm font-medium">{coin.name}</span>
                                                <span className={`text-xs ${themeClasses.secondaryText}`}>{coin.symbol}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-xs sm:text-sm font-medium">${coin.price}</span>
                                    </Link>
                                </td>
                                <td className="hidden sm:table-cell px-2 sm:px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className={`text-xs sm:text-sm ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {parseFloat(coin.priceChangePercent) >= 0 ? '+' : ''}{coin.priceChangePercent}%
                                        </span>
                                    </Link>
                                </td>
                                <td className="hidden md:table-cell px-2 sm:px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-xs sm:text-sm">${coin.marketCap}</span>
                                    </Link>
                                </td>
                                <td className="hidden lg:table-cell px-2 sm:px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-xs sm:text-sm">${coin.volume24h}</span>
                                    </Link>
                                </td>
                                <td className="hidden xl:table-cell px-2 sm:px-4 py-4 text-right">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        <span className="text-xs sm:text-sm">{coin.circulatingSupply}</span>
                                    </Link>
                                </td>
                                <td className="px-2 sm:px-4 py-4">
                                    <Link href={`/crypto/${coin.symbol.toLowerCase()}`} className="block">
                                        {coin.sparkline_in_7d?.price && (
                                            <div className="h-[30px] w-[120px] sm:h-[40px] sm:w-[160px]">
                                                <Sparkline
                                                    data={coin.sparkline_in_7d.price}
                                                    color={parseFloat(coin.priceChangePercent) >= 0 ? '#22c55e' : '#ef4444'}
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