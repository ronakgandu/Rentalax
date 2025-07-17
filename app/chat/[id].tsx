import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import {
  Send,
  Phone,
  Video,
  MoreHorizontal,
  RefreshCw,
  Check,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ChatMessage, Product, User } from '@/types';
import useChat from '@/hooks/useChat';
import useAuth from '@/hooks/useAuth';
import useSwap from '@/hooks/useSwap';

// Mock data for demo
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    content: 'Chat started',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    type: 'text',
    content: 'Hi! Is your DJI Mavic Air 2 still available?',
    sender: 'other',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    type: 'text',
    content: 'Yes, it is! Are you looking to rent or swap?',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: '4',
    type: 'text',
    content: 'I have a Canon EOS R that I could swap for a few days. Would you be interested?',
    sender: 'other',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { sendMessage, activeChat, setActiveChat } = useChat();
  const { createSwapRequest, getUserSwappableItems } = useSwap();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendTextMessage = () => {
    if (!message.trim() || !id || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    sendMessage(id, {
      type: 'text',
      content: message.trim(),
      sender: 'user',
    });

    setMessage('');
    inputRef.current?.focus();
  };

  const handleSwapProposal = () => {
    setShowSwapModal(true);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !prevMessage || 
      new Date(item.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        
        {item.type === 'system' ? (
          <View style={styles.systemMessage}>
            <Text style={styles.systemText}>{item.content}</Text>
          </View>
        ) : item.type === 'text' ? (
          <View style={[
            styles.messageContainer,
            item.sender === 'user' ? styles.userMessage : styles.otherMessage
          ]}>
            <View style={[
              styles.messageBubble,
              item.sender === 'user' ? styles.userBubble : styles.otherBubble
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userText : styles.otherText
              ]}>
                {item.content}
              </Text>
            </View>
            <Text style={styles.messageTime}>
              {formatTime(item.timestamp)}
              {item.sender === 'user' && (
                <CheckCheck size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
              )}
            </Text>
          </View>
        ) : item.type === 'swap' ? (
          <View style={styles.swapMessage}>
            <View style={styles.swapHeader}>
              <RefreshCw size={20} color={colors.secondary} />
              <Text style={styles.swapTitle}>Swap Proposal</Text>
            </View>
            {/* Swap details would go here */}
          </View>
        ) : null}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>Alex Johnson</Text>
          <Text style={styles.headerStatus}>
            {isTyping ? 'Typing...' : 'Online'}
          </Text>
        </View>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton}>
          <Phone size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Video size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderHeader()}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapProposal}
          >
            <RefreshCw size={16} color={colors.background} />
            <Text style={styles.swapButtonText}>Propose Swap</Text>
          </TouchableOpacity>
        </View>
        
        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendTextMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? colors.background : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  messagesList: {
    paddingVertical: 16,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  messageContainer: {
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: colors.background,
  },
  otherText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  swapMessage: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.sky[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sky[200],
  },
  swapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  swapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  swapButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.backgroundSecondary,
  },
});