import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [location, setLocation] = React.useState(true);

  const SettingItem = ({ 
    icon, 
    title, 
    value, 
    onValueChange,
    type = 'switch'
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.text.primary} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : value ? colors.primary : colors.border}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>
        <SettingItem
          icon="notifications"
          title="Push-уведомления"
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        <SettingItem
          icon="moon"
          title="Темная тема"
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Конфиденциальность</Text>
        <SettingItem
          icon="location"
          title="Доступ к геолокации"
          value={location}
          onValueChange={setLocation}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={24} color={colors.text.primary} />
            <Text style={styles.settingTitle}>Версия приложения</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
    lineHeight: typography.h2.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingTitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    lineHeight: typography.body1.lineHeight,
    color: colors.text.primary,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  versionText: {
    fontSize: typography.body2.fontSize,
    fontWeight: '400',
    color: colors.text.secondary,
  },
}); 