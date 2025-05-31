import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';
import { Walk } from '../types/walk';
import { WalkCard } from '../components/WalkCard';
import { WalkStorage } from '../data/walkStorage';

export const WalkStatsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [walks, setWalks] = useState<Walk[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredWalks, setFilteredWalks] = useState<Walk[]>([]);

  useEffect(() => {
    loadWalks();
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedDate) {
      const dayWalks = walks.filter(walk => 
        isSameDay(new Date(walk.startTime), selectedDate)
      );
      setFilteredWalks(dayWalks);
    } else {
      setFilteredWalks(walks);
    }
  }, [selectedDate, walks]);

  const loadWalks = async () => {
    const storage = WalkStorage.getInstance();
    await storage.load();

    const now = new Date();
    let periodWalks: Walk[];

    switch (selectedPeriod) {
      case 'week':
        const weekStart = startOfWeek(now, { locale: ru });
        const weekEnd = endOfWeek(now, { locale: ru });
        periodWalks = await storage.getWalksByPeriod(weekStart, weekEnd);
        break;
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        periodWalks = await storage.getWalksByPeriod(monthStart, monthEnd);
        break;
      default:
        periodWalks = await storage.getWalks();
    }

    setWalks(periodWalks);
    setSelectedDate(null); // Сбрасываем выбранный день при смене периода
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(selectedDate && isSameDay(selectedDate, date) ? null : date);
  };

  const renderHeader = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: ru });
    const weekEnd = endOfWeek(now, { locale: ru });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const displayedWalks = filteredWalks;
    const totalDistance = displayedWalks.reduce((sum, walk) => sum + walk.distance, 0);
    const totalDuration = displayedWalks.reduce((sum, walk) => sum + walk.duration, 0);

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {selectedDate 
            ? `Прогулки за ${format(selectedDate, 'd MMMM', { locale: ru })}` 
            : 'Статистика прогулок'}
        </Text>
        
        <View style={styles.periodSelector}>
          <View style={styles.periodButtons}>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'week' && styles.periodButtonTextActive
              ]}>
                Неделя
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'month' && styles.periodButtonTextActive
              ]}>
                Месяц
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'all' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('all')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'all' && styles.periodButtonTextActive
              ]}>
                Все время
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Ionicons name="footsteps" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>
              {totalDistance < 1000 
                ? `${Math.round(totalDistance)} м` 
                : `${(totalDistance / 1000).toFixed(1)} км`}
            </Text>
            <Text style={styles.summaryLabel}>Пройдено</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>
              {Math.floor(totalDuration / 3600)}ч {Math.floor((totalDuration % 3600) / 60)}м
            </Text>
            <Text style={styles.summaryLabel}>Время</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="paw" size={24} color={colors.primary} />
            <Text style={styles.summaryValue}>{displayedWalks.length}</Text>
            <Text style={styles.summaryLabel}>Прогулок</Text>
          </View>
        </View>

        {selectedPeriod === 'week' && (
          <View style={styles.weekView}>
            {days.map((day) => {
              const dayWalks = walks.filter(w => 
                isSameDay(new Date(w.startTime), day)
              );
              const hasWalk = dayWalks.length > 0;
              const isSelected = selectedDate && isSameDay(selectedDate, day);
              
              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  style={styles.dayColumn}
                  onPress={() => handleDayPress(day)}
                >
                  <Text style={[
                    styles.dayName,
                    isSelected && styles.selectedDayText
                  ]}>
                    {format(day, 'EEEEEE', { locale: ru })}
                  </Text>
                  <View style={[
                    styles.dayIndicator,
                    hasWalk && styles.dayIndicatorActive,
                    isSelected && styles.dayIndicatorSelected
                  ]} />
                  <Text style={[
                    styles.dayDate,
                    isSelected && styles.selectedDayText
                  ]}>
                    {format(day, 'd')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyText}>
        {selectedDate 
          ? `Нет прогулок за ${format(selectedDate, 'd MMMM', { locale: ru })}` 
          : 'Нет прогулок за выбранный период'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredWalks}
        renderItem={({ item }) => <WalkCard walk={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          filteredWalks.length === 0 && styles.emptyListContent
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  periodSelector: {
    marginBottom: spacing.md,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  periodButtonTextActive: {
    color: colors.text.light,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  dayIndicatorActive: {
    backgroundColor: colors.primary,
  },
  dayDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  selectedDayText: {
    color: colors.primary,
    fontWeight: '600',
  },
  dayIndicatorSelected: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.2 }],
  },
}); 