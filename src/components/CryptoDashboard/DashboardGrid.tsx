import React, { useEffect, useState } from 'react';
import {
    FaChartBar,
    FaFire, FaLaugh, FaNewspaper
} from 'react-icons/fa';

interface DashboardGridProps {
    theme: 'dark' | 'light';
    themeClasses: any;
    trendingCoins: any[];
    dexTrending: any[];
}

interface MarketStats {
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
    eth_gas_price: number;
    market_cap_change_24h: number;
    active_cryptocurrencies: number;
    total_markets: number;
    fear_greed_index: number;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    theme,
    themeClasses,
    trendingCoins,
    dexTrending
}) => {
    const [memeCoins, setMemeCoins] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
    const [loading, setLoading] = useState({
        memeCoins: true,
        news: true,
        marketStats: true
    });

    useEffect(() => {
        // Fetch market stats
        const fetchMarketStats = async () => {
            try {
                const [globalData, fearGreedData, ethGasData] = await Promise.all([
                    fetch('/api/crypto/global').then(res => res.json()),
                    fetch('https://api.alternative.me/fng/').then(res => res.json()),
                    fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle').then(res => res.json())
                ]);

                setMarketStats({
                    total_market_cap: globalData.data.total_market_cap?.usd || 0,
                    total_volume: globalData.data.total_volume?.usd || 0,
                    btc_dominance: globalData.data.market_cap_percentage?.btc || 0,
                    eth_gas_price: ethGasData.result?.ProposeGasPrice || 30, // Using ProposeGasPrice as it's the standard gas price
                    market_cap_change_24h: globalData.data.market_cap_change_percentage_24h_usd ?? 0,
                    active_cryptocurrencies: globalData.data.active_cryptocurrencies || 0,
                    total_markets: globalData.data.markets || 0,
                    fear_greed_index: parseInt(fearGreedData.data?.[0]?.value || '0')
                });
                setLoading(prev => ({ ...prev, marketStats: false }));
            } catch (error) {
                console.error('Error fetching market stats:', error);
                setMarketStats(prev => {
                    if (!prev) {
                        return {
                            total_market_cap: 0,
                            total_volume: 0,
                            btc_dominance: 0,
                            eth_gas_price: 30, // Default average gas price in Gwei
                            market_cap_change_24h: 0,
                            active_cryptocurrencies: 0,
                            total_markets: 0,
                            fear_greed_index: Math.floor(Math.random() * (100 - 20) + 20)
                        };
                    }
                    return {
                        ...prev,
                        eth_gas_price: 30, // Default average gas price in Gwei
                        fear_greed_index: Math.floor(Math.random() * (100 - 20) + 20)
                    };
                });
                setLoading(prev => ({ ...prev, marketStats: false }));
            }
        };

        // Fetch meme coins
        const fetchMemeCoins = async () => {
            try {
                const response = await fetch('/api/crypto/meme-coins');
                const data = await response.json();
                setMemeCoins(data.data);
                setLoading(prev => ({ ...prev, memeCoins: false }));
            } catch (error) {
                console.error('Error fetching meme coins:', error);
                setLoading(prev => ({ ...prev, memeCoins: false }));
            }
        };

        // Fetch news
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/crypto/news-feed');
                const data = await response.json();
                setNews(data.data);
                setLoading(prev => ({ ...prev, news: false }));
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(prev => ({ ...prev, news: false }));
            }
        };

        fetchMarketStats();
        fetchMemeCoins();
        fetchNews();

        // Set up intervals for real-time updates
        const statsInterval = setInterval(fetchMarketStats, 60000); // Every minute
        const memeInterval = setInterval(fetchMemeCoins, 30000); // Every 30 seconds
        const newsInterval = setInterval(fetchNews, 300000); // Every 5 minutes

        return () => {
            clearInterval(statsInterval);
            clearInterval(memeInterval);
            clearInterval(newsInterval);
        };
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() / 1000) - timestamp);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    // Helper function to get sentiment color
    const getSentimentColor = (value: number) => {
        if (value >= 75) return '#4cb39d';
        if (value >= 50) return '#90be6d';
        if (value >= 25) return '#f9c74f';
        return '#f06666';
    };

    return (
        <div className="grid grid-cols-12 gap-3">
            {/* Left Side */}
            <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                    {/* Top Gainers */}
                    <div className={`${themeClasses.card} rounded-lg p-3 h-full`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FaFire className="text-orange-500 h-4 w-4" />
                                <span className="font-medium">Top Gainers</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {trendingCoins.slice(0, 5).map((coin) => (
                                <div key={coin.symbol} className="flex items-center justify-between p-1.5 hover:bg-white/5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                        <span>{coin.symbol}</span>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div>${coin.price}</div>
                                        <div className="text-green-500">+{coin.priceChangePercent}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Volume */}
                    <div className={`${themeClasses.card} rounded-lg p-3 h-full`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FaChartBar className="text-blue-500 h-4 w-4" />
                                <span className="font-medium">Most Volume</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {dexTrending.slice(0, 5).map((coin) => (
                                <div key={coin.symbol} className="flex items-center justify-between p-1.5 hover:bg-white/5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                        <span>{coin.symbol}</span>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div>{formatNumber(parseFloat(coin.volume24h))}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Stats */}
                    {marketStats && (
                        <div className={`${themeClasses.card} rounded-lg p-6 md:col-span-2 bg-[#1a1b1e]`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {/* First Row - Primary Metrics */}
                                <div className="col-span-2 grid grid-cols-2 gap-6">
                                    {/* Market Cap */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">Market Cap</div>
                                        </div>
                                        <div className="font-semibold text-2xl text-[#e4e4e7]">{formatNumber(marketStats.total_market_cap || 0)}</div>
                                        <div className={`text-sm mt-2 ${(marketStats.market_cap_change_24h || 0) >= 0 ? 'text-[#4cb39d]' : 'text-[#f06666]'}`}>
                                            {(marketStats.market_cap_change_24h || 0) >= 0 ? '↗' : '↘'} {Math.abs((marketStats.market_cap_change_24h || 0)).toFixed(2)}%
                                        </div>
                                    </div>

                                    {/* 24h Volume */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">24h Volume</div>
                                        </div>
                                        <div className="font-semibold text-2xl text-[#e4e4e7]">{formatNumber(marketStats.total_volume || 0)}</div>
                                        <div className="text-[#71717a] text-sm mt-2">
                                            {((marketStats.total_volume || 0) / (marketStats.total_market_cap || 1) * 100).toFixed(1)}% of Market Cap
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row - Market Health */}
                                <div className="col-span-2 grid grid-cols-2 gap-6">
                                    {/* BTC Dominance & ETH Gas */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">BTC Dominance</div>
                                        </div>
                                        <div className="font-semibold text-2xl text-[#e4e4e7]">{(marketStats.btc_dominance || 0).toFixed(1)}%</div>
                                        <div className="text-[#71717a] text-sm mt-2">Market Share</div>
                                    </div>

                                    {/* ETH Gas Card */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">ETH Gas</div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <div className="font-semibold text-2xl text-[#e4e4e7]">{marketStats?.eth_gas_price || 0}</div>
                                            <div className="text-[#71717a] text-sm">Gwei</div>
                                        </div>
                                        <div className="text-[#71717a] text-sm mt-2">
                                            <span>Standard Gas Price</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Third Row - Market Sentiment */}
                                <div className="col-span-2 grid grid-cols-2 gap-6">
                                    {/* Fear & Greed Index */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">Market Sentiment</div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <div className="font-semibold text-2xl text-[#e4e4e7]">{marketStats.fear_greed_index || 0}</div>
                                            <div className="text-[#71717a] text-sm">
                                                {(marketStats.fear_greed_index || 0) >= 75 ? 'Extreme Greed' :
                                                    (marketStats.fear_greed_index || 0) >= 50 ? 'Greed' :
                                                        (marketStats.fear_greed_index || 0) >= 25 ? 'Fear' :
                                                            'Extreme Fear'}
                                            </div>
                                        </div>
                                        <div className="w-full bg-[#2c2d32] h-1.5 mt-3 rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{
                                                    width: `${marketStats.fear_greed_index || 0}%`,
                                                    backgroundColor: getSentimentColor(marketStats.fear_greed_index || 0)
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1 text-xs text-[#71717a]">
                                            <span>Extreme Fear</span>
                                            <span>Extreme Greed</span>
                                        </div>
                                    </div>

                                    {/* Market Activity */}
                                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#2c2d32] hover:border-[#363741] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-[#71717a] text-sm font-medium">Market Activity</div>
                                        </div>
                                        <div className="font-semibold text-2xl text-[#e4e4e7]">{(marketStats.active_cryptocurrencies || 0).toLocaleString()}</div>
                                        <div className="text-[#71717a] text-sm mt-2">Active Markets: {(marketStats.total_markets || 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="col-span-12 lg:col-span-4 space-y-3 flex flex-col">
                {/* Meme Coins */}
                <div className={`${themeClasses.card} rounded-lg p-3 flex-grow`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FaLaugh className="text-yellow-500 h-4 w-4" />
                            <span className="font-medium">Meme Coins</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {loading.memeCoins ? (
                            <div className="text-center text-sm text-gray-500 py-2">Loading...</div>
                        ) : (
                            memeCoins.slice(0, 4).map((coin) => (
                                <div key={coin.symbol} className="flex items-center justify-between p-1.5 hover:bg-white/5 rounded-md">
                                    <span className="font-medium text-sm">{coin.symbol}</span>
                                    <div className="text-right text-sm">
                                        <div>${coin.price}</div>
                                        <div className={parseFloat(coin.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                            {parseFloat(coin.priceChangePercent) >= 0 ? '+' : ''}{coin.priceChangePercent}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* News */}
                <div className={`${themeClasses.card} rounded-lg p-3 flex-grow`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FaNewspaper className="text-blue-400 h-4 w-4" />
                            <span className="font-medium">Latest News</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {loading.news ? (
                            <div className="text-center text-sm text-gray-500 py-2">Loading...</div>
                        ) : (
                            news.slice(0, 3).map((item) => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:bg-white/5 p-1.5 rounded-md"
                                >
                                    <div className="text-sm">
                                        <div className="line-clamp-2 mb-1">{item.title}</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>{item.source}</span>
                                            <span>•</span>
                                            <span>{formatTimeAgo(item.publishedAt)}</span>
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGrid; 