import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VetVisitForm } from '../components/VetVisitForm';
import { colors } from '../theme/theme';

export const AddVetVisitScreen = () => {
  return (
    <View style={styles.container}>
      <VetVisitForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}); 