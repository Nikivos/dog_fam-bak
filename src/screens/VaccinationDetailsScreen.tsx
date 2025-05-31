import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { MedicalStackParamList } from '../types/navigation';
import { colors, spacing } from '../theme/theme';
import { MedicalStorage, Vaccination } from '../data/medicalStorage';
import { format, parse, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type VaccinationDetailsScreenRouteProp = RouteProp<MedicalStackParamList, 'VaccinationDetails'>;

export const VaccinationDetailsScreen = () => {
  const route = useRoute<VaccinationDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const [vaccination, setVaccination] = useState<Vaccination | null>(null);

  useEffect(() => {
    const storage = MedicalStorage.getInstance();
    const found = storage.getVaccinations().find(v => v.id === id);
    if (found) {
      setVaccination(found);
    }
  }, [id]);

  const handleEdit = () => {
    navigation.navigate('EditVaccination', { id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление вакцинации',
      'Вы уверены, что хотите удалить эту вакцинацию?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              const storage = MedicalStorage.getInstance();
              await storage.deleteVaccination(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить вакцинацию');
            }
          },
        },
      ]
    );
  };

  if (!vaccination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Вакцинация не найдена</Text>
      </View>
    );
  }

  const nextDate = parse(vaccination.nextDate, 'yyyy-MM-dd', new Date());
  const daysUntilNext = differenceInDays(nextDate, new Date());
  const isUrgent = daysUntilNext <= 7 && daysUntilNext > 0;
  const isOverdue = daysUntilNext < 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isUrgent ? ['#ff9966', '#ff5e62'] : isOverdue ? ['#ED4337', '#C32F27'] : ['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{vaccination.name}</Text>
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

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={colors.text.light} />
          <Text style={styles.infoText}>
            Дата: {format(parse(vaccination.date, 'yyyy-MM-dd', new Date()), 'd MMMM yyyy', { locale: ru })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color={colors.text.light} />
          <Text style={styles.infoText}>
            Следующая: {format(nextDate, 'd MMMM yyyy', { locale: ru })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="repeat" size={20} color={colors.text.light} />
          <Text style={styles.infoText}>
            Тип: {vaccination.type}
          </Text>
        </View>

        {(isUrgent || isOverdue) && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={24} color={colors.text.light} />
            <Text style={styles.warningText}>
              {isUrgent
                ? `До следующей вакцинации осталось ${daysUntilNext} ${getDaysWord(daysUntilNext)}`
                : `Просрочено на ${Math.abs(daysUntilNext)} ${getDaysWord(Math.abs(daysUntilNext))}`}
            </Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Ionicons name="create" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Редактировать</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color={colors.error} />
          <Text style={[styles.actionText, styles.deleteText]}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getDaysWord = (days: number) => {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'дней';
  }

  if (lastDigit === 1) {
    return 'день';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }

  return 'дней';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.light,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.text.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  overdueBadge: {
    backgroundColor: colors.error,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 16,
    color: colors.text.light,
    marginLeft: spacing.sm,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  warningText: {
    fontSize: 16,
    color: colors.text.light,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.error + '10',
  },
  actionText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  deleteText: {
    color: colors.error,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 