'use client';

import { useAuth } from '@/lib/AuthContext/auth-context';
import { useTheme } from '@/lib/Theme/theme-context';
import { Bot, Send, TrendingUp, DollarSign, PieChart, BarChart3, Activity, Lightbulb, AlertCircle, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cryptoData?: any;
}

interface CryptoAIChatProps {
  cryptoData: CryptoData[];
  marketStats: MarketStats;
}

export default function CryptoAIChat({ cryptoData, marketStats }: CryptoAIChatProps) {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    if (user && token && !chatId) {
      initializeChat();
    }
  }, [user, token, chatId]);

  const initializeChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Crypto Analysis Chat'
        }),
      });

      if (response.ok) {
        const { chatId: newChatId } = await response.json();
        setChatId(newChatId);
        
        // Add welcome message
        setMessages([{
          id: Date.now().toString(),
          role: 'assistant',
          content: `Welcome to your Crypto Analysis AI! I can help you with:

• **Market Analysis** - Real-time insights on market trends
• **Price Predictions** - Technical analysis and forecasts  
• **Portfolio Advice** - Investment strategies and risk management
• **Crypto News** - Latest developments and market sentiment
• **Trading Signals** - Buy/sell recommendations based on data

Current Market Overview:
- BTC: $${marketStats.btcPrice.toFixed(2)} (${marketStats.btcChange24h.toFixed(2)}%)
- ETH: $${marketStats.ethPrice.toFixed(2)} (${marketStats.ethChange24h.toFixed(2)}%)
- Market Cap: $${(marketStats.marketCap / 1e9).toFixed(2)}B
- BTC Dominance: ${marketStats.dominance.btc.toFixed(1)}%

What would you like to analyze today?`,
          timestamp: new Date(),
          cryptoData: { marketStats }
        }]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !chatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Fetch additional market analysis data
      let advancedAnalysis = '';
      
      // Check if user is asking about specific coins
      const coinMentions = cryptoData.filter(coin => 
        inputMessage.toLowerCase().includes(coin.symbol.toLowerCase()) ||
        inputMessage.toLowerCase().includes(coin.name.toLowerCase())
      );
      
      if (coinMentions.length > 0) {
        const coin = coinMentions[0];
        try {
          const analysisResponse = await fetch(`/api/crypto/analysis?symbol=${coin.symbol}&action=technical-analysis`);
          if (analysisResponse.ok) {
            const analysis = await analysisResponse.json();
            advancedAnalysis = `
Technical Analysis for ${coin.symbol}:
- RSI: ${analysis.technicalIndicators.rsi.toFixed(2)}
- SMA20: $${analysis.technicalIndicators.movingAverages.sma20.toFixed(2)}
- SMA50: $${analysis.technicalIndicators.movingAverages.sma50.toFixed(2)}
- Sentiment: ${analysis.sentiment.sentiment} (${analysis.sentiment.confidence}% confidence)
- Trading Signal: ${analysis.tradingSignal.signal.toUpperCase()} (${analysis.tradingSignal.strength}% strength)
- Signal Reasoning: ${analysis.tradingSignal.reasoning}
- Support Levels: ${analysis.supportLevels.map((l: number) => `$${l.toFixed(2)}`).join(', ')}
- Resistance Levels: ${analysis.resistanceLevels.map((l: number) => `$${l.toFixed(2)}`).join(', ')}
- Price Targets: Short ${analysis.priceTarget.short.toFixed(2)}, Medium ${analysis.priceTarget.medium.toFixed(2)}, Long ${analysis.priceTarget.long.toFixed(2)}
`;
          }
        } catch (error) {
          console.error('Error fetching analysis:', error);
        }
      }
      
      // Get market overview if asking about general market
      if (inputMessage.toLowerCase().includes('market') || inputMessage.toLowerCase().includes('overview')) {
        try {
          const overviewResponse = await fetch('/api/crypto/analysis?symbol=BTCUSDT&action=market-overview');
          if (overviewResponse.ok) {
            const overview = await overviewResponse.json();
            advancedAnalysis += `
Market Overview:
- Total Markets: ${overview.totalMarkets}
- Gainers: ${overview.gainers} | Losers: ${overview.losers}
- Average Change: ${overview.avgChange.toFixed(2)}%
- Total Volume: $${(overview.totalVolume / 1e9).toFixed(2)}B

Top Gainers:
${overview.topGainers.map((g: any) => `- ${g.symbol}: $${g.price.toFixed(2)} (+${g.change.toFixed(2)}%)`).join('\n')}

Top Losers:
${overview.topLosers.map((l: any) => `- ${l.symbol}: $${l.price.toFixed(2)} (${l.change.toFixed(2)}%)`).join('\n')}
`;
          }
        } catch (error) {
          console.error('Error fetching market overview:', error);
        }
      }

      // Enhanced context for crypto analysis
      const cryptoContext = `
Current Market Data:
- BTC: $${marketStats.btcPrice.toFixed(2)} (${marketStats.btcChange24h.toFixed(2)}%)
- ETH: $${marketStats.ethPrice.toFixed(2)} (${marketStats.ethChange24h.toFixed(2)}%)
- Market Cap: $${(marketStats.marketCap / 1e9).toFixed(2)}B
- 24h Volume: $${(marketStats.volume24h / 1e9).toFixed(2)}B
- BTC Dominance: ${marketStats.dominance.btc.toFixed(1)}%

Top Trending Coins:
${cryptoData.slice(0, 10).map(coin => 
  `- ${coin.symbol}: $${coin.price} (${coin.priceChangePercent}%)`
).join('\n')}

${advancedAnalysis}

As a crypto analysis AI, provide insights based on this real-time data and technical analysis.
      `;

      const contextMessages = [
        {
          role: 'system',
          content: `You are a professional cryptocurrency analyst and trading advisor. You have access to real-time market data, technical indicators, and trading signals. Provide insightful, data-driven analysis using the provided market data and technical analysis. Always include relevant market data in your responses when applicable. Be helpful but remind users that crypto investments carry risk and to do their own research.

${cryptoContext}`
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: inputMessage
        }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: contextMessages,
          chatId: chatId
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        let assistantResponse = '';
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'content') {
                  assistantResponse += data.content;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantResponse }
                      : msg
                  ));
                }
              } catch (e) {
                // Ignore JSON parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Analyze current market trends",
      prompt: "What are the current market trends and what's driving them?"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "Bitcoin price prediction",
      prompt: "What's your analysis on Bitcoin's price movement? Should I buy or wait?"
    },
    {
      icon: <PieChart className="w-4 h-4" />,
      text: "Portfolio diversification",
      prompt: "How should I diversify my crypto portfolio based on current market conditions?"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      text: "Technical analysis",
      prompt: "Can you provide technical analysis for the top cryptocurrencies?"
    },
    {
      icon: <Activity className="w-4 h-4" />,
      text: "Market sentiment",
      prompt: "What's the current market sentiment and what factors are influencing it?"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Trading opportunities",
      prompt: "Are there any good trading opportunities in the current market?"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-800 px-6 py-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Crypto Analysis AI</h2>
              <p className="text-sm text-zinc-400">Real-time market insights & trading advice</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-zinc-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Live Market Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-6 bg-zinc-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3 max-w-[80%]`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-zinc-700'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-zinc-100'
              }`}>
                <div className="prose prose-invert max-w-none">
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-blue-400 rounded-full" style={{animationDelay: '0.1s'}}></div>
                  <div className="animate-bounce w-2 h-2 bg-blue-400 rounded-full" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-sm text-zinc-400 ml-2">Analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Quick Analysis Options:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt.prompt)}
                className="flex items-center space-x-2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors text-left"
              >
                <div className="text-blue-400">{prompt.icon}</div>
                <span className="text-sm text-zinc-300">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-4 bg-zinc-800 border-t border-zinc-700">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crypto markets, prices, trading strategies..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        <div className="flex justify-between items-center text-xs text-zinc-400 mt-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputMessage.length} characters</span>
        </div>
      </div>
    </div>
  );
}