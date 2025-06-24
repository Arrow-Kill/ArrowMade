'use client';

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { suppressGoogleOAuthErrors } from '@/lib/google-auth-utils';
import { ThemeProvider } from '@/lib/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Suppress Google OAuth console errors and redirect if user is already authenticated
  useEffect(() => {
    // Suppress the Cross-Origin-Opener-Policy console errors from Google OAuth
    suppressGoogleOAuthErrors();

    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <>
      {isLogin ? (
        <LoginForm onSwitchToSignupAction={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLoginAction={() => setIsLogin(true)} />
      )}
    </>
  );
}

export default function AuthPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthPageContent />
      </AuthProvider>
    </ThemeProvider>
  );
} 