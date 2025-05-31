import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Screen } from '../components/ui/Screen';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PetCard } from '../components/PetCard';
import { QuickActions } from '../components/QuickActions';

import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { Pet, Gender, HealthCondition } from '../types/pet';
import { Vaccination, VetVisit } from '../types/medical';
import { Walk } from '../types/walk';
import { PetStorage } from '../data/petStorage';
import { MedicalStorage } from '../data/medicalStorage';
import { WalkStorage } from '../data/walkStorage';
import { AchievementsService } from '../services/achievementsService';

type PetProfileScreenRouteProp = RouteProp<RootStackParamList, 'PetProfile'>;
type PetProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PetProfileScreen = () => {
  const route = useRoute<PetProfileScreenRouteProp>();
  const navigation = useNavigation<PetProfileScreenNavigationProp>();
  const { colors, spacing } = useTheme();
  const { petId } = route.params;

  const [pet, setPet] = useState<Pet | null>(null);
  const [nextVaccination, setNextVaccination] = useState<Date | null>(null);
  const [nextVetVisit, setNextVetVisit] = useState<Date | null>(null);
  const [todayWalks, setTodayWalks] = useState<number>(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    loadPetData();
  }, [petId]);

  const loadPetData = async () => {
    try {
      const petStorage = PetStorage.getInstance();
      const medicalStorage = MedicalStorage.getInstance();
      const walkStorage = WalkStorage.getInstance();
      const achievementsService = AchievementsService.getInstance();

      await walkStorage.load(); // Загружаем данные прогулок

      const petData = await petStorage.getAllPets();
      const pet = petData.find(p => p.id === petId);
      if (!pet) return;
      setPet(pet);

      // Загружаем ближайшие события
      const medical = medicalStorage.getDataForPet(petId);
      const nextVac = medical.vaccinations
        .filter((v: Vaccination) => v.nextDate && v.nextDate > new Date())
        .sort((a: Vaccination, b: Vaccination) => 
          (a.nextDate as Date).getTime() - (b.nextDate as Date).getTime()
        )[0];
      
      const nextVisit = medical.vetVisits
        .filter((v: VetVisit) => v.nextVisitDate && v.nextVisitDate > new Date())
        .sort((a: VetVisit, b: VetVisit) => 
          (a.nextVisitDate as Date).getTime() - (b.nextVisitDate as Date).getTime()
        )[0];

      if (nextVac?.nextDate) {
        setNextVaccination(nextVac.nextDate);
      }

      if (nextVisit?.nextVisitDate) {
        setNextVetVisit(nextVisit.nextVisitDate);
      }

      // Загружаем статистику прогулок
      const today = new Date();
      const walks = await walkStorage.getWalks();
      const todayWalksCount = walks
        .filter((w: Walk) => w.petId === petId)
        .filter((w: Walk) => {
          const walkDate = new Date(w.startTime);
          return walkDate.toDateString() === today.toDateString();
        })
        .length;
      setTodayWalks(todayWalksCount);

      // Загружаем достижения
      const petAchievements = achievementsService.getAchievements()
        .filter(a => a.progress > 0)
        .map(a => a.title);
      setAchievements(petAchievements);
    } catch (error) {
      console.error('Error loading pet data:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditPet', { petId });
  };

  const handleAddMedicalRecord = () => {
    navigation.navigate('MainTabs', {
      screen: 'MedicalStack',
      params: { screen: 'AddVetVisit', params: { petId } }
    });
  };

  const handleStartWalk = () => {
    navigation.navigate('MainTabs', { 
      screen: 'WalkStack',
      params: { screen: 'NewWalk' }
    });
  };

  if (!pet) return null;

  return (
    <Screen>
      <ScrollView style={styles.container}>
        {/* Основная информация */}
        <View style={styles.header}>
          <Image 
            source={{ uri: pet.photoUri }} 
            style={styles.photo} 
          />
          <View style={styles.headerInfo}>
            <Text variant="h1" style={styles.name}>{pet.name}</Text>
            <Text variant="body1" style={styles.breed}>{pet.breed}</Text>
            <View style={styles.statsRow}>
              <Text variant="body2">
                {format(new Date(pet.birthDate), 'd MMMM yyyy', { locale: ru })}
              </Text>
              <Text variant="body2">{pet.gender === Gender.Male ? '♂' : '♀'}</Text>
              <Text variant="body2">{pet.weight} кг</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Быстрые действия */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.primary }]}
              onPress={handleStartWalk}
            >
              <Ionicons name="walk" size={24} color={colors.white} />
              <Text style={[styles.quickActionText, { color: colors.white }]}>
                Прогулка
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.success }]}
              onPress={handleAddMedicalRecord}
            >
              <Ionicons name="medical" size={24} color={colors.white} />
              <Text style={[styles.quickActionText, { color: colors.white }]}>
                Медицина
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Ближайшие события */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Ближайшие события</Text>
          {nextVaccination && (
            <View style={styles.eventRow}>
              <Ionicons name="medical" size={24} color={colors.primary} />
              <Text variant="body1" style={styles.eventText}>
                Вакцинация {format(nextVaccination, 'd MMMM', { locale: ru })}
              </Text>
            </View>
          )}
          {nextVetVisit && (
            <View style={styles.eventRow}>
              <Ionicons name="medical" size={24} color={colors.primary} />
              <Text variant="body1" style={styles.eventText}>
                Визит к ветеринару {format(nextVetVisit, 'd MMMM', { locale: ru })}
              </Text>
            </View>
          )}
        </Card>

        {/* Статистика */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Сегодня</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="walk" size={32} color={colors.primary} />
              <Text variant="h2">{todayWalks}</Text>
              <Text variant="body2">прогулок</Text>
            </View>
            {/* Здесь можно добавить другие метрики */}
          </View>
        </Card>

        {/* Достижения */}
        {achievements.length > 0 && (
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Достижения</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Ionicons name="trophy" size={32} color={colors.warning} />
                  <Text variant="body2" style={styles.achievementText}>
                    {achievement}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  breed: {
    marginTop: 4,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventText: {
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  achievementItem: {
    alignItems: 'center',
    width: '30%',
  },
  achievementText: {
    textAlign: 'center',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 