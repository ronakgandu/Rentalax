import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  MapPin, 
  Filter, 
  Search, 
  Layers,
  Navigation,
  RefreshCw,
  Star,
  Heart
} from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { colors } from '@/constants/colors';
import { mockProducts } from '@/mocks/data';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Sample coordinates for San Francisco
const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface MapProduct extends Product {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function HomeScreen() {
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const [selectedProduct, setSelectedProduct] = useState<MapProduct | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  
  // Create map products with coordinates
  const mapProducts: MapProduct[] = mockProducts
    .filter(product => product.coordinates)
    .map(product => ({
      ...product,
      coordinates: product.coordinates!
    }));

  const featuredProducts = mapProducts.filter(product => product.featured);
  const nearbyProducts = mapProducts.slice(0, 8);

  const snapPoints = React.useMemo(() => ['15%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleMarkerPress = (product: MapProduct) => {
    setSelectedProduct(product);
    bottomSheetRef.current?.snapToIndex(1);
    
    // Animate to marker location
    mapRef.current?.animateToRegion({
      latitude: product.coordinates.latitude,
      longitude: product.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      setMapRegion({
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
      mapRef.current?.animateToRegion({
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    } catch (error) {
      console.error('Error getting location:', error);
    }
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

  const renderSelectedProduct = () => {
    if (!selectedProduct) return null;
    
    return (
      <View style={styles.selectedProductCard}>
        <ProductCard 
          product={selectedProduct}
          onPress={() => console.log('Open product details')}
          onFavoritePress={() => toggleFavorite(selectedProduct.id)}
          isFavorite={favorites.has(selectedProduct.id)}
          size="large"
        />
      </View>
    );
  };

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
        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            mapType={mapType}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={setMapRegion}
          >
            {mapProducts.map((product) => (
              <Marker
                key={product.id}
                coordinate={product.coordinates}
                onPress={() => handleMarkerPress(product)}
              >
                <View style={styles.markerContainer}>
                  <View style={[
                    styles.marker,
                    selectedProduct?.id === product.id && styles.selectedMarker
                  ]}>
                    <Text style={styles.markerPrice}>${product.price}</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={getCurrentLocation}
            >
              <Navigation size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
            >
              <Layers size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Filter Button */}
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            {/* Bottom Sheet Header */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {selectedProduct ? selectedProduct.title : 'Discover Items Nearby'}
              </Text>
              <Text style={styles.bottomSheetSubtitle}>
                {selectedProduct ? 'Tap to view details' : `${mapProducts.length} items available`}
              </Text>
            </View>

            {/* Selected Product or Product List */}
            {selectedProduct ? (
              renderSelectedProduct()
            ) : (
              <BottomSheetFlatList
                data={nearbyProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 16,
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    position: 'absolute',
    bottom: 140,
    right: 16,
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
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMarker: {
    backgroundColor: colors.primary,
  },
  markerPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  bottomSheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.border,
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSheetHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedProductCard: {
    marginBottom: 16,
  },
  productList: {
    paddingBottom: 100,
  },
  productItem: {
    flex: 1,
    margin: 6,
  },
});