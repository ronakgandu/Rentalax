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
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Send, Plus, Image as ImageIcon, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { mockProducts } from '@/mocks/data';
import { ChatMessage, Product, TextMessage } from '@/types';

// Mock messages for the chat
const generateMockMessages = (chatId: string): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const product = mockProducts.find(p => p.id === chatId) || mockProducts[0];
  const now = Date.now();

  // System message
  messages.push({
    id: '1',
    type: 'system',
    content: 'Rental request started',
    timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
  });

  // Product share
  messages.push({
    id: '2',
    type: 'product',
    product,
    timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
  });

  // Chat messages
  const sampleMessages = [
    "Hi, is this still available?",
    "Yes, it is! When would you like to rent it?",
    "I'm thinking next weekend. Is that possible?",
    "Yes, that works for me. Would you like to proceed with the booking?",
    "Great! Let me check the exact dates.",
    "Sure, take your time. Let me know if you have any questions.",
  ];

  sampleMessages.forEach((content, index) => {
    messages.push({
      id: `msg-${index + 3}`,
      type: 'text',
      content,
      sender: index % 2 === 0 ? 'user' : 'other',
      timestamp: new Date(now - 1000 * 60 * (sampleMessages.length - index)).toISOString(),
    });
  });

  return messages;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(generateMockMessages(id));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    const newMessage: TextMessage = {
      id: `msg-${Date.now()}`,
      type: 'text',
      content: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate reply
    setTimeout(() => {
      const reply: TextMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'text',
        content: "I'll get back to you shortly!",
        sender: 'other',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }

    if (item.type === 'product') {
      return (
        <View style={styles.productMessage}>
          <Image
            source={{ uri: item.product.images[0] }}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.product.title}
            </Text>
            <Text style={styles.productPrice}>
              ${item.product.price}/{item.product.priceUnit}
            </Text>
          </View>
        </View>
      );
    }

    const isUser = item.sender === 'user';
    const showAvatar = !isUser && 
      (index === messages.length - 1 || 
       messages[index + 1].type === 'text' && 
       (messages[index + 1] as TextMessage).sender !== item.sender);

    return (
      <View style={[
        styles.messageRow,
        isUser && styles.userMessageRow
      ]}>
        {!isUser && showAvatar && (
          <Image
            source={{ uri: product.owner.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.otherBubble,
          !showAvatar && !isUser && styles.otherBubbleNoAvatar
        ]}>
          <Text style={[
            styles.messageText,
            isUser && styles.userMessageText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: product.owner.name,
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Send 
                size={20} 
                color={message.trim() ? 'white' : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
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
  messageList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    marginLeft: 40,
  },
  otherBubbleNoAvatar: {
    marginLeft: 40,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  userMessageText: {
    color: 'white',
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 16,
  },
  systemText: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  productMessage: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: colors.text,
    marginRight: 8,
    paddingTop: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.card,
  },
});