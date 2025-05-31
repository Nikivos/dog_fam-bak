import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { MedicalStackParamList } from '../types/navigation';
import { colors, spacing } from '../theme/theme';
import { MedicalStorage, VetVisit } from '../data/medicalStorage';
import { format, parse, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type VetVisitDetailsScreenRouteProp = RouteProp<MedicalStackParamList, 'VetVisitDetails'>;

export const VetVisitDetailsScreen = () => {
  const route = useRoute<VetVisitDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const [visit, setVisit] = useState<VetVisit | null>(null);

  useEffect(() => {
    const storage = MedicalStorage.getInstance();
    const found = storage.getVetVisits().find(v => v.id === id);
    if (found) {
      setVisit(found);
    }
  }, [id]);

  const handleEdit = () => {
    navigation.navigate('EditVetVisit', { id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление визита',
      'Вы уверены, что хотите удалить этот визит?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              const storage = MedicalStorage.getInstance();
              await storage.deleteVetVisit(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить визит');
            }
          },
        },
      ]
    );
  };

  if (!visit) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Визит не найден</Text>
      </View>
    );
  }

  const visitDate = parse(visit.date, 'yyyy-MM-dd', new Date());
  const isTodays = isToday(visitDate);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isTodays ? ['#ff9966', '#ff5e62'] : ['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{visit.reason}</Text>
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

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={colors.text.light} />
          <Text style={styles.infoText}>
            Дата: {format(visitDate, 'd MMMM yyyy', { locale: ru })}
          </Text>
        </View>

        {visit.doctor && (
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={colors.text.light} />
            <Text style={styles.infoText}>
              Врач: {visit.doctor}
            </Text>
          </View>
        )}

        {visit.diagnosis && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fitness" size={20} color={colors.text.light} />
              <Text style={styles.sectionTitle}>Диагноз</Text>
            </View>
            <Text style={styles.sectionText}>{visit.diagnosis}</Text>
          </View>
        )}

        {visit.prescriptions && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={20} color={colors.text.light} />
              <Text style={styles.sectionTitle}>Назначения</Text>
            </View>
            <Text style={styles.sectionText}>{visit.prescriptions}</Text>
          </View>
        )}

        {visit.symptoms && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={20} color={colors.text.light} />
              <Text style={styles.sectionTitle}>Симптомы</Text>
            </View>
            <Text style={styles.sectionText}>{visit.symptoms}</Text>
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
    flexWrap: 'wrap',
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
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.light,
    marginLeft: spacing.sm,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text.light,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: 12,
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