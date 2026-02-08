// Premium AI Chat Screen
// Chatbot connected to FastAPI AI backend

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble, { SuggestionChips } from '../../src/components/ui/ChatBubble';
import TypingIndicator from '../../src/components/ui/TypingIndicator';
import GradientHeader from '../../src/components/ui/GradientHeader';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { useApi, spendxApi } from '../../src/hooks/useApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatApiResponse {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
  conversation_id: string;
}

const suggestions = [
  "How much did I spend this week?",
  "Create a budget for me",
  "Analyze my subscriptions",
  "Tips to save money",
];

export default function ChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;
  const flatListRef = useRef<FlatList>(null);
  const { post, isLoading: apiLoading } = useApi<ChatApiResponse>();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SpendX AI assistant. I can help you analyze your spending, create budgets, and provide personalized financial advice. What would you like to know?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [lastMessageTyping, setLastMessageTyping] = useState(false);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: getTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call AI chat endpoint
      const { data, error } = await post(spendxApi.ai.chat, {
        message: messageText,
        conversation_id: conversationId,
      });

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setConversationId(data.conversation_id);

        const aiMessage: Message = {
          id: data.message.id,
          text: data.message.content,
          sender: 'ai',
          timestamp: getTimestamp(),
        };

        setIsTyping(false);
        setLastMessageTyping(true);
        setMessages(prev => [...prev, aiMessage]);

        // Turn off typing effect after message displays
        setTimeout(() => {
          setLastMessageTyping(false);
        }, Math.min(aiMessage.text.length * 20, 3000) + 500);
      }
    } catch (error: any) {
      setIsTyping(false);

      // Show error as AI message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `I'm having trouble connecting right now. Please try again. (${error.message || 'Network error'})`,
        sender: 'ai',
        timestamp: getTimestamp(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isLastAIMessage = item.sender === 'ai' && index === messages.length - 1;

    return (
      <ChatBubble
        message={item.text}
        sender={item.sender}
        timestamp={item.timestamp}
        isTyping={isLastAIMessage && lastMessageTyping}
        delay={0}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <GradientHeader height="sm" rounded={false}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Avatar.Icon
              size={40}
              icon="robot"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
            <View>
              <Text variant="titleMedium" style={styles.headerTitle}>
                SpendX AI
              </Text>
              <Text variant="labelSmall" style={styles.headerSubtitle}>
                {isTyping ? 'Thinking...' : 'Always online'}
              </Text>
            </View>
          </View>
          <Pressable style={styles.menuButton}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </GradientHeader>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            messages.length === 1 ? (
              <Animated.View entering={FadeInDown.delay(300).duration(300)}>
                <SuggestionChips
                  suggestions={suggestions}
                  onSelect={handleSuggestion}
                />
              </Animated.View>
            ) : null
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <Avatar.Icon
                  size={32}
                  icon="robot"
                  style={{ backgroundColor: colors.primary }}
                />
                <TypingIndicator style={styles.typingIndicator} />
              </View>
            ) : null
          }
        />

        {/* Input */}
        <Animated.View
          entering={FadeIn.delay(200).duration(300)}
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + Spacing.sm,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask SpendX AI..."
              placeholderTextColor={colors.placeholder}
              style={[styles.input, { color: colors.text }]}
              multiline
              maxLength={500}
              editable={!isTyping}
            />
            <Pressable
              onPress={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor: input.trim() && !isTyping ? colors.primary : colors.disabled,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={isTyping ? 'loading' : 'send'}
                size={20}
                color={input.trim() && !isTyping ? '#FFFFFF' : colors.disabledText}
              />
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
  },
  menuButton: {
    padding: Spacing.xs,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  typingIndicator: {
    marginLeft: Spacing.xs,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BorderRadius.lg,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
