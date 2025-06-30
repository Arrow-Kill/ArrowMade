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
        button: string;
        buttonText: string;
        input: string;
        secondaryText: string;
    };
    symbol: string;
}

declare global {
    interface Window {
        TradingView: any;
    }
}

export default function CryptoPriceChart({ theme, themeClasses, symbol }: CryptoPriceChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [interval, setInterval] = useState('D');

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
            if (!containerRef.current) return;

            // Clear the container before initializing new widget
            containerRef.current.innerHTML = '';

            await loadTradingViewScript();

            // Format the symbol correctly for TradingView
            // Remove USDT suffix if present and add it back in the correct format
            const formattedSymbol = symbol.replace(/USDT$/, '') + 'USDT';

            const widgetOptions = {
                symbol: `BINANCE:${formattedSymbol}`,
                interval: interval,
                timezone: 'Etc/UTC',
                theme: theme === 'dark' ? 'dark' : 'light',
                style: '1',
                locale: 'en',
                toolbar_bg: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                enable_publishing: false,
                allow_symbol_change: false,
                container_id: containerRef.current.id,
                autosize: true,
                studies: [
                    'MASimple@tv-basicstudies',
                    'RSI@tv-basicstudies'
                ],
                show_popup_button: true,
                popup_width: '1000',
                popup_height: '650',
                hide_side_toolbar: false,
                withdateranges: true,
                hide_volume: false,
                height: 600,
                save_image: true,
                backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                gridColor: theme === 'dark' ? '#2f3640' : '#e8e8e8',
                scalesProperties: {
                    textColor: theme === 'dark' ? '#fff' : '#000',
                },
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
                }
            };

            new window.TradingView.widget(widgetOptions);
        };

        initWidget();

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [theme, symbol, interval]);

    const intervals = [
        { label: '24H', value: '60' },
        { label: '7D', value: 'D' },
        { label: '1M', value: 'W' },
        { label: '1Y', value: 'M' },
    ];

    return (
        <div className={`${themeClasses.card} rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Price Chart</h2>
                <div className="flex gap-2">
                    {intervals.map((int) => (
                        <button
                            key={int.value}
                            onClick={() => setInterval(int.value)}
                            className={`px-3 py-1 rounded transition-colors duration-200 ${interval === int.value
                                ? `${themeClasses.button} ${themeClasses.buttonText}`
                                : themeClasses.card
                                }`}
                        >
                            {int.label}
                        </button>
                    ))}
                </div>
            </div>
            <div
                ref={containerRef}
                id={`tradingview_${symbol.toLowerCase()}`}
                className="h-[600px] w-full"
            />
        </div>
    );
} 