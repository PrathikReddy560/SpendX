// Premium AI Chat Screen
// Chatbot with typing effects and premium bubbles

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble, { SuggestionChips } from '../../src/components/ui/ChatBubble';
import TypingIndicator from '../../src/components/ui/TypingIndicator';
import GradientHeader from '../../src/components/ui/GradientHeader';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your SpendX AI assistant. I can help you analyze your spending, create budgets, and provide personalized financial advice. What would you like to know?",
    sender: 'ai',
    timestamp: '10:30 AM',
  },
];

const suggestions = [
  "How much did I spend this week?",
  "Create a budget for me",
  "Analyze my subscriptions",
  "Tips to save money",
];

const aiResponses: Record<string, string> = {
  default: "I've analyzed your spending patterns. Based on your recent transactions, you're spending an average of $45 per day. Your biggest spending category is Food & Dining at 35% of your total expenses. Would you like some tips to optimize your spending?",
  budget: "Based on your income of $4,500 and current spending patterns, I recommend:\n\n• Essentials: $2,250 (50%)\n• Wants: $1,350 (30%)\n• Savings: $900 (20%)\n\nThis follows the 50/30/20 rule. Shall I break this down further by category?",
  subscriptions: "I found 5 active subscriptions:\n\n• Netflix: $15.99/mo\n• Spotify: $9.99/mo\n• Amazon Prime: $14.99/mo\n• gym: $29.99/mo\n• Cloud Storage: $2.99/mo\n\nTotal: $73.95/month. You could save $108/year by switching to annual plans!",
  tips: "Here are 3 personalized tips based on your spending:\n\n1. 🍔 Cook at home 2 more times per week to save ~$80/month\n2. ☕ Your coffee spending is $95/month - try brewing at home\n3. 🚗 Consider carpooling - you could save $50/month on transport",
};

export default function ChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessageTyping, setLastMessageTyping] = useState(false);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('budget')) return aiResponses.budget;
    if (lower.includes('subscription')) return aiResponses.subscriptions;
    if (lower.includes('tip') || lower.includes('save')) return aiResponses.tips;
    return aiResponses.default;
  };

  const sendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: getTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(messageText),
        sender: 'ai',
        timestamp: getTimestamp(),
      };

      setIsTyping(false);
      setLastMessageTyping(true);
      setMessages(prev => [...prev, aiMessage]);

      // Turn off typing effect after message displays
      setTimeout(() => {
        setLastMessageTyping(false);
      }, aiMessage.text.length * 30 + 500);
    }, 1500);
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
                Always online
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
            />
            <Pressable
              onPress={() => sendMessage()}
              disabled={!input.trim()}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor: input.trim() ? colors.primary : colors.disabled,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={input.trim() ? '#FFFFFF' : colors.disabledText}
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
    paddingHorizontal: Spacing.xs, // Smaller padding on mobile
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
    borderRadius: BorderRadius.lg, // Smaller radius
    paddingLeft: Spacing.md, // Less padding
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs, // Tighter gap
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
