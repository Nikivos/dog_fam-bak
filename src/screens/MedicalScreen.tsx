import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextStyle, ViewStyle, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isAfter, isBefore, addDays, parse, differenceInDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius, typography, layout } from '../theme/theme';
import { VaccinationCard } from '../components/VaccinationCard';
import { VetVisitCard } from '../components/VetVisitCard';
import { MedicalStorage } from '../data/medicalStorage';
import { Vaccination, VetVisit } from '../types/medical';
import { useNavigation } from '@react-navigation/native';
import { MedicalStackNavigationProp } from '../types/navigation';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

type NavigationProp = MedicalStackNavigationProp;

type TabType = 'vaccinations' | 'visits';

const Tab = createMaterialTopTabNavigator();

const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    name: 'Бешенство',
    date: '15.03.2024',
    nextDate: '15.03.2025',
    type: 'Ежегодная',
  },
  {
    id: '2',
    name: 'Комплексная DHPP',
    date: '01.02.2024',
    nextDate: '01.02.2025',
    type: 'Ежегодная',
  },
];

const mockVisits: VetVisit[] = [
  {
    id: '1',
    date: '25.03.2024',
    reason: 'Плановый осмотр',
    doctor: 'Др. Иванов',
    status: 'scheduled',
  },
  {
    id: '2',
    date: '10.03.2024',
    reason: 'Вакцинация',
    doctor: 'Др. Петрова',
    status: 'completed',
  },
];

const VaccinationsTab = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadVaccinations();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadVaccinations();
    });

    return unsubscribe;
  }, [navigation]);

  const loadVaccinations = async () => {
    const storage = MedicalStorage.getInstance();
    await storage.load();
    setVaccinations(storage.getVaccinations());
  };

  const handleAddVaccination = () => {
    navigation.navigate('AddVaccination');
  };

  const handleVaccinationPress = (id: string) => {
    navigation.navigate('VaccinationDetails', { id });
  };

  const renderVaccinationCard = (vaccination: Vaccination) => {
    const nextDate = parse(vaccination.nextDate, 'yyyy-MM-dd', new Date());
    const daysUntilNext = differenceInDays(nextDate, new Date());
    const isUrgent = daysUntilNext <= 7 && daysUntilNext > 0;
    const isOverdue = daysUntilNext < 0;

    return (
      <TouchableOpacity
        key={vaccination.id}
        style={styles.cardContainer}
        onPress={() => handleVaccinationPress(vaccination.id)}
      >
        <LinearGradient
          colors={isUrgent ? ['#ff9966', '#ff5e62'] : isOverdue ? ['#ED4337', '#C32F27'] : ['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{vaccination.name}</Text>
            {isUrgent && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Срочно</Text>
              </View>
            )}
            {isOverdue && (
              <View style={[styles.badge, styles.overdueBadge]}>
                <Text style={styles.badgeText}>Просрочено</Text>
              </View>
            )}
          </View>

          <View style={styles.cardRow}>
            <Ionicons name="calendar" size={20} color={colors.text.light} />
            <Text style={styles.cardText}>
              {format(parse(vaccination.date, 'yyyy-MM-dd', new Date()), 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Ionicons name="time" size={20} color={colors.text.light} />
            <Text style={styles.cardText}>
              Следующая: {format(nextDate, 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {vaccinations.length > 0 ? (
          vaccinations.map(renderVaccinationCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="medical" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>Нет вакцинаций</Text>
            <Text style={styles.emptyStateText}>
              Добавьте информацию о вакцинациях вашего питомца
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddVaccination}>
        <Ionicons name="add" size={24} color={colors.text.light} />
      </TouchableOpacity>
    </View>
  );
};

const VetVisitsTab = () => {
  const [visits, setVisits] = useState<VetVisit[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadVisits();
    });

    return unsubscribe;
  }, [navigation]);

  const loadVisits = async () => {
    const storage = MedicalStorage.getInstance();
    await storage.load();
    setVisits(storage.getVetVisits());
  };

  const handleAddVisit = () => {
    navigation.navigate('AddVetVisit');
  };

  const handleVisitPress = (id: string) => {
    navigation.navigate('VetVisitDetails', { id });
  };

  const renderVisitCard = (visit: VetVisit) => {
    const visitDate = parse(visit.date, 'yyyy-MM-dd', new Date());
    const isTodays = isToday(visitDate);

    return (
      <TouchableOpacity
        key={visit.id}
        style={styles.cardContainer}
        onPress={() => handleVisitPress(visit.id)}
      >
        <LinearGradient
          colors={isTodays ? ['#ff9966', '#ff5e62'] : ['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{visit.reason}</Text>
            {isTodays && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Сегодня</Text>
              </View>
            )}
            <View style={[styles.badge, styles.statusBadge]}>
              <Text style={styles.badgeText}>
                {visit.status === 'scheduled' ? 'Запланирован' : visit.status === 'completed' ? 'Завершен' : 'Отменен'}
              </Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <Ionicons name="calendar" size={20} color={colors.text.light} />
            <Text style={styles.cardText}>
              {format(visitDate, 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>

          {visit.doctor && (
            <View style={styles.cardRow}>
              <Ionicons name="person" size={20} color={colors.text.light} />
              <Text style={styles.cardText}>
                {visit.doctor}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {visits.length > 0 ? (
          visits.map(renderVisitCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="medical" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>Нет визитов</Text>
            <Text style={styles.emptyStateText}>
              Добавьте информацию о визитах к ветеринару
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddVisit}>
        <Ionicons name="add" size={24} color={colors.text.light} />
      </TouchableOpacity>
    </View>
  );
};

export const MedicalScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarPressColor: `${colors.primary}20`,
          tabBarPressOpacity: 0.8,
        }}
      >
        <Tab.Screen
          name="Vaccinations"
          component={VaccinationsTab}
          options={{
            title: 'Вакцинации',
          }}
        />
        <Tab.Screen
          name="VetVisits"
          component={VetVisitsTab}
          options={{
            title: 'Визиты',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.light,
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardText: {
    fontSize: 16,
    color: colors.text.light,
    marginLeft: spacing.sm,
  },
  badge: {
    backgroundColor: colors.text.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  overdueBadge: {
    backgroundColor: colors.error,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  tabBar: {
    backgroundColor: colors.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 48,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: 1.5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
    letterSpacing: 0.2,
  },
}); 