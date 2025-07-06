import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User, MapPin, Camera, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { UserType } from '@/types';
import Button from '@/components/Button';
import useAuth from '@/hooks/useAuth';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [userType, setUserType] = useState<UserType>('both');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const userTypeOptions = [
    {
      type: 'renter' as UserType,
      title: 'Renter',
      description: 'I want to rent items from others',
      icon: '🏠',
    },
    {
      type: 'owner' as UserType,
      title: 'Owner',
      description: 'I want to rent out my items',
      icon: '💰',
    },
    {
      type: 'both' as UserType,
      title: 'Both',
      description: 'I want to rent and rent out items',
      icon: '🔄',
    },
  ];

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      await updateUser({
        ...user!,
        name: name.trim(),
        location: location.trim(),
        userType,
      });

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Complete Your Profile",
          headerBackVisible: false,
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Let's set up your profile</Text>
          <Text style={styles.subtitle}>
            Help others get to know you better and build trust in the community
          </Text>
        </View>

        {/* Profile Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo</Text>
          <TouchableOpacity style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color={colors.textSecondary} />
              <Text style={styles.photoText}>Add Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="City, State"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        {/* User Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How do you plan to use RentShare?</Text>
          <Text style={styles.sectionSubtitle}>You can change this later in settings</Text>
          
          <View style={styles.userTypeContainer}>
            {userTypeOptions.map((option) => (
              <TouchableOpacity
                key={option.type}
                style={[
                  styles.userTypeCard,
                  userType === option.type && styles.userTypeCardSelected
                ]}
                onPress={() => setUserType(option.type)}
              >
                <View style={styles.userTypeHeader}>
                  <Text style={styles.userTypeIcon}>{option.icon}</Text>
                  {userType === option.type && (
                    <View style={styles.checkIcon}>
                      <Check size={16} color="white" />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.userTypeTitle,
                  userType === option.type && styles.userTypeTitleSelected
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.userTypeDescription,
                  userType === option.type && styles.userTypeDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Complete Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Complete Setup"
            onPress={handleComplete}
            loading={loading}
            style={styles.completeButton}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  userTypeContainer: {
    gap: 12,
  },
  userTypeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  userTypeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(74, 128, 240, 0.05)',
  },
  userTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userTypeIcon: {
    fontSize: 24,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userTypeTitleSelected: {
    color: colors.primary,
  },
  userTypeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  userTypeDescriptionSelected: {
    color: colors.text,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  completeButton: {
    width: '100%',
  },
  bottomSpacing: {
    height: 40,
  },
});