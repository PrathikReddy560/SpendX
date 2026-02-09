/**
 * useChat Hook
 * Manages AI chatbot conversations
 */
import { useState, useCallback } from 'react';
import { ChatAPI, ChatResponse } from '../services/api';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface UseChatResult {
    messages: ChatMessage[];
    suggestions: string[];
    loading: boolean;
    error: string | null;
    sessionId: string | null;
    sendMessage: (message: string) => Promise<void>;
    clearChat: () => void;
}

export function useChat(): UseChatResult {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([
        'How much did I spend this month?',
        'Give me a tip to save money',
        'What are my top expenses?',
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        setLoading(true);
        setError(null);

        // Add user message immediately
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Add typing indicator
        const typingMessage: ChatMessage = {
            id: 'typing',
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isTyping: true,
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            const response = await ChatAPI.sendMessage(message, sessionId ?? undefined);

            // Update session ID
            setSessionId(response.session_id);

            // Remove typing indicator and add assistant response
            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== 'typing');
                return [...filtered, {
                    id: `assistant-${Date.now()}`,
                    role: 'assistant',
                    content: response.response,
                    timestamp: new Date(),
                }];
            });

            // Update suggestions
            if (response.suggestions.length > 0) {
                setSuggestions(response.suggestions);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
            // Remove typing indicator
            setMessages(prev => prev.filter(m => m.id !== 'typing'));
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setSessionId(null);
        setSuggestions([
            'How much did I spend this month?',
            'Give me a tip to save money',
            'What are my top expenses?',
        ]);
    }, []);

    return {
        messages,
        suggestions,
        loading,
        error,
        sessionId,
        sendMessage,
        clearChat,
    };
}

export default useChat;
