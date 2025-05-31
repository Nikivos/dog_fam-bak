import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetStorage } from '../data/petStorage';
import { Pet } from '../types/pet';
import { colors, spacing, typography } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PetDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PetProfile'>;

export const PetDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PetDetailsScreenRouteProp>();
  const { petId } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const loadPet = async () => {
      const storage = PetStorage.getInstance();
      const pets = await storage.getAllPets();
      const foundPet = pets.find(p => p.id === petId);
      setPet(foundPet || null);
    };
    loadPet();
  }, [petId]);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: pet.photoUri }}
          style={styles.photo as ImageStyle}
          defaultSource={require('../assets/default-pet.png')}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.breed}>{pet.breed}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основная информация</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Возраст:</Text>
          <Text style={styles.value}>{calculateAge(pet.birthDate)} лет</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Дата рождения:</Text>
          <Text style={styles.value}>{formatDate(pet.birthDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Вес:</Text>
          <Text style={styles.value}>{pet.weight} кг</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Здоровье</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Состояние:</Text>
          <Text style={styles.value}>{pet.healthCondition}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Прививки:</Text>
          <Text style={styles.value}>{pet.vaccinations.length} записей</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Аллергии:</Text>
          <Text style={styles.value}>
            {pet.allergies.length > 0 ? pet.allergies.join(', ') : 'Нет'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditPet', { petId: pet.id })}
      >
        <Ionicons name="pencil" size={24} color={colors.text.primary} />
        <Text style={styles.editButtonText}>Редактировать</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    lineHeight: typography.body1.lineHeight,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.h1.fontSize,
    fontWeight: '600',
    lineHeight: typography.h1.lineHeight,
    color: colors.text.primary,
  },
  breed: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    lineHeight: typography.body1.lineHeight,
    color: colors.text.secondary,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
    lineHeight: typography.h2.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.body2.fontSize,
    fontWeight: '400',
    lineHeight: typography.body2.lineHeight,
    color: colors.text.secondary,
  },
  value: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    lineHeight: typography.body1.lineHeight,
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  editButtonText: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
}); 