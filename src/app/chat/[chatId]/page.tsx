'use client';

import Chatbot from '@/components/NewPage/Chatbot';
import { AuthProvider, useAuth } from '@/lib/AuthContext/auth-context';
import { useTheme } from '@/lib/Theme/theme-context';
import { ChevronLeft, ChevronRight, Edit3, LogOut, MessageSquare, Moon, Plus, Sun, User } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatItem {
    chatId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

function ChatPageContent() {
    const { user, isLoading, logout, token } = useAuth();
    const { isDark, toggleTheme, theme } = useTheme();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const chatId = params.chatId as string;
    const initialMessage = searchParams.get('initialMessage');
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user && token) {
            fetchChats();
        }
    }, [user, token]);

    // Auto-refresh chat list every 30 seconds to catch title updates
    useEffect(() => {
        if (user && token) {
            const interval = setInterval(() => {
                fetchChats();
            }, 30000); // Refresh every 30 seconds

            return () => clearInterval(interval);
        }
    }, [user, token]);

    const fetchChats = async () => {
        try {
            const response = await fetch('/api/chats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data.chats);
            } else {
                console.error('Failed to fetch chats');
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoadingChats(false);
        }
    };

    const createNewChat = () => {
        // Simply redirect to the main chat page to show centered input
        router.push('/chat');
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen ${theme.bg.primary} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    const handleLogout = () => {
        logout();
        router.push('/auth');
    };

    return (
        <div className={`h-screen ${theme.bg.primary} flex relative`}>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Fixed Sidebar */}
            <div className={`${
                // Desktop behavior
                isSidebarCollapsed ? 'w-16' : 'w-80'
                } ${
                // Mobile behavior
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed lg:relative h-full z-50 lg:z-auto flex-shrink-0 ${theme.bg.secondary} border-r ${theme.border.primary} flex flex-col transition-all duration-300 ease-in-out`}>
                {/* Header */}
                <div className={`flex-shrink-0 p-3 border-b ${theme.border.primary}`}>
                    {/* Mobile: Close button */}
                    <div className="flex items-center justify-between mb-3 lg:hidden">
                        <h1 className={`text-lg font-bold ${theme.text.primary}`}>
                            VisionChat
                        </h1>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2 rounded-lg ${theme.bg.tertiary} ${theme.hover} transition-colors`}
                        >
                            <ChevronLeft className={`w-4 h-4 ${theme.text.primary}`} />
                        </button>
                    </div>

                    {/* Desktop: Theme toggle and title */}
                    <div className={`hidden lg:flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
                        {!isSidebarCollapsed && (
                            <h1 className={`text-xl font-bold ${theme.text.primary}`}>
                                VisionChat
                            </h1>
                        )}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg ${theme.bg.tertiary} ${theme.hover} transition-colors ${isSidebarCollapsed ? 'mb-2' : ''}`}
                        >
                            {isDark ? (
                                <Sun className={`w-4 h-4 ${theme.text.primary}`} />
                            ) : (
                                <Moon className={`w-4 h-4 ${theme.text.primary}`} />
                            )}
                        </button>
                    </div>

                    {/* New Chat Button */}
                    {(!isSidebarCollapsed || isMobileMenuOpen) && (
                        <button
                            onClick={() => {
                                createNewChat();
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 ${theme.accent.primary} ${theme.text.inverse} font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
                        >
                            <Plus className="w-4 h-4" />
                            New Chat
                        </button>
                    )}

                    {isSidebarCollapsed && !isMobileMenuOpen && (
                        <button
                            onClick={createNewChat}
                            className={`w-full flex items-center justify-center p-3 ${theme.accent.primary} ${theme.text.inverse} font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
                            title="New Chat"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Chat List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                    {(!isSidebarCollapsed || isMobileMenuOpen) && (
                        <h2 className={`text-sm font-medium ${theme.text.tertiary} mb-4 uppercase tracking-wide`}>
                            Recent Conversations
                        </h2>
                    )}
                    {loadingChats ? (
                        <div className={`text-center ${theme.text.tertiary} py-8`}>
                            {(!isSidebarCollapsed || isMobileMenuOpen) ? (
                                <div className="animate-pulse space-y-2">
                                    <div className={`h-3 ${theme.bg.tertiary} rounded w-3/4`}></div>
                                    <div className={`h-3 ${theme.bg.tertiary} rounded w-1/2`}></div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className={`h-8 w-8 ${theme.bg.tertiary} rounded mx-auto`}></div>
                                    <div className={`h-8 w-8 ${theme.bg.tertiary} rounded mx-auto`}></div>
                                </div>
                            )}
                        </div>
                    ) : chats.length === 0 ? (
                        <div className={`text-center ${theme.text.tertiary} py-8`}>
                            {(!isSidebarCollapsed || isMobileMenuOpen) ? (
                                <>
                                    <p className="text-sm">No conversations yet</p>
                                    <p className="text-xs mt-1">Start a new chat to begin</p>
                                </>
                            ) : (
                                <MessageSquare className="w-6 h-6 mx-auto opacity-50" />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {chats.map((chat) => (
                                <button
                                    key={chat.chatId}
                                    onClick={() => {
                                        router.push(`/chat/${chat.chatId}`);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${theme.hover} border ${chat.chatId === chatId
                                        ? `${theme.border.focus} ${theme.bg.active}`
                                        : `${theme.border.primary} ${theme.bg.tertiary}`
                                        } ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'justify-center' : ''} active:scale-[0.98]`}
                                    title={(isSidebarCollapsed && !isMobileMenuOpen) ? chat.title : ''}
                                >
                                    {(isSidebarCollapsed && !isMobileMenuOpen) ? (
                                        <div className="flex justify-center">
                                            <MessageSquare className={`w-4 h-4 ${chat.chatId === chatId ? theme.text.primary : theme.text.tertiary}`} />
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className={`w-4 h-4 ${theme.text.tertiary} mt-0.5 flex-shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`${theme.text.primary} text-sm font-medium truncate`}>
                                                    {chat.title}
                                                </p>
                                                <p className={`${theme.text.tertiary} text-xs mt-1`}>
                                                    {new Date(chat.updatedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Info - Fixed at bottom */}
                <div className={`flex-shrink-0 p-2 border-t ${theme.border.primary}`}>
                    {(!isSidebarCollapsed || isMobileMenuOpen) ? (
                        <>
                            <div className={`flex items-center gap-3 ${theme.text.primary} mb-3 p-3 rounded-lg ${theme.bg.tertiary}`}>
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className={`w-8 h-8 ${theme.accent.primary} rounded-full flex items-center justify-center`}>
                                        <User className={`w-4 h-4 ${theme.text.inverse}`} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className={`text-xs ${theme.text.tertiary} truncate`}>{user.email}</p>
                                </div>
                            </div>

                            {/* Mobile: Theme toggle */}
                            <div className="lg:hidden mb-2">
                                <button
                                    onClick={toggleTheme}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${theme.text.secondary} ${theme.hover} rounded-lg transition-all duration-200 border ${theme.border.primary}`}
                                >
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>

                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${theme.text.secondary} ${theme.hover} rounded-lg transition-all duration-200 border ${theme.border.primary} active:scale-[0.98]`}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex justify-center">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                    title={user.name}
                                />
                            ) : (
                                <div className={`w-10 h-10 ${theme.accent.primary} rounded-full flex items-center justify-center`} title={user.name}>
                                    <User className={`w-5 h-5 ${theme.text.inverse}`} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile: Menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`fixed top-3 left-4 z-30 lg:hidden ${theme.bg.secondary} ${theme.hover} border ${theme.border.primary} rounded-lg p-2 shadow-lg transition-all  duration-200 active:scale-95`}
            >
                <ChevronRight className={`w-4 h-4 ${theme.text.primary}`} />
            </button>

            {/* Desktop: Sidebar Toggle Button */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-10 ${theme.bg.secondary} ${theme.hover} border ${theme.border.primary} rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out active:scale-95`}
                style={{ left: isSidebarCollapsed ? '3.5rem' : '19rem' }}
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className={`w-4 h-4 ${theme.text.primary}`} />
                ) : (
                    <ChevronLeft className={`w-4 h-4 ${theme.text.primary}`} />
                )}
            </button>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0" style={{ marginLeft: isMobileMenuOpen ? '0' : '0' }}>
                <Chatbot chatId={chatId} initialMessage={initialMessage} />
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <AuthProvider>
            <ChatPageContent />
        </AuthProvider>
    );
} 