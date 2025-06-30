'use client';

import MarketStatsBar from '@/components/CryptoDashboard/MarketStatsBar';
import MarketTable from '@/components/CryptoDashboard/MarketTable';
import TrendingCoins from '@/components/CryptoDashboard/TrendingCoins';
import TopNavBar from '@/components/TopNavBar/TopNavBar';
import { useEffect, useState } from 'react';

interface CryptoData {
    symbol: string;
    name: string;
    price: string;
    priceChangePercent: string;
    volume24h: string;
    marketCap: string;
    circulatingSupply: string;
    rank: number;
    coinId?: string;
    image?: string;
    sparkline_in_7d?: {
        price: number[];
    };
}

interface MarketStats {
    cryptos: number;
    exchanges: number;
    marketCap: number;
    volume24h: number;
    dominance: {
        btc: number;
        eth: number;
    };
    btcPrice: number;
    ethPrice: number;
    btcChange24h: number;
    ethChange24h: number;
}

export default function CryptoDashboard() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [marketStats, setMarketStats] = useState<MarketStats>({
        cryptos: 0,
        exchanges: 1,
        marketCap: 0,
        volume24h: 0,
        dominance: {
            btc: 0,
            eth: 0
        },
        btcPrice: 0,
        ethPrice: 0,
        btcChange24h: 0,
        ethChange24h: 0
    });
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Theme classes
    const themeClasses = {
        background: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
        text: theme === 'dark' ? 'text-white' : 'text-gray-900',
        card: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
        cardHover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
        border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        button: theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600',
        buttonText: 'text-white',
        input: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300',
        secondaryText: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    };

    // Fetch market stats
    useEffect(() => {
        const fetchMarketStats = async () => {
            try {
                const response = await fetch('/api/crypto?action=market-stats');
                const data = await response.json();
                setMarketStats(data);
            } catch (error) {
                console.error('Error fetching market stats:', error);
            }
        };

        fetchMarketStats();
        const statsInterval = setInterval(fetchMarketStats, 30000); // Update every 30 seconds
        return () => clearInterval(statsInterval);
    }, []);

    const formatNumber = (num: number | string | undefined): string => {
        if (!num) return '0';
        const n = typeof num === 'string' ? parseFloat(num) : num;
        return n.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatPrice = (price: string | number): string => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (numPrice < 1) {
            return numPrice.toFixed(6);
        }
        return numPrice.toFixed(2);
    };

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch(`/api/crypto?action=tickers&page=${currentPage}&limit=20`);
                const result = await response.json();
                const formattedData = result.data.map((item: any) => ({
                    symbol: item.symbol,
                    name: item.name || item.symbol,
                    price: formatPrice(item.lastPrice),
                    priceChangePercent: item.priceChangePercent,
                    volume24h: formatNumber(item.quoteVolume),
                    marketCap: formatNumber(item.marketCap),
                    circulatingSupply: `${formatNumber(item.circulatingSupply)} ${item.symbol.replace('USDT', '')}`,
                    rank: item.rank,
                    coinId: item.symbol.toLowerCase(),
                    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
                    sparkline_in_7d: item.sparkline_in_7d
                }));
                setCryptoData(formattedData);
                setTotalPages(result.totalPages);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
                setIsLoading(false);
            }
        };

        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 10000);
        return () => clearInterval(interval);
    }, [currentPage]);

    const generateSparklineUrl = (symbol: string, isPositive: boolean): string => {
        // This is a placeholder function - you'll need to replace this with your actual sparkline data source
        const baseColor = isPositive ? '26,215,97' : '234,57,67';
        return `https://www.coingecko.com/coins/${symbol.toLowerCase()}/sparkline`;
    };

    const toggleFavorite = (symbol: string) => {
        setFavorites(prev =>
            prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol]
        );
    };

    // Get trending coins (top gainers)
    const trendingCoins = [...cryptoData]
        .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
        .slice(0, 3);

    // Get DexScan trending (most volume)
    const dexTrending = [...cryptoData]
        .sort((a, b) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
        .slice(0, 3);

    return (
        <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
            <TopNavBar theme={theme} themeClasses={themeClasses} />

            <div className="pt-16 w-full overflow-x-hidden">
                <MarketStatsBar
                    theme={theme}
                    themeClasses={themeClasses}
                    stats={marketStats}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="space-y-6">
                        <TrendingCoins
                            theme={theme}
                            themeClasses={themeClasses}
                            trendingCoins={trendingCoins}
                            dexTrending={dexTrending}
                        />

                        {isLoading ? (
                            <div className="flex items-center justify-center h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <MarketTable
                                    theme={theme}
                                    themeClasses={themeClasses}
                                    coins={cryptoData}
                                    favorites={favorites}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === 1
                                    ? `${themeClasses.card} ${themeClasses.secondaryText} cursor-not-allowed`
                                    : `${themeClasses.button} ${themeClasses.buttonText}`
                                    }`}
                            >
                                Previous
                            </button>
                            <span className={`px-3 sm:px-4 py-2 ${themeClasses.card} rounded-lg text-sm sm:text-base`}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === totalPages
                                    ? `${themeClasses.card} ${themeClasses.secondaryText} cursor-not-allowed`
                                    : `${themeClasses.button} ${themeClasses.buttonText}`
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 