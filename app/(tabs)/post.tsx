import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { mockCategories } from '@/mocks/data';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Plus, X, DollarSign, Info } from 'lucide-react-native';

export default function PostItemScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState<'new' | 'like new' | 'good' | 'fair'>('good');
  const [allowBarter, setAllowBarter] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 5 images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    if (!title || !description || !price || !category || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success!', 
        'Your item has been posted successfully.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post your item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Post an Item for Rent</Text>
        <Text style={styles.subtitle}>
          Share your items with the community and earn money.
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>
          <Text style={styles.sectionSubtitle}>
            Add up to 5 high-quality photos of your item.
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri }}
                  style={styles.image}
                  contentFit="cover"
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Camera size={24} color={colors.textSecondary} />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you renting out?"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your item, include condition, features, etc."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {mockCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.name && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.name && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.conditionContainer}>
              {(['new', 'like new', 'good', 'fair'] as const).map((cond) => (
                <TouchableOpacity
                  key={cond}
                  style={[
                    styles.conditionButton,
                    condition === cond && styles.conditionButtonActive,
                  ]}
                  onPress={() => setCondition(cond)}
                >
                  <Text
                    style={[
                      styles.conditionText,
                      condition === cond && styles.conditionTextActive,
                    ]}
                  >
                    {cond.charAt(0).toUpperCase() + cond.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceInputContainer}>
              <DollarSign size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.priceUnitContainer}>
              {(['hour', 'day', 'week', 'month'] as const).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.priceUnitButton,
                    priceUnit === unit && styles.priceUnitButtonActive,
                  ]}
                  onPress={() => setPriceUnit(unit)}
                >
                  <Text
                    style={[
                      styles.priceUnitText,
                      priceUnit === unit && styles.priceUnitTextActive,
                    ]}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.barterContainer}
            onPress={() => setAllowBarter(!allowBarter)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                allowBarter && styles.checkboxActive
              ]}>
                {allowBarter && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.barterText}>Allow Barter/Exchange</Text>
            </View>
            <Info size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Post Item"
          onPress={handleSubmit}
          loading={loading}
          disabled={!title || !description || !price || !category || images.length === 0}
          style={styles.button}
          size="large"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  conditionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  conditionButtonActive: {
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
  },
  conditionText: {
    fontSize: 14,
    color: colors.text,
  },
  conditionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    padding: 16,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  priceUnitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceUnitButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priceUnitButtonActive: {
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
  },
  priceUnitText: {
    fontSize: 14,
    color: colors.text,
  },
  priceUnitTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  barterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  barterText: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    marginTop: 8,
  },
});