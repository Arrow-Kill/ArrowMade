# 🚀 VisionChat AI

A modern, full-stack AI chat application built with Next.js 15, featuring advanced authentication, real-time conversations, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🤖 AI-Powered Chat
- **OpenAI Integration**: Powered by advanced language models for intelligent conversations
- **Real-time Responses**: Instant AI responses with streaming support
- **Context Awareness**: Maintains conversation context across messages
- **Quick Prompts**: Pre-built prompts for common use cases (data analysis, business strategy, technical solutions)

### 🔐 Advanced Authentication
- **Dual Authentication System**: Support for both email/password and Google OAuth
- **Secure JWT Tokens**: Industry-standard token-based authentication
- **Email Verification**: Account verification system with secure email delivery
- **Password Reset**: Complete forgot password and reset functionality
- **Session Management**: Persistent login state with automatic token refresh

### 💼 Chat Management
- **Multiple Conversations**: Create and manage unlimited chat sessions
- **Chat History**: Persistent conversation storage with MongoDB
- **Auto-Save**: Automatic conversation saving and restoration
- **Chat Organization**: Easy navigation between different conversations

### 🎨 Modern UI/UX
- **Dark/Light Themes**: Beautiful theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Space-efficient navigation with collapse functionality
- **Smooth Animations**: Polished transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🏗️ Technical Excellence
- **TypeScript**: Full type safety across the entire application
- **Server Components**: Next.js 15 App Router with React Server Components
- **API Routes**: RESTful API design with proper error handling
- **Database Integration**: MongoDB with Mongoose ODM
- **Performance Optimized**: Turbopack dev server and optimized builds

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
- **JWT** - JSON Web Tokens for authentication

### Authentication & Security
- **NextAuth.js** - Complete authentication solution
- **Google OAuth** - Social login integration
- **bcryptjs** - Password hashing
- **Email Verification** - Secure account verification

### Development Tools
- **Turbopack** - Ultra-fast bundler for development
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)
- Gmail account (for email verification)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd arrow-kill
npm install
# or
yarn install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/visionchat

# OpenAI API Key
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
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📱 Usage

### Getting Started
1. **Sign Up**: Create an account using email or Google OAuth
2. **Verify Email**: Check your email for verification (if using email signup)
3. **Start Chatting**: Create your first chat and begin conversing with AI
4. **Explore Features**: Try quick prompts, manage multiple chats, and customize themes

### Key Workflows
- **New Conversation**: Click "New Chat" to start a fresh conversation
- **Switch Themes**: Use the theme toggle for dark/light mode
- **Chat Navigation**: Use the sidebar to switch between conversations
- **Profile Management**: Access user settings and logout options

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat functionality
│   │   └── chats/         # Chat management
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   │   └── [chatId]/      # Dynamic chat routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── constants/         # Application constants
│   ├── NewPage/           # Landing page components
│   └── types/             # TypeScript type definitions
└── lib/                   # Utility libraries
    ├── auth-context.tsx   # Authentication context
    ├── theme-context.tsx  # Theme management
    └── mongodb.ts         # Database connection
```

## 🔧 Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [OpenAI](https://openai.com/) - AI language model integration
- [MongoDB](https://www.mongodb.com/) - Database platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library

---

<div align="center">
  <strong>Built with ❤️ using modern web technologies</strong>
</div>
