# 🚀 NeuroCap - Crypto Analysis AI Platform

A comprehensive AI-powered cryptocurrency analysis platform that combines real-time market data, technical analysis, and intelligent chat assistance. Built with Next.js 15, featuring advanced authentication, real-time crypto data, and sophisticated AI-driven insights.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🤖 AI-Powered Crypto Analysis
- **Intelligent Chat Assistant**: Advanced AI that understands crypto markets and provides real-time analysis
- **Technical Analysis Integration**: RSI, Moving Averages, Support/Resistance levels, and Trading Signals
- **Market Sentiment Analysis**: AI-driven sentiment scoring with confidence levels
- **Price Predictions**: Short, medium, and long-term price targets based on technical indicators
- **Real-time Data Integration**: Live market data from Binance API with automatic updates

### 📊 Comprehensive Dashboard
- **Market Overview**: Real-time market statistics, dominance charts, and volume analysis
- **Interactive Charts**: Price charts with technical indicators and trading signals
- **Top Gainers/Losers**: Dynamic lists of best and worst performing cryptocurrencies
- **Portfolio Tracking**: Monitor your favorite cryptocurrencies with advanced analytics
- **Market Trends**: Visual representation of market trends and momentum

### 🔍 Advanced Analysis Tools
- **Technical Indicators**: RSI, SMA (20, 50, 200), MACD, and custom analysis algorithms
- **Trading Signals**: Buy/Sell/Hold recommendations with confidence scores
- **Support & Resistance**: Automated calculation of key price levels
- **Market Sentiment**: Multi-factor sentiment analysis with reasoning
- **Risk Assessment**: Comprehensive risk analysis for trading decisions

### 🎯 Smart Features
- **Contextual AI Responses**: AI assistant that understands specific coin mentions and provides targeted analysis
- **Quick Analysis Prompts**: Pre-built prompts for common analysis scenarios
- **Real-time Updates**: Live market data with 10-second refresh intervals
- **Multi-tab Interface**: Seamless switching between Dashboard, AI Chat, and Live Analysis

### 🔐 Advanced Authentication
- **Dual Authentication System**: Support for both email/password and Google OAuth
- **Secure JWT Tokens**: Industry-standard token-based authentication
- **Email Verification**: Account verification system with secure email delivery
- **Password Reset**: Complete forgot password and reset functionality
- **Session Management**: Persistent login state with automatic token refresh

### 🎨 Modern UI/UX
- **Dark/Light Themes**: Beautiful theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Space-efficient navigation with collapse functionality
- **Smooth Animations**: Polished transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for scalable data storage
- **Mongoose** - MongoDB object modeling
- **Binance API** - Real-time cryptocurrency market data
- **Custom Analysis Engine** - Advanced technical analysis algorithms

### AI & Analysis
- **OpenAI GPT-4** - Advanced language model for crypto analysis
- **Custom Technical Indicators** - RSI, SMA, MACD calculations
- **Sentiment Analysis** - Multi-factor market sentiment scoring
- **Trading Signals** - Automated buy/sell/hold recommendations

### Authentication & Security
- **NextAuth.js** - Complete authentication solution
- **Google OAuth** - Social login integration
- **bcryptjs** - Password hashing
- **JWT** - JSON Web Tokens for secure authentication
- **Email Verification** - Secure account verification

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)
- Gmail account (for email verification)
- OpenAI API key (for AI analysis)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd neurocap
npm install --legacy-peer-deps
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/neurocap

# OpenAI API Key for AI Analysis
NEXT_PUBLIC_DEEP_AI_KEY=your_openai_api_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# JWT Secret
JWT_SECRET=your_secure_jwt_secret

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration
NEXT_PUBLIC_EMAIL=your_gmail@gmail.com
NEXT_PUBLIC_PASS=your_gmail_app_password
```

> 📝 See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment configuration instructions.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create an account using email or Google OAuth
2. **Verify Email**: Check your email for verification (if using email signup)
3. **Explore Dashboard**: View real-time market data and trending cryptocurrencies
4. **Start AI Chat**: Get personalized crypto analysis and trading advice
5. **Analyze Markets**: Use the Live Analysis tab for comprehensive market insights

### Key Features Walkthrough

#### 🏠 Dashboard Tab
- **Market Stats Bar**: Real-time BTC/ETH prices and market dominance
- **Trending Coins**: Top gainers and most active cryptocurrencies
- **Market Table**: Comprehensive list of cryptocurrencies with price, volume, and sparkline charts
- **Interactive Charts**: Click on any cryptocurrency to view detailed charts

#### 🤖 AI Analysis Tab
- **Smart Chat**: Ask questions about specific cryptocurrencies or market trends
- **Technical Analysis**: Get detailed RSI, moving averages, and trading signals
- **Quick Prompts**: Use pre-built prompts for common analysis scenarios
- **Real-time Context**: AI responses include live market data and technical indicators

#### 📊 Live Analysis Tab
- **Market Sentiment**: Real-time bullish/bearish sentiment analysis
- **Top Gainers/Losers**: Dynamic lists with performance metrics
- **Market Overview**: Comprehensive market statistics and trends
- **AI Quick Analysis**: Instant market insights and trading opportunities

### Advanced Usage Tips

1. **Specific Coin Analysis**: Mention any cryptocurrency by name in the AI chat to get detailed technical analysis
2. **Market Trends**: Ask "What are the current market trends?" to get comprehensive market overview
3. **Trading Signals**: Request "Should I buy Bitcoin?" for personalized trading recommendations
4. **Risk Assessment**: Ask about portfolio diversification for risk management advice

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # AI chat functionality
│   │   ├── chats/         # Chat management
│   │   └── crypto/        # Crypto data and analysis
│   │       ├── route.ts   # Market data API
│   │       └── analysis/  # Advanced analysis API
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   ├── crypto/            # Crypto-specific pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main unified dashboard
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── CryptoAIChat/      # AI chat component
│   ├── CryptoDashboard/   # Dashboard components
│   ├── CryptoDetail/      # Crypto detail components
│   ├── TradingChart/      # Chart components
│   ├── TopNavBar/         # Navigation
│   └── NewPage/           # Landing page components
└── lib/                   # Utility libraries
    ├── AuthContext/       # Authentication context
    ├── Theme/            # Theme management
    ├── db/               # Database connection
    ├── models/           # Data models
    └── services/         # External services
```

## 🔧 Available Scripts

```bash
# Development with Turbopack (recommended)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Install dependencies (use this for initial setup)
npm install --legacy-peer-deps
```

## 🌐 API Endpoints

### Crypto Data API
- `GET /api/crypto?action=market-stats` - Get market statistics
- `GET /api/crypto?action=tickers` - Get cryptocurrency tickers
- `GET /api/crypto?action=klines&symbol=BTCUSDT` - Get price history

### Advanced Analysis API
- `GET /api/crypto/analysis?symbol=BTCUSDT&action=technical-analysis` - Get technical analysis
- `GET /api/crypto/analysis?symbol=BTCUSDT&action=market-overview` - Get market overview

### Chat API
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chats` - Get user's chat history
- `POST /api/chats` - Create new chat session

## � Key Features Deep Dive

### AI-Powered Analysis
The AI assistant provides:
- **Real-time Market Context**: Every response includes current market data
- **Technical Analysis**: RSI, moving averages, support/resistance levels
- **Trading Signals**: Buy/sell/hold recommendations with confidence scores
- **Market Sentiment**: Bullish/bearish sentiment with reasoning
- **Price Predictions**: Short, medium, and long-term price targets

### Advanced Technical Analysis
- **RSI Calculation**: 14-period Relative Strength Index
- **Moving Averages**: 20, 50, and 200-period Simple Moving Averages
- **Support/Resistance**: Automated calculation of key price levels
- **Trading Signals**: Multi-factor signal generation
- **Market Sentiment**: Volume, momentum, and technical indicator-based sentiment

### Real-time Data Integration
- **Binance API**: Live market data with 10-second updates
- **Market Statistics**: Real-time market cap, volume, and dominance
- **Price Charts**: Interactive charts with technical indicators
- **Trending Analysis**: Top gainers, losers, and most active cryptocurrencies

## �🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `MONGO_URI` - MongoDB connection string
- `NEXT_PUBLIC_DEEP_AI_KEY` - OpenAI API key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `JWT_SECRET` - JWT signing secret
- `NEXT_PUBLIC_SITE_URL` - Production URL
- `NEXT_PUBLIC_EMAIL` - Email for notifications
- `NEXT_PUBLIC_PASS` - Email password

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Environment Setup Guide](./ENV_SETUP.md)
- [API Documentation](./docs/API.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔧 Troubleshooting

### Common Issues

1. **Dependencies Installation Error**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Database Connection Issues**
   - Check MongoDB connection string
   - Ensure MongoDB is running
   - Verify network connectivity

3. **API Key Issues**
   - Verify OpenAI API key is valid
   - Check API key permissions
   - Ensure sufficient API credits

4. **Authentication Problems**
   - Verify Google OAuth configuration
   - Check JWT secret configuration
   - Ensure email service is configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [OpenAI](https://openai.com/) - AI language model integration
- [Binance API](https://binance-docs.github.io/apidocs/) - Real-time cryptocurrency data
- [MongoDB](https://www.mongodb.com/) - Database platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library

---

<div align="center">
  <strong>🚀 Built for the future of crypto analysis with AI-powered insights</strong>
  <br>
  <em>Transform your crypto trading with intelligent, data-driven analysis</em>
</div>
