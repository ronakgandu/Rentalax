import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Calendar, Clock, CreditCard, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockProducts } from '@/mocks/data';
import Button from '@/components/Button';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

export default function NewBookingScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = mockProducts.find(p => p.id === productId);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!product) {
    return null;
  }

  const totalPrice = product.price * duration;
  const serviceFee = totalPrice * 0.1;
  const total = totalPrice + serviceFee;

  const handleDateSelect = () => {
    // Open date picker
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Booking Confirmed!',
        'Your booking has been confirmed. You can now chat with the owner.',
        [
          { 
            text: 'View Booking', 
            onPress: () => router.replace('/rentals')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Confirm Booking',
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Summary */}
        <View style={styles.productCard}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.productPrice}>
              ${product.price}/{product.priceUnit}
            </Text>
          </View>
        </View>

        {/* Rental Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Period</Text>
          
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={handleDateSelect}
          >
            <View style={styles.dateInfo}>
              <Calendar size={20} color={colors.primary} />
              <View>
                <Text style={styles.dateLabel}>Select Dates</Text>
                <Text style={styles.dateValue}>
                  {startDate && endDate 
                    ? `${startDate} - ${endDate}`
                    : 'Choose your rental period'
                  }
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity 
                style={[
                  styles.durationButton,
                  duration === 1 && styles.durationButtonDisabled
                ]}
                onPress={() => duration > 1 && setDuration(duration - 1)}
                disabled={duration === 1}
              >
                <Text style={styles.durationButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.duration}>
                {duration} {product.priceUnit}
                {duration > 1 ? 's' : ''}
              </Text>
              
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => setDuration(duration + 1)}
              >
                <Text style={styles.durationButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentInfo}>
              <CreditCard size={20} color={colors.primary} />
              <Text style={styles.paymentText}>Add Payment Method</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${product.price} × {duration} {product.priceUnit}
              {duration > 1 ? 's' : ''}
            </Text>
            <Text style={styles.priceValue}>${totalPrice}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>${serviceFee}</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <Text style={styles.policyText}>
            Free cancellation before pickup. After pickup, the first day's rent will be charged as cancellation fee.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <Button
          title="Confirm & Pay"
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  durationContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  durationLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  durationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonDisabled: {
    backgroundColor: colors.inactive,
  },
  durationButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  duration: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text,
  },
  priceValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  policyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  payButton: {
    width: '100%',
  },
});