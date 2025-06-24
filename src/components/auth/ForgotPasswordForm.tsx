'use client';

import { useTheme } from '@/lib/theme-context';
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to send reset email');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className={`${theme.bg.secondary} p-8 rounded-2xl shadow-2xl border ${theme.border.primary}`}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h1 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>
                                Check Your Email
                            </h1>

                            <p className={`${theme.text.secondary} mb-6`}>
                                We've sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions to reset your password.
                            </p>

                            <p className={`${theme.text.secondary} text-sm mb-6`}>
                                The link will expire in 24 hours. If you don't see the email, check your spam folder.
                            </p>

                            <button
                                onClick={onBackToLogin}
                                className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Login
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
                            Forgot Password
                        </h1>
                        <p className={`${theme.text.secondary}`}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${theme.text.tertiary}`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Reset Link...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onBackToLogin}
                            className={`${theme.text.secondary} font-medium transition-colors duration-200 hover:${theme.text.primary} flex items-center justify-center gap-2 mx-auto`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 