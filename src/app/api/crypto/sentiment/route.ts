import { NextResponse } from 'next/server';

async function fetchSentimentData(symbol: string) {
    try {
        // Remove USDT suffix if present and convert to uppercase
        const baseSymbol = symbol.toUpperCase().replace(/USDT$/, '');
        const tradingPair = `${baseSymbol}USDT`;

        // Fetch data from Binance API
        const [tickerResponse, depthResponse] = await Promise.all([
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${tradingPair}`),
            fetch(`https://api.binance.com/api/v3/depth?symbol=${tradingPair}&limit=10`)
        ]);

        if (!tickerResponse.ok || !depthResponse.ok) {
            throw new Error(`Failed to fetch data for ${tradingPair}`);
        }

        const tickerData = await tickerResponse.json();
        const depthData = await depthResponse.json();

        // Calculate sentiment based on price change and order book
        const priceChange = parseFloat(tickerData.priceChangePercent);
        const volume24h = parseFloat(tickerData.volume);
        
        // Calculate buy/sell pressure from order book
        const totalBuyVolume = depthData.bids.reduce((acc: number, [_, volume]: [string, string]) => 
            acc + parseFloat(volume), 0);
        const totalSellVolume = depthData.asks.reduce((acc: number, [_, volume]: [string, string]) => 
            acc + parseFloat(volume), 0);
        
        // Calculate sentiment scores
        let positive = 50; // neutral baseline
        
        // Adjust based on price change
        if (priceChange > 0) {
            positive += Math.min(priceChange * 2, 25); // max +25 for price change
        } else {
            positive -= Math.min(Math.abs(priceChange) * 2, 25); // max -25 for price change
        }
        
        // Adjust based on buy/sell pressure
        const buyPressure = totalBuyVolume / (totalBuyVolume + totalSellVolume);
        positive += (buyPressure - 0.5) * 25; // max ±12.5 for buy/sell pressure

        // Ensure sentiment stays within 0-100 range
        positive = Math.max(0, Math.min(100, positive));
        
        return {
            positive: Math.round(positive),
            negative: Math.round(100 - positive),
            metrics: {
                priceChange24h: priceChange,
                volume24h: volume24h,
                buyPressure: buyPressure,
                sellPressure: 1 - buyPressure
            }
        };
    } catch (error) {
        console.error('Error fetching sentiment data:', error);
        throw error;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');

        if (!symbol) {
            return NextResponse.json(
                { error: 'Symbol parameter is required' },
                { status: 400 }
            );
        }

        const sentimentData = await fetchSentimentData(symbol);
        return NextResponse.json(sentimentData);
    } catch (error) {
        console.error('Error in sentiment API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sentiment data' },
            { status: 500 }
        );
    }
} 