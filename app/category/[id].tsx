import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { mockCategories, mockProducts } from '@/mocks/data';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { Filter, Grid, List } from 'lucide-react-native';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Find the category by id
  const category = mockCategories.find(c => c.id === id) || mockCategories[0];
  
  // Filter products by category and search query
  const filteredProducts = mockProducts.filter(product => 
    product.category === category.name && 
    (searchQuery === '' || product.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  useEffect(() => {
    // Update the header title when category changes
  }, [category]);

  return (
    <>
      <Stack.Screen 
        options={{
          title: category.name,
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search in ${category.name}...`}
            style={styles.searchBar}
          />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleViewMode}
            >
              {viewMode === 'grid' ? (
                <List size={20} color={colors.text} />
              ) : (
                <Grid size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.resultsText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
        </Text>
        
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              style={viewMode === 'grid' ? styles.gridItem : styles.listItem} 
            />
          )}
          keyExtractor={item => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filters to find what you're looking for.
              </Text>
            </View>
          }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsText: {
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    padding: 16,
  },
  gridItem: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  listItem: {
    width: '100%',
    marginBottom: 16,
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