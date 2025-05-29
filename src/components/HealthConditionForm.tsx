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
import { saveHealthCondition } from '../data/medicalStorage';

type RootStackParamList = {
  AddHealthCondition: { petId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type HealthConditionFormRouteProp = RouteProp<RootStackParamList, 'AddHealthCondition'>;

export const HealthConditionForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HealthConditionFormRouteProp>();
  const { petId } = route.params;

  const [name, setName] = useState('');
  const [diagnosedDate, setDiagnosedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'active' | 'resolved'>('active');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDiagnosedDate(formattedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      await saveHealthCondition(petId, {
        name,
        diagnosedDate,
        status,
        notes,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving health condition:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Название заболевания</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Введите название заболевания"
          />

          <Text style={styles.label}>Дата диагностирования</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{diagnosedDate}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Статус</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'active' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('active')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'active' && styles.statusButtonTextActive,
                ]}
              >
                Активно
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'resolved' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('resolved')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'resolved' && styles.statusButtonTextActive,
                ]}
              >
                Вылечено
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Заметки</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Дополнительная информация"
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Добавить
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(diagnosedDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#333',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    padding: 12,
  },
  submitButton: {
    backgroundColor: '#4facfe',
  },
  gradient: {
    padding: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  submitButtonText: {
    color: '#fff',
  },
}); 