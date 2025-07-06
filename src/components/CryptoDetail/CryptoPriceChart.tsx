'use client';

import { useEffect, useRef, useState } from 'react';

interface CryptoPriceChartProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        secondaryText: string;
    };
    symbol: string;
}

declare global {
    interface Window {
        TradingView: any;
    }
}

const intervals = [
    { label: '1D', value: '60' },
    { label: '1W', value: 'D' },
    { label: '1M', value: 'W' },
    { label: '1Y', value: 'M' }
];

export default function CryptoPriceChart({ theme, themeClasses, symbol }: CryptoPriceChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [interval, setInterval] = useState('D');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTradingViewScript = () => {
            return new Promise((resolve) => {
                if (window.TradingView) {
                    resolve(window.TradingView);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://s3.tradingview.com/tv.js';
                script.async = true;
                script.onload = () => resolve(window.TradingView);
                document.head.appendChild(script);
            });
        };

        const initWidget = async () => {
            try {
                if (!containerRef.current) return;

                // Clear the container before initializing new widget
                containerRef.current.innerHTML = '';

                await loadTradingViewScript();

                // Format the symbol correctly for TradingView
                const formattedSymbol = symbol.replace(/USDT$/, '') + 'USDT';

                new window.TradingView.widget({
                    symbol: `BINANCE:${formattedSymbol}`,
                    interval: interval,
                    timezone: 'Etc/UTC',
                    theme: 'dark',
                    style: '1',
                    locale: 'en',
                    toolbar_bg: '#18181b',
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: true,
                    container_id: containerRef.current.id,
                    height: '100%',
                    width: '100%',
                    autosize: false,
                    studies: [
                        'MASimple@tv-basicstudies',
                        'RSI@tv-basicstudies'
                    ],
                    show_popup_button: true,
                    popup_width: '1000',
                    popup_height: '650',
                    hide_side_toolbar: false,
                    hide_volume: false,
                    backgroundColor: '#18181b',
                    gridColor: 'rgba(255, 255, 255, 0.06)',
                    allow_symbol_change: true,
                    details: true,
                    hotlist: true,
                    calendar: true,
                    studies_overrides: {
                        "volume.volume.color.0": "#ef4444",
                        "volume.volume.color.1": "#22c55e",
                    },
                    overrides: {
                        "mainSeriesProperties.candleStyle.upColor": "#22c55e",
                        "mainSeriesProperties.candleStyle.downColor": "#ef4444",
                        "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
                        "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
                        "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
                        "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
                        "paneProperties.background": "#18181b",
                        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.06)",
                        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.06)",
                        "scalesProperties.textColor": "#ffffff"
                    }
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing TradingView widget:', error);
                setIsLoading(false);
            }
        };

        initWidget();

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [symbol, interval]);

    return (
        <div className={`${themeClasses.card} rounded-xl border ${themeClasses.border} p-6 h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Price Chart</h2>
                <div className="flex items-center space-x-2">
                    {intervals.map((int) => (
                        <button
                            key={int.value}
                            onClick={() => setInterval(int.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${interval === int.value
                                ? 'bg-white/10'
                                : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            {int.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            <span className={themeClasses.secondaryText}>Loading chart...</span>
                        </div>
                    </div>
                )}
                <div
                    ref={containerRef}
                    id={`tradingview_${symbol.toLowerCase()}`}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
} 