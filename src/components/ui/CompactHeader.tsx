import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme/theme';

interface CompactHeaderProps {
  petName: string;
  petAvatar?: string;
  userAvatar?: string;
  onPetPress: () => void;
  onUserPress: () => void;
  hasMultiplePets?: boolean;
}

export const CompactHeader: React.FC<CompactHeaderProps> = ({
  petName,
  petAvatar,
  userAvatar,
  onPetPress,
  onUserPress,
  hasMultiplePets = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.petContainer} onPress={onPetPress}>
        <View style={styles.avatarContainer}>
          {petAvatar ? (
            <Image source={{ uri: petAvatar }} style={styles.petAvatar} />
          ) : (
            <View style={[styles.petAvatarPlaceholder, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.petAvatarPlaceholderText, { color: colors.primary }]}>
                {petName[0]}
              </Text>
            </View>
          )}
          {hasMultiplePets && (
            <View style={[styles.switchPetBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="chevron-down" size={12} color={colors.text.light} />
            </View>
          )}
        </View>
        <View style={styles.petInfo}>
          <Text style={[styles.petName, { color: colors.text.primary }]}>{petName}</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Мой питомец</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userAvatar} onPress={onUserPress}>
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.userAvatarImage} />
        ) : (
          <View style={[styles.userAvatarPlaceholder, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  petAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
  },
  petAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petAvatarPlaceholderText: {
    ...typography.h3,
  },
  switchPetBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    marginLeft: spacing.sm,
  },
  petName: {
    ...typography.body1,
  },
  subtitle: {
    ...typography.caption,
  },
  userAvatar: {
    width: 36,
    height: 36,
  },
  userAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 