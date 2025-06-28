# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/visionchat
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/visionchat

# Google OAuth Client ID (only Client ID needed with @react-oauth/google)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Bing Web Search API Key
BING_SUBSCRIPTION_KEY=your_bing_api_key_here

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

### 3. Bing Web Search API Setup
1. Go to [Microsoft Azure Portal](https://portal.azure.com/)
2. Create a free account if you don't have one
3. Create a new Bing Search resource
4. Choose the F1 free tier (free - 3 transactions per second, 1000 transactions per month)
5. After creation, go to "Keys and Endpoint"
6. Copy either Key 1 or Key 2 to `BING_SUBSCRIPTION_KEY`

### 4. JWT Secret
Generate a secure random string for JWT_SECRET:
```bash
# You can use this command to generate a random string:
openssl rand -base64 32
```

### 5. Email Configuration (for Email Verification)
1. Use a Gmail account for sending verification emails
2. Enable 2-Factor Authentication on your Gmail account

## Database Collections
The system automatically creates two separate collections:
- `users` - For email/password authentication
- `googleusers` - For Google OAuth authentication

This separation allows for different user models and authentication flows. 