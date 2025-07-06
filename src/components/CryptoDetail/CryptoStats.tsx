'use client';

import { BarChart3, CircleDollarSign, CoinsIcon, LineChart, TrendingDown, TrendingUp } from 'lucide-react';

interface CryptoStatsProps {
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
    data: {
        marketCap: number;
        volume24h: number;
        circulatingSupply: number;
        totalSupply: number;
        maxSupply: number;
        high24h: number;
        low24h: number;
        symbol: string;
    };
}

export default function CryptoStats({ theme, themeClasses, data }: CryptoStatsProps) {
    const formatNumber = (num: number, decimals: number = 2): string => {
        if (num >= 1e9) {
            return `$${(num / 1e9).toFixed(decimals)}B`;
        }
        if (num >= 1e6) {
            return `$${(num / 1e6).toFixed(decimals)}M`;
        }
        if (num >= 1e3) {
            return `$${(num / 1e3).toFixed(decimals)}K`;
        }
        return `$${num.toFixed(decimals)}`;
    };

    const formatSupply = (supply: number): string => {
        if (supply >= 1e9) {
            return `${(supply / 1e9).toFixed(2)}B`;
        }
        if (supply >= 1e6) {
            return `${(supply / 1e6).toFixed(2)}M`;
        }
        if (supply >= 1e3) {
            return `${(supply / 1e3).toFixed(2)}K`;
        }
        return supply.toFixed(2);
    };

    return (
        <div className={`${themeClasses.card} rounded-xl border ${themeClasses.border} p-6`}>
            <h2 className="text-lg font-medium mb-6">Market Stats</h2>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                    <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.07]`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <CircleDollarSign className="w-5 h-5 text-emerald-500" />
                                <span className={themeClasses.secondaryText}>Market Cap</span>
                            </div>
                            <span className="font-medium">{formatNumber(data.marketCap)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                <span className={themeClasses.secondaryText}>24h Volume</span>
                            </div>
                            <span className="font-medium">{formatNumber(data.volume24h)}</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.07]`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className={themeClasses.secondaryText}>24h High</span>
                            </div>
                            <span className="font-medium text-emerald-500">{formatNumber(data.high24h)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                                <span className={themeClasses.secondaryText}>24h Low</span>
                            </div>
                            <span className="font-medium text-red-500">{formatNumber(data.low24h)}</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.07]`}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CoinsIcon className="w-5 h-5 text-amber-500" />
                                    <span className={themeClasses.secondaryText}>Circulating Supply</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{formatSupply(data.circulatingSupply)}</span>
                                    <span className="text-sm text-zinc-500">{data.symbol}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-purple-500" />
                                    <span className={themeClasses.secondaryText}>Total Supply</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{formatSupply(data.totalSupply)}</span>
                                    <span className="text-sm text-zinc-500">{data.symbol}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-indigo-500" />
                                    <span className={themeClasses.secondaryText}>Max Supply</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                        {data.maxSupply ? formatSupply(data.maxSupply) : '∞'}
                                    </span>
                                    {data.maxSupply && <span className="text-sm text-zinc-500">{data.symbol}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 