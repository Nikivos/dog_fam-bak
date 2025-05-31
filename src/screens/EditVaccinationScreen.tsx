import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VaccinationForm } from '../components/VaccinationForm';
import { colors } from '../theme/theme';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MedicalStackParamList } from '../types/navigation';

type EditVaccinationScreenRouteProp = RouteProp<MedicalStackParamList, 'EditVaccination'>;

export const EditVaccinationScreen = () => {
  const route = useRoute<EditVaccinationScreenRouteProp>();
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <VaccinationForm vaccinationId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}); 