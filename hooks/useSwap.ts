import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwapRequest, Product, User } from '@/types';

interface SwapState {
  swapRequests: SwapRequest[];
  userSwappableItems: Product[];
  
  // Actions
  createSwapRequest: (
    requestedProduct: Product,
    offeredProduct: Product,
    requester: User,
    message?: string,
    swapDuration?: { startDate: string; endDate: string }
  ) => SwapRequest;
  
  acceptSwapRequest: (requestId: string) => void;
  declineSwapRequest: (requestId: string) => void;
  cancelSwapRequest: (requestId: string) => void;
  completeSwapRequest: (requestId: string) => void;
  
  getSwapRequestsForUser: (userId: string) => SwapRequest[];
  getSwapRequestsByStatus: (status: SwapRequest['status']) => SwapRequest[];
  getUserSwappableItems: (userId: string) => Product[];
  addSwappableItem: (product: Product) => void;
  removeSwappableItem: (productId: string) => void;
  
  // Statistics
  getSwapStats: (userId: string) => {
    totalSwaps: number;
    completedSwaps: number;
    pendingRequests: number;
    successRate: number;
  };
}

export const useSwap = create<SwapState>()(
  persist(
    (set, get) => ({
      swapRequests: [],
      userSwappableItems: [],

      createSwapRequest: (
        requestedProduct: Product,
        offeredProduct: Product,
        requester: User,
        message?: string,
        swapDuration?: { startDate: string; endDate: string }
      ) => {
        const newSwapRequest: SwapRequest = {
          id: Date.now().toString(),
          requestedProduct,
          offeredProduct,
          requester,
          owner: requestedProduct.owner,
          status: 'pending',
          message,
          swapDuration,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          swapRequests: [...state.swapRequests, newSwapRequest]
        }));

        return newSwapRequest;
      },

      acceptSwapRequest: (requestId: string) => {
        set(state => ({
          swapRequests: state.swapRequests.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status: 'accepted' as const,
                  updatedAt: new Date().toISOString()
                }
              : request
          )
        }));
      },

      declineSwapRequest: (requestId: string) => {
        set(state => ({
          swapRequests: state.swapRequests.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status: 'declined' as const,
                  updatedAt: new Date().toISOString()
                }
              : request
          )
        }));
      },

      cancelSwapRequest: (requestId: string) => {
        set(state => ({
          swapRequests: state.swapRequests.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status: 'cancelled' as const,
                  updatedAt: new Date().toISOString()
                }
              : request
          )
        }));
      },

      completeSwapRequest: (requestId: string) => {
        set(state => ({
          swapRequests: state.swapRequests.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status: 'completed' as const,
                  updatedAt: new Date().toISOString()
                }
              : request
          )
        }));
      },

      getSwapRequestsForUser: (userId: string) => {
        const { swapRequests } = get();
        return swapRequests.filter(
          request => 
            request.requester.id === userId || 
            request.owner.id === userId
        );
      },

      getSwapRequestsByStatus: (status: SwapRequest['status']) => {
        const { swapRequests } = get();
        return swapRequests.filter(request => request.status === status);
      },

      getUserSwappableItems: (userId: string) => {
        const { userSwappableItems } = get();
        return userSwappableItems.filter(item => item.owner.id === userId);
      },

      addSwappableItem: (product: Product) => {
        set(state => ({
          userSwappableItems: [...state.userSwappableItems, product]
        }));
      },

      removeSwappableItem: (productId: string) => {
        set(state => ({
          userSwappableItems: state.userSwappableItems.filter(
            item => item.id !== productId
          )
        }));
      },

      getSwapStats: (userId: string) => {
        const { swapRequests } = get();
        const userSwaps = swapRequests.filter(
          request => 
            request.requester.id === userId || 
            request.owner.id === userId
        );

        const totalSwaps = userSwaps.length;
        const completedSwaps = userSwaps.filter(
          request => request.status === 'completed'
        ).length;
        const pendingRequests = userSwaps.filter(
          request => request.status === 'pending'
        ).length;
        const successRate = totalSwaps > 0 ? (completedSwaps / totalSwaps) * 100 : 0;

        return {
          totalSwaps,
          completedSwaps,
          pendingRequests,
          successRate: Math.round(successRate),
        };
      },
    }),
    {
      name: 'swap-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        swapRequests: state.swapRequests,
        userSwappableItems: state.userSwappableItems,
      }),
    }
  )
);

export default useSwap;