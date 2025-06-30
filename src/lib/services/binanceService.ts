import axios from 'axios';

const BINANCE_BASE_URL = 'https://api.binance.com';
const BINANCE_DATA_URL = 'https://data-api.binance.vision';

class BinanceService {
  private static instance: BinanceService;
  private apiKey: string;
  private apiSecret: string;
  private readonly BINANCE_BASE_URL = 'https://api.binance.com';
  private readonly COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

  // Common trading pairs to filter out
  private readonly TRADING_PAIRS = ['USDT', 'BTC', 'ETH', 'BNB', 'USD'];

  // Common symbol to CoinGecko ID mappings
  private readonly SYMBOL_TO_COINGECKO_ID: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'AVAX': 'avalanche-2',
    'ATOM': 'cosmos',
    'LTC': 'litecoin',
    'ETC': 'ethereum-classic',
    // Add more mappings as needed
  };

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_BINANCE_API || '';
    this.apiSecret = process.env.NEXT_PUBLIC_BINANCE_SECRET_KEY || '';
  }

  public static getInstance(): BinanceService {
    if (!BinanceService.instance) {
      BinanceService.instance = new BinanceService();
    }
    return BinanceService.instance;
  }

  // Convert Binance symbol to CoinGecko ID
  private getBinanceSymbolId(symbol: string): string {
    // Remove common trading pairs from the symbol
    let baseSymbol = symbol.toUpperCase();
    for (const pair of this.TRADING_PAIRS) {
      if (baseSymbol.endsWith(pair)) {
        baseSymbol = baseSymbol.slice(0, -pair.length);
        break;
      }
    }

    // Return the mapped ID or the lowercase symbol as fallback
    return this.SYMBOL_TO_COINGECKO_ID[baseSymbol] || baseSymbol.toLowerCase();
  }

  // Get all ticker prices and 24h stats
  async getAllTickers(page: number = 1, limit: number = 100) {
    try {
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/ticker/24hr`);
      const data = response.data;
      
      // Filter and format the data
      const formattedData = data
        .filter((item: any) => item.symbol.endsWith('USDT')) // Only include USDT pairs
        .map((item: any) => ({
          ...item,
          coinId: this.getBinanceSymbolId(item.symbol), // Add CoinGecko ID
        }));

      // Calculate pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = formattedData.slice(start, end);
      
      return {
        data: paginatedData,
        total: formattedData.length,
        page,
        limit,
        totalPages: Math.ceil(formattedData.length / limit)
      };
    } catch (error) {
      console.error('Error fetching tickers:', error);
      throw error;
    }
  }

  // Get detailed coin information from CoinGecko
  async getCoinInfo(coinId: string) {
    try {
      // Convert Binance symbol to CoinGecko ID if needed
      const geckoId = this.getBinanceSymbolId(coinId);
      console.log('Fetching CoinGecko info for:', { originalId: coinId, geckoId });

      const response = await axios.get(`${this.COINGECKO_BASE_URL}/coins/${geckoId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: true,
          sparkline: false
        }
      });

      return {
        id: response.data.id,
        symbol: response.data.symbol.toUpperCase(),
        name: response.data.name,
        description: response.data.description.en,
        image: response.data.image,
        marketData: {
          currentPrice: response.data.market_data.current_price.usd,
          marketCap: response.data.market_data.market_cap.usd,
          totalVolume: response.data.market_data.total_volume.usd,
          high24h: response.data.market_data.high_24h.usd,
          low24h: response.data.market_data.low_24h.usd,
          priceChangePercentage24h: response.data.market_data.price_change_percentage_24h,
          circulatingSupply: response.data.market_data.circulating_supply,
          totalSupply: response.data.market_data.total_supply,
          maxSupply: response.data.market_data.max_supply,
        },
        communityData: {
          twitterFollowers: response.data.community_data.twitter_followers,
          redditSubscribers: response.data.community_data.reddit_subscribers,
          telegramChannelUserCount: response.data.community_data.telegram_channel_user_count,
        },
        developerData: {
          forks: response.data.developer_data.forks,
          stars: response.data.developer_data.stars,
          subscribers: response.data.developer_data.subscribers,
          totalIssues: response.data.developer_data.total_issues,
          closedIssues: response.data.developer_data.closed_issues,
          pullRequestsMerged: response.data.developer_data.pull_requests_merged,
          pullRequestContributors: response.data.developer_data.pull_request_contributors,
        },
        links: {
          homepage: response.data.links.homepage[0],
          blockchain_site: response.data.links.blockchain_site.filter(Boolean)[0],
          official_forum_url: response.data.links.official_forum_url.filter(Boolean)[0],
          chat_url: response.data.links.chat_url.filter(Boolean)[0],
          announcement_url: response.data.links.announcement_url.filter(Boolean)[0],
          twitter_screen_name: response.data.links.twitter_screen_name,
          facebook_username: response.data.links.facebook_username,
          telegram_channel_identifier: response.data.links.telegram_channel_identifier,
          github: response.data.links.repos_url.github?.[0],
          whitepaper: response.data.whitepaper?.link,
        },
        categories: response.data.categories,
        genesisDate: response.data.genesis_date,
        sentimentVotesUpPercentage: response.data.sentiment_votes_up_percentage,
        sentimentVotesDownPercentage: response.data.sentiment_votes_down_percentage,
        lastUpdated: response.data.last_updated,
      };
    } catch (error) {
      console.error(`Error fetching coin info for ${coinId}:`, error);
      throw error;
    }
  }

  // Get klines/candlestick data
  async getKlines(symbol: string, interval: string, limit?: number) {
    try {
      // Log the request parameters
      console.log('BinanceService getKlines params:', { symbol, interval, limit });

      // Validate the interval
      const validIntervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
      if (!validIntervals.includes(interval)) {
        throw new Error(`Invalid interval: ${interval}. Valid intervals are: ${validIntervals.join(', ')}`);
      }

      // Convert symbol to Binance trading pair format (e.g., 'bitcoin' -> 'BTCUSDT')
      let tradingPair = symbol;
      // If it's a CoinGecko ID, convert it back to symbol
      for (const [sym, id] of Object.entries(this.SYMBOL_TO_COINGECKO_ID)) {
        if (id === symbol.toLowerCase()) {
          tradingPair = sym;
          break;
        }
      }
      // Ensure it's in the correct format for Binance API
      tradingPair = tradingPair.toUpperCase();
      if (!tradingPair.endsWith('USDT')) {
        tradingPair += 'USDT';
      }

      console.log('Using trading pair:', tradingPair);

      // Make the API request
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/klines`, {
        params: {
          symbol: tradingPair,
          interval,
          limit: limit || 500
        }
      });

      // Log the raw response
      console.log('Binance API raw response:', {
        status: response.status,
        headers: response.headers,
        data: response.data?.slice(0, 2) // Log first two items only
      });

      // Validate response data
      if (!Array.isArray(response.data)) {
        console.error('Invalid klines response format:', response.data);
        throw new Error('Invalid klines data format');
      }

      // Map the response to the expected format
      const klines = response.data.map((kline: any[]) => {
        if (!Array.isArray(kline) || kline.length < 6) {
          console.error('Invalid kline format:', kline);
          return null;
        }

        try {
          return [
            Number(kline[0]),    // Open time
            String(kline[1]),    // Open
            String(kline[2]),    // High
            String(kline[3]),    // Low
            String(kline[4]),    // Close
            String(kline[5]),    // Volume
          ];
        } catch (error) {
          console.error('Error processing kline:', error, kline);
          return null;
        }
      }).filter(Boolean);

      // Log the processed data
      console.log('Processed klines data:', {
        length: klines.length,
        sample: klines.slice(0, 2)
      });

      return klines;
    } catch (error: any) {
      // Enhanced error logging
      console.error('Error in getKlines:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        symbol,
        interval
      });

      // If it's a Binance API error, throw it with the specific message
      if (error.response?.data?.msg) {
        throw new Error(`Binance API Error: ${error.response.data.msg}`);
      }

      throw error;
    }
  }

  // Get order book
  async getOrderBook(symbol: string, limit?: number) {
    try {
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/depth`, {
        params: {
          symbol,
          limit: limit || 100
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order book for ${symbol}:`, error);
      throw error;
    }
  }

  // Get recent trades
  async getRecentTrades(symbol: string, limit?: number) {
    try {
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/trades`, {
        params: {
          symbol,
          limit: limit || 500
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent trades for ${symbol}:`, error);
      throw error;
    }
  }

  // Get exchange information
  async getExchangeInfo() {
    try {
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/exchangeInfo`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      throw error;
    }
  }

  // Get average price
  async getAveragePrice(symbol: string) {
    try {
      const response = await axios.get(`${this.BINANCE_BASE_URL}/api/v3/avgPrice`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching average price for ${symbol}:`, error);
      throw error;
    }
  }
}

export default BinanceService.getInstance(); 