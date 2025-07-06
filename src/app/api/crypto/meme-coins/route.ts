import { NextResponse } from 'next/server';

const MEME_COIN_SYMBOLS = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'];

export async function GET() {
    try {
        // Fetch data from Binance API for meme coins
        const responses = await Promise.all(
            MEME_COIN_SYMBOLS.map(symbol =>
                fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`)
                    .then(res => res.json())
                    .catch(() => null)
            )
        );

        const memeCoins = responses
            .filter(Boolean)
            .map(data => ({
                symbol: data.symbol.replace('USDT', ''),
                price: parseFloat(data.lastPrice).toFixed(6),
                priceChangePercent: parseFloat(data.priceChangePercent).toFixed(2),
                volume24h: parseFloat(data.volume).toFixed(2)
            }));

        return NextResponse.json({ data: memeCoins });
    } catch (error) {
        console.error('Error fetching meme coins:', error);
        return NextResponse.json({ error: 'Failed to fetch meme coins data' }, { status: 500 });
    }
} 