import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isAfter, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, borderRadius, typography, layout } from '../theme/theme';
import { VaccinationCard } from '../components/VaccinationCard';
import { VetVisitCard } from '../components/VetVisitCard';
import { MedicalStorage } from '../data/medicalStorage';
import { Vaccination, VetVisit } from '../types/medical';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuickAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: keyof RootStackParamList;
  color: string;
};

const quickActions: QuickAction[] = [
  {
    icon: 'medical',
    label: 'Вакцинация',
    screen: 'AddVaccination',
    color: colors.primary,
  },
  {
    icon: 'medkit',
    label: 'Визит к врачу',
    screen: 'AddVetVisit',
    color: colors.success,
  },
];

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

export const MedicalScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>(mockVisits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    const storage = MedicalStorage.getInstance();
    await storage.load();
    setVaccinations(storage.getVaccinations());
    setVetVisits(storage.getVetVisits());
    setLoading(false);
  };

  const handleDeleteVaccination = async (id: string) => {
    const storage = MedicalStorage.getInstance();
    await storage.deleteVaccination(id);
    setVaccinations(storage.getVaccinations());
  };

  const handleDeleteVetVisit = async (id: string) => {
    const storage = MedicalStorage.getInstance();
    await storage.deleteVetVisit(id);
    setVetVisits(storage.getVetVisits());
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyImageContainer}>
        <Ionicons name="medkit-outline" size={100} color={colors.text.secondary} />
      </View>
      <Text style={styles.emptyTitle}>Нет медицинских записей</Text>
      <Text style={styles.emptyText}>
        Добавьте информацию о вакцинациях и визитах к ветеринару
      </Text>
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.screen}
            style={styles.quickAction}
            onPress={() => navigation.navigate(action.screen)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={24} color={colors.text.light} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderUpcomingEvents = () => {
    const upcomingVaccinations = vaccinations
      .filter(v => isAfter(new Date(v.nextDate), new Date()))
      .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
      .slice(0, 2);

    if (upcomingVaccinations.length === 0) return null;

    return (
      <View style={styles.upcomingContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ближайшие прививки</Text>
        </View>
        {upcomingVaccinations.map(vaccination => (
          <View key={vaccination.id} style={styles.upcomingEvent}>
            <View style={styles.upcomingEventIcon}>
              <Ionicons name="medical" size={24} color={colors.primary} />
            </View>
            <View style={styles.upcomingEventContent}>
              <Text style={styles.upcomingEventTitle}>{vaccination.name}</Text>
              <Text style={styles.upcomingEventDate}>
                {format(new Date(vaccination.nextDate), 'd MMMM yyyy', { locale: ru })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.screen}
          style={styles.quickAction}
          onPress={() => navigation.navigate(action.screen)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
            <Ionicons name={action.icon} size={24} color={colors.text.light} />
          </View>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStats = () => {
    const overdueVaccinations = vaccinations.filter(v => 
      isBefore(new Date(v.nextDate), new Date())
    ).length;

    const totalVisits = vetVisits.length;
    const upcomingVaccinations = vaccinations.filter(v => 
      isAfter(new Date(v.nextDate), new Date())
    ).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overdueVaccinations}</Text>
            <Text style={styles.statLabel}>Просроченных{'\n'}прививок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{upcomingVaccinations}</Text>
            <Text style={styles.statLabel}>Предстоящих{'\n'}прививок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalVisits}</Text>
            <Text style={styles.statLabel}>Всего{'\n'}визитов</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  const hasNoData = vaccinations.length === 0 && vetVisits.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, `${colors.primary}80`]}
          style={styles.header}
        >
          <Text style={styles.title}>Здоровье</Text>
          <Text style={styles.subtitle}>Медицинская карта питомца</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.primary}15`, `${colors.primary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Вакцинация</Text>
              </View>
              <Button
                variant="tertiary"
                size="small"
                onPress={() => navigation.navigate('AddVaccination')}
                icon={<Ionicons name="add" size={20} color={colors.primary} />}
              >
                Добавить
              </Button>
            </View>

            {vaccinations.map(vaccination => (
              <Card key={vaccination.id} variant="elevated" style={styles.vaccinationCard}>
                <LinearGradient
                  colors={[`${colors.primary}05`, `${colors.primary}10`]}
                  style={styles.vaccinationContent}
                >
                  <View style={[styles.vaccinationIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Ionicons name="medical" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.vaccinationInfo}>
                    <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                    <View style={styles.vaccinationMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.metaText}>
                          {format(vaccination.date, 'd MMMM yyyy', { locale: ru })}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="repeat-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.metaText}>{vaccination.type}</Text>
                      </View>
                    </View>
                    <View style={styles.nextDateContainer}>
                      <Text style={styles.nextDateLabel}>Следующая прививка:</Text>
                      <Text style={styles.nextDate}>
                        {format(vaccination.nextDate, 'd MMMM yyyy', { locale: ru })}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.secondary}15`, `${colors.secondary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="medkit" size={20} color={colors.secondary} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Посещения врача</Text>
              </View>
              <Button
                variant="tertiary"
                size="small"
                onPress={() => navigation.navigate('AddVetVisit')}
                icon={<Ionicons name="add" size={20} color={colors.secondary} />}
              >
                Записаться
              </Button>
            </View>

            {vetVisits.map(visit => (
              <Card key={visit.id} variant="elevated" style={styles.visitCard}>
                <LinearGradient
                  colors={[
                    visit.status === 'completed' ? `${colors.success}05` : `${colors.secondary}05`,
                    visit.status === 'completed' ? `${colors.success}10` : `${colors.secondary}10`
                  ]}
                  style={styles.visitContent}
                >
                  <View style={[
                    styles.visitIcon,
                    { backgroundColor: visit.status === 'completed' ? `${colors.success}15` : `${colors.secondary}15` }
                  ]}>
                    <Ionicons
                      name={visit.status === 'completed' ? 'checkmark-circle' : 'time'}
                      size={24}
                      color={visit.status === 'completed' ? colors.success : colors.secondary}
                    />
                  </View>
                  <View style={styles.visitInfo}>
                    <Text style={styles.visitReason}>{visit.reason}</Text>
                    <View style={styles.visitMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.metaText}>
                          {format(visit.date, 'd MMMM yyyy', { locale: ru })}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.metaText}>{visit.doctor}</Text>
                      </View>
                    </View>
                  </View>
                  <Button
                    variant="tertiary"
                    size="small"
                    onPress={() => navigation.navigate('AddVetVisit')}
                    icon={<Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />}
                  />
                </LinearGradient>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <Button
        variant="primary"
        size="large"
        style={styles.addButton}
        onPress={() => navigation.navigate('AddVetVisit')}
        icon={<Ionicons name="add" size={24} color={colors.text.light} />}
      >
        Добавить запись
      </Button>
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
  header: {
    padding: spacing.lg,
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
  title: {
    ...typography.h1,
    color: colors.text.light,
    marginBottom: spacing.xs,
  } as TextStyle,
  subtitle: {
    ...typography.body,
    color: colors.text.light,
    opacity: 0.9,
  } as TextStyle,
  section: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  vaccinationCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  vaccinationContent: {
    flexDirection: 'row',
    padding: spacing.md,
  } as ViewStyle,
  vaccinationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  vaccinationInfo: {
    flex: 1,
    marginLeft: spacing.md,
  } as ViewStyle,
  vaccinationName: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  vaccinationMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.md,
  } as ViewStyle,
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  metaText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  } as TextStyle,
  nextDateContainer: {
    marginTop: spacing.sm,
    padding: spacing.xs,
    backgroundColor: `${colors.primary}10`,
    borderRadius: borderRadius.small,
  } as ViewStyle,
  nextDateLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
  nextDate: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  } as TextStyle,
  visitCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  visitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  } as ViewStyle,
  visitIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  visitInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  } as ViewStyle,
  visitReason: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  visitMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.md,
  } as ViewStyle,
  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    ...shadows.medium,
  } as ViewStyle,
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyImageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    width: 100,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  upcomingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  upcomingEventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  upcomingEventContent: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  upcomingEventDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 