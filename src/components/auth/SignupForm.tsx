'use client';

import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';

interface SignupFormProps {
    onSwitchToLoginAction: () => void;
}

function SignupFormContent({ onSwitchToLoginAction }: SignupFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const { signup, googleAuth, isLoading, error, signupSuccess, signupMessage, clearSignupSuccess } = useAuth();
    const { theme } = useTheme();

    const handleGoogleSuccess = (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                googleAuth(credentialResponse.credential);
            }
        } catch (error) {
            console.error('Google signup error:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google signup failed');
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
        if (!name || !email || !password || !confirmPassword) return;

        if (!validatePassword(password, confirmPassword)) return;

        try {
            await signup(name, email, password);
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center p-4`}>
            <div className="w-full max-w-md mx-auto">
                <div className={`${theme.bg.secondary} border ${theme.border.primary} rounded-xl p-8 shadow-sm`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`mx-auto w-16 h-16 ${theme.accent.primary} rounded-xl flex items-center justify-center mb-4`}>
                            <User className={`w-8 h-8 ${theme.text.inverse}`} />
                        </div>
                        <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
                            Create Account
                        </h1>
                        <p className={`${theme.text.secondary}`}>Join VisionChat AI today</p>
                    </div>

                    {/* Success Message */}
                    {signupSuccess && signupMessage && (
                        <div className={`mb-6 p-4 ${theme.bg.tertiary} border ${theme.border.primary} rounded-lg ${theme.text.primary}`}>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium mb-1 text-sm">Account Created Successfully!</p>
                                    <p className="text-sm">{signupMessage}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={onSwitchToLoginAction}
                                            className={`text-xs ${theme.accent.primary} ${theme.text.inverse} px-3 py-1 rounded-lg transition-all duration-200 ${theme.accent.hover}`}
                                        >
                                            Go to Login
                                        </button>
                                        <button
                                            onClick={clearSignupSuccess}
                                            className={`text-xs ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                                        >
                                            Create Another Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {(error || passwordError) && !signupSuccess && (
                        <div className={`mb-6 p-4 ${theme.bg.tertiary} border ${theme.border.secondary} rounded-lg ${theme.text.primary} text-sm`}>
                            {error || passwordError}
                        </div>
                    )}

                    {/* Google Sign Up */}
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

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className={`h-5 w-5 ${theme.text.tertiary}`} />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

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
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (confirmPassword) {
                                            validatePassword(e.target.value, confirmPassword);
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Create a password"
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${theme.text.tertiary}`} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (password) {
                                            validatePassword(password, e.target.value);
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-3 ${theme.bg.primary} border ${theme.border.primary} rounded-lg ${theme.text.primary} placeholder:${theme.text.tertiary} focus:outline-none focus:border-gray-500 transition-colors duration-200`}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme.text.tertiary} hover:${theme.text.secondary}`}
                                >
                                    {showConfirmPassword ? (
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
                            disabled={isLoading || !name || !email || !password || !confirmPassword || !!passwordError}
                            className={`w-full ${theme.accent.primary} ${theme.text.inverse} font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <div className="mt-8 text-center">
                        <p className={`${theme.text.secondary}`}>
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLoginAction}
                                className={`${theme.text.primary} font-medium transition-colors duration-200 hover:underline`}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupForm({ onSwitchToLoginAction }: SignupFormProps) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error('Google Client ID not found. Please check your environment variables.');
        return <SignupFormContent onSwitchToLoginAction={onSwitchToLoginAction} />;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <SignupFormContent onSwitchToLoginAction={onSwitchToLoginAction} />
        </GoogleOAuthProvider>
    );
} 