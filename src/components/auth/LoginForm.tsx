'use client';

import { useAuth } from '@/lib/auth-context';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

function LoginFormContent({ onSwitchToSignup }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, googleAuth, isLoading, error } = useAuth();

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

        try {
            await login(email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-300 mt-2">Sign in to your VisionChat AI account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Google Sign In */}
                <div className="mb-6">
                    {isLoading ? (
                        <div className="w-full flex items-center justify-center gap-3 bg-gray-500/50 border border-gray-500/30 rounded-xl px-6 py-3 text-gray-400 font-medium cursor-not-allowed">
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
                        />
                    )}
                </div>

                {/* Divider */}
                <div className="flex items-center mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <span className="px-4 text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                    <p className="text-gray-300">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error('Google Client ID not found. Please check your environment variables.');
        return <LoginFormContent onSwitchToSignup={onSwitchToSignup} />;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <LoginFormContent onSwitchToSignup={onSwitchToSignup} />
        </GoogleOAuthProvider>
    );
} 