import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image,
  Modal,
  FlatList,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../types/pet';
import { PetStorage } from '../data/petStorage';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { Button } from './Button';
import { dogBreeds } from '../data/breeds';

interface PetFormProps {
  initialData?: Pet;
  onSubmit: (pet: Pet) => void;
  onCancel: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    breed: initialData?.breed || '',
    birthDate: initialData?.birthDate || new Date().toISOString().split('T')[0],
    weight: initialData?.weight?.toString() || '',
    gender: initialData?.gender || 'male',
    chipNumber: initialData?.chipNumber || '',
    allergies: initialData?.allergies?.join(', ') || '',
    specialNeeds: initialData?.specialNeeds || '',
    photo: initialData?.photo || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  // Для свайпа
  const screenHeight = Dimensions.get('window').height;
  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 200,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > screenHeight * 0.2) {
          closeAnim.start(() => onCancel());
        } else {
          resetPositionAnim.start();
        }
      },
    })
  ).current;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'breed') {
      if (value.length > 0) {
        const suggestions = dogBreeds.filter(breed => 
          breed.toLowerCase().includes(value.toLowerCase())
        );
        setBreedSuggestions(suggestions);
        setShowBreedSuggestions(suggestions.length > 0);
      } else {
        setBreedSuggestions([]);
        setShowBreedSuggestions(false);
      }
    }
  };

  const handleBreedSelect = (breed: string) => {
    setFormData(prev => ({
      ...prev,
      breed: breed
    }));
    setShowBreedSuggestions(false);
    setBreedSuggestions([]);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleImagePick = async (type: 'camera' | 'gallery') => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на использование камеры');
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets[0]) {
      handleChange('photo', result.assets[0].uri);
    }
    setShowImagePicker(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Имя питомца обязательно для заполнения');
      return;
    }

    if (!formData.breed.trim()) {
      Alert.alert('Ошибка', 'Укажите породу питомца');
      return;
    }

    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Ошибка', 'Укажите корректный вес питомца');
      return;
    }

    const petData: Pet = {
      id: initialData?.id || '',
      name: formData.name.trim(),
      breed: formData.breed.trim(),
      birthDate: formData.birthDate,
      weight: weight,
      gender: formData.gender as 'male' | 'female',
      chipNumber: formData.chipNumber.trim() || undefined,
      allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()).filter(Boolean) : [],
      specialNeeds: formData.specialNeeds.trim() || undefined,
      photo: formData.photo,
      vaccinations: initialData?.vaccinations || [],
      medicalRecords: initialData?.medicalRecords || [],
    };

    try {
      const storage = PetStorage.getInstance();
      await storage.save(petData);
      console.log('Pet saved successfully');
      onSubmit(petData);
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить данные питомца');
    }
  };

  return (
    <Animated.View 
      style={[styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {initialData ? 'Редактировать питомца' : 'Добавить питомца'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={32} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.photoContainer} 
              onPress={() => setShowImagePicker(true)}
            >
              {formData.photo ? (
                <Image source={{ uri: formData.photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={32} color={colors.text.secondary} />
                  <Text style={styles.photoPlaceholderText}>Добавить фото</Text>
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color={colors.text.light} />
              </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя*</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Введите имя питомца"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Порода*</Text>
              <TextInput
                style={styles.input}
                value={formData.breed}
                onChangeText={(value) => handleChange('breed', value)}
                placeholder="Введите породу"
              />
              {showBreedSuggestions && (
                <>
                  <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={0}
                    onPress={() => {
                      setShowBreedSuggestions(false);
                      setBreedSuggestions([]);
                    }}
                  />
                  <View style={styles.suggestionsContainer}>
                    <View style={styles.suggestionsList}>
                      {breedSuggestions.map((breed) => (
                        <TouchableOpacity
                          key={breed}
                          style={styles.suggestionItem}
                          onPress={() => handleBreedSelect(breed)}
                        >
                          <Text style={styles.suggestionText}>{breed}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата рождения*</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formData.birthDate}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.birthDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Вес (кг)*</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(value) => handleChange('weight', value)}
                keyboardType="decimal-pad"
                placeholder="Введите вес"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Пол</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => handleChange('gender', 'male')}
                >
                  <Text style={[
                    styles.genderText,
                    formData.gender === 'male' && styles.genderTextActive
                  ]}>♂ Мальчик</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => handleChange('gender', 'female')}
                >
                  <Text style={[
                    styles.genderText,
                    formData.gender === 'female' && styles.genderTextActive
                  ]}>♀ Девочка</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Номер чипа (если есть)</Text>
              <TextInput
                style={styles.input}
                value={formData.chipNumber}
                onChangeText={(value) => handleChange('chipNumber', value)}
                placeholder="Введите номер чипа"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Аллергии (через запятую)</Text>
              <TextInput
                style={styles.input}
                value={formData.allergies}
                onChangeText={(value) => handleChange('allergies', value)}
                placeholder="Например: курица, говядина"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Особые потребности</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.specialNeeds}
                onChangeText={(value) => handleChange('specialNeeds', value)}
                placeholder="Опишите особые потребности питомца"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit}>
                {initialData ? 'Сохранить изменения' : 'Добавить питомца'}
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <Modal
          visible={showImagePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Выберите фото</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick('camera')}
              >
                <Ionicons name="camera" size={24} color={colors.primary} />
                <Text style={styles.modalOptionText}>Сделать фото</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick('gallery')}
              >
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={styles.modalOptionText}>Выбрать из галереи</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: colors.text.primary,
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.background,
  },
  photoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.primary,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  genderButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.primary,
  },
  genderTextActive: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.light,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  suggestionsList: {
    maxHeight: 200,
    backgroundColor: colors.background,
  },
  suggestionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  cancelOption: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.error,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
}); 