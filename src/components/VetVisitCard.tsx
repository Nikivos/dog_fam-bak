import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextStyle } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing, shadows, borderRadius, typography } from '../theme/theme';
import { VetVisit } from '../types/medical';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visit: VetVisit;
  onDelete?: (id: string) => void;
};

export const VetVisitCard = ({ visit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = visit.symptoms?.trim().length > 0 || 
                    visit.diagnosis?.trim().length > 0 || 
                    visit.prescriptions?.trim().length > 0;

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

  return (
    <TouchableOpacity 
      style={[styles.container, shadows.medium]}
      onPress={toggleExpand}
      activeOpacity={hasDetails ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>
          <Text style={styles.date}>
            {format(new Date(visit.date), 'd MMMM yyyy', { locale: ru })}
          </Text>
        </View>
        {hasDetails && (
          <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={colors.text.secondary} 
            />
          </Animated.View>
        )}
      </View>

      <Text style={styles.reason}>{visit.reason}</Text>

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
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: `${colors.primary}10`,
    padding: spacing.xs,
    borderRadius: borderRadius.small,
  },
  date: {
    ...typography.caption,
    marginLeft: spacing.xs,
  } as TextStyle,
  reason: {
    ...typography.h2,
    marginBottom: spacing.sm,
  } as TextStyle,
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