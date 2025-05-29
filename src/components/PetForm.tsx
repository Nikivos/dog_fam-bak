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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PetForm'>;

export const PetForm = () => {
  const navigation = useNavigation<Props['navigation']>();
  const route = useRoute<Props['route']>();
  const initialPet = route.params?.pet;

  const [formData, setFormData] = useState({
    name: initialPet?.name || '',
    breed: initialPet?.breed || '',
    birthDate: initialPet?.birthDate || new Date().toISOString().split('T')[0],
    weight: initialPet?.weight?.toString() || '',
    gender: initialPet?.gender || 'male',
    chipNumber: initialPet?.chipNumber || '',
    allergies: initialPet?.allergies?.join(', ') || '',
    specialNeeds: initialPet?.specialNeeds || '',
    photo: initialPet?.photo || '',
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
      id: initialPet?.id || '',
      name: formData.name.trim(),
      breed: formData.breed.trim(),
      birthDate: formData.birthDate,
      weight: weight,
      gender: formData.gender as 'male' | 'female',
      chipNumber: formData.chipNumber.trim() || undefined,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      specialNeeds: formData.specialNeeds.trim() || undefined,
      photo: formData.photo,
      vaccinations: initialPet?.vaccinations || [],
      medicalRecords: initialPet?.medicalRecords || [],
    };

    console.log('Saving pet data:', petData);

    try {
      await PetStorage.savePet(petData);
      console.log('Pet saved successfully');
      navigation.goBack();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {initialPet ? 'Редактировать питомца' : 'Добавить питомца'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.photoContainer} onPress={showImagePicker}>
          {formData.photo ? (
            <Image source={{ uri: formData.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Добавить фото</Text>
            </View>
          )}
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Дата рождения*</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.birthDate}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderText: {
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
}); 