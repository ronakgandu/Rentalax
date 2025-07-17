# 🔄 Rent Share - Rent. Swap. Repeat.

A modern peer-to-peer rental and barter platform built with React Native and Expo, featuring map-based discovery and real-time swap functionality.

## 🚀 Features

### Core Functionality
- **🗺️ Map-Based Discovery**: Interactive map with OpenStreetMap integration showing available items nearby
- **🔄 Swap System**: Comprehensive item swapping and bartering platform
- **💬 Real-Time Chat**: Socket.io powered messaging with swap request integration
- **📱 Mobile-First Design**: Optimized for React Native with responsive layouts
- **🎨 Modern UI**: Beautiful design system with Teal/Sky Blue color scheme

### Key Features Implemented

#### 🏠 Home Screen (Map Interface)
- Interactive map with custom markers showing item prices
- Bottom sheet drawer with product discovery
- Map controls (location, satellite/standard toggle)
- Filter functionality
- Real-time location services

#### 🔄 Swap System
- Swap request creation and management
- Swap-only items vs. rental+swap items
- Swap statistics and analytics
- Visual swap indicators on product cards

#### 💬 Chat System
- Real-time messaging with Socket.io
- Product context in conversations
- Swap proposal integration
- Message status indicators
- Typing indicators and online status

#### 🎨 Enhanced Components
- **ProductCard**: Multiple sizes (small/medium/large) with swap badges
- **SwapCard**: Specialized cards for swap-focused items
- **Bottom Sheet**: Smooth gesture-based interactions
- **Enhanced UI**: Modern design with shadows, blur effects, and animations

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **NativeWind** for Tailwind CSS styling
- **React Native Maps** for map functionality
- **React Native Bottom Sheet** for drawer interactions
- **React Native Gesture Handler** for smooth animations
- **Lucide React Native** for icons

### State Management
- **Zustand** with persistence for local state
- **AsyncStorage** for data persistence

### Real-Time Features
- **Socket.io Client** for real-time messaging
- **Expo Location** for geolocation services
- **Expo Notifications** for push notifications

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx           # Map-based home screen
│   ├── categories.tsx      # Category browser
│   ├── post.tsx           # Create listings
│   ├── profile.tsx        # User profile
│   └── rentals.tsx        # My rentals/swaps
├── chat/
│   ├── index.tsx          # Chat list
│   └── [id].tsx          # Chat conversation
├── product/
│   └── [id].tsx          # Product details
├── auth.tsx               # Authentication
└── onboarding.tsx         # App onboarding

components/
├── ProductCard.tsx        # Enhanced product cards
├── SwapCard.tsx          # Swap-focused cards
├── Button.tsx            # Reusable button component
├── CategoryCard.tsx      # Category display
└── SearchBar.tsx         # Search functionality

hooks/
├── useAuth.ts            # Authentication state
├── useChat.ts            # Real-time chat management
└── useSwap.ts            # Swap system management

types/
└── index.ts              # TypeScript definitions
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#14B8A6)
- **Secondary**: Sky Blue (#0EA5E9)
- **Accent**: Cyan (#06B6D4)
- **Background**: White with slate variants
- **Text**: Slate-900 for primary, Slate-500 for secondary

### Typography
- **Primary Font**: System font with weight variations
- **Size Scale**: 10px - 24px with consistent line heights

### Components
- **Cards**: 16-20px border radius with subtle shadows
- **Buttons**: 14px border radius with hover states
- **Input Fields**: 20px border radius with focus states
- **Badges**: 8-16px border radius for status indicators

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI
- iOS Simulator or Android Emulator
- React Native development environment

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd rent-share
   npm install --legacy-peer-deps
   ```

2. **Environment Setup**
   Create `.env` file:
   ```env
   EXPO_PUBLIC_SOCKET_URL=ws://localhost:3001
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Start Development**
   ```bash
   npm start
   # Then choose iOS, Android, or Web
   ```

## 🗺️ Map Integration

The app uses React Native Maps with Google Maps provider:

### Features
- Custom price markers for items
- User location detection
- Map type switching (standard/satellite)
- Smooth marker animations
- Clustering for multiple items

### Configuration
```typescript
<MapView
  provider={PROVIDER_GOOGLE}
  region={mapRegion}
  mapType={mapType}
  showsUserLocation={true}
  onRegionChangeComplete={setMapRegion}
>
  {mapProducts.map((product) => (
    <Marker
      key={product.id}
      coordinate={product.coordinates}
      onPress={() => handleMarkerPress(product)}
    />
  ))}
</MapView>
```

## 🔄 Swap System

### Swap Request Flow
1. User browses swappable items
2. Selects item to swap for
3. Chooses their own item to offer
4. Sends swap proposal with message
5. Owner reviews and accepts/declines
6. If accepted, swap details are finalized

### Swap Types
- **Swap-Only**: Items only available for swapping
- **Rent+Swap**: Items available for both rental and swap
- **Temporary Swap**: Time-limited exchanges
- **Permanent Swap**: Ownership transfer

## 💬 Real-Time Chat

### Socket.io Integration
```typescript
const socket = io(SOCKET_URL, {
  auth: { userId },
  transports: ['websocket'],
});

socket.on('message:received', handleMessageReceived);
socket.on('chat:created', handleChatCreated);
```

### Message Types
- **Text Messages**: Standard chat messages
- **System Messages**: Automated notifications
- **Product Messages**: Shared product cards
- **Swap Messages**: Swap proposal cards

## 📊 State Management

### Zustand Stores
- **useAuth**: User authentication and profile
- **useChat**: Chat state and real-time messaging
- **useSwap**: Swap requests and swappable items

### Data Persistence
All stores use Zustand persistence with AsyncStorage for offline capability.

## 🎯 Key Implementation Details

### Map Performance
- Marker clustering for dense areas
- Lazy loading of product details
- Optimized re-renders with React.memo

### Chat Performance
- Message virtualization for large conversations
- Optimistic updates for sent messages
- Background sync for offline messages

### Swap Logic
- Validation of swap compatibility
- Automatic swap matching suggestions
- Swap history and analytics

## 🚀 Production Considerations

### Backend Requirements
- Socket.io server for real-time features
- REST API for data persistence
- Image storage (AWS S3/Firebase)
- Push notification service
- User authentication service

### Deployment
- Expo Application Services (EAS) for builds
- App Store/Google Play deployment
- Environment-specific configurations

## 🔮 Future Enhancements

### Planned Features
- **AI-Powered Recommendations**: Smart swap suggestions
- **Augmented Reality**: AR try-before-swap feature
- **Blockchain Integration**: Decentralized swap verification
- **Social Features**: User communities and reviews
- **Advanced Analytics**: Swap success rates and trends

### Technical Improvements
- **Offline Support**: Cached data and offline messaging
- **Performance**: Lazy loading and code splitting
- **Accessibility**: Screen reader support and keyboard navigation
- **Internationalization**: Multi-language support

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the sharing economy**

*Rent Share empowers communities to share resources efficiently, reducing waste and fostering connections through innovative swap technology.*