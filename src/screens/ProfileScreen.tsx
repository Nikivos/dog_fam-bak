import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../types/pet';
import { PetForm } from '../components/PetForm';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme/theme';
import { PetStorage } from '../data/petStorage';
import { LinearGradient } from 'expo-linear-gradient';

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

interface PetInfo {
  name: string;
  breed: string;
  age: number;
  weight: number;
  photo: string;
}

const mockPetInfo: PetInfo = {
  name: 'Макс',
  breed: 'Лабрадор',
  age: 2,
  weight: 25,
  photo: 'https://via.placeholder.com/120',
};

const settingsItems = [
  { icon: 'person-outline' as keyof typeof Ionicons.glyphMap, label: 'Личные данные' },
  { icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap, label: 'Уведомления' },
  { icon: 'share-social-outline' as keyof typeof Ionicons.glyphMap, label: 'Поделиться доступом' }
];

export const ProfileScreen = () => {
  const [pet, setPet] = useState<Pet>(mockPet);
  const [isEditMode, setIsEditMode] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadPet = async () => {
      const storage = PetStorage.getInstance();
      const pets = await storage.getAllPets();
      if (pets.length > 0) {
        setPet(pets[0]);
      }
    };
    loadPet();
  }, []);

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
              mediaTypes: 'images',
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, `${colors.primary}80`]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: pet.photo }} style={styles.photo} />
              <LinearGradient
                colors={[colors.card, `${colors.card}90`]}
                style={styles.editPhotoButton}
              >
                <Button
                  variant="tertiary"
                  size="small"
                  onPress={handlePhotoPress}
                  icon={<Ionicons name="camera" size={20} color={colors.primary} />}
                />
              </LinearGradient>
            </View>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.breed}>{pet.breed}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <Card variant="elevated" style={styles.statsCard}>
              <LinearGradient
                colors={[`${colors.primary}05`, `${colors.primary}10`]}
                style={styles.statsGradient}
              >
                <View style={styles.statsContent}>
                  <View style={[styles.statsIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Ionicons name="calendar" size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.statsValue}>{calculateAge(pet.birthDate)} года</Text>
                  <Text style={styles.statsLabel}>Возраст</Text>
                </View>
              </LinearGradient>
            </Card>
            <Card variant="elevated" style={styles.statsCard}>
              <LinearGradient
                colors={[`${colors.secondary}05`, `${colors.secondary}10`]}
                style={styles.statsGradient}
              >
                <View style={styles.statsContent}>
                  <View style={[styles.statsIcon, { backgroundColor: `${colors.secondary}15` }]}>
                    <Ionicons name="scale" size={24} color={colors.secondary} />
                  </View>
                  <Text style={styles.statsValue}>{pet.weight} кг</Text>
                  <Text style={styles.statsLabel}>Вес</Text>
                </View>
              </LinearGradient>
            </Card>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.primary}15`, `${colors.primary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Документы</Text>
              </View>
            </View>

            <Card variant="elevated" style={styles.documentCard}>
              <LinearGradient
                colors={[colors.card, `${colors.primary}05`]}
                style={styles.documentGradient}
              >
                <View style={styles.documentContent}>
                  <View style={[styles.documentIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Ionicons name="medical" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>Паспорт питомца</Text>
                    <Text style={styles.documentDescription}>
                      Основной документ с информацией о прививках и лечении
                    </Text>
                  </View>
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<Ionicons name="chevron-forward" size={20} color={colors.primary} />}
                  />
                </View>
              </LinearGradient>
            </Card>

            <Card variant="elevated" style={styles.documentCard}>
              <LinearGradient
                colors={[colors.card, `${colors.secondary}05`]}
                style={styles.documentGradient}
              >
                <View style={styles.documentContent}>
                  <View style={[styles.documentIcon, { backgroundColor: `${colors.secondary}15` }]}>
                    <Ionicons name="ribbon" size={24} color={colors.secondary} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>Родословная</Text>
                    <Text style={styles.documentDescription}>
                      Документ о происхождении и регистрации
                    </Text>
                  </View>
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<Ionicons name="chevron-forward" size={20} color={colors.secondary} />}
                  />
                </View>
              </LinearGradient>
            </Card>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.primary}15`, `${colors.primary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="settings" size={20} color={colors.primary} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Настройки</Text>
              </View>
            </View>

            <Card variant="elevated" style={styles.settingsCard}>
              {settingsItems.map((setting, index, array) => (
                <React.Fragment key={setting.label}>
                  <Button
                    variant="tertiary"
                    size="medium"
                    style={styles.settingsButton}
                    icon={<Ionicons name={setting.icon} size={20} color={colors.text.primary} />}
                  >
                    {setting.label}
                  </Button>
                  {index < array.length - 1 && <View style={styles.settingsDivider} />}
                </React.Fragment>
              ))}
            </Card>
          </View>
        </View>
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
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  } as ViewStyle,
  content: {
    flex: 1,
    marginTop: -spacing.xl,
    padding: spacing.md,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    backgroundColor: colors.background,
  } as ViewStyle,
  header: {
    alignItems: 'center',
  } as ViewStyle,
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  } as ViewStyle,
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.card,
  },
  editPhotoButton: {
    position: 'absolute',
    right: -spacing.xs,
    bottom: -spacing.xs,
    borderRadius: borderRadius.circle,
    padding: spacing.xs,
    ...shadows.small,
  } as ViewStyle,
  name: {
    ...typography.h1,
    color: colors.text.light,
    textAlign: 'center',
  } as TextStyle,
  breed: {
    ...typography.body,
    color: colors.text.light,
    opacity: 0.9,
    textAlign: 'center',
  } as TextStyle,
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  } as ViewStyle,
  statsCard: {
    flex: 1,
    margin: spacing.xs,
    overflow: 'hidden',
  } as ViewStyle,
  statsGradient: {
    padding: spacing.md,
  } as ViewStyle,
  statsContent: {
    alignItems: 'center',
  } as ViewStyle,
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as ViewStyle,
  statsValue: {
    ...typography.h2,
  } as TextStyle,
  statsLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
  section: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionHeader: {
    marginBottom: spacing.md,
  } as ViewStyle,
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  } as ViewStyle,
  sectionTitle: {
    ...typography.h2,
  } as TextStyle,
  documentCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  documentGradient: {
    padding: spacing.md,
  } as ViewStyle,
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  documentInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  } as ViewStyle,
  documentTitle: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  documentDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  } as TextStyle,
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  } as ViewStyle,
  settingsButton: {
    width: '100%',
    justifyContent: 'flex-start',
    borderRadius: 0,
    padding: spacing.md,
  } as ViewStyle,
  settingsDivider: {
    height: 1,
    backgroundColor: `${colors.text.secondary}10`,
  } as ViewStyle,
}); 