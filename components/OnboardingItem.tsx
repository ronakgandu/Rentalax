import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { OnboardingSlide } from '@/types';

interface OnboardingItemProps {
  item: OnboardingSlide;
}

export default function OnboardingItem({ item }: OnboardingItemProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={{ uri: item.image }}
        style={[styles.image, { width: width * 0.8 }]}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    height: 300,
    borderRadius: 20,
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 16,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: 20,
  },
});