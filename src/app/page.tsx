'use client';

import { AuthProvider, useAuth } from '@/lib/AuthContext/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function HomeContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/chat');
      } else {
        router.push('/auth');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-2 border-gray-600 rounded-full"></div>
        {/* Inner loading circle */}
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-t-white rounded-full animate-smooth-spin"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
