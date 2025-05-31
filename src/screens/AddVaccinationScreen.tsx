import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VaccinationForm } from '../components/VaccinationForm';
import { colors } from '../theme/theme';

export const AddVaccinationScreen = () => {
  return (
    <View style={styles.container}>
      <VaccinationForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}); 