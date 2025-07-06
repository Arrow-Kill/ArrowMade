'use client';

import { TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SentimentData {
    positive: number;
    negative: number;
    metrics: {
        priceChange24h: number;
        volume24h: number;
        buyPressure: number;
        sellPressure: number;
    };
}

interface CryptoSentimentProps {
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
    symbol: string;
}

export default function CryptoSentiment({ theme, themeClasses, symbol }: CryptoSentimentProps) {
    const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/crypto/sentiment?symbol=${symbol}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sentiment data');
                }
                const data = await response.json();
                setSentimentData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching sentiment:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSentiment();
        // Refresh sentiment data every 5 minutes
        const interval = setInterval(fetchSentiment, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [symbol]);

    const getSentimentText = () => {
        if (!sentimentData) return 'Loading...';
        const positive = sentimentData.positive;
        if (positive >= 75) return 'Very Bullish';
        if (positive >= 60) return 'Bullish';
        if (positive >= 40) return 'Neutral';
        if (positive >= 25) return 'Bearish';
        return 'Very Bearish';
    };

    const getSentimentColor = () => {
        if (!sentimentData) return 'text-zinc-400';
        const positive = sentimentData.positive;
        if (positive >= 75) return 'text-emerald-400';
        if (positive >= 60) return 'text-emerald-500';
        if (positive >= 40) return 'text-zinc-400';
        if (positive >= 25) return 'text-red-500';
        return 'text-red-400';
    };

    if (error) {
        return (
            <div className={`${themeClasses.card} rounded-xl border ${themeClasses.border} p-6`}>
                <div className="text-center text-red-500">
                    Failed to load sentiment data
                </div>
            </div>
        );
    }

    return (
        <div className={`${themeClasses.card} rounded-xl border ${themeClasses.border} p-6`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Market Sentiment</h2>
                <div className={`px-3 py-1 rounded-full ${getSentimentColor()} bg-white/5`}>
                    {getSentimentText()}
                </div>
            </div>

            <div className="space-y-6">
                <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">Bullish</span>
                        </div>
                        <span className="text-emerald-500 font-medium">
                            {sentimentData ? `${sentimentData.positive.toFixed(1)}%` : '...'}
                        </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500/30 relative overflow-hidden"
                            style={{ width: `${sentimentData ? sentimentData.positive : 0}%` }}
                        >
                            <div
                                className="absolute inset-0 bg-emerald-500"
                                style={{
                                    width: '100%',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-red-500" />
                            <span className="text-red-500 font-medium">Bearish</span>
                        </div>
                        <span className="text-red-500 font-medium">
                            {sentimentData ? `${sentimentData.negative.toFixed(1)}%` : '...'}
                        </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500/30 relative overflow-hidden"
                            style={{ width: `${sentimentData ? sentimentData.negative : 0}%` }}
                        >
                            <div
                                className="absolute inset-0 bg-red-500"
                                style={{
                                    width: '100%',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {sentimentData && (
                    <div className="space-y-2 mt-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className={themeClasses.secondaryText}>24h Price Change</span>
                            <span className={sentimentData.metrics.priceChange24h >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                {sentimentData.metrics.priceChange24h.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={themeClasses.secondaryText}>Buy Pressure</span>
                            <span>{(sentimentData.metrics.buyPressure * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={themeClasses.secondaryText}>Sell Pressure</span>
                            <span>{(sentimentData.metrics.sellPressure * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 mt-4">
                    <Users className="w-4 h-4 text-zinc-500" />
                    <span className={`${themeClasses.secondaryText} text-sm`}>
                        {isLoading ? 'Updating...' : 'Real-time market data'}
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
            `}</style>
        </div>
    );
} 