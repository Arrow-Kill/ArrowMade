'use client';

import { AlertCircle, CheckCircle, Loader2, Mail, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'already-verified'>('loading');
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else {
            setStatus('error');
            setMessage('No verification token provided');
        }
    }, [token]);

    const verifyToken = async (verificationToken: string) => {
        try {
            // First check if token is valid
            const checkResponse = await fetch(`/api/auth/verify-email?token=${verificationToken}`);
            const checkData = await checkResponse.json();

            if (!checkResponse.ok) {
                setStatus('error');
                setMessage(checkData.error || 'Invalid verification token');
                return;
            }

            if (checkData.verified) {
                setStatus('already-verified');
                setMessage('Your email is already verified!');
                setUserEmail(checkData.user?.email || '');
                return;
            }

            // If token is valid but not verified yet, proceed with verification
            const verifyResponse = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: verificationToken }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
                setStatus('success');
                setMessage(verifyData.message);
                setUserEmail(verifyData.user?.email || '');
                setUserName(verifyData.user?.name || '');
            } else {
                setStatus('error');
                setMessage(verifyData.error || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    const handleResendVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resendEmail.trim()) return;

        setIsResending(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resendEmail.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Verification email sent successfully! Please check your inbox.');
                setShowResendForm(false);
                setResendEmail('');
            } else {
                setMessage(data.error || 'Failed to send verification email');
            }
        } catch (error) {
            console.error('Resend error:', error);
            setMessage('Failed to send verification email. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const goToLogin = () => {
        router.push('/auth');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                    {/* Status Icon */}
                    <div className="text-center mb-6">
                        {status === 'loading' && (
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        )}
                        {status === 'already-verified' && (
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Status Message */}
                    <div className="text-center mb-8">
                        {status === 'loading' && (
                            <>
                                <h1 className="text-2xl font-bold text-white mb-2">Verifying Email</h1>
                                <p className="text-gray-300">Please wait while we verify your email address...</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                    Email Verified!
                                </h1>
                                <p className="text-gray-300 mb-4">
                                    Welcome {userName}! Your email {userEmail} has been successfully verified.
                                </p>
                                <p className="text-gray-400 text-sm">
                                    You can now log in to access all features.
                                </p>
                            </>
                        )}
                        {status === 'already-verified' && (
                            <>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                    Already Verified
                                </h1>
                                <p className="text-gray-300 mb-4">
                                    Your email {userEmail} is already verified.
                                </p>
                                <p className="text-gray-400 text-sm">
                                    You can proceed to log in.
                                </p>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    Verification Failed
                                </h1>
                                <p className="text-gray-300 mb-4">{message}</p>
                                {message.includes('expired') || message.includes('Invalid') ? (
                                    <p className="text-gray-400 text-sm mb-4">
                                        Your verification link may have expired. You can request a new one below.
                                    </p>
                                ) : null}
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {(status === 'success' || status === 'already-verified') && (
                            <button
                                onClick={goToLogin}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                            >
                                Continue to Login
                            </button>
                        )}

                        {status === 'error' && (
                            <>
                                {!showResendForm ? (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowResendForm(true)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Resend Verification Email
                                        </button>
                                        <button
                                            onClick={goToLogin}
                                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleResendVerification} className="space-y-4">
                                        <div>
                                            <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-200 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="resendEmail"
                                                    type="email"
                                                    value={resendEmail}
                                                    onChange={(e) => setResendEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isResending || !resendEmail.trim()}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                            >
                                                {isResending ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="w-5 h-5" />
                                                        Send Email
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowResendForm(false);
                                                    setResendEmail('');
                                                }}
                                                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>

                    {/* Success message for resend */}
                    {message.includes('sent successfully') && (
                        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm text-center">
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
