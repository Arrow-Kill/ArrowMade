'use client';

import { useAuth } from '@/lib/AuthContext/auth-context';
import { useTheme } from '@/lib/Theme/theme-context';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface LoginFormProps {
    onSwitchToSignupAction: () => void;
}

function LoginFormContent({ onSwitchToSignupAction }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const { login, googleAuth, isLoading, error } = useAuth();
    const { theme } = useTheme();

    const handleGoogleSuccess = (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                googleAuth(credentialResponse.credential);
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google login failed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setResendMessage(null);
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleResendVerification = async () => {
        if (!email.trim()) {
            setResendMessage('Please enter your email address first');
            return;
        }

        setIsResendingVerification(true);
        setResendMessage(null);

        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendMessage('Verification email sent! Please check your inbox.');
            } else {
                setResendMessage(data.error || 'Failed to send verification email');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            setResendMessage('Failed to send verification email. Please try again.');
        } finally {
            setIsResendingVerification(false);
        }
    };

    return (
        <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md mx-auto">
                <div className={`${theme.bg.secondary} border ${theme.border.primary} rounded-xl p-8 shadow-sm`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`mx-auto w-16 h-16 ${theme.accent.primary} rounded-xl flex items-center justify-center mb-4`}>
                            <Lock className={`w-8 h-8 ${theme.text.inverse}`} />
                        </div>
                        <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
                            Welcome Back
                        </h1>
                        <p className={`${theme.text.secondary}`}>Sign in to your VisionChat AI account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={`mb-6 p-4 ${theme.bg.tertiary} border ${theme.border.secondary} rounded-lg ${theme.text.primary}`}>
                            <p className="text-sm">{error}</p>
                            {error.includes('verify your email') && (
                                <div className="mt-3">
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={isResendingVerification}
                                        className={`inline-flex items-center gap-2 text-xs ${theme.accent.primary} ${theme.text.inverse} px-3 py-2 rounded-lg transition-all duration-200 ${theme.accent.hover} disabled:opacity-50`}
                                    >
                                        {isResendingVerification ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4" />
                                                Resend Verification Email
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resend Message */}
                    {resendMessage && (
                        <div className={`mb-6 p-4 border rounded-lg text-sm ${resendMessage.includes('sent')
                            ? `${theme.bg.tertiary} ${theme.border.primary} ${theme.text.primary}`
                            : `${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary}`
                            }`}>
                            {resendMessage}
                        </div>
                    )}

                    {/* Google Sign In */}
                    <div className="mb-6">
                        {isLoading ? (
                            <div className={`w-full flex items-center justify-center gap-3 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg px-6 py-3 ${theme.text.secondary} font-medium cursor-not-allowed`}>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Continue with Google
                            </div>
                        ) : (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_blue"
                                size="large"
                                width="100%"
                                text="continue_with"
                                useOneTap={false}
                                auto_select={false}
                            />
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-6">
                        <div className={`flex-1 h-px ${theme.border.primary}`}></div>
                        <span className={`px-4 ${theme.text.tertiary} text-sm`}>or</span>
                        <div className={`flex-1 h-px ${theme.border.primary}`}></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
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

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                Password
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
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme.text.tertiary} hover:${theme.text.secondary}`}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <a
                                href="/auth/forgot-password"
                                className={`text-sm ${theme.text.secondary} hover:${theme.text.primary} transition-colors duration-200`}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Switch to Signup */}
                    <div className="mt-8 text-center">
                        <p className={`${theme.text.secondary}`}>
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToSignupAction}
                                className={`${theme.text.primary} font-medium transition-colors duration-200 hover:underline`}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginForm({ onSwitchToSignupAction }: LoginFormProps) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error('Google Client ID not found. Please check your environment variables.');
        return <LoginFormContent onSwitchToSignupAction={onSwitchToSignupAction} />;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <LoginFormContent onSwitchToSignupAction={onSwitchToSignupAction} />
        </GoogleOAuthProvider>
    );
} 