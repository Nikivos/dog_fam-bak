import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VetVisitForm } from '../components/VetVisitForm';
import { colors } from '../theme/theme';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MedicalStackParamList } from '../types/navigation';

type EditVetVisitScreenRouteProp = RouteProp<MedicalStackParamList, 'EditVetVisit'>;

export const EditVetVisitScreen = () => {
  const route = useRoute<EditVetVisitScreenRouteProp>();
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <VetVisitForm visitId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}); 