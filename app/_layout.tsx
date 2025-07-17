import { BundleInspector } from '../.rorkai/inspector';
import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';
import useAuth from '@/hooks/useAuth';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Determine the initial route based on authentication state
  let initialRoute = '(tabs)';
  
  if (!hasCompletedOnboarding) {
    initialRoute = 'onboarding';
  } else if (!isAuthenticated) {
    initialRoute = 'auth';
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RorkErrorBoundary>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerBackTitle: "Back",
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerShadowVisible: false,
              headerTintColor: colors.text,
              headerTitleStyle: {
                fontWeight: '600',
              },
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
            initialRouteName={initialRoute}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen 
              name="product/[id]" 
              options={{ 
                title: "Product Details",
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="category/[id]" 
              options={{ 
                title: "Category",
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="profile/setup" 
              options={{ 
                title: "Complete Your Profile",
                headerBackVisible: false,
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </View>
        <BundleInspector />
      </RorkErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});