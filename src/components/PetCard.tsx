import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from './ui/Text';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const PetCard = () => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        ...shadows.medium,
      }
    ]}>
      <View style={[styles.header, { gap: spacing.md }]}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }}
          style={[styles.image, { borderRadius: borderRadius.lg }]}
        />
        <View style={[styles.info, { gap: spacing.sm }]}>
          <Text variant="h2">Барсик</Text>
          <Text variant="body2" style={{ color: colors.text.secondary }}>
            Шотландская вислоухая • 2 года
          </Text>
          <View style={[styles.stats, { gap: spacing.md }]}>
            <View style={styles.stat}>
              <Ionicons name="walk" size={20} color={colors.primary} />
              <Text variant="body2">2/3</Text>
              <Text variant="caption" style={{ color: colors.text.secondary }}>прогулки</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="restaurant" size={20} color={colors.primary} />
              <Text variant="body2">1/2</Text>
              <Text variant="caption" style={{ color: colors.text.secondary }}>кормления</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="medical" size={20} color={colors.primary} />
          <Text variant="body2">Здоровье</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text variant="body2">Календарь</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="stats-chart" size={20} color={colors.primary} />
          <Text variant="body2">Статистика</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
}); 