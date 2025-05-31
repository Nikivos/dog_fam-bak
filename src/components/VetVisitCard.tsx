import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextStyle } from 'react-native';
import { format, parse, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing, shadows, borderRadius, typography } from '../theme/theme';
import { VetVisit } from '../types/medical';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  visit: VetVisit;
  onDelete?: (id: string) => void;
};

export const VetVisitCard = ({ visit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(
    (visit.symptoms && visit.symptoms.trim().length > 0) ||
    (visit.diagnosis && visit.diagnosis.trim().length > 0) ||
    (visit.prescriptions && visit.prescriptions.trim().length > 0)
  );

  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    if (!hasDetails) return;
    
    setExpanded(!expanded);
    Animated.spring(animation, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const visitDate = parse(visit.date, 'yyyy-MM-dd', new Date());
  const isTodays = isToday(visitDate);

  return (
    <TouchableOpacity 
      style={[styles.container, shadows.medium]}
      onPress={toggleExpand}
      activeOpacity={hasDetails ? 0.7 : 1}
    >
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
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar" size={20} color={colors.text.light} />
          <Text style={styles.text}>
            {format(visitDate, 'd MMMM yyyy', { locale: ru })}
          </Text>
        </View>

        {visit.doctor && (
          <View style={styles.row}>
            <Ionicons name="person" size={20} color={colors.text.light} />
            <Text style={styles.text}>{visit.doctor}</Text>
          </View>
        )}

        {hasDetails && (
          <View style={styles.detailsContainer}>
            <Ionicons name="document-text" size={20} color={colors.text.light} />
            <Text style={styles.detailsText}>Есть заметки</Text>
          </View>
        )}
      </LinearGradient>

      {expanded && hasDetails && (
        <Animated.View 
          style={[
            styles.details,
            {
              opacity: animation,
              transform: [{
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                })
              }]
            }
          ]}
        >
          {visit.symptoms && (
            <View style={styles.detailSection}>
              <View style={styles.detailHeader}>
                <Ionicons name="medical" size={16} color={colors.text.secondary} />
                <Text style={styles.detailLabel}>Симптомы</Text>
              </View>
              <Text style={styles.detailText}>{visit.symptoms}</Text>
            </View>
          )}
          {visit.diagnosis && (
            <View style={styles.detailSection}>
              <View style={styles.detailHeader}>
                <Ionicons name="fitness" size={16} color={colors.text.secondary} />
                <Text style={styles.detailLabel}>Диагноз</Text>
              </View>
              <Text style={styles.detailText}>{visit.diagnosis}</Text>
            </View>
          )}
          {visit.prescriptions && (
            <View style={styles.detailSection}>
              <View style={styles.detailHeader}>
                <Ionicons name="document-text" size={16} color={colors.text.secondary} />
                <Text style={styles.detailLabel}>Назначения</Text>
              </View>
              <Text style={styles.detailText}>{visit.prescriptions}</Text>
            </View>
          )}
        </Animated.View>
      )}

      {onDelete && (
        <TouchableOpacity 
          onPress={() => onDelete(visit.id)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
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
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: 16,
    color: colors.text.light,
    marginLeft: spacing.sm,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.sm,
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 14,
    color: colors.text.light,
    marginLeft: spacing.sm,
  },
  details: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailSection: {
    marginBottom: spacing.md,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...typography.caption,
    marginLeft: spacing.xs,
  } as TextStyle,
  detailText: {
    ...typography.body,
    color: colors.text.primary,
  } as TextStyle,
  deleteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
  },
}); 