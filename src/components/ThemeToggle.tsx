import React from 'react';
import { Switch, StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle = () => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Switch
        value={colorScheme === 'dark'}
        onValueChange={() => {}}
        trackColor={{ false: colors.gray, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
  },
}); 