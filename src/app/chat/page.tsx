'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Bot, ChevronLeft, ChevronRight, Edit3, LogOut, MessageSquare, Moon, Plus, Send, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatItem {
    chatId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

function ChatPageContent() {
    const { user, isLoading, token, logout } = useAuth();
    const { isDark, toggleTheme, theme } = useTheme();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
            return;
        }

        if (user && token) {
            fetchChats();
        }
    }, [user, isLoading, token, router]);

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

    const sendFirstMessage = async () => {
        if (!message.trim() || isLoadingMessage) return;

        setIsLoadingMessage(true);

        try {
            // First create a new chat
            const createResponse = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: 'New Chat'
                }),
            });

            if (!createResponse.ok) {
                console.error('Failed to create new chat');
                return;
            }

            const { chatId } = await createResponse.json();

            // Redirect to the new chat with the message in URL params
            router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(message)}`);
        } catch (error) {
            console.error('Error creating chat:', error);
        } finally {
            setIsLoadingMessage(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendFirstMessage();
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/auth');
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

    const quickPrompts = [
        {
            icon: '📊',
            text: 'Analyze this data',
            description: 'Data analysis and insights'
        },
        {
            icon: '💼',
            text: 'Business strategy',
            description: 'Strategic planning help'
        },
        {
            icon: '🔧',
            text: 'Technical solution',
            description: 'Engineering assistance'
        },
        {
            icon: '📝',
            text: 'Write documentation',
            description: 'Content creation'
        }
    ];

    return (
        <div className={`h-screen ${theme.bg.primary} flex relative`}>
            {/* Fixed Sidebar */}
            <div className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 ${theme.bg.secondary} border-r ${theme.border.primary} flex flex-col transition-all duration-300 ease-in-out hidden lg:flex`}>
                {/* Header */}
                <div className={`flex-shrink-0 p-3 border-b ${theme.border.primary}`}>
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
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
                    {!isSidebarCollapsed && (
                        <button
                            onClick={createNewChat}
                            className={`w-full flex items-center gap-3 px-4 py-3 ${theme.accent.primary} ${theme.text.inverse} font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
                        >
                            <Plus className="w-4 h-4" />
                            New Chat
                        </button>
                    )}

                    {isSidebarCollapsed && (
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
                    {!isSidebarCollapsed && (
                        <h2 className={`text-sm font-medium ${theme.text.tertiary} mb-4 uppercase tracking-wide`}>
                            Recent Conversations
                        </h2>
                    )}
                    {loadingChats ? (
                        <div className={`text-center ${theme.text.tertiary} py-8`}>
                            {!isSidebarCollapsed ? (
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
                            {!isSidebarCollapsed ? (
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
                                    onClick={() => router.push(`/chat/${chat.chatId}`)}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${theme.hover} ${theme.bg.tertiary} border ${theme.border.primary} ${isSidebarCollapsed ? 'justify-center' : ''} active:scale-[0.98]`}
                                    title={isSidebarCollapsed ? chat.title : ''}
                                >
                                    {isSidebarCollapsed ? (
                                        <div className="flex justify-center">
                                            <MessageSquare className={`w-4 h-4 ${theme.text.tertiary}`} />
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
                    {!isSidebarCollapsed ? (
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

            {/* Desktop: Sidebar Toggle Button */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-10 ${theme.bg.secondary} ${theme.hover} border ${theme.border.primary} rounded-full p-2 shadow-lg mb-5 transition-all duration-300 ease-in-out active:scale-95`}
                style={{ left: isSidebarCollapsed ? '3.5rem' : '19rem' }}
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className={`w-4 h-4 ${theme.text.primary}`} />
                ) : (
                    <ChevronLeft className={`w-4 h-4 ${theme.text.primary}`} />
                )}
            </button>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 lg:p-8">
                <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center space-y-3 mb-8">
                        <div className={`${theme.accent.primary} p-3 rounded-2xl mx-auto w-fit`}>
                            <Bot className={`h-10 w-10 ${theme.text.inverse}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
                                VisionChat
                            </h1>
                            <p className={`text-sm ${theme.text.tertiary} mt-1`}>
                                AI Assistant
                            </p>
                        </div>

                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`${theme.bg.secondary} ${theme.hover} border ${theme.border.primary} rounded-lg p-2 transition-all duration-200 active:scale-95`}
                        >
                            {isDark ? (
                                <Sun className={`w-5 h-5 ${theme.text.primary}`} />
                            ) : (
                                <Moon className={`w-5 h-5 ${theme.text.primary}`} />
                            )}
                        </button>
                    </div>

                    {/* Welcome Section */}
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="hidden lg:block">
                            <div className={`${theme.accent.primary} p-4 rounded-2xl mx-auto w-fit mb-6`}>
                                <Bot className={`h-12 w-12 ${theme.text.inverse}`} />
                            </div>
                            <h1 className={`text-3xl sm:text-4xl font-bold ${theme.text.primary} mb-3`}>
                                Welcome to VisionChat
                            </h1>
                        </div>
                        <p className={`text-base sm:text-lg ${theme.text.secondary} leading-relaxed max-w-md mx-auto`}>
                            Start a conversation with our AI assistant. Ask questions, get help with coding, or just chat!
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className={`${theme.bg.secondary} border ${theme.border.primary} rounded-xl p-4 sm:p-6 shadow-sm`}>
                        <div className="space-y-4">
                            <div className="flex items-end space-x-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message here..."
                                        className={`w-full ${theme.bg.primary} ${theme.text.primary} placeholder:${theme.text.tertiary} border ${theme.border.primary} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-${theme.accent.primary.split('-')[1]}-500 transition-all text-sm sm:text-base`}
                                        disabled={isLoadingMessage}
                                    />
                                </div>
                                <button
                                    onClick={sendFirstMessage}
                                    disabled={!message.trim() || isLoadingMessage}
                                    className={`${theme.accent.primary} ${theme.text.inverse} px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-sm text-sm sm:text-base`}
                                >
                                    {isLoadingMessage ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span className="hidden sm:inline">Starting...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Send className="h-4 w-4" />
                                            <span className="hidden sm:inline">Send</span>
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className={`${theme.text.tertiary} hidden sm:inline`}>
                                    Press <kbd className={`px-1.5 py-0.5 ${theme.bg.tertiary} rounded text-xs`}>Enter</kbd> to send
                                </span>
                                <span className={`${theme.text.tertiary} sm:hidden`}>
                                    Tap send to start chatting
                                </span>
                                <span className={`${theme.text.tertiary}`}>
                                    {message.length > 0 && `${message.length} characters`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Recent Chats */}
                    {chats.length > 0 && (
                        <div className="lg:hidden space-y-4">
                            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
                                Recent Conversations
                            </h2>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {chats.slice(0, 5).map((chat) => (
                                    <button
                                        key={chat.chatId}
                                        onClick={() => router.push(`/chat/${chat.chatId}`)}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${theme.hover} ${theme.bg.tertiary} border ${theme.border.primary} active:scale-[0.98]`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className={`w-4 h-4 ${theme.text.tertiary} mt-0.5 flex-shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`${theme.text.primary} text-sm font-medium truncate`}>
                                                    {chat.title}
                                                </p>
                                                <p className={`${theme.text.tertiary} text-xs mt-1`}>
                                                    {new Date(chat.updatedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile: User Info */}
                    <div className="lg:hidden">
                        <div className={`flex items-center gap-3 ${theme.text.primary} p-3 rounded-lg ${theme.bg.tertiary} border ${theme.border.primary}`}>
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
                            <button
                                onClick={handleLogout}
                                className={`p-2 ${theme.text.secondary} ${theme.hover} rounded-lg transition-all duration-200 active:scale-95`}
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
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