import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Medication, MedicationStorage } from '../data/medicalStorage';
import { Button } from './Button';
import { Card } from './Card';
import { colors, typography, spacing } from '../theme/theme';

type RootStackParamList = {
  AddMedication: { petId: string };
};

type AddMedicationRouteProp = RouteProp<RootStackParamList, 'AddMedication'>;
type AddMedicationNavigationProp = StackNavigationProp<RootStackParamList>;

export const MedicationForm = () => {
  const navigation = useNavigation<AddMedicationNavigationProp>();
  const route = useRoute<AddMedicationRouteProp>();
  const { petId } = route.params;

  const [medication, setMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    petId,
  });

  const handleSave = async () => {
    try {
      const storage = MedicationStorage.getInstance(petId);
      await storage.save({
        ...medication,
        id: storage.createId(),
      } as Medication);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Добавить медикамент</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card variant="elevated" style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Название</Text>
            <TextInput
              style={styles.input}
              value={medication.name}
              onChangeText={(text) => setMedication(prev => ({ ...prev, name: text }))}
              placeholder="Введите название медикамента"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Дозировка</Text>
            <TextInput
              style={styles.input}
              value={medication.dosage}
              onChangeText={(text) => setMedication(prev => ({ ...prev, dosage: text }))}
              placeholder="Например: 1 таблетка"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Частота приема</Text>
            <TextInput
              style={styles.input}
              value={medication.frequency}
              onChangeText={(text) => setMedication(prev => ({ ...prev, frequency: text }))}
              placeholder="Например: 2 раза в день"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Примечания</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={medication.notes}
              onChangeText={(text) => setMedication(prev => ({ ...prev, notes: text }))}
              placeholder="Дополнительная информация"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          variant="tertiary"
          size="medium"
          onPress={() => navigation.goBack()}
        >
          Отмена
        </Button>
        <Button
          variant="primary"
          size="medium"
          onPress={handleSave}
        >
          Сохранить
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  formCard: {
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
}); 