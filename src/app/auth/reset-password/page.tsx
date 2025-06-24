'use client';

import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function ResetPasswordPageContent() {
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success' | 'error'>('loading');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { theme } = useTheme();

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else {
            setStatus('invalid');
            setError('No reset token provided');
        }
    }, [token]);

    const verifyToken = async (resetToken: string) => {
        try {
            const response = await fetch(`/api/auth/reset-password?token=${resetToken}`);
            const data = await response.json();

            if (response.ok) {
                setStatus('valid');
                setUserName(data.user?.name || '');
                setUserEmail(data.user?.email || '');
            } else {
                setStatus('invalid');
                setError(data.error || 'Invalid reset token');
            }
        } catch (error) {
            console.error('Token verification error:', error);
            setStatus('invalid');
            setError('Something went wrong. Please try again.');
        }
    };

    const validatePassword = (pass: string, confirmPass: string) => {
        if (pass.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }
        if (pass !== confirmPass) {
            setPasswordError('Passwords do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !confirmPassword || !token) return;

        if (!validatePassword(password, confirmPassword)) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToLogin = () => {
        router.push('/auth');
    };

    if (status === 'loading') {
        return (
            <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className={`${theme.bg.secondary} p-8 rounded-2xl shadow-2xl border ${theme.border.primary}`}>
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-6" />
                            <h1 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>
                                Verifying Reset Token
                            </h1>
                            <p className={`${theme.text.secondary}`}>
                                Please wait while we verify your password reset link...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className={`${theme.bg.secondary} p-8 rounded-2xl shadow-2xl border ${theme.border.primary}`}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>

                            <h1 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>
                                Invalid Reset Link
                            </h1>

                            <p className={`${theme.text.secondary} mb-6`}>
                                {error || 'This password reset link is invalid or has expired.'}
                            </p>

                            <button
                                onClick={goToLogin}
                                className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02]`}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className={`${theme.bg.secondary} p-8 rounded-2xl shadow-2xl border ${theme.border.primary}`}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h1 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>
                                Password Reset Successfully!
                            </h1>

                            <p className={`${theme.text.secondary} mb-6`}>
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>

                            <button
                                onClick={goToLogin}
                                className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02]`}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md">
                <div className={`${theme.bg.secondary} p-8 rounded-2xl shadow-2xl border ${theme.border.primary}`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2`}>
                            Reset Password
                        </h1>
                        <p className={`${theme.text.secondary} mb-2`}>
                            Hello {userName}! Set a new password for your account.
                        </p>
                        <p className={`${theme.text.secondary} text-sm`}>
                            {userEmail}
                        </p>
                    </div>

                    {/* Error Message */}
                    {(error || passwordError) && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{error || passwordError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${theme.text.tertiary}`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className={`h-5 w-5 ${theme.text.tertiary} hover:${theme.text.secondary} transition-colors`} />
                                    ) : (
                                        <Eye className={`h-5 w-5 ${theme.text.tertiary} hover:${theme.text.secondary} transition-colors`} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${theme.text.tertiary}`} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className={`h-5 w-5 ${theme.text.tertiary} hover:${theme.text.secondary} transition-colors`} />
                                    ) : (
                                        <Eye className={`h-5 w-5 ${theme.text.tertiary} hover:${theme.text.secondary} transition-colors`} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !password || !confirmPassword}
                            className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Reset Password
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={goToLogin}
                            className={`${theme.text.secondary} font-medium transition-colors duration-200 hover:${theme.text.primary}`}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <ThemeProvider>
            <ResetPasswordPageContent />
        </ThemeProvider>
    );
} 