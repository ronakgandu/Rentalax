import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { RefreshCw, Star, MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Product } from '@/types';

interface SwapCardProps {
  product: Product;
  style?: ViewStyle;
  onSwapPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function SwapCard({ 
  product, 
  style, 
  onSwapPress,
  size = 'medium'
}: SwapCardProps) {
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const getImageHeight = () => {
    switch (size) {
      case 'small': return 120;
      case 'large': return 220;
      default: return 160;
    }
  };

  const getFontSizes = () => {
    switch (size) {
      case 'small':
        return {
          title: 13,
          subtitle: 10,
          rating: 10,
          location: 10,
        };
      case 'large':
        return {
          title: 20,
          subtitle: 15,
          rating: 14,
          location: 13,
        };
      default:
        return {
          title: 16,
          subtitle: 12,
          rating: 12,
          location: 11,
        };
    }
  };

  const fonts = getFontSizes();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        size === 'large' && styles.largeContainer,
        style
      ]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.images[0] }} 
          style={[
            styles.image, 
            { height: getImageHeight() }
          ]} 
        />
        
        {/* Swap Badge */}
        <View style={styles.swapBadge}>
          <RefreshCw size={12} color="white" />
          <Text style={styles.swapText}>SWAP</Text>
        </View>

        {/* Featured Badge */}
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}

        {/* Availability Indicator */}
        <View style={[
          styles.availabilityBadge,
          product.available ? styles.availableBadge : styles.unavailableBadge
        ]}>
          <View style={[
            styles.availabilityDot,
            product.available ? styles.availableDot : styles.unavailableDot
          ]} />
          <Text style={[
            styles.availabilityText,
            product.available ? styles.availableText : styles.unavailableText
          ]}>
            {product.available ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>
      
      <View style={[styles.content, size === 'large' && styles.largeContent]}>
        <Text 
          style={[styles.title, { fontSize: fonts.title }]} 
          numberOfLines={size === 'large' ? 3 : 2}
        >
          {product.title}
        </Text>
        
        <Text 
          style={[styles.subtitle, { fontSize: fonts.subtitle }]} 
          numberOfLines={2}
        >
          {product.description}
        </Text>
        
        <View style={styles.meta}>
          <View style={styles.ratingContainer}>
            <Star 
              size={size === 'large' ? 14 : 12} 
              color={colors.warning} 
              fill={colors.warning} 
            />
            <Text style={[styles.ratingText, { fontSize: fonts.rating }]}>
              {product.rating}
            </Text>
            <Text style={[styles.reviewsText, { fontSize: fonts.rating }]}>
              ({product.reviews})
            </Text>
          </View>
          
          {product.condition && (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin 
            size={size === 'large' ? 14 : 12} 
            color={colors.textSecondary} 
          />
          <Text 
            style={[styles.locationText, { fontSize: fonts.location }]} 
            numberOfLines={1}
          >
            {product.location}
          </Text>
        </View>
        
        {/* Swap Action Button */}
        <TouchableOpacity 
          style={styles.swapButton}
          onPress={onSwapPress}
        >
          <RefreshCw size={16} color={colors.background} />
          <Text style={styles.swapButtonText}>Propose Swap</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.sky[100],
  },
  largeContainer: {
    borderRadius: 24,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  swapBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  swapText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availableBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availableDot: {
    backgroundColor: colors.success,
  },
  unavailableDot: {
    backgroundColor: colors.error,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  availableText: {
    color: 'white',
  },
  unavailableText: {
    color: 'white',
  },
  content: {
    padding: 18,
  },
  largeContent: {
    padding: 22,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 1.4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
    color: colors.text,
  },
  reviewsText: {
    color: colors.textSecondary,
  },
  conditionBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    color: colors.textSecondary,
    flex: 1,
  },
  swapButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  swapButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
});