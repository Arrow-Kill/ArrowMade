import { NextRequest, NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
}

interface MarketSentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  factors: string[];
}

interface TradingSignal {
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  reasoning: string;
}

interface CryptoAnalysis {
  symbol: string;
  price: number;
  priceChange24h: number;
  volume: number;
  marketCap: number;
  technicalIndicators: TechnicalIndicators;
  sentiment: MarketSentiment;
  tradingSignal: TradingSignal;
  supportLevels: number[];
  resistanceLevels: number[];
  priceTarget: {
    short: number;
    medium: number;
    long: number;
  };
}

// Simple RSI calculation
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Simple Moving Average
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
}

// Market sentiment analysis
function analyzeSentiment(priceChange: number, volume: number, rsi: number): MarketSentiment {
  const factors: string[] = [];
  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 0;
  
  // Price momentum
  if (priceChange > 5) {
    factors.push('Strong positive price momentum');
    confidence += 30;
  } else if (priceChange > 0) {
    factors.push('Positive price momentum');
    confidence += 15;
  } else if (priceChange < -5) {
    factors.push('Strong negative price momentum');
    confidence += 30;
  } else if (priceChange < 0) {
    factors.push('Negative price momentum');
    confidence += 15;
  }
  
  // RSI analysis
  if (rsi > 70) {
    factors.push('RSI indicates overbought conditions');
    confidence += 20;
  } else if (rsi < 30) {
    factors.push('RSI indicates oversold conditions');
    confidence += 20;
  } else if (rsi > 50) {
    factors.push('RSI shows bullish bias');
    confidence += 10;
  } else {
    factors.push('RSI shows bearish bias');
    confidence += 10;
  }
  
  // Volume analysis
  if (volume > 1000000) {
    factors.push('High trading volume confirms trend');
    confidence += 15;
  }
  
  // Determine sentiment
  if (priceChange > 0 && rsi < 70) {
    sentiment = 'bullish';
  } else if (priceChange < 0 && rsi > 30) {
    sentiment = 'bearish';
  } else {
    sentiment = 'neutral';
  }
  
  return {
    sentiment,
    confidence: Math.min(confidence, 100),
    factors
  };
}

// Generate trading signal
function generateTradingSignal(analysis: Partial<CryptoAnalysis>): TradingSignal {
  const { technicalIndicators, sentiment, priceChange24h } = analysis;
  
  if (!technicalIndicators || !sentiment || priceChange24h === undefined) {
    return {
      signal: 'hold',
      strength: 0,
      reasoning: 'Insufficient data for signal generation'
    };
  }
  
  const rsi = technicalIndicators.rsi;
  const sma20 = technicalIndicators.movingAverages.sma20;
  const sma50 = technicalIndicators.movingAverages.sma50;
  
  let signal: 'buy' | 'sell' | 'hold' = 'hold';
  let strength = 0;
  let reasoning = '';
  
  // Buy signals
  if (rsi < 30 && sentiment.sentiment === 'bullish' && sma20 > sma50) {
    signal = 'buy';
    strength = 80;
    reasoning = 'Oversold RSI with bullish sentiment and upward trend';
  } else if (priceChange24h > 0 && rsi < 50 && sentiment.confidence > 70) {
    signal = 'buy';
    strength = 60;
    reasoning = 'Positive momentum with strong sentiment';
  }
  
  // Sell signals
  else if (rsi > 70 && sentiment.sentiment === 'bearish' && sma20 < sma50) {
    signal = 'sell';
    strength = 80;
    reasoning = 'Overbought RSI with bearish sentiment and downward trend';
  } else if (priceChange24h < -5 && rsi > 50 && sentiment.confidence > 70) {
    signal = 'sell';
    strength = 60;
    reasoning = 'Strong negative momentum with bearish sentiment';
  }
  
  // Hold conditions
  else {
    signal = 'hold';
    strength = 40;
    reasoning = 'Mixed signals, sideways movement expected';
  }
  
  return { signal, strength, reasoning };
}

// Calculate support and resistance levels
function calculateSupportResistance(prices: number[]): { support: number[], resistance: number[] } {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const currentPrice = prices[prices.length - 1];
  
  const support = sortedPrices.filter(p => p < currentPrice).slice(-3);
  const resistance = sortedPrices.filter(p => p > currentPrice).slice(0, 3);
  
  return { support, resistance };
}

// Generate price targets
function generatePriceTargets(currentPrice: number, sentiment: MarketSentiment): { short: number, medium: number, long: number } {
  const multiplier = sentiment.sentiment === 'bullish' ? 1 : -1;
  const confidence = sentiment.confidence / 100;
  
  return {
    short: currentPrice * (1 + (multiplier * 0.05 * confidence)),
    medium: currentPrice * (1 + (multiplier * 0.15 * confidence)),
    long: currentPrice * (1 + (multiplier * 0.30 * confidence))
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const action = searchParams.get('action');
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }
  
  try {
    switch (action) {
      case 'technical-analysis': {
        // Get klines data for analysis
        const klinesResponse = await fetch(`${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=1h&limit=200`);
        const klinesData = await klinesResponse.json();
        
        // Get 24hr ticker
        const tickerResponse = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerResponse.json();
        
        const prices = klinesData.map((kline: any[]) => parseFloat(kline[4])); // Close prices
        const currentPrice = parseFloat(tickerData.lastPrice);
        const priceChange24h = parseFloat(tickerData.priceChangePercent);
        const volume = parseFloat(tickerData.volume);
        
        // Calculate technical indicators
        const rsi = calculateRSI(prices);
        const sma20 = calculateSMA(prices, 20);
        const sma50 = calculateSMA(prices, 50);
        const sma200 = calculateSMA(prices, 200);
        
        const technicalIndicators: TechnicalIndicators = {
          rsi,
          macd: {
            macd: 0, // Simplified
            signal: 0,
            histogram: 0
          },
          movingAverages: {
            sma20,
            sma50,
            sma200
          }
        };
        
        const sentiment = analyzeSentiment(priceChange24h, volume, rsi);
        const { support, resistance } = calculateSupportResistance(prices);
        
        const analysis: CryptoAnalysis = {
          symbol,
          price: currentPrice,
          priceChange24h,
          volume,
          marketCap: 0, // Would need additional API call
          technicalIndicators,
          sentiment,
          tradingSignal: generateTradingSignal({
            technicalIndicators,
            sentiment,
            priceChange24h
          }),
          supportLevels: support,
          resistanceLevels: resistance,
          priceTarget: generatePriceTargets(currentPrice, sentiment)
        };
        
        return NextResponse.json(analysis);
      }
      
      case 'market-overview': {
        // Get top 20 cryptocurrencies analysis
        const tickerResponse = await fetch(`${BINANCE_API_BASE}/ticker/24hr`);
        const allTickers = await tickerResponse.json();
        
        const usdtPairs = allTickers
          .filter((ticker: any) => ticker.symbol.endsWith('USDT'))
          .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
          .slice(0, 20);
        
        const marketOverview = {
          totalMarkets: usdtPairs.length,
          gainers: usdtPairs.filter((t: any) => parseFloat(t.priceChangePercent) > 0).length,
          losers: usdtPairs.filter((t: any) => parseFloat(t.priceChangePercent) < 0).length,
          topGainers: usdtPairs
            .filter((t: any) => parseFloat(t.priceChangePercent) > 0)
            .sort((a: any, b: any) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
            .slice(0, 5)
            .map((t: any) => ({
              symbol: t.symbol,
              price: parseFloat(t.lastPrice),
              change: parseFloat(t.priceChangePercent)
            })),
          topLosers: usdtPairs
            .filter((t: any) => parseFloat(t.priceChangePercent) < 0)
            .sort((a: any, b: any) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent))
            .slice(0, 5)
            .map((t: any) => ({
              symbol: t.symbol,
              price: parseFloat(t.lastPrice),
              change: parseFloat(t.priceChangePercent)
            })),
          avgChange: usdtPairs.reduce((sum: number, t: any) => sum + parseFloat(t.priceChangePercent), 0) / usdtPairs.length,
          totalVolume: usdtPairs.reduce((sum: number, t: any) => sum + parseFloat(t.quoteVolume), 0)
        };
        
        return NextResponse.json(marketOverview);
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Crypto analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}