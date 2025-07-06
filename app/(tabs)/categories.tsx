import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Search, Grid, List } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockCategories } from '@/mocks/data';
import { Category } from '@/types';
import CategoryCard from '@/components/CategoryCard';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - 48 - 16) / numColumns;

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  const renderCategoryGrid = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { width: cardWidth }]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>📱</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} items</Text>
    </TouchableOpacity>
  );

  const renderCategoryList = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryListItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.categoryListIcon}>
        <Text style={styles.categoryEmoji}>📱</Text>
      </View>
      <View style={styles.categoryListContent}>
        <Text style={styles.categoryListName}>{item.name}</Text>
        <Text style={styles.categoryListCount}>{item.count} items available</Text>
      </View>
      <View style={styles.categoryArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Categories",
          headerRight: () => (
            <TouchableOpacity
              style={styles.viewToggle}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List size={20} color={colors.text} />
              ) : (
                <Grid size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Browse by Category</Text>
          <Text style={styles.headerSubtitle}>
            Find exactly what you're looking for
          </Text>
        </View>

        {/* Categories List */}
        <FlatList
          data={filteredCategories}
          renderItem={viewMode === 'grid' ? renderCategoryGrid : renderCategoryList}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? numColumns : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={viewMode === 'grid' ? styles.row : undefined}
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
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryListItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryListIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryListContent: {
    flex: 1,
  },
  categoryListName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  categoryListCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});