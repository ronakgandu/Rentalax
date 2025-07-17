import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { Chat, ChatMessage, User, Product, SwapRequest } from '@/types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  socket: Socket | null;
  isConnected: boolean;
  
  // Actions
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  createChat: (participants: User[], product?: Product, swapRequest?: SwapRequest) => Chat;
  markAsRead: (chatId: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  
  // Socket event handlers
  onMessageReceived: (message: ChatMessage & { chatId: string }) => void;
  onChatCreated: (chat: Chat) => void;
  onUserOnline: (userId: string) => void;
  onUserOffline: (userId: string) => void;
}

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      socket: null,
      isConnected: false,

      initializeSocket: (userId: string) => {
        const socket = io(SOCKET_URL, {
          auth: {
            userId,
          },
          transports: ['websocket'],
        });

        socket.on('connect', () => {
          console.log('Socket connected');
          set({ socket, isConnected: true });
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          set({ isConnected: false });
        });

        socket.on('message:received', (data: ChatMessage & { chatId: string }) => {
          get().onMessageReceived(data);
        });

        socket.on('chat:created', (chat: Chat) => {
          get().onChatCreated(chat);
        });

        socket.on('user:online', (userId: string) => {
          get().onUserOnline(userId);
        });

        socket.on('user:offline', (userId: string) => {
          get().onUserOffline(userId);
        });

        set({ socket });
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null, isConnected: false });
        }
      },

      sendMessage: (chatId: string, messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const { socket, chats } = get();
        if (!socket) return;

        const message: ChatMessage = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };

        // Emit to socket
        socket.emit('message:send', {
          chatId,
          message,
        });

        // Update local state optimistically
        const updatedChats = chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message,
              updatedAt: message.timestamp,
            };
          }
          return chat;
        });

        set({ chats: updatedChats });
      },

      createChat: (participants: User[], product?: Product, swapRequest?: SwapRequest) => {
        const newChat: Chat = {
          id: Date.now().toString(),
          participants,
          messages: [],
          product,
          swapRequest,
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { socket, chats } = get();
        
        // Add to local state
        set({ chats: [...chats, newChat] });

        // Emit to socket
        if (socket) {
          socket.emit('chat:create', newChat);
        }

        return newChat;
      },

      markAsRead: (chatId: string) => {
        const { chats, socket } = get();
        const updatedChats = chats.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        });

        set({ chats: updatedChats });

        // Emit to socket
        if (socket) {
          socket.emit('chat:markRead', { chatId });
        }
      },

      setActiveChat: (chat: Chat | null) => {
        set({ activeChat: chat });
        if (chat) {
          get().markAsRead(chat.id);
        }
      },

      onMessageReceived: (data: ChatMessage & { chatId: string }) => {
        const { chats, activeChat } = get();
        const { chatId, ...message } = data;

        const updatedChats = chats.map(chat => {
          if (chat.id === chatId) {
            const unreadCount = activeChat?.id === chatId ? 0 : chat.unreadCount + 1;
            return {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message,
              unreadCount,
              updatedAt: message.timestamp,
            };
          }
          return chat;
        });

        set({ chats: updatedChats });
      },

      onChatCreated: (chat: Chat) => {
        const { chats } = get();
        const existingChat = chats.find(c => c.id === chat.id);
        if (!existingChat) {
          set({ chats: [...chats, chat] });
        }
      },

      onUserOnline: (userId: string) => {
        // Handle user online status
        console.log(`User ${userId} is online`);
      },

      onUserOffline: (userId: string) => {
        // Handle user offline status
        console.log(`User ${userId} is offline`);
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        chats: state.chats,
      }),
    }
  )
);

export default useChat;