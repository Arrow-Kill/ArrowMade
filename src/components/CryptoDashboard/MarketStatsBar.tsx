import { ArrowDownRight, ArrowUpRight, Coins, DollarSign, LineChart, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketStatsBarProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        secondaryText: string;
    };
}

interface MarketStats {
    marketCap: number;
    volume24h: number;
    cryptos: number;
    exchanges: number;
    dominance: {
        btc: number;
        eth: number;
    };
    btcPrice: number;
    ethPrice: number;
    btcChange24h: number;
    ethChange24h: number;
}

function formatNumber(num: number): string {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
}

export default function MarketStatsBar({ theme, themeClasses }: MarketStatsBarProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/crypto/global');
                if (!response.ok) {
                    throw new Error('Failed to fetch market data');
                }

                const result = await response.json();

                if (result.data) {
                    setStats({
                        marketCap: result.data.total_market_cap.usd,
                        volume24h: result.data.total_volume.usd,
                        cryptos: result.data.active_cryptocurrencies,
                        exchanges: result.data.markets,
                        btcPrice: result.data.total_market_cap.usd * (result.data.market_cap_percentage.btc / 100) /
                            (result.data.market_cap_percentage.btc * result.data.total_market_cap.btc / 100),
                        btcChange24h: result.data.market_cap_change_percentage_24h_usd,
                        ethPrice: result.data.total_market_cap.usd * (result.data.market_cap_percentage.eth / 100) /
                            (result.data.market_cap_percentage.eth * result.data.total_market_cap.eth / 100),
                        ethChange24h: result.data.market_cap_change_percentage_24h_usd,
                        dominance: {
                            btc: result.data.market_cap_percentage.btc,
                            eth: result.data.market_cap_percentage.eth
                        }
                    });
                }
            } catch (err) {
                console.error('Error fetching global market data:', err);
                setError('Failed to load market data');
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();

        // Fetch data every 2 minutes
        const interval = setInterval(fetchGlobalData, 120000);

        return () => clearInterval(interval);
    }, []);

    const formatNumber = (value: number | undefined): string => {
        if (!value) return '0.00';
        if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toFixed(2);
    };

    if (loading || !stats) {
        return (
            <div className={`w-full backdrop-blur-xl bg-opacity-50 border-b ${themeClasses.border}`}>
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
                    <div className="text-center text-sm text-gray-500">Loading market data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`w-full backdrop-blur-xl bg-opacity-50 border-b ${themeClasses.border}`}>
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
                    <div className="text-center text-sm text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full backdrop-blur-xl bg-opacity-50 border-b ${themeClasses.border}`}>
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Market Overview */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 border border-zinc-800">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-2.5">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium text-lg">Market Overview</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>Market Cap</span>
                                    <span className="font-medium text-base">${formatNumber(stats?.marketCap)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>24h Volume</span>
                                    <span className="font-medium text-base">${formatNumber(stats?.volume24h)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 border border-zinc-800">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-2.5">
                                    <LineChart className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium text-lg">Market Stats</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>Active Cryptos</span>
                                    <span className="font-medium text-base">{stats?.cryptos?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>Markets</span>
                                    <span className="font-medium text-base">{stats?.exchanges?.toLocaleString() || '0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bitcoin Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 border border-zinc-800">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-2.5">
                                    <Coins className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium text-lg">Bitcoin</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>BTC Price</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-base">${formatNumber(stats?.btcPrice)}</span>
                                        <span className={`flex items-center text-sm ${(stats?.btcChange24h || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {(stats?.btcChange24h || 0) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                            {Math.abs(stats?.btcChange24h || 0).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>Dominance</span>
                                    <span className="font-medium text-base">{stats?.dominance?.btc?.toFixed(1) || '0.0'}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ethereum Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 border border-zinc-800">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-2.5">
                                    <Wallet className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium text-lg">Ethereum</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>ETH Price</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-base">${formatNumber(stats?.ethPrice)}</span>
                                        <span className={`flex items-center text-sm ${(stats?.ethChange24h || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {(stats?.ethChange24h || 0) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                            {Math.abs(stats?.ethChange24h || 0).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={themeClasses.secondaryText}>Dominance</span>
                                    <span className="font-medium text-base">{stats?.dominance?.eth?.toFixed(1) || '0.0'}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 