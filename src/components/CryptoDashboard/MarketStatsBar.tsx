import { ArrowDownRight, ArrowUpRight, Coins, DollarSign, LineChart, Wallet } from 'lucide-react';

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
    stats: {
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
    };
}

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

export default function MarketStatsBar({ theme, themeClasses, stats }: MarketStatsBarProps) {
    return (
        <div className={`w-full backdrop-blur-xl bg-opacity-50 ${themeClasses.card}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Market Overview */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-indigo-500/20 rounded-lg p-2">
                                    <DollarSign className="h-5 w-5 text-indigo-400" />
                                </div>
                                <span className="font-semibold text-base">Market Overview</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>Market Cap</span>
                                    <span className="font-medium text-base">${formatNumber(stats.marketCap)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>24h Volume</span>
                                    <span className="font-medium text-base">${formatNumber(stats.volume24h)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-purple-500/20 rounded-lg p-2">
                                    <LineChart className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="font-semibold text-base">Market Stats</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>Active Pairs</span>
                                    <span className="font-medium text-base">{stats.cryptos}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>Exchange</span>
                                    <span className="font-medium text-base">Binance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bitcoin Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-orange-500 opacity-20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-orange-500/20 rounded-lg p-2">
                                    <Coins className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="font-semibold text-base">Bitcoin</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>BTC Price</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-base">${formatNumber(stats.btcPrice)}</span>
                                        <span className={`flex items-center text-sm ${stats.btcChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stats.btcChange24h >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                            {Math.abs(stats.btcChange24h).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>Dominance</span>
                                    <span className="font-medium text-base">{stats.dominance.btc.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ethereum Stats */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4">
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                            <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-blue-500/20 rounded-lg p-2">
                                    <Wallet className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="font-semibold text-base">Ethereum</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>ETH Price</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-base">${formatNumber(stats.ethPrice)}</span>
                                        <span className={`flex items-center text-sm ${stats.ethChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stats.ethChange24h >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                            {Math.abs(stats.ethChange24h).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.secondaryText}`}>Dominance</span>
                                    <span className="font-medium text-base">{stats.dominance.eth.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 