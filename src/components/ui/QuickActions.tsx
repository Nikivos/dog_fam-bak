import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeContext';

export interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickActionButtonProps[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const { colors, shadows } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, shadows.medium]}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.action,
            index < actions.length - 1 && styles.actionBorder,
            { borderColor: colors.border }
          ]}
          onPress={action.onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${action.color || colors.primary}15` }]}>
            <Ionicons
              name={action.icon}
              size={24}
              color={action.color || colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="body1" style={{ color: colors.text.primary }}>
              {action.title}
            </Text>
            {action.subtitle && (
              <Text variant="body2" style={{ color: colors.text.secondary }}>
                {action.subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionBorder: {
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
}); 