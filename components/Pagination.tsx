import React from 'react';
import { View, StyleSheet, Animated, useWindowDimensions, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface PaginationProps {
  data: any[];
  scrollX?: Animated.Value;
  currentIndex?: number;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
}

export default function Pagination({ 
  data, 
  scrollX, 
  currentIndex = 0,
  dotStyle,
  activeDotStyle 
}: PaginationProps) {
  const { width } = useWindowDimensions();

  // If scrollX is provided, use animated pagination
  if (scrollX) {
    return (
      <View style={styles.container}>
        {data.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  }

  // Static pagination with currentIndex
  return (
    <View style={styles.container}>
      {data.map((_, i) => (
        <View
          key={i.toString()}
          style={[
            styles.staticDot,
            dotStyle,
            i === currentIndex && styles.activeDot,
            i === currentIndex && activeDotStyle,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  staticDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.inactive,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
});