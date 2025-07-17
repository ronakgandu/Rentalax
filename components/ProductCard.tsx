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
import { Star, MapPin, Heart, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
  onFavoritePress?: () => void;
  onPress?: () => void;
  isFavorite?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ProductCard({ 
  product, 
  style, 
  onFavoritePress,
  onPress,
  isFavorite = false,
  size = 'medium'
}: ProductCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const getImageHeight = () => {
    switch (size) {
      case 'small': return 100;
      case 'large': return 200;
      default: return 140;
    }
  };

  const getFontSizes = () => {
    switch (size) {
      case 'small':
        return {
          title: 12,
          price: 14,
          priceUnit: 10,
          rating: 10,
          location: 10,
        };
      case 'large':
        return {
          title: 18,
          price: 20,
          priceUnit: 14,
          rating: 14,
          location: 13,
        };
      default:
        return {
          title: 14,
          price: 16,
          priceUnit: 12,
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
        {onFavoritePress && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Heart 
              size={size === 'large' ? 20 : 16} 
              color={isFavorite ? colors.error : 'white'}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        )}
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        {product.allowBarter && (
          <View style={styles.swapBadge}>
            <RefreshCw size={10} color="white" />
            <Text style={styles.swapText}>Swap</Text>
          </View>
        )}
      </View>
      
      <View style={[styles.content, size === 'large' && styles.largeContent]}>
        <Text 
          style={[styles.title, { fontSize: fonts.title }]} 
          numberOfLines={size === 'large' ? 3 : 2}
        >
          {product.title}
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
        
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { fontSize: fonts.price }]}>
            ${product.price}
          </Text>
          <Text style={[styles.priceUnit, { fontSize: fonts.priceUnit }]}>
            /{product.priceUnit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  largeContainer: {
    borderRadius: 20,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
  swapBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swapText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 14,
  },
  largeContent: {
    padding: 18,
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontWeight: '600',
    color: colors.text,
  },
  reviewsText: {
    color: colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    color: colors.textSecondary,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontWeight: '800',
    color: colors.primary,
  },
  priceUnit: {
    color: colors.textSecondary,
    marginLeft: 2,
  },
});