'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { ThemeProvider } from '@/lib/theme-context';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const handleBackToLogin = () => {
        router.push('/auth');
    };

    return (
        <ThemeProvider>
            <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        </ThemeProvider>
    );
} 