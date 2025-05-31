import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing } from '../theme/theme';
import { MedicalStorage } from '../data/medicalStorage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const commonVaccines = [
  'Бешенство',
  'Комплексная DHPP',
  'Лептоспироз',
  'Бордетеллез',
  'Коронавирус',
];

export const AddVaccinationScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(addMonths(new Date(), 12));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'date' | 'next'>('date');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      await storage.addVaccination({
        name: name.trim(),
        date: date.toISOString(),
        nextDate: nextDate.toISOString(),
      });

      Alert.alert(
        'Готово',
        'Вакцинация успешно добавлена',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось сохранить вакцинацию',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowNextDatePicker(false);
    }

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

  const handleVaccineSuggestionPress = (vaccine: string) => {
    setName(vaccine);
    setShowSuggestions(false);
  };

  const renderDatePicker = () => {
    if ((showDatePicker || showNextDatePicker) && Platform.OS === 'ios') {
      return (
        <DateTimePicker
          value={datePickerType === 'date' ? date : nextDate}
          mode="date"
          display="spinner"
          onChange={(_, selectedDate) => handleDateChange(selectedDate)}
          locale="ru"
        />
      );
    }

    if (Platform.OS === 'android' && (showDatePicker || showNextDatePicker)) {
      return (
        <DateTimePicker
          value={datePickerType === 'date' ? date : nextDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => handleDateChange(selectedDate)}
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

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={24} color={colors.text.light} />
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
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
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.text.light,
    fontWeight: '600',
    marginLeft: spacing.sm,
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
}); 