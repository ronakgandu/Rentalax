import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { mockProducts } from '@/mocks/data';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Create mock bookings based on mock products
const mockBookings = mockProducts.map((product, index) => ({
  id: `booking-${index}`,
  product,
  startDate: new Date(Date.now() + 86400000 * index).toISOString().split('T')[0], // Today + index days
  endDate: new Date(Date.now() + 86400000 * (index + 3)).toISOString().split('T')[0], // Start + 3 days
  status: index === 0 ? 'pending' : index === 1 ? 'confirmed' : index === 2 ? 'active' : 'completed',
  totalPrice: product.price * 3, // 3 days rental
  paymentStatus: index === 0 ? 'pending' : 'paid',
  createdAt: new Date(Date.now() - 86400000 * index).toISOString(),
}));

export default function RentalsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  const upcomingBookings = mockBookings.filter(
    booking => booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'active'
  );
  
  const pastBookings = mockBookings.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.primary;
      case 'active': return colors.success;
      case 'completed': return colors.text;
      case 'cancelled': return colors.error;
      default: return colors.textSecondary;
    }
  };
  
  const renderBookingItem = ({ item }: { item: typeof mockBookings[0] }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      onPress={() => router.push(`/booking/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.product.images[0] }}
        style={styles.bookingImage}
        contentFit="cover"
      />
      
      <View style={styles.bookingInfo}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingTitle} numberOfLines={1}>
            {item.product.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingDetail}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={styles.bookingDetailText}>
            {item.startDate} - {item.endDate}
          </Text>
        </View>
        
        <View style={styles.bookingDetail}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.bookingDetailText} numberOfLines={1}>
            {item.product.location}
          </Text>
        </View>
        
        <View style={styles.bookingFooter}>
          <Text style={styles.bookingPrice}>
            ${item.totalPrice.toFixed(2)}
          </Text>
          <ChevronRight size={16} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displayedBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No rentals found</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming rentals. Browse items to rent something!"
                : "You don't have any past rentals yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  bookingImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.card,
  },
  bookingInfo: {
    flex: 1,
    padding: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  bookingDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});