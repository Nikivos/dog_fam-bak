import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PawButton } from '../components/PawButton';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme/theme';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuickAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: keyof RootStackParamList;
  color: string;
};

const quickActions: QuickAction[] = [
  { icon: 'map-outline', label: 'Прогулка', screen: 'Walk', color: colors.primary },
  { icon: 'restaurant-outline', label: 'Покормить', screen: 'Feeding', color: colors.secondary },
  { icon: 'fitness-outline', label: 'Тренировка', screen: 'Training', color: colors.primary },
  { icon: 'medical-outline', label: 'Здоровье', screen: 'Medical', color: colors.error }
];

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.welcomeHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[colors.primary, `${colors.primary}80`]}
          style={styles.welcomeGradient}
        >
          <Text style={styles.welcomeText}>Привет, Хозяин! 👋</Text>
          <Text style={styles.welcomeSubtext}>Макс ждёт новых приключений</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/120' }}
              style={styles.petAvatar}
            />
            <View style={styles.avatarBadge}>
              <Ionicons name="paw" size={16} color={colors.text.light} />
            </View>
          </TouchableOpacity>
        </View>

        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Сегодня</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="sunny" size={16} color={colors.primary} />
              <Text style={styles.statusBadgeText}>Отличное настроение</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="walk" size={24} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>2.5 км</Text>
              <Text style={styles.statLabel}>Прогулка</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.secondary}15` }]}>
                <Ionicons name="restaurant" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.statValue}>2/3</Text>
              <Text style={styles.statLabel}>Кормления</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="fitness" size={24} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>15 мин</Text>
              <Text style={styles.statLabel}>Тренировка</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ближайшие события</Text>
          <Card variant="elevated" style={styles.eventCard}>
            <LinearGradient
              colors={[`${colors.primary}10`, `${colors.primary}05`]}
              style={styles.eventGradient}
            >
              <View style={styles.eventItem}>
                <View style={[styles.eventIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name="medical" size={24} color={colors.primary} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>Прививка от бешенства</Text>
                  <Text style={styles.eventTime}>Завтра, 10:00</Text>
                </View>
                <Button
                  variant="tertiary"
                  size="small"
                  onPress={() => navigation.navigate('Medical')}
                  icon={<Ionicons name="chevron-forward" size={20} color={colors.primary} />}
                />
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.screen}
                style={styles.actionItem}
                onPress={() => navigation.navigate(action.screen)}
              >
                <LinearGradient
                  colors={[action.color, `${action.color}80`]}
                  style={styles.actionGradient}
                >
                  <Ionicons name={action.icon} size={24} color={colors.text.light} />
                </LinearGradient>
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <PawButton
        style={styles.fabButton}
        onPress={() => navigation.navigate('Profile')}
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
  } as ViewStyle,
  welcomeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  } as ViewStyle,
  welcomeGradient: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  } as ViewStyle,
  welcomeText: {
    ...typography.h1,
    color: colors.text.light,
    marginBottom: spacing.xs,
  } as TextStyle,
  welcomeSubtext: {
    ...typography.body,
    color: colors.text.light,
    opacity: 0.9,
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  content: {
    padding: spacing.md,
  } as ViewStyle,
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  } as ViewStyle,
  avatarContainer: {
    position: 'relative',
    ...shadows.medium,
  } as ViewStyle,
  petAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.card,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: spacing.xs,
    borderRadius: borderRadius.circle,
    ...shadows.small,
  } as ViewStyle,
  statusCard: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  } as ViewStyle,
  statusTitle: {
    ...typography.h2,
  } as TextStyle,
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.large,
  } as ViewStyle,
  statusBadgeText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
  } as TextStyle,
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  } as ViewStyle,
  statItem: {
    alignItems: 'center',
  } as ViewStyle,
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as ViewStyle,
  statValue: {
    ...typography.h2,
    color: colors.text.primary,
  } as TextStyle,
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
  section: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  } as TextStyle,
  eventCard: {
    overflow: 'hidden',
    padding: 0,
  } as ViewStyle,
  eventGradient: {
    padding: spacing.md,
  } as ViewStyle,
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  eventInfo: {
    flex: 1,
    marginLeft: spacing.md,
  } as ViewStyle,
  eventTitle: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  eventTime: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -spacing.xs,
  } as ViewStyle,
  actionItem: {
    width: '50%',
    padding: spacing.xs,
  } as ViewStyle,
  actionGradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    ...shadows.small,
  } as ViewStyle,
  actionText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text.primary,
  } as TextStyle,
  fabButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    ...shadows.medium,
  } as ViewStyle,
}); 