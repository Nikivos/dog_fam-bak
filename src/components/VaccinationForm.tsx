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
import { Vaccination, saveVaccination } from '../data/medicalStorage';

type RootStackParamList = {
  AddVaccination: { petId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type VaccinationFormRouteProp = RouteProp<RootStackParamList, 'AddVaccination'>;

export const VaccinationForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VaccinationFormRouteProp>();
  const { petId } = route.params;

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDate, setNextDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'date' | 'nextDate'>('date');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    setShowNextDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (currentPicker === 'date') {
        setDate(formattedDate);
      } else {
        setNextDate(formattedDate);
      }
    }
  };

  const showPicker = (pickerType: 'date' | 'nextDate') => {
    setCurrentPicker(pickerType);
    if (pickerType === 'date') {
      setShowDatePicker(true);
    } else {
      setShowNextDatePicker(true);
    }
  };

  const handleSubmit = async () => {
    try {
      await saveVaccination(petId, {
        name,
        date,
        nextDate,
        notes,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving vaccination:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Название вакцины</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Введите название вакцины"
          />

          <Text style={styles.label}>Дата вакцинации</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => showPicker('date')}
          >
            <Text style={styles.dateButtonText}>{date}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Дата следующей вакцинации</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => showPicker('nextDate')}
          >
            <Text style={styles.dateButtonText}>{nextDate}</Text>
          </TouchableOpacity>

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

      {(showDatePicker || showNextDatePicker) && (
        <DateTimePicker
          value={new Date(currentPicker === 'date' ? date : nextDate)}
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