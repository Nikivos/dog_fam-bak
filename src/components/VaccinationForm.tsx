import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MedicalStackNavigationProp } from '../types/navigation';
import { MedicalStorage } from '../data/medicalStorage';
import { format, addMonths, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = MedicalStackNavigationProp;

const commonVaccines = [
  'Бешенство',
  'Комплексная DHPP',
  'Лептоспироз',
  'Бордетеллез',
  'Коронавирус',
];

interface VaccinationFormProps {
  vaccinationId?: string;
}

export const VaccinationForm: React.FC<VaccinationFormProps> = ({ vaccinationId }) => {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(addMonths(new Date(), 12));
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'date' | 'next'>('date');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (vaccinationId) {
      const storage = MedicalStorage.getInstance();
      const vaccination = storage.getVaccinations().find(v => v.id === vaccinationId);
      if (vaccination) {
        setName(vaccination.name);
        setDate(parse(vaccination.date, 'yyyy-MM-dd', new Date()));
        setNextDate(parse(vaccination.nextDate, 'yyyy-MM-dd', new Date()));
      }
    }
  }, [vaccinationId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Ошибка',
        'Пожалуйста, введите название вакцины',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const storage = MedicalStorage.getInstance();
      if (vaccinationId) {
        await storage.updateVaccination(vaccinationId, {
          name: name.trim(),
          date: format(date, 'yyyy-MM-dd'),
          nextDate: format(nextDate, 'yyyy-MM-dd'),
          type: 'Ежегодная',
        });
      } else {
        await storage.addVaccination({
          name: name.trim(),
          date: format(date, 'yyyy-MM-dd'),
          nextDate: format(nextDate, 'yyyy-MM-dd'),
          type: 'Ежегодная',
        });
      }

      Alert.alert(
        'Готово',
        vaccinationId ? 'Вакцинация успешно обновлена' : 'Вакцинация успешно добавлена',
        [{ 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
            // Принудительно обновляем список на предыдущем экране
            navigation.navigate('Medical');
          }
        }]
      );
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось сохранить вакцинацию',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (datePickerType === 'date') {
        setDate(selectedDate);
        // Автоматически устанавливаем следующую дату через год
        setNextDate(addMonths(selectedDate, 12));
      } else {
        setNextDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    setShowDatePicker(false);
    setShowNextDatePicker(false);
  };

  const handleVaccineSuggestionPress = (vaccine: string) => {
    setName(vaccine);
    setShowSuggestions(false);
  };

  const renderDatePicker = () => {
    if ((showDatePicker || showNextDatePicker) && Platform.OS === 'ios') {
      return (
        <View>
          <DateTimePicker
            value={datePickerType === 'date' ? date : nextDate}
            mode="date"
            display="spinner"
            onChange={(_, selectedDate) => handleDateChange(_, selectedDate)}
            locale="ru"
          />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmDate}
          >
            <Text style={styles.confirmButtonText}>Подтвердить</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (Platform.OS === 'android' && (showDatePicker || showNextDatePicker)) {
      return (
        <DateTimePicker
          value={datePickerType === 'date' ? date : nextDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            handleDateChange(_, selectedDate);
            handleConfirmDate();
          }}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Название вакцины</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setShowSuggestions(text.length > 0);
            }}
            placeholder="Введите название"
            placeholderTextColor={colors.text.secondary}
            onFocus={() => setShowSuggestions(name.length > 0)}
          />
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              {commonVaccines
                .filter(v => v.toLowerCase().includes(name.toLowerCase()))
                .map((vaccine) => (
                  <TouchableOpacity
                    key={vaccine}
                    style={styles.suggestionItem}
                    onPress={() => handleVaccineSuggestionPress(vaccine)}
                  >
                    <Ionicons name="medical-outline" size={20} color={colors.primary} />
                    <Text style={styles.suggestionText}>{vaccine}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Дата вакцинации</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerType('date');
              setShowDatePicker(true);
              setShowNextDatePicker(false);
              setShowSuggestions(false);
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.dateButtonText}>
              {format(date, 'd MMMM yyyy', { locale: ru })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Следующая вакцинация</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerType('next');
              setShowNextDatePicker(true);
              setShowDatePicker(false);
              setShowSuggestions(false);
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.dateButtonText}>
              {format(nextDate, 'd MMMM yyyy', { locale: ru })}
            </Text>
          </TouchableOpacity>
        </View>

        {renderDatePicker()}

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
            onPress={handleSave}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                Сохранить
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  dateContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: spacing.sm,
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
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  confirmButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
}); 