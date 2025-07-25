'use client';

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { AuthProvider, useAuth } from '@/lib/AuthContext/auth-context';
import { ThemeProvider } from '@/lib/Theme/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

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