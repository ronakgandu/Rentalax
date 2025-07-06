import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { mockProducts } from '@/mocks/data';
import Button from '@/components/Button';
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Find the product by id
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const handleNextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLiked(!liked);
  };
  
  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  const handleRent = () => {
    router.push({
      pathname: '/booking/new',
      params: { productId: product.id }
    });
  };
  
  const handleMessage = () => {
    router.push({
      pathname: '/chat',
      params: { userId: product.owner.id }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: product.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleLike}>
                <Heart 
                  size={24} 
                  color={liked ? colors.secondary : colors.text} 
                  fill={liked ? colors.secondary : 'transparent'} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Share2 size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[currentImageIndex] }}
            style={styles.image}
            contentFit="cover"
          />
          
          {product.images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={handleNextImage}
                disabled={currentImageIndex === product.images.length - 1}
              >
                <ChevronRight size={24} color="white" />
              </TouchableOpacity>
              
              <View style={styles.pagination}>
                {product.images.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.title}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.location}>{product.location}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.warning} fill={colors.warning} />
            <Text style={styles.rating}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${product.price}
              <Text style={styles.priceUnit}>/{product.priceUnit}</Text>
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ownerContainer}>
            <Image
              source={{ uri: product.owner.avatar }}
              style={styles.ownerAvatar}
              contentFit="cover"
            />
            
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{product.owner.name}</Text>
              <View style={styles.ownerRating}>
                <Star size={14} color={colors.warning} fill={colors.warning} />
                <Text style={styles.ownerRatingText}>{product.owner.rating}</Text>
                {product.owner.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={handleMessage}
            >
              <MessageCircle size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{product.category}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>
                  {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Barter</Text>
                <Text style={styles.detailValue}>
                  {product.allowBarter ? 'Allowed' : 'Not Allowed'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Availability</Text>
                <Text style={styles.detailValue}>
                  {product.available ? 'Available Now' : 'Not Available'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
          
          {product.allowBarter && (
            <View style={styles.barterContainer}>
              <Info size={20} color={colors.primary} />
              <Text style={styles.barterText}>
                This item is available for barter. You can offer one of your items in exchange.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerPrice}>
              ${product.price}
              <Text style={styles.footerPriceUnit}>/{product.priceUnit}</Text>
            </Text>
          </View>
          
          <Button
            title="Rent Now"
            onPress={handleRent}
            style={styles.rentButton}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.card,
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 16,
  },
  infoContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: colors.text,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerRatingText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  barterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
  },
  barterText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  footerPriceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  rentButton: {
    width: 150,
  },
});