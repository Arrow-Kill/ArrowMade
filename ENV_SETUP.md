# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/visionchat
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/visionchat

# OpenRouter API Key (for chat functionality)
NEXT_PUBLIC_DEEP_AI_KEY=your_openrouter_api_key_here

# Google OAuth Client ID (only Client ID needed with @react-oauth/google)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# JWT Secret for token signing (generate a random string)
JWT_SECRET=your_jwt_secret_key_here

# Site URL (for Google OAuth and email verification)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (for verification emails)
NEXT_PUBLIC_EMAIL=your_gmail_address@gmail.com
NEXT_PUBLIC_PASS=your_gmail_app_password_here
```

## Setup Instructions:

### 1. MongoDB Setup
- **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/visionchat`
- **MongoDB Atlas**: Create a free cluster at https://cloud.mongodb.com and use the connection string

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized origins: `http://localhost:3000` (and your production domain)
7. Copy the Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### 3. JWT Secret
Generate a secure random string for JWT_SECRET:
```bash
# You can use this command to generate a random string:
openssl rand -base64 32
```

### 4. OpenRouter API Key
You should already have this from your previous setup.

### 5. Email Configuration (for Email Verification)
1. Use a Gmail account for sending verification emails
2. Enable 2-Factor Authentication on your Gmail account
3. Generate an App Password:
   - Go to Google Account settings → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password (not your regular Gmail password) for `NEXT_PUBLIC_PASS`
4. Set `NEXT_PUBLIC_EMAIL` to your Gmail address

## Database Collections
The system automatically creates two separate collections:
- `users` - For email/password authentication
- `googleusers` - For Google OAuth authentication

This separation allows for different user models and authentication flows. 