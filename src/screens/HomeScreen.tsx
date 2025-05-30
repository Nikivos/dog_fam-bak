import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PawButton } from '../components/PawButton';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

type RootStackParamList = {
  Profile: undefined;
  Walk: undefined;
  Feeding: undefined;
  Training: undefined;
  Medical: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Приветствие и аватар питомца */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет, Хозяин! 👋</Text>
            <Text style={styles.subtitle}>Макс ждёт новых приключений</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60' }}
              style={styles.petAvatar}
            />
          </TouchableOpacity>
        </View>

        {/* Карточка состояния */}
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Сегодня</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Отличное настроение</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="walk" size={24} color={colors.primary} />
              <Text style={styles.statValue}>2.5 км</Text>
              <Text style={styles.statLabel}>Прогулка</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={24} color={colors.primary} />
              <Text style={styles.statValue}>2/3</Text>
              <Text style={styles.statLabel}>Кормления</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="fitness" size={24} color={colors.primary} />
              <Text style={styles.statValue}>15 мин</Text>
              <Text style={styles.statLabel}>Тренировка</Text>
            </View>
          </View>
        </Card>

        {/* Ближайшие события */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ближайшие события</Text>
          <Card style={styles.eventCard}>
            <View style={styles.eventItem}>
              <View style={styles.eventIcon}>
                <Ionicons name="medical" size={24} color={colors.error} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Прививка от бешенства</Text>
                <Text style={styles.eventTime}>Завтра, 10:00</Text>
              </View>
              <Button
                variant="tertiary"
                size="small"
                onPress={() => {}}
                style={styles.eventButton}
              >
                Детали
              </Button>
            </View>
          </Card>
        </View>

        {/* Быстрые действия */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Walk')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="map" size={24} color={colors.text.light} />
              </View>
              <Text style={styles.actionText}>Прогулка</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Feeding')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                <Ionicons name="restaurant" size={24} color={colors.text.primary} />
              </View>
              <Text style={styles.actionText}>Покормить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Training')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="fitness" size={24} color={colors.text.light} />
              </View>
              <Text style={styles.actionText}>Тренировка</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Medical')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.error }]}>
                <Ionicons name="medical" size={24} color={colors.text.light} />
              </View>
              <Text style={styles.actionText}>Здоровье</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Кнопка быстрого действия */}
      <PawButton
        style={styles.fabButton}
        onPress={() => {}}
        size={64}
        color={colors.primary}
      />
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
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  statusCard: {
    marginBottom: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.text.light,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  eventCard: {
    marginBottom: spacing.sm,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.small,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventTime: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  eventButton: {
    marginLeft: spacing.sm,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -spacing.xs,
  },
  actionItem: {
    width: '50%',
    padding: spacing.xs,
  },
  actionIcon: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.body2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
}); 