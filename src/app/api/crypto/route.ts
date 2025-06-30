import { NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

interface BinanceSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

async function fetchMarketStats() {
  try {
    const [ticker24h, btcTicker, ethTicker] = await Promise.all([
      fetch(`${BINANCE_API_BASE}/ticker/24hr`),
      fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=BTCUSDT`),
      fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=ETHUSDT`)
    ]);

    const allTickers: BinanceTicker[] = await ticker24h.json();
    const btcData = await btcTicker.json();
    const ethData = await ethTicker.json();

    // Calculate total market volume and count active pairs
    const usdtPairs = allTickers.filter(ticker => ticker.symbol.endsWith('USDT'));
    const totalVolume = usdtPairs.reduce((sum, ticker) => sum + parseFloat(ticker.quoteVolume), 0);
    
    // Calculate total market cap (approximate using available data)
    const totalMarketCap = usdtPairs.reduce((sum, ticker) => {
      const price = parseFloat(ticker.lastPrice);
      const volume = parseFloat(ticker.volume);
      return sum + (price * volume);
    }, 0);

    // Calculate BTC and ETH dominance
    const btcMarketCap = parseFloat(btcData.lastPrice) * parseFloat(btcData.volume);
    const ethMarketCap = parseFloat(ethData.lastPrice) * parseFloat(ethData.volume);
    
    const btcDominance = (btcMarketCap / totalMarketCap) * 100;
    const ethDominance = (ethMarketCap / totalMarketCap) * 100;

    return {
      cryptos: usdtPairs.length,
      exchanges: 1, // Binance only
      marketCap: totalMarketCap,
      volume24h: totalVolume,
      dominance: {
        btc: btcDominance,
        eth: ethDominance
      },
      btcPrice: parseFloat(btcData.lastPrice),
      ethPrice: parseFloat(ethData.lastPrice),
      btcChange24h: parseFloat(btcData.priceChangePercent),
      ethChange24h: parseFloat(ethData.priceChangePercent)
    };
  } catch (error) {
    console.error('Error fetching market stats:', error);
    throw error;
  }
}

async function fetchBinanceData() {
  try {
    // Fetch 24hr ticker data
    const [tickerResponse, exchangeInfoResponse] = await Promise.all([
      fetch(`${BINANCE_API_BASE}/ticker/24hr`),
      fetch(`${BINANCE_API_BASE}/exchangeInfo`)
    ]);

    const tickerData: BinanceTicker[] = await tickerResponse.json();
    const exchangeInfo = await exchangeInfoResponse.json();

    // Create a map of symbols to their details
    const symbolDetails = new Map<string, BinanceSymbol>(
      exchangeInfo.symbols.map((symbol: BinanceSymbol) => [symbol.symbol, symbol])
    );

    // Process and format the data
    const processedData = tickerData
      .filter((ticker) => ticker.symbol.endsWith('USDT')) // Only get USDT pairs
      .map((ticker, index) => {
        const symbolInfo = symbolDetails.get(ticker.symbol);
        const baseAsset = symbolInfo?.baseAsset || '';
        const quoteAsset = symbolInfo?.quoteAsset || '';
        
        return {
          id: index + 1,
          symbol: ticker.symbol,
          name: baseAsset,
          lastPrice: ticker.lastPrice,
          priceChangePercent: ticker.priceChangePercent,
          volume: ticker.volume,
          quoteVolume: ticker.quoteVolume, // 24h volume in USDT
          marketCap: (parseFloat(ticker.lastPrice) * parseFloat(ticker.volume)).toString(),
          circulatingSupply: ticker.volume,
          high24h: ticker.highPrice,
          lowPrice: ticker.lowPrice,
          rank: index + 1
        };
      })
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

    return processedData;
  } catch (error) {
    console.error('Error fetching Binance data:', error);
    throw error;
  }
}

async function fetchKlines(symbol: string, interval = '1d', limit = 7): Promise<KlineData[]> {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    const data = await response.json();
    return data.map((kline: any[]) => ({
      time: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4])
    }));
  } catch (error) {
    console.error('Error fetching klines:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const symbol = searchParams.get('symbol');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    switch (action) {
      case 'market-stats': {
        const stats = await fetchMarketStats();
        return NextResponse.json(stats);
      }

      case 'tickers': {
        const data = await fetchBinanceData();
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = data.slice(start, end);
        
        // Fetch klines data for each symbol
        const dataWithKlines = await Promise.all(
          paginatedData.map(async (item) => {
            const klines = await fetchKlines(item.symbol);
            return {
              ...item,
              sparkline_in_7d: {
                price: klines.map((k: KlineData) => k.close)
              }
            };
          })
        );

        return NextResponse.json({
          data: dataWithKlines,
          totalPages: Math.ceil(data.length / limit)
        });
      }

      case 'klines': {
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }
        const klines = await fetchKlines(symbol);
        return NextResponse.json(klines);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 