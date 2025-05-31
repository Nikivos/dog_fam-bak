import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, Platform, ScrollView, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing, shadows, borderRadius, typography, layout } from '../theme/theme';
import { MedicalStorage } from '../data/medicalStorage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const commonSymptoms = [
  'Рвота',
  'Диарея',
  'Кашель',
  'Чихание',
  'Потеря аппетита',
  'Вялость',
  'Хромота',
];

export const AddVetVisitScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [showSymptomSuggestions, setShowSymptomSuggestions] = useState(false);

  const handleSave = async () => {
    if (!reason.trim()) {
      Alert.alert(
        'Ошибка',
        'Пожалуйста, укажите причину визита',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const storage = MedicalStorage.getInstance();
      await storage.addVetVisit({
        date: date.toISOString(),
        reason: reason.trim(),
        symptoms: symptoms.trim(),
        diagnosis: diagnosis.trim(),
        prescriptions: prescriptions.trim(),
      });

      Alert.alert(
        'Готово',
        'Визит успешно добавлен',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось сохранить визит',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSymptomSuggestionPress = (symptom: string) => {
    const currentSymptoms = symptoms.trim();
    const newSymptoms = currentSymptoms
      ? `${currentSymptoms}, ${symptom}`
      : symptom;
    setSymptoms(newSymptoms);
    setShowSymptomSuggestions(false);
  };

  const renderDatePicker = () => {
    if (showDatePicker && Platform.OS === 'ios') {
      return (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(_, selectedDate) => handleDateChange(selectedDate)}
          locale="ru"
        />
      );
    }

    if (Platform.OS === 'android' && showDatePicker) {
      return (
        <DateTimePicker
          value={date}
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Новый визит</Text>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="calendar" size={20} color={colors.text.secondary} />
              <Text style={styles.label}>Дата визита</Text>
            </View>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setShowDatePicker(true);
                setShowSymptomSuggestions(false);
              }}
            >
              <Text style={styles.dateButtonText}>
                {format(date, 'd MMMM yyyy', { locale: ru })}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="document-text" size={20} color={colors.text.secondary} />
              <Text style={styles.label}>Причина визита</Text>
            </View>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              placeholder="Укажите причину визита"
              placeholderTextColor={colors.text.secondary}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="medical" size={20} color={colors.text.secondary} />
              <Text style={styles.label}>Симптомы</Text>
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Опишите симптомы"
              placeholderTextColor={colors.text.secondary}
              multiline
              onFocus={() => setShowSymptomSuggestions(true)}
            />
            {showSymptomSuggestions && (
              <View style={styles.suggestionsContainer}>
                {commonSymptoms.map((symptom) => (
                  <TouchableOpacity
                    key={symptom}
                    style={styles.suggestionItem}
                    onPress={() => handleSymptomSuggestionPress(symptom)}
                  >
                    <Ionicons name="add-circle" size={20} color={colors.primary} />
                    <Text style={styles.suggestionText}>{symptom}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="fitness" size={20} color={colors.text.secondary} />
              <Text style={styles.label}>Диагноз</Text>
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="Укажите диагноз"
              placeholderTextColor={colors.text.secondary}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="list" size={20} color={colors.text.secondary} />
              <Text style={styles.label}>Назначения</Text>
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={prescriptions}
              onChangeText={setPrescriptions}
              placeholder="Укажите назначения"
              placeholderTextColor={colors.text.secondary}
              multiline
            />
          </View>
        </View>

        {renderDatePicker()}

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={24} color={colors.text.light} />
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  content: {
    padding: spacing.md,
  } as ViewStyle,
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  } as TextStyle,
  card: {
    ...layout.card,
    marginBottom: spacing.lg,
  } as ViewStyle,
  inputContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  } as ViewStyle,
  label: {
    ...typography.caption,
    marginLeft: spacing.xs,
  } as TextStyle,
  input: {
    ...layout.input,
  } as TextStyle,
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  } as TextStyle,
  dateButton: {
    ...layout.input,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  dateButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  } as TextStyle,
  saveButton: {
    ...layout.button.primary,
    marginBottom: spacing.xl,
  } as ViewStyle,
  saveButtonText: {
    fontSize: 16,
    color: colors.text.light,
    fontWeight: '600',
    marginLeft: spacing.sm,
  } as TextStyle,
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
    ...shadows.medium,
    maxHeight: 200,
  } as ViewStyle,
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  suggestionText: {
    ...typography.body,
    marginLeft: spacing.sm,
  } as TextStyle,
}); 