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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error || !cryptoData) {
        return (
            <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
                <TopNavBar theme={theme} themeClasses={themeClasses} />
                <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
                    <div className={`${themeClasses.card} rounded-lg p-8 max-w-md mx-auto text-center`}>
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
                        <p className={`${themeClasses.secondaryText} mb-6`}>
                            {error || `Could not find data for ${Array.isArray(params?.symbol) ? params.symbol[0] : params?.symbol}`}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className={`${themeClasses.button} ${themeClasses.buttonText} px-6 py-2 rounded-lg`}
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
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <CryptoDetailHeader
                        theme={theme}
                        themeClasses={themeClasses}
                        data={{ ...cryptoData, fallbackImage: 'default-image-url' }}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2">
                            <CryptoPriceChart
                                theme={theme}
                                themeClasses={themeClasses}
                                symbol={cryptoData.tradingPair}
                            />
                        </div>

                        <div className="space-y-6">
                            <CryptoStats
                                theme={theme}
                                themeClasses={themeClasses}
                                data={cryptoData}
                            />

                            <CryptoSentiment
                                theme={theme}
                                themeClasses={themeClasses}
                                sentiment={cryptoData.sentiment}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 