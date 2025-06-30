import crypto from 'crypto';
import { NextResponse } from 'next/server';

const BINANCE_API_KEY = process.env.NEXT_PUBLIC_BINANCE_API;
const BINANCE_SECRET_KEY = process.env.NEXT_PUBLIC_BINANCE_SERCET_KEY;

async function getSignature(queryString: string): Promise<string> {
    return crypto
        .createHmac('sha256', BINANCE_SECRET_KEY!)
        .update(queryString)
        .digest('hex');
}

async function fetchBinanceData(symbol: string) {
    try {
        // Remove USDT suffix if present and convert to uppercase
        const baseSymbol = symbol.toUpperCase().replace(/USDT$/, '');
        const tradingPair = `${baseSymbol}USDT`;

        // Fetch 24hr ticker price change
        const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${tradingPair}`);
        if (!tickerResponse.ok) {
            throw new Error(`Symbol ${tradingPair} not found on Binance`);
        }
        const tickerData = await tickerResponse.json();

        // Fetch current order book
        const depthResponse = await fetch(`https://api.binance.com/api/v3/depth?symbol=${tradingPair}&limit=5`);
        if (!depthResponse.ok) {
            throw new Error(`Failed to fetch order book for ${tradingPair}`);
        }
        const depthData = await depthResponse.json();

        // Fetch klines (candlestick) data
        const klinesResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${tradingPair}&interval=1d&limit=7`);
        if (!klinesResponse.ok) {
            throw new Error(`Failed to fetch price history for ${tradingPair}`);
        }
        const klinesData = await klinesResponse.json();

        return {
            ticker: tickerData,
            depth: depthData,
            klines: klinesData,
            baseSymbol,
            tradingPair
        };
    } catch (error) {
        console.error('Error fetching from Binance:', error);
        throw error;
    }
}

const COIN_NAMES: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'SOL': 'Solana',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOGE': 'Dogecoin',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'LINK': 'Chainlink'
};

const COIN_IDS: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'LINK': 'chainlink'
};

export async function GET(
    request: Request,
    { params }: { params: { symbol: string } }
) {
    try {
        // Validate the symbol parameter
        if (!params?.symbol) {
            return NextResponse.json(
                { error: 'Symbol parameter is required' },
                { status: 400 }
            );
        }

        // Fetch data from Binance
        const binanceData = await fetchBinanceData(params.symbol);
        const { baseSymbol, tradingPair } = binanceData;

        // Get the coin's CoinGecko ID if available
        const coinId = COIN_IDS[baseSymbol] || baseSymbol.toLowerCase();

        // Format the data
        const formattedData = {
            id: baseSymbol,
            symbol: baseSymbol,
            name: COIN_NAMES[baseSymbol] || baseSymbol,
            tradingPair,
            price: parseFloat(binanceData.ticker.lastPrice) || 0,
            priceChangePercent24h: parseFloat(binanceData.ticker.priceChangePercent) || 0,
            marketCap: parseFloat(binanceData.ticker.quoteVolume) || 0,
            volume24h: parseFloat(binanceData.ticker.volume) || 0,
            circulatingSupply: 0,
            totalSupply: 0,
            maxSupply: 0,
            rank: 1,
            high24h: parseFloat(binanceData.ticker.highPrice) || 0,
            low24h: parseFloat(binanceData.ticker.lowPrice) || 0,
            image: `https://assets.coingecko.com/coins/images/1/${baseSymbol.toLowerCase()}.png`,
            fallbackImage: `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`,
            description: `${baseSymbol}/USDT trading pair on Binance`,
            sentiment: {
                positive: parseFloat(binanceData.ticker.priceChangePercent) >= 0 ? 75 : 25,
                negative: parseFloat(binanceData.ticker.priceChangePercent) >= 0 ? 25 : 75
            },
            orderBook: {
                bids: Array.isArray(binanceData.depth.bids) ? binanceData.depth.bids.slice(0, 5) : [],
                asks: Array.isArray(binanceData.depth.asks) ? binanceData.depth.asks.slice(0, 5) : []
            },
            candlesticks: Array.isArray(binanceData.klines) ? binanceData.klines.map((kline: any[]) => ({
                timestamp: kline[0],
                open: parseFloat(kline[1]),
                high: parseFloat(kline[2]),
                low: parseFloat(kline[3]),
                close: parseFloat(kline[4]),
                volume: parseFloat(kline[5])
            })) : []
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error in crypto detail API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch crypto details' },
            { status: 500 }
        );
    }
} 