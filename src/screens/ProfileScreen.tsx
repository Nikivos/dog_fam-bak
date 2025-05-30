import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../types/pet';
import { PetForm } from '../components/PetForm';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { PetStorage } from '../data/petStorage';

// Временные данные для демонстрации
const mockPet: Pet = {
  id: '1',
  name: 'Барон',
  breed: 'Немецкая овчарка',
  birthDate: '2020-05-15',
  weight: 32,
  photo: 'https://placekitten.com/200/200', // Временное фото
  gender: 'male',
  vaccinations: [
    {
      id: '1',
      name: 'Бешенство',
      date: '2023-06-01',
      nextDate: '2024-06-01',
    },
  ],
  medicalRecords: [
    {
      id: '1',
      date: '2023-12-15',
      description: 'Ежегодный осмотр',
      doctor: 'Иванов И.И.',
      clinic: 'ВетКлиника',
    },
  ],
  allergies: ['Курица'],
};

export const ProfileScreen = () => {
  const [pet, setPet] = useState<Pet>(mockPet);
  const [isEditMode, setIsEditMode] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handlePhotoPress = async () => {
    const options: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => Promise<void>;
    }> = [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Сделать фото',
        onPress: async () => {
          try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Ошибка', 'Нужно разрешение на использование камеры');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
              const updatedPet = { ...pet, photo: result.assets[0].uri };
              setPet(updatedPet);
              const storage = PetStorage.getInstance();
              await storage.save(updatedPet);
            }
          } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Ошибка', 'Не удалось сделать фото');
          }
        },
      },
      {
        text: 'Выбрать из галереи',
        onPress: async () => {
          try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
              const updatedPet = { ...pet, photo: result.assets[0].uri };
              setPet(updatedPet);
              const storage = PetStorage.getInstance();
              await storage.save(updatedPet);
            }
          } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Ошибка', 'Не удалось выбрать фото');
          }
        },
      },
    ];

    Alert.alert('Изменить фото', 'Выберите способ', options);
  };

  const handleFormSubmit = (updatedPet: Pet) => {
    setPet(updatedPet);
    setIsEditMode(false);
  };

  const handleFormCancel = () => {
    setIsEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.photoContainer}>
            <Image source={{ uri: pet.photo }} style={styles.photo} />
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={handlePhotoPress}
            >
              <Ionicons name="camera" size={24} color={colors.text.light} />
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.breed}>{pet.breed}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditPress}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={styles.editProfileText}>Редактировать профиль</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Card variant="subtle" style={styles.infoCard}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.infoValue}>{calculateAge(pet.birthDate)} лет</Text>
              <Text style={styles.infoLabel}>Возраст</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="scale" size={24} color={colors.primary} />
              <Text style={styles.infoValue}>{pet.weight} кг</Text>
              <Text style={styles.infoLabel}>Вес</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name={pet.gender === 'male' ? 'male' : 'female'} size={24} color={colors.primary} />
              <Text style={styles.infoValue}>
                {pet.gender === 'male' ? 'Мальчик' : 'Девочка'}
              </Text>
              <Text style={styles.infoLabel}>Пол</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Прививки</Text>
          {pet.vaccinations.map((vaccination) => (
            <Card key={vaccination.id} style={styles.itemCard}>
              <View style={styles.vaccinationItem}>
                <View style={styles.itemHeader}>
                  <Ionicons name="medical" size={20} color={colors.primary} />
                  <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                </View>
                <Text style={styles.vaccinationDate}>
                  Следующая: {vaccination.nextDate}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Медицинская карта</Text>
          {pet.medicalRecords.map((record) => (
            <Card key={record.id} style={styles.itemCard}>
              <View style={styles.recordItem}>
                <Text style={styles.recordDate}>{record.date}</Text>
                <Text style={styles.recordDescription}>{record.description}</Text>
                <Text style={styles.recordDoctor}>{record.doctor}</Text>
              </View>
            </Card>
          ))}
        </View>

        {pet.allergies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Аллергии</Text>
            <Card style={styles.itemCard}>
              {pet.allergies.map((allergy, index) => (
                <Text key={index} style={styles.allergyItem}>
                  • {allergy}
                </Text>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>

      <Modal 
        visible={isEditMode} 
        animationType="slide"
        presentationStyle="formSheet"
      >
        <PetForm
          initialData={pet}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.circle,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  breed: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.large,
    marginTop: spacing.xl,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
  },
  editProfileText: {
    ...typography.body2,
    color: colors.primary,
  },
  infoCard: {
    margin: spacing.md,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  infoValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  vaccinationItem: {
    padding: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vaccinationName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  vaccinationDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  recordItem: {
    padding: spacing.md,
  },
  recordDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  recordDescription: {
    ...typography.body1,
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  recordDoctor: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  allergyItem: {
    ...typography.body1,
    color: colors.text.primary,
    padding: spacing.sm,
  },
}); 