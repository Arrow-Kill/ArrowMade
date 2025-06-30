'use client';

import { AuthProvider } from '@/lib/AuthContext/auth-context';

export default function CryptoLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <AuthProvider>
            <div>
                <main>
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
} 