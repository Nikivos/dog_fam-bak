import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../types/pet';
import { PetStorage } from '../data/petStorage';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { Button } from './Button';

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      allergies: formData.allergies ? formData.allergies.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const pickImage = async () => {
    try {
      // Запрашиваем разрешения
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
        return;
      }

      // Открываем галерею
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        handleChange('photo', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const takePhoto = async () => {
    try {
      // Запрашиваем разрешения
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на использование камеры');
        return;
      }

      // Открываем камеру
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        handleChange('photo', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Добавить фото',
      'Выберите источник фото',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Сделать фото',
          onPress: takePhoto,
        },
        {
          text: 'Выбрать из галереи',
          onPress: pickImage,
        },
      ]
    );
  };

  const handleClose = () => {
    Alert.alert(
      'Закрыть форму',
      'Вы уверены? Все несохраненные изменения будут потеряны.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Закрыть',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Редактировать питомца' : 'Добавить питомца'}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={32} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.photoContainer} onPress={showImagePicker}>
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color={colors.text.secondary} />
                <Text style={styles.photoPlaceholderText}>Добавить фото</Text>
              </View>
            )}
          </TouchableOpacity>

          <Button
            variant="secondary"
            onPress={showImagePicker}
            icon={<Ionicons name="camera" size={20} color={colors.primary} />}
            style={styles.photoButton}
          >
            {formData.photo ? 'Изменить фото' : 'Добавить фото'}
          </Button>

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
                <Text style={formData.gender === 'male' ? styles.genderTextActive : styles.genderText}>
                  Мальчик
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => handleChange('gender', 'female')}
              >
                <Text style={formData.gender === 'female' ? styles.genderTextActive : styles.genderText}>
                  Девочка
                </Text>
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
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
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
    ...typography.h1,
    color: colors.text.primary,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body1,
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
    ...typography.body1,
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
    ...typography.body1,
    color: colors.text.primary,
  },
  genderTextActive: {
    ...typography.body1,
    color: colors.text.light,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.light,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
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
  photoButton: {
    marginBottom: spacing.xl,
  },
  photoPlaceholderText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
}); 