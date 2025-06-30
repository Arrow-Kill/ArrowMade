'use client';

import { useAuth } from '@/lib/AuthContext/auth-context';
import { useTheme } from '@/lib/Theme/theme-context';
import {
    AlertCircle,
    Bot,
    Check,
    Code,
    Copy,
    Lightbulb,
    Loader2,
    MessageSquare,
    Moon,
    Send,
    Sun,
    Target,
    User
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

interface CodeBlockProps {
    children: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'javascript' }) => {
    const { isDark, theme } = useTheme();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative group my-4">
            <div className={`flex items-center justify-between ${theme.bg.tertiary} px-4 py-3 rounded-t-lg border ${theme.border.primary}`}>
                <div className="flex items-center space-x-2">
                    <Code className={`h-4 w-4 ${theme.text.primary}`} />
                    <span className={`text-sm ${theme.text.primary} font-medium`}>
                        {language.toUpperCase()}
                    </span>
                </div>
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center space-x-1 ${theme.text.secondary} ${theme.hover} px-3 py-1.5 rounded-md transition-colors`}
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" />
                            <span className="text-xs font-medium">Copy</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: '1px solid',
                    borderColor: isDark ? '#374151' : '#d1d5db',
                    borderTop: 'none',
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                    color: isDark ? '#6b7280' : '#9ca3af',
                    fontSize: '0.75rem',
                    paddingRight: '1rem',
                    borderRight: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    marginRight: '1rem',
                }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
};


const StreamingCodeBlock: React.FC<{ language: string; isComplete: boolean; isStreaming?: boolean; children: string }> = ({ language, isComplete, isStreaming = false, children }) => {
    const { theme, isDark } = useTheme();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (isComplete) {
        return <CodeBlock language={language}>{children}</CodeBlock>;
    }

    // For streaming/incomplete code blocks, show the terminal container immediately
    return (
        <div className="relative group my-4">
            <div className={`flex items-center justify-between ${theme.bg.tertiary} px-4 py-3 rounded-t-lg border ${theme.border.primary}`}>
                <div className="flex items-center space-x-2">
                    <Code className={`h-4 w-4 ${theme.text.primary}`} />
                    <span className={`text-sm ${theme.text.primary} font-medium`}>
                        {language.toUpperCase()}
                    </span>
                    {isStreaming && (
                        <div className={`flex items-center space-x-2 ${theme.text.tertiary}`}>
                            <div className="flex space-x-1">
                                <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`}></div>
                                <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                                <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs">Writing...</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center space-x-1 ${theme.text.secondary} ${theme.hover} px-3 py-1.5 rounded-md transition-colors`}
                    disabled={!children}
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" />
                            <span className="text-xs font-medium">Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div
                className="rounded-b-lg border border-t-0"
                style={{
                    borderColor: isDark ? '#374151' : '#d1d5db',
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    minHeight: '4rem',
                }}
            >
                <SyntaxHighlighter
                    language={language}
                    style={isDark ? oneDark : oneLight}
                    customStyle={{
                        margin: 0,
                        borderRadius: '0 0 0.5rem 0.5rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        padding: '1rem',
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                        color: isDark ? '#6b7280' : '#9ca3af',
                        fontSize: '0.75rem',
                        paddingRight: '1rem',
                        borderRight: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        marginRight: '1rem',
                    }}
                >
                    {children || ' '}
                </SyntaxHighlighter>
                {isStreaming && (
                    <div className={`px-4 pb-2 ${theme.text.tertiary} text-sm italic`}>
                        <span className="animate-pulse">●</span> Streaming code...
                    </div>
                )}
            </div>
        </div>
    );
};

const MessageContent: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming = false }) => {
    const { theme } = useTheme();

    const parseContentWithStreaming = (text: string, isStreamingActive: boolean) => {
        const parts: (string | { type: 'code'; content: string; language: string; isComplete: boolean })[] = [];

        // First, handle complete code blocks
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;
        const completeMatches: { start: number; end: number; language: string; content: string }[] = [];

        while ((match = codeBlockRegex.exec(text)) !== null) {
            completeMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                language: match[1] || 'javascript',
                content: match[2].trim()
            });
        }

        // Check for incomplete code blocks (streaming)
        const incompleteCodeRegex = /```(\w+)?\n?([\s\S]*)$/;
        const incompleteMatch = incompleteCodeRegex.exec(text);

        let hasIncompleteCode = false;
        let incompleteCodeStart = -1;
        let incompleteLanguage = '';
        let incompleteContent = '';

        if (incompleteMatch && isStreamingActive) {
            const potentialStart = incompleteMatch.index;
            // Check if this incomplete match is not part of a complete code block
            const isPartOfComplete = completeMatches.some(complete =>
                potentialStart >= complete.start && potentialStart < complete.end
            );

            if (!isPartOfComplete) {
                hasIncompleteCode = true;
                incompleteCodeStart = potentialStart;
                incompleteLanguage = incompleteMatch[1] || 'javascript';
                incompleteContent = incompleteMatch[2];
            }
        }

        lastIndex = 0;

        // Add complete code blocks
        for (const complete of completeMatches) {
            // Add text before code block
            if (complete.start > lastIndex) {
                const beforeText = text.slice(lastIndex, complete.start);
                if (beforeText) parts.push(beforeText);
            }

            // Add complete code block
            parts.push({
                type: 'code',
                content: complete.content,
                language: complete.language,
                isComplete: true
            });

            lastIndex = complete.end;
        }

        // Handle incomplete code block
        if (hasIncompleteCode) {
            // Add text before incomplete code block
            if (incompleteCodeStart > lastIndex) {
                const beforeText = text.slice(lastIndex, incompleteCodeStart);
                if (beforeText) parts.push(beforeText);
            }

            // Add incomplete code block
            parts.push({
                type: 'code',
                content: incompleteContent,
                language: incompleteLanguage,
                isComplete: false
            });

            lastIndex = text.length;
        } else {
            // Add remaining text
            if (lastIndex < text.length) {
                parts.push(text.slice(lastIndex));
            }
        }

        return parts;
    };

    const parseInlineFormatting = (text: string): React.ReactNode[] => {
        // First handle inline code to protect it from other formatting
        const codeRegex = /(`[^`]+`)/g;
        const parts = text.split(codeRegex);

        return parts.map((part, index) => {
            // Handle inline code
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={index}
                        className={`${theme.bg.tertiary} ${theme.text.primary} px-2 py-1 rounded text-sm font-mono border ${theme.border.primary}`}
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }

            // For non-code parts, handle bold and italic
            return parseTextFormatting(part, index);
        });
    };

    const parseTextFormatting = (text: string, baseIndex: number): React.ReactNode => {
        // Handle **bold** text
        const boldRegex = /(\*\*[^*]+\*\*)/g;
        const boldParts = text.split(boldRegex);

        return boldParts.map((boldPart, boldIndex) => {
            if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                const boldText = boldPart.slice(2, -2);
                // Check for italic within bold
                return (
                    <strong key={`${baseIndex}-bold-${boldIndex}`} className={`font-semibold ${theme.text.primary}`}>
                        {parseItalicFormatting(boldText, `${baseIndex}-bold-${boldIndex}`)}
                    </strong>
                );
            }

            // Handle *italic* text (but not ** which is bold)
            return parseItalicFormatting(boldPart, `${baseIndex}-${boldIndex}`);
        });
    };

    const parseItalicFormatting = (text: string, baseKey: string): React.ReactNode => {
        const italicRegex = /(\*[^*]+\*)/g;
        const italicParts = text.split(italicRegex);

        return italicParts.map((italicPart, italicIndex) => {
            if (italicPart.startsWith('*') && italicPart.endsWith('*') && !italicPart.startsWith('**')) {
                return (
                    <em key={`${baseKey}-italic-${italicIndex}`} className={`italic ${theme.text.primary}`}>
                        {italicPart.slice(1, -1)}
                    </em>
                );
            }
            return italicPart;
        });
    };

    const parseMarkdownText = (text: string) => {
        const lines = text.split('\n');
        const result: React.ReactNode[] = [];
        let currentList: { items: string[], type: 'bullet' | 'numbered' }[] = [];
        let currentText = '';
        let listIndex = 0;

        const flushCurrentText = (index: number) => {
            if (currentText.trim()) {
                result.push(
                    <div key={`text-${index}`} className="mb-4">
                        {parseInlineFormatting(currentText.trim())}
                    </div>
                );
                currentText = '';
            }
        };

        const flushCurrentList = (index: number) => {
            if (currentList.length > 0) {
                currentList.forEach((list, listIdx) => {
                    result.push(
                        <div key={`list-${index}-${listIdx}`} className="mb-6">
                            <div className="space-y-3">
                                {list.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start space-x-3">
                                        {list.type === 'bullet' ? (
                                            <div className={`w-2 h-2 ${theme.accent.primary} rounded-full mt-2 flex-shrink-0`}></div>
                                        ) : (
                                            <div className={`${theme.text.tertiary} text-sm font-medium mt-0.5 flex-shrink-0 min-w-[1.5rem]`}>
                                                {itemIndex + 1}.
                                            </div>
                                        )}
                                        <div className={`${theme.text.primary} leading-relaxed flex-1`}>
                                            {parseInlineFormatting(item)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                });
                currentList = [];
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Handle headers (## or ###)
            if (trimmedLine.startsWith('##')) {
                flushCurrentText(index);
                flushCurrentList(index);

                const headerLevel = trimmedLine.startsWith('###') ? 3 : 2;
                const headerText = trimmedLine.replace(/^#{2,3}\s*/, '');

                result.push(
                    <div key={`header-${index}`} className="mb-4 mt-6">
                        {headerLevel === 2 ? (
                            <h2 className={`text-xl font-bold ${theme.text.primary} mb-3 pb-2 border-b ${theme.border.primary}`}>
                                {parseInlineFormatting(headerText)}
                            </h2>
                        ) : (
                            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
                                {parseInlineFormatting(headerText)}
                            </h3>
                        )}
                    </div>
                );
            }
            // Handle bullet points (- or *)
            else if (trimmedLine.match(/^[-*]\s+/)) {
                flushCurrentText(index);

                const item = trimmedLine.replace(/^[-*]\s+/, '');
                if (currentList.length === 0 || currentList[currentList.length - 1].type !== 'bullet') {
                    currentList.push({ items: [item], type: 'bullet' });
                } else {
                    currentList[currentList.length - 1].items.push(item);
                }
            }
            // Handle numbered lists (1. 2. etc.)
            else if (trimmedLine.match(/^\d+\.\s+/)) {
                flushCurrentText(index);

                const item = trimmedLine.replace(/^\d+\.\s+/, '');
                if (currentList.length === 0 || currentList[currentList.length - 1].type !== 'numbered') {
                    currentList.push({ items: [item], type: 'numbered' });
                } else {
                    currentList[currentList.length - 1].items.push(item);
                }
            }
            // Handle empty lines (end lists)
            else if (trimmedLine === '') {
                if (currentList.length > 0) {
                    flushCurrentList(index);
                }
                currentText += line + '\n';
            }
            // Regular text
            else {
                if (currentList.length > 0) {
                    flushCurrentList(index);
                }
                currentText += line + '\n';
            }
        });

        // Flush remaining content
        flushCurrentText(lines.length);
        flushCurrentList(lines.length);

        return result;
    };

    const parts = parseContentWithStreaming(content, isStreaming);

    return (
        <div className={`${theme.text.primary} leading-relaxed`}>
            {parts.map((part, index) => {
                if (typeof part === 'string') {
                    return (
                        <div key={index}>
                            {parseMarkdownText(part)}
                        </div>
                    );
                } else {
                    // Render both complete and incomplete code blocks in the terminal
                    return (
                        <StreamingCodeBlock
                            key={index}
                            language={part.language}
                            isComplete={part.isComplete}
                            isStreaming={isStreaming && !part.isComplete}
                        >
                            {part.content}
                        </StreamingCodeBlock>
                    );
                }
            })}
        </div>
    );
};

interface ChatbotProps {
    chatId?: string;
    initialMessage?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ chatId: propChatId, initialMessage }) => {
    const { token } = useAuth();
    const { isDark, toggleTheme, theme } = useTheme();
    const [chatId, setChatId] = useState<string | null>(propChatId || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load a specific chat with its messages
    const loadChat = async (chatIdToLoad: string) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/chats/${chatIdToLoad}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                // Convert saved messages to the format expected by the component
                const formattedMessages = data.messages.map((msg: any, index: number) => ({
                    id: `${index}`,
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(msg.timestamp)
                }));

                setMessages(formattedMessages);
                setChatId(chatIdToLoad);
                setError(null);
                setHasInitialized(true);
            } else {
                console.error('Failed to load chat');
                setError('Failed to load chat');
                // If chat doesn't exist or fails, create a new one
                createNewChat();
            }
        } catch (error) {
            console.error('Error loading chat:', error);
            setError('Failed to load chat');
            // If there's an error, create a new chat
            createNewChat();
        }
    };

    // Create a new chat when the component mounts
    const createNewChat = async () => {
        if (!token || isCreatingChat) return;

        setIsCreatingChat(true);
        try {
            const response = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: 'New Chat'
                })
            });

            if (response.ok) {
                const data = await response.json();
                setChatId(data.chatId);
                setMessages([]); // Start with empty messages for clean state
                setHasInitialized(true);
            } else {
                console.error('Failed to create chat');
                setError('Failed to create chat session');
            }
        } catch (error) {
            console.error('Error creating chat:', error);
            setError('Failed to create chat session');
        } finally {
            setIsCreatingChat(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (token && !hasInitialized) {
            if (propChatId) {
                // Load the specific chat if chatId is provided
                loadChat(propChatId);
            } else {
                // Create a new chat if no chatId is provided
                createNewChat();
            }
        }
    }, [token, propChatId, hasInitialized]);

    // Update chatId when propChatId changes (for navigation between chats)
    useEffect(() => {
        if (propChatId && propChatId !== chatId && hasInitialized) {
            loadChat(propChatId);
        }
    }, [propChatId, chatId, hasInitialized]);

    // Handle initial message from URL params
    useEffect(() => {
        if (initialMessage && chatId && hasInitialized && messages.length === 0) {
            setInputMessage(initialMessage);
            // Auto-send the message after a brief delay
            setTimeout(() => {
                const sendInitialMessage = async () => {
                    if (!initialMessage.trim() || isLoading || !chatId) return;

                    const userMessage: Message = {
                        id: Date.now().toString(),
                        role: 'user',
                        content: initialMessage.trim(),
                        timestamp: new Date()
                    };

                    // Create initial assistant message for streaming
                    const assistantMessageId = (Date.now() + 1).toString();
                    const assistantMessage: Message = {
                        id: assistantMessageId,
                        role: 'assistant',
                        content: '',
                        timestamp: new Date(),
                        isStreaming: true
                    };

                    setMessages([userMessage, assistantMessage]);
                    setInputMessage('');
                    setIsLoading(true);
                    setError(null);
                    setStreamingMessageId(assistantMessageId);

                    // Create abort controller for this request
                    abortControllerRef.current = new AbortController();

                    try {
                        const response = await fetch('/api/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                chatId: chatId,
                                messages: [userMessage].map(msg => ({
                                    role: msg.role,
                                    content: msg.content
                                }))
                            }),
                            signal: abortControllerRef.current.signal
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        // Handle streaming response
                        const reader = response.body?.getReader();
                        const decoder = new TextDecoder();

                        if (!reader) {
                            throw new Error('No reader available');
                        }

                        let accumulatedContent = '';

                        while (true) {
                            const { done, value } = await reader.read();

                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split('\n');

                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    try {
                                        const data = JSON.parse(line.slice(6));

                                        if (data.type === 'content') {
                                            accumulatedContent += data.content;

                                            // Update the streaming message
                                            setMessages(prev => prev.map(msg =>
                                                msg.id === assistantMessageId
                                                    ? { ...msg, content: accumulatedContent }
                                                    : msg
                                            ));
                                        } else if (data.type === 'done') {
                                            // Mark streaming as complete
                                            setMessages(prev => prev.map(msg =>
                                                msg.id === assistantMessageId
                                                    ? { ...msg, isStreaming: false }
                                                    : msg
                                            ));
                                            break;
                                        } else if (data.type === 'error') {
                                            throw new Error(data.error);
                                        }
                                    } catch (parseError) {
                                        // Skip invalid JSON lines
                                        continue;
                                    }
                                }
                            }
                        }

                    } catch (err: any) {
                        if (err.name === 'AbortError') {
                            // Request was aborted
                            return;
                        }

                        setError(err instanceof Error ? err.message : 'An error occurred');
                        console.error('Chat error:', err);

                        // Remove the failed streaming message
                        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
                    } finally {
                        setIsLoading(false);
                        setStreamingMessageId(null);
                        abortControllerRef.current = null;
                    }
                };

                sendInitialMessage();
            }, 500); // Small delay to ensure everything is initialized
        }
    }, [initialMessage, chatId, hasInitialized, messages.length, isLoading, token]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading || !chatId) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        // Create initial assistant message for streaming
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);
        setStreamingMessageId(assistantMessageId);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    chatId: chatId,
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No reader available');
            }

            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'content') {
                                accumulatedContent += data.content;

                                // Update the streaming message
                                setMessages(prev => prev.map(msg =>
                                    msg.id === assistantMessageId
                                        ? { ...msg, content: accumulatedContent }
                                        : msg
                                ));
                            } else if (data.type === 'done') {
                                // Mark streaming as complete
                                setMessages(prev => prev.map(msg =>
                                    msg.id === assistantMessageId
                                        ? { ...msg, isStreaming: false }
                                        : msg
                                ));
                                break;
                            } else if (data.type === 'error') {
                                throw new Error(data.error);
                            }
                        } catch (parseError) {
                            // Skip invalid JSON lines
                            continue;
                        }
                    }
                }
            }

        } catch (err: any) {
            if (err.name === 'AbortError') {
                // Request was aborted
                return;
            }

            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Chat error:', err);

            // Remove the failed streaming message
            setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        } finally {
            setIsLoading(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        // Abort any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setError(null);
        setIsLoading(false);
        setStreamingMessageId(null);
        setMessages([]);
        setChatId(null);

        // Reset initialization to trigger useEffect to create new chat
        setHasInitialized(false);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const quickPrompts = [
        { icon: Code, text: "Code review", description: "Review and improve code" },
        { icon: Lightbulb, text: "Brainstorm ideas", description: "Generate creative solutions" },
        { icon: Target, text: "Problem solving", description: "Analyze and solve issues" },
        { icon: MessageSquare, text: "General chat", description: "Ask me anything" },
    ];

    return (
        <div className={`h-screen flex flex-col ${theme.bg.primary}`}>
            {/* Fixed Header */}
            <div className={`flex-shrink-0 ${theme.bg.secondary} border-b ${theme.border.primary} p-3 sm:p-4`}>
                <div className="max-w-4xl mx-auto">
                    {/* Mobile Layout - Centered */}
                    <div className="flex sm:hidden items-center justify-center relative">
                        <div className="flex items-center space-x-2">
                            <div className={`${theme.accent.primary} p-1.5 rounded-lg`}>
                                <Bot className={`h-4 w-4 ${theme.text.inverse}`} />
                            </div>
                            <div>
                                <h1 className={`text-base font-semibold ${theme.text.primary}`}>
                                    VisionChat
                                </h1>
                            </div>
                        </div>
                        {/* Theme toggle positioned absolutely on mobile */}
                        <button
                            onClick={toggleTheme}
                            className={`absolute right-0 p-1.5 rounded-lg ${theme.bg.tertiary} ${theme.hover} transition-colors`}
                        >
                            {isDark ? (
                                <Sun className={`w-4 h-4 ${theme.text.primary}`} />
                            ) : (
                                <Moon className={`w-4 h-4 ${theme.text.primary}`} />
                            )}
                        </button>
                    </div>

                    {/* Desktop Layout - Justified */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`${theme.accent.primary} p-2 rounded-lg`}>
                                <Bot className={`h-5 w-5 ${theme.text.inverse}`} />
                            </div>
                            <div>
                                <h1 className={`text-lg font-semibold ${theme.text.primary}`}>
                                    VisionChat
                                </h1>
                                <p className={`text-xs ${theme.text.tertiary}`}>
                                    AI Assistant
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg ${theme.bg.tertiary} ${theme.hover} transition-colors`}
                        >
                            {isDark ? (
                                <Sun className={`w-4 h-4 ${theme.text.primary}`} />
                            ) : (
                                <Moon className={`w-4 h-4 ${theme.text.primary}`} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-3 sm:p-6">
                    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                        {messages.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] text-center space-y-6 sm:space-y-8">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className={`${theme.accent.primary} p-3 sm:p-4 rounded-2xl mx-auto w-fit`}>
                                        <Bot className={`h-10 w-10 sm:h-12 sm:w-12 ${theme.text.inverse}`} />
                                    </div>
                                    <div className="space-y-2 sm:space-y-3 px-4">
                                        <h2 className={`text-xl sm:text-2xl font-bold ${theme.text.primary}`}>
                                            Ready to help
                                        </h2>
                                        <p className={`${theme.text.secondary} max-w-md mx-auto leading-relaxed text-sm sm:text-base`}>
                                            Start a conversation by typing a message or selecting a quick prompt below.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Prompts */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full px-4">
                                    {quickPrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInputMessage(prompt.text)}
                                            className={`p-3 sm:p-4 ${theme.bg.secondary} ${theme.hover} border ${theme.border.primary} rounded-lg transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]`}
                                        >
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <prompt.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${theme.text.primary} mt-0.5 flex-shrink-0`} />
                                                <div className="min-w-0">
                                                    <h3 className={`${theme.text.primary} font-medium text-sm`}>
                                                        {prompt.text}
                                                    </h3>
                                                    <p className={`${theme.text.tertiary} text-xs mt-1 line-clamp-2`}>
                                                        {prompt.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => {
                                    const isRoleChange = index > 0 && messages[index - 1].role !== message.role;
                                    return (
                                        <div key={message.id} className={`flex items-start space-x-2 sm:space-x-4 ${isRoleChange ? 'mt-6 sm:mt-8' : 'mt-4 sm:mt-6'} ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {message.role === 'assistant' && (
                                                <div className="flex-shrink-0 mt-1 hidden sm:block">
                                                    <div className={`${theme.accent.primary} p-2 rounded-lg`}>
                                                        <Bot className={`h-4 w-4 ${theme.text.inverse}`} />
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`group w-full sm:max-w-3xl ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                                                <div className={`relative ${message.role === 'user'
                                                    ? `${theme.accent.primary} ${theme.text.inverse} ml-auto max-w-[85%] sm:max-w-fit`
                                                    : `${theme.bg.secondary} ${theme.text.primary} max-w-full sm:max-w-[85%]`
                                                    } rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm border ${theme.border.primary} mb-3 sm:mb-4`}>

                                                    {/* Mobile: Show avatar inline for assistant messages */}
                                                    {message.role === 'assistant' && (
                                                        <div className="flex items-center space-x-2 mb-2 sm:hidden">
                                                            <div className={`${theme.accent.primary} p-1.5 rounded-lg`}>
                                                                <Bot className={`h-3 w-3 ${theme.text.inverse}`} />
                                                            </div>
                                                            <span className={`text-xs font-medium ${theme.text.secondary}`}>VisionChat</span>
                                                        </div>
                                                    )}

                                                    {message.role === 'user' ? (
                                                        <p className="leading-relaxed text-sm">{message.content}</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <MessageContent content={message.content} isStreaming={message.isStreaming} />
                                                            {message.isStreaming && (
                                                                <div className={`flex items-center space-x-2 ${theme.text.tertiary}`}>
                                                                    <div className="flex space-x-1">
                                                                        <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`}></div>
                                                                        <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                                                                        <div className={`w-1.5 h-1.5 ${theme.accent.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                                                                    </div>
                                                                    <span className="text-xs">Typing...</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className={`flex items-center justify-between mt-2 sm:mt-3 pt-2 border-t ${theme.border.primary}`}>
                                                        <span className={`text-xs ${theme.text.tertiary}`}>
                                                            {formatTime(message.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {message.role === 'user' && (
                                                <div className="flex-shrink-0 mt-1 order-2 hidden sm:block">
                                                    <div className={`w-8 h-8 ${theme.accent.primary} rounded-lg flex items-center justify-center`}>
                                                        <User className={`h-4 w-4 ${theme.text.inverse}`} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {error && (
                                    <div className={`${theme.bg.secondary} border border-red-500/20 rounded-lg p-3 sm:p-4 flex items-center space-x-3`}>
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-red-500 font-medium text-sm">Error</p>
                                            <p className={`${theme.text.secondary} text-sm`}>{error}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Fixed Input Area */}
            <div className={`flex-shrink-0 ${theme.bg.secondary} border-t ${theme.border.primary} p-3 sm:p-4`}>
                <div className="max-w-4xl mx-auto">
                    <div className={`relative ${theme.bg.primary} border ${theme.border.primary} rounded-xl p-3 sm:p-4 shadow-sm`}>
                        <div className="flex items-end space-x-2 sm:space-x-3">
                            <div className="flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className={`w-full ${theme.bg.primary} ${theme.text.primary} placeholder:${theme.text.tertiary} resize-none focus:outline-none text-sm leading-relaxed`}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className={`${theme.accent.primary} ${theme.text.inverse} p-2 sm:p-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 active:scale-95 shadow-sm`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2 sm:mt-3 text-xs">
                            <span className={`${theme.text.tertiary} hidden sm:inline`}>
                                Press <kbd className={`px-1.5 py-0.5 ${theme.bg.tertiary} rounded text-xs`}>Enter</kbd> to send
                            </span>
                            <span className={`${theme.text.tertiary} sm:hidden text-xs`}>
                                Tap send to reply
                            </span>
                            <button
                                onClick={clearChat}
                                className={`${theme.text.tertiary} ${theme.hover} px-2 py-1 rounded transition-colors text-xs`}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot; 