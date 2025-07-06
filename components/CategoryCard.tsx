import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Category } from '@/types';
import { useRouter } from 'expo-router';
import * as Icons from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  style?: any;
}

export default function CategoryCard({ category, style }: CategoryCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };

  // Dynamically get the icon component
  const IconComponent = (Icons as any)[category.icon.charAt(0).toUpperCase() + category.icon.slice(1)];

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent size={24} color={colors.primary} />}
      </View>
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.count}>{category.count} items</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  count: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});