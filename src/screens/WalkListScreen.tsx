import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalkStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<WalkStackParamList>;

type Walk = {
  id: string;
  date: string;
  duration: number;
  distance: number;
  petId: string;
};

const mockWalks: Walk[] = [
  {
    id: '1',
    date: '2024-03-20T10:00:00Z',
    duration: 30,
    distance: 2.5,
    petId: '1',
  },
  {
    id: '2',
    date: '2024-03-19T15:30:00Z',
    duration: 45,
    distance: 3.8,
    petId: '1',
  },
];

export const WalkListScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ч ${remainingMinutes} мин`;
  };

  const renderWalkItem = ({ item }: { item: Walk }) => (
    <TouchableOpacity
      style={styles.walkItem}
      onPress={() => navigation.navigate('WalkDetails', { walkId: item.id })}
    >
      <View style={styles.walkInfo}>
        <Text style={styles.walkDate}>{formatDate(item.date)}</Text>
        <View style={styles.walkStats}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={colors.text.secondary} />
            <Text style={styles.statText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="map" size={16} color={colors.text.secondary} />
            <Text style={styles.statText}>{item.distance.toFixed(1)} км</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockWalks}
        renderItem={renderWalkItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewWalk')}
      >
        <Ionicons name="add" size={24} color={colors.text.primary} />
        <Text style={styles.addButtonText}>Новая прогулка</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  walkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  walkInfo: {
    flex: 1,
  },
  walkDate: {
    fontSize: typography.body1.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  walkStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.body2.fontSize,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  addButtonText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
}); 