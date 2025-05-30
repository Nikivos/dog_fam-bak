import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Vaccination,
  Deworming,
  VetVisit,
  Medication,
  HealthCondition,
  VaccinationStorage,
  DewormingStorage,
  VetVisitStorage,
  MedicationStorage,
  HealthConditionStorage,
} from '../data/medicalStorage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { format, parseISO, isAfter } from 'date-fns';
import { ru } from 'date-fns/locale';

type RootStackParamList = {
  Medical: { petId: string };
  AddVaccination: { petId: string };
  AddDeworming: { petId: string };
  AddVetVisit: { petId: string };
  AddMedication: { petId: string };
  AddHealthCondition: { petId: string };
};

type MedicalScreenRouteProp = RouteProp<RootStackParamList, 'Medical'>;
type MedicalScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const MedicalScreen = () => {
  const navigation = useNavigation<MedicalScreenNavigationProp>();
  const route = useRoute<MedicalScreenRouteProp>();
  const { petId } = route.params;

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [dewormings, setDewormings] = useState<Deworming[]>([]);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMedicalData = async () => {
    setLoading(true);
    try {
      const vaccinationStorage = VaccinationStorage.getInstance(petId);
      const dewormingStorage = DewormingStorage.getInstance(petId);
      const vetVisitStorage = VetVisitStorage.getInstance(petId);
      const medicationStorage = MedicationStorage.getInstance(petId);
      const healthConditionStorage = HealthConditionStorage.getInstance(petId);

      const [
        vaccinationsData,
        dewormingsData,
        vetVisitsData,
        medicationsData,
        healthConditionsData,
      ] = await Promise.all([
        vaccinationStorage.getAll(),
        dewormingStorage.getAll(),
        vetVisitStorage.getAll(),
        medicationStorage.getAll(),
        healthConditionStorage.getAll(),
      ]);

      setVaccinations(vaccinationsData.filter(v => v.petId === petId));
      setDewormings(dewormingsData.filter(d => d.petId === petId));
      setVetVisits(vetVisitsData.filter(v => v.petId === petId));
      setMedications(medicationsData.filter(m => m.petId === petId));
      setHealthConditions(healthConditionsData.filter(h => h.petId === petId));
    } catch (error) {
      console.error('Error loading medical data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalData();
  }, [petId]);

  const renderUpcomingEvents = () => {
    const events = [
      ...vaccinations.map(v => ({
        type: 'vaccination' as const,
        date: v.nextDate,
        name: v.name,
        icon: 'medical',
        color: colors.primary,
      })),
      ...dewormings.map(d => ({
        type: 'deworming' as const,
        date: d.nextDate,
        name: 'Дегельминтизация',
        icon: 'shield',
        color: colors.success,
      })),
      ...vetVisits.map(v => ({
        type: 'vetVisit' as const,
        date: v.nextVisit,
        name: v.reason,
        icon: 'medkit',
        color: colors.warning,
      })),
    ].filter(event => event.date && isAfter(parseISO(event.date), new Date()))
      .sort((a, b) => parseISO(a.date!).getTime() - parseISO(b.date!).getTime());

    if (events.length === 0) {
      return (
        <Card variant="subtle" style={styles.emptyCard}>
          <Text style={styles.emptyText}>Нет предстоящих событий</Text>
        </Card>
      );
    }

    return events.map((event, index) => (
      <Card key={index} variant="elevated" style={styles.eventCard}>
        <View style={styles.eventContent}>
          <View style={[styles.eventIcon, { backgroundColor: event.color }]}>
            <Ionicons name={event.icon as any} size={24} color={colors.text.light} />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventDate}>
              {format(parseISO(event.date!), 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>
        </View>
      </Card>
    ));
  };

  const renderHealthSummary = () => {
    const activeConditions = healthConditions.filter(c => c.status === 'active');
    const activeMedications = medications.filter(m => !m.endDate || isAfter(parseISO(m.endDate), new Date()));

    return (
      <View style={styles.summaryContainer}>
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Ionicons name="pulse" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>{activeConditions.length}</Text>
            <Text style={styles.summaryLabel}>Активных{'\n'}заболеваний</Text>
          </View>
        </Card>
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Ionicons name="medical" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>{vaccinations.length}</Text>
            <Text style={styles.summaryLabel}>Сделано{'\n'}прививок</Text>
          </View>
        </Card>
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Ionicons name="flask" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>{activeMedications.length}</Text>
            <Text style={styles.summaryLabel}>Текущих{'\n'}медикаментов</Text>
          </View>
        </Card>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddVaccination', { petId })}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name="medical" size={24} color={colors.text.light} />
        </View>
        <Text style={styles.actionText}>Прививка</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddVetVisit', { petId })}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
          <Ionicons name="medkit" size={24} color={colors.text.light} />
        </View>
        <Text style={styles.actionText}>Визит</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddMedication', { petId })}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
          <Ionicons name="flask" size={24} color={colors.text.light} />
        </View>
        <Text style={styles.actionText}>Лекарство</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddHealthCondition', { petId })}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.error }]}>
          <Ionicons name="pulse" size={24} color={colors.text.light} />
        </View>
        <Text style={styles.actionText}>Диагноз</Text>
      </TouchableOpacity>
    </View>
  );

  if (!petId) {
    return (
      <SafeAreaView style={styles.container}>
        <Card variant="elevated" style={styles.errorCard}>
          <Ionicons name="alert-circle" size={32} color={colors.error} />
          <Text style={styles.error}>Ошибка: не указан ID питомца</Text>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Здоровье</Text>
          <Text style={styles.subtitle}>Медицинские записи питомца</Text>
        </View>

        {renderHealthSummary()}
        {renderQuickActions()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Предстоящие события</Text>
            </View>
          </View>
          {renderUpcomingEvents()}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="pulse" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Активные заболевания</Text>
            </View>
            <Button
              variant="tertiary"
              size="small"
              onPress={() => navigation.navigate('AddHealthCondition', { petId })}
              icon={<Ionicons name="add" size={20} color={colors.primary} />}
            >
              Добавить
            </Button>
          </View>
          {healthConditions.filter(c => c.status === 'active').map((condition) => (
            <Card key={condition.id} variant="elevated" style={styles.itemCard}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{condition.name}</Text>
                <Text style={styles.itemDate}>
                  Диагностировано: {format(parseISO(condition.diagnosedDate), 'd MMMM yyyy', { locale: ru })}
                </Text>
                {condition.notes && (
                  <Text style={styles.itemNotes}>{condition.notes}</Text>
                )}
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="flask" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Текущие медикаменты</Text>
            </View>
            <Button
              variant="tertiary"
              size="small"
              onPress={() => navigation.navigate('AddMedication', { petId })}
              icon={<Ionicons name="add" size={20} color={colors.primary} />}
            >
              Добавить
            </Button>
          </View>
          {medications.filter(m => !m.endDate || isAfter(parseISO(m.endDate), new Date())).map((medication) => (
            <Card key={medication.id} variant="elevated" style={styles.itemCard}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{medication.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {medication.dosage} • {medication.frequency}
                </Text>
                <Text style={styles.itemDate}>
                  Начало приема: {format(parseISO(medication.startDate), 'd MMMM yyyy', { locale: ru })}
                </Text>
                {medication.notes && (
                  <Text style={styles.itemNotes}>{medication.notes}</Text>
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    minWidth: 100,
  },
  summaryContent: {
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  summaryValue: {
    ...typography.h2,
    color: colors.text.primary,
    fontSize: 20,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    width: '22%',
    minWidth: 72,
    alignItems: 'center',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    width: '100%',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontSize: 18,
    flexShrink: 1,
  },
  eventCard: {
    marginBottom: spacing.sm,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  eventDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyCard: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  errorCard: {
    margin: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  error: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  itemContent: {
    padding: spacing.md,
  },
  itemTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  itemSubtitle: {
    ...typography.body2,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  itemDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  itemNotes: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
}); 