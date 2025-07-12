'use client';

import { AuthProvider } from '@/lib/AuthContext/auth-context';
import { useAuth } from '@/lib/AuthContext/auth-context';
import { useTheme } from '@/lib/Theme/theme-context';
import CryptoAIChat from '@/components/CryptoAIChat/CryptoAIChat';
import DashboardGrid from '@/components/CryptoDashboard/DashboardGrid';
import MarketStatsBar from '@/components/CryptoDashboard/MarketStatsBar';
import MarketTable from '@/components/CryptoDashboard/MarketTable';
import TopNavBar from '@/components/TopNavBar/TopNavBar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bot, TrendingUp, MessageSquare, BarChart3, PieChart, Activity } from 'lucide-react';

interface CryptoData {
  symbol: string;
  name: string;
  price: string;
  priceChangePercent: string;
  volume24h: string;
  marketCap: string;
  circulatingSupply: string;
  rank: number;
  coinId?: string;
  image?: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface MarketStats {
  cryptos: number;
  exchanges: number;
  marketCap: number;
  volume24h: number;
  dominance: {
    btc: number;
    eth: number;
  };
  btcPrice: number;
  ethPrice: number;
  btcChange24h: number;
  ethChange24h: number;
}

export default function Home() {
  return (
    <AuthProvider>
      <CryptoAnalysisHub />
    </AuthProvider>
  );
}

function CryptoAnalysisHub() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'analysis'>('dashboard');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    cryptos: 0,
    exchanges: 1,
    marketCap: 0,
    volume24h: 0,
    dominance: { btc: 0, eth: 0 },
    btcPrice: 0,
    ethPrice: 0,
    btcChange24h: 0,
    ethChange24h: 0
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Fetch market stats
  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        const response = await fetch('/api/crypto?action=market-stats');
        const data = await response.json();
        setMarketStats(data);
      } catch (error) {
        console.error('Error fetching market stats:', error);
      }
    };

    fetchMarketStats();
    const statsInterval = setInterval(fetchMarketStats, 30000);
    return () => clearInterval(statsInterval);
  }, []);

  // Fetch crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`/api/crypto?action=tickers&page=${currentPage}&limit=20`);
        const result = await response.json();
        const formattedData = result.data.map((item: any) => ({
          symbol: item.symbol,
          name: item.name || item.symbol,
          price: typeof item.lastPrice === 'string' ? parseFloat(item.lastPrice).toFixed(item.lastPrice.includes('.') && parseFloat(item.lastPrice) < 1 ? 6 : 2) : item.lastPrice.toFixed(2),
          priceChangePercent: item.priceChangePercent,
          volume24h: item.quoteVolume,
          marketCap: item.marketCap,
          circulatingSupply: `${item.circulatingSupply} ${item.symbol.replace('USDT', '')}`,
          rank: item.rank,
          coinId: item.symbol.toLowerCase(),
          image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
          sparkline_in_7d: item.sparkline_in_7d
        }));
        setCryptoData(formattedData);
        setIsLoadingData(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setIsLoadingData(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const trendingCoins = [...cryptoData]
    .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
    .slice(0, 3);

  const dexTrending = [...cryptoData]
    .sort((a, b) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary}`}>
      <TopNavBar theme="dark" themeClasses={{
        background: 'bg-black',
        text: 'text-white',
        card: 'bg-zinc-900',
        cardHover: 'hover:bg-zinc-800',
        border: 'border-zinc-800',
        button: 'bg-white text-black hover:bg-zinc-200',
        buttonText: 'text-black',
        input: 'bg-zinc-900 border-zinc-800',
        secondaryText: 'text-zinc-400'
      }} />

      <div className="pt-16 w-full overflow-x-hidden">
        <MarketStatsBar
          theme="dark"
          themeClasses={{
            background: 'bg-black',
            text: 'text-white',
            card: 'bg-zinc-900',
            cardHover: 'hover:bg-zinc-800',
            border: 'border-zinc-800',
            secondaryText: 'text-zinc-400'
          }}
          {...marketStats}
        />

        {/* Main Navigation Tabs */}
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-4">
          <div className="flex space-x-1 bg-zinc-900 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'analysis' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Analysis</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <main className="max-w-[90rem] mx-auto px-4 sm:px-6 pb-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <DashboardGrid
                theme="dark"
                themeClasses={{
                  background: 'bg-black',
                  text: 'text-white',
                  card: 'bg-zinc-900',
                  cardHover: 'hover:bg-zinc-800',
                  border: 'border-zinc-800',
                  secondaryText: 'text-zinc-400'
                }}
                trendingCoins={trendingCoins}
                dexTrending={dexTrending}
              />

              {isLoadingData ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                  <MarketTable
                    theme="dark"
                    themeClasses={{
                      background: 'bg-black',
                      text: 'text-white',
                      card: 'bg-zinc-900',
                      cardHover: 'hover:bg-zinc-800',
                      border: 'border-zinc-800',
                      secondaryText: 'text-zinc-400'
                    }}
                    coins={cryptoData}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="mt-8">
              <CryptoAIChat cryptoData={cryptoData} marketStats={marketStats} />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Real-time Market Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-300 mb-2">Market Sentiment</p>
                      <p className="text-lg font-semibold text-green-400">
                        {marketStats.btcChange24h > 0 ? 'Bullish' : 'Bearish'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        BTC: {marketStats.btcChange24h.toFixed(2)}% | ETH: {marketStats.ethChange24h.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-300 mb-2">Top Gainers</p>
                      {trendingCoins.slice(0, 3).map((coin) => (
                        <div key={coin.symbol} className="flex justify-between items-center mb-2">
                          <span className="text-sm">{coin.symbol}</span>
                          <span className="text-sm text-green-400">+{coin.priceChangePercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-blue-400" />
                    AI Quick Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <p className="text-sm text-zinc-300 mb-2">Market Overview</p>
                      <p className="text-sm">
                        Current market cap: ${(marketStats.marketCap / 1e9).toFixed(2)}B
                      </p>
                      <p className="text-sm">
                        24h Volume: ${(marketStats.volume24h / 1e9).toFixed(2)}B
                      </p>
                      <p className="text-sm">
                        BTC Dominance: {marketStats.dominance.btc.toFixed(1)}%
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium transition-colors"
                    >
                      Start AI Analysis Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
