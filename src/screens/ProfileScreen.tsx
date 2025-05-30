import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../types/pet';
import { PetForm } from '../components/PetForm';
import { Card } from '../components/Card';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';
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
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
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

  const handleLongPress = (section: string) => {
    Alert.alert(
      'Редактировать',
      `Хотите отредактировать раздел "${section}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Редактировать', onPress: () => handleEditPress() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Фиксированный хедер с фото */}
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: pet.photo }} style={styles.photo} />
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={handlePhotoPress}
          >
            <Ionicons name="camera" size={20} color={colors.text.light} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
      </View>

      {/* Основной контент */}
      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Карточка статистики */}
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calculateAge(pet.birthDate)}</Text>
              <Text style={styles.statLabel}>лет</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pet.weight}</Text>
              <Text style={styles.statLabel}>кг</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pet.gender === 'male' ? '♂' : '♀'}</Text>
              <Text style={styles.statLabel}>пол</Text>
            </View>
          </View>
        </Card>

        {/* Секция здоровья */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Здоровье</Text>
          
          {/* Прививки */}
          <Pressable onLongPress={() => handleLongPress('Прививки')}>
            <Card style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name="medical" size={20} color={colors.primary} />
                </View>
                <Text style={styles.healthCardTitle}>Прививки</Text>
              </View>
              {pet.vaccinations.map((vaccination) => (
                <View key={vaccination.id} style={styles.healthItem}>
                  <Text style={styles.healthItemTitle}>{vaccination.name}</Text>
                  <Text style={styles.healthItemDate}>Следующая: {vaccination.nextDate}</Text>
                </View>
              ))}
            </Card>
          </Pressable>

          {/* Медкарта */}
          <Pressable onLongPress={() => handleLongPress('Медкарта')}>
            <Card style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.accent}15` }]}>
                  <Ionicons name="fitness" size={20} color={colors.accent} />
                </View>
                <Text style={styles.healthCardTitle}>Медкарта</Text>
              </View>
              {pet.medicalRecords.map((record) => (
                <View key={record.id} style={styles.healthItem}>
                  <Text style={styles.healthItemTitle}>{record.description}</Text>
                  <Text style={styles.healthItemSubtitle}>{record.doctor}</Text>
                  <Text style={styles.healthItemDate}>{record.date}</Text>
                </View>
              ))}
            </Card>
          </Pressable>

          {/* Аллергии */}
          {pet.allergies.length > 0 && (
            <Pressable onLongPress={() => handleLongPress('Аллергии')}>
              <Card style={styles.healthCard}>
                <View style={styles.healthCardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.error}15` }]}>
                    <Ionicons name="warning" size={20} color={colors.error} />
                  </View>
                  <Text style={styles.healthCardTitle}>Аллергии</Text>
                </View>
                <View style={styles.allergyList}>
                  {pet.allergies.map((allergy, index) => (
                    <View key={index} style={styles.allergyItem}>
                      <View style={styles.allergyDot} />
                      <Text style={styles.allergyText}>{allergy}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </Pressable>
          )}
        </View>
      </Animated.ScrollView>

      {/* Плавающая кнопка редактирования */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditPress}
      >
        <Ionicons name="create-outline" size={24} color={colors.text.light} />
      </TouchableOpacity>

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
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.small,
  },
  photoContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.background,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
    fontWeight: 700,
  },
  breed: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: 400,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: 400,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: `${colors.text.secondary}15`,
    marginHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  healthCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  healthCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  healthCardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: 600,
  },
  healthItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.text.secondary}10`,
  },
  healthItemTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: 500,
  },
  healthItemSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '400',
  },
  healthItemDate: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: 400,
  },
  allergyList: {
    marginTop: spacing.sm,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  allergyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  allergyText: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '400',
  },
  editButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
}); 