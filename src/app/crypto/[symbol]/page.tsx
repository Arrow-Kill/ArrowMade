'use client';

import CryptoDetailHeader from '@/components/CryptoDetail/CryptoDetailHeader';
import CryptoPriceChart from '@/components/CryptoDetail/CryptoPriceChart';
import CryptoSentiment from '@/components/CryptoDetail/CryptoSentiment';
import CryptoStats from '@/components/CryptoDetail/CryptoStats';
import TopNavBar from '@/components/TopNavBar/TopNavBar';
import { AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CryptoDetailData {
    id: string;
    symbol: string;
    name: string;
    tradingPair: string;
    price: number;
    priceChangePercent24h: number;
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
    totalSupply: number;
    maxSupply: number;
    rank: number;
    high24h: number;
    low24h: number;
    image: string;
    description: string;
    sentiment: {
        positive: number;
        negative: number;
    };
    orderBook: {
        bids: [string, string][];
        asks: [string, string][];
    };
    candlesticks: {
        timestamp: number;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[];
}

export default function CryptoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [cryptoData, setCryptoData] = useState<CryptoDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const themeClasses = {
        background: 'bg-black',
        text: 'text-white',
        card: 'bg-zinc-900',
        cardHover: 'hover:bg-zinc-800',
        border: 'border-zinc-800',
        button: 'bg-white text-black hover:bg-zinc-200',
        buttonText: 'text-black',
        input: 'bg-zinc-900 border-zinc-800',
        secondaryText: 'text-zinc-400',
    };

    useEffect(() => {
        const fetchCryptoDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (!params?.symbol) {
                    throw new Error('Symbol parameter is missing');
                }

                const symbol = Array.isArray(params.symbol) ? params.symbol[0] : params.symbol;
                const response = await fetch(`/api/crypto/detail/${symbol.toLowerCase()}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch data for ${symbol}`);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto details:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch crypto details');
            } finally {
                setIsLoading(false);
            }
        };

        if (params?.symbol) {
            fetchCryptoDetail();
        }
    }, [params?.symbol]);

    if (isLoading) {
        return (
            <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
                <TopNavBar theme={theme} themeClasses={themeClasses} />
                <div className="pt-16 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }

    if (error || !cryptoData) {
        return (
            <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
                <TopNavBar theme={theme} themeClasses={themeClasses} />
                <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
                    <div className={`${themeClasses.card} rounded-xl border ${themeClasses.border} p-8 max-w-md mx-auto text-center`}>
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-medium mb-2">Error Loading Data</h2>
                        <p className={`${themeClasses.secondaryText} mb-6`}>
                            {error || `Could not find data for ${Array.isArray(params?.symbol) ? params.symbol[0] : params?.symbol}`}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
            <TopNavBar theme={theme} themeClasses={themeClasses} />

            <div className="pt-16 w-full overflow-x-hidden">
                <main className="max-w-[90rem] mx-auto px-4 sm:px-6 py-8">
                    <CryptoDetailHeader
                        theme={theme}
                        themeClasses={themeClasses}
                        data={{ ...cryptoData, fallbackImage: 'default-image-url' }}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        <div className="lg:col-span-2 h-full">
                            <CryptoPriceChart
                                theme={theme}
                                themeClasses={themeClasses}
                                symbol={cryptoData.tradingPair}
                            />
                        </div>

                        <div className="space-y-6 h-full flex flex-col">
                            <div className="flex-1">
                                <CryptoStats
                                    theme={theme}
                                    themeClasses={themeClasses}
                                    data={cryptoData}
                                />
                            </div>

                            <div>
                                <CryptoSentiment
                                    theme={theme}
                                    themeClasses={themeClasses}
                                    symbol={cryptoData.symbol}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 