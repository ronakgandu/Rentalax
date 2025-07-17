import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  MapPin, 
  Filter, 
  Search, 
  Layers,
  Navigation,
  Star,
  Heart
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockProducts } from '@/mocks/data';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const { width, height } = Dimensions.get('window');

interface MapProduct extends Product {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function HomeScreen() {
  const [selectedProduct, setSelectedProduct] = useState<MapProduct | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  
  // Create map products with coordinates
  const mapProducts: MapProduct[] = mockProducts
    .filter(product => product.coordinates)
    .map(product => ({
      ...product,
      coordinates: product.coordinates!
    }));

  const featuredProducts = mapProducts.filter(product => product.featured);
  const nearbyProducts = mapProducts.slice(0, 8);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const renderProductItem = ({ item }: { item: MapProduct }) => (
    <View style={styles.productItem}>
      <ProductCard 
        product={item}
        onPress={() => setSelectedProduct(item)}
        onFavoritePress={() => toggleFavorite(item.id)}
        isFavorite={favorites.has(item.id)}
      />
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Screen 
        options={{
          title: "RentShare",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
            color: colors.text,
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Search size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Find what you need,{'\n'}when you need it</Text>
          <Text style={styles.welcomeSubtitle}>Rent from trusted neighbors in your community</Text>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
              Map View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        {viewMode === 'map' && (
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={colors.primary} />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>Interactive map coming soon!</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.background} />
            </TouchableOpacity>
          </View>
        )}

        {/* Product List */}
        {viewMode === 'list' && (
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {/* Featured Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Items</Text>
              <FlatList
                data={featuredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>

            {/* Nearby Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nearby Items</Text>
              <View style={styles.gridContainer}>
                {nearbyProducts.map((product) => (
                  <View key={product.id} style={styles.gridItem}>
                    <ProductCard 
                      product={product}
                      onPress={() => setSelectedProduct(product)}
                      onFavoritePress={() => toggleFavorite(product.id)}
                      isFavorite={favorites.has(product.id)}
                      size="small"
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 34,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    margin: 20,
    borderRadius: 20,
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  filterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  listContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItem: {
    width: (width - 56) / 2,
  },
  productItem: {
    width: 280,
  },
});