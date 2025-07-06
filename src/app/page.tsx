'use client';

import DashboardGrid from '@/components/CryptoDashboard/DashboardGrid';
import MarketStatsBar from '@/components/CryptoDashboard/MarketStatsBar';
import MarketTable from '@/components/CryptoDashboard/MarketTable';
import TopNavBar from '@/components/TopNavBar/TopNavBar';
import { AuthProvider } from '@/lib/AuthContext/auth-context';
import { useEffect, useState } from 'react';

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
      <CryptoDashboard />
    </AuthProvider>
  );
}

function CryptoDashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    cryptos: 0,
    exchanges: 1,
    marketCap: 0,
    volume24h: 0,
    dominance: {
      btc: 0,
      eth: 0
    },
    btcPrice: 0,
    ethPrice: 0,
    btcChange24h: 0,
    ethChange24h: 0
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Theme classes
  const themeClasses = {
    background: 'bg-black',
    text: 'text-white',
    card: 'bg-zinc-900',
    cardHover: 'hover:bg-zinc-800',
    border: 'border-zinc-800',
    button: 'bg-white text-black hover:bg-zinc-200',
    buttonText: 'text-black',
    input: 'bg-zinc-900 border-zinc-800',
    secondaryText: 'text-zinc-400'
  };

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
    const statsInterval = setInterval(fetchMarketStats, 30000); // Update every 30 seconds
    return () => clearInterval(statsInterval);
  }, []);

  const formatNumber = (num: number | string | undefined): string => {
    if (!num) return '0';
    const n = typeof num === 'string' ? parseFloat(num) : num;
    return n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice < 1) {
      return numPrice.toFixed(6);
    }
    return numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`/api/crypto?action=tickers&page=${currentPage}&limit=20`);
        const result = await response.json();
        const formattedData = result.data.map((item: any) => ({
          symbol: item.symbol,
          name: item.name || item.symbol,
          price: formatPrice(item.lastPrice),
          priceChangePercent: item.priceChangePercent,
          volume24h: formatNumber(item.quoteVolume),
          marketCap: formatNumber(item.marketCap),
          circulatingSupply: `${formatNumber(item.circulatingSupply)} ${item.symbol.replace('USDT', '')}`,
          rank: item.rank,
          coinId: item.symbol.toLowerCase(),
          image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
          sparkline_in_7d: item.sparkline_in_7d
        }));
        setCryptoData(formattedData);
        setTotalPages(result.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setIsLoading(false);
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

  // Get trending coins (top gainers)
  const trendingCoins = [...cryptoData]
    .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
    .slice(0, 3);

  // Get DexScan trending (most volume)
  const dexTrending = [...cryptoData]
    .sort((a, b) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
    .slice(0, 3);

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <TopNavBar theme={theme} themeClasses={themeClasses} />

      <div className="pt-16 w-full overflow-x-hidden">
        <MarketStatsBar
          theme={theme}
          themeClasses={themeClasses}
          {...marketStats}
        />

        <main className="max-w-[90rem] mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8">
            <DashboardGrid
              theme={theme}
              themeClasses={themeClasses}
              trendingCoins={trendingCoins}
              dexTrending={dexTrending}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <MarketTable
                  theme={theme}
                  themeClasses={themeClasses}
                  coins={cryptoData}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
