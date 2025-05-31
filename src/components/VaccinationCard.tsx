import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';
import { Vaccination } from '../types/medical';

interface Props {
  vaccination: Vaccination;
  onDelete?: (id: string) => void;
}

export const VaccinationCard: React.FC<Props> = ({ vaccination, onDelete }) => {
  const nextDate = new Date(vaccination.nextDate);
  const isOverdue = nextDate < new Date();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{vaccination.name}</Text>
        <View style={styles.dates}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Дата вакцинации</Text>
            <Text style={styles.date}>
              {format(new Date(vaccination.date), 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, isOverdue && styles.overdue]}>
              Следующая вакцинация
            </Text>
            <Text style={[styles.date, isOverdue && styles.overdue]}>
              {format(nextDate, 'd MMMM yyyy', { locale: ru })}
            </Text>
          </View>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(vaccination.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 14,
    color: colors.text.primary,
  },
  overdue: {
    color: colors.error,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
}); 