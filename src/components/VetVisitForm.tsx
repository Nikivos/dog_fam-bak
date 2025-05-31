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
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { colors, spacing } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = MedicalStackNavigationProp;

const commonSymptoms = [
  'Рвота',
  'Диарея',
  'Кашель',
  'Чихание',
  'Потеря аппетита',
  'Вялость',
  'Хромота',
];

interface VetVisitFormProps {
  visitId?: string;
}

export const VetVisitForm: React.FC<VetVisitFormProps> = ({ visitId }) => {
  const navigation = useNavigation<NavigationProp>();

  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSymptomSuggestions, setShowSymptomSuggestions] = useState(false);
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    if (visitId) {
      const storage = MedicalStorage.getInstance();
      const visit = storage.getVetVisits().find(v => v.id === visitId);
      if (visit) {
        setDate(parse(visit.date, 'yyyy-MM-dd', new Date()));
        setReason(visit.reason);
        setDiagnosis(visit.diagnosis || '');
        setPrescriptions(visit.prescriptions || '');
        setSymptoms(visit.symptoms || '');
      }
    }
  }, [visitId]);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    setShowDatePicker(false);
  };

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
      if (visitId) {
        await storage.updateVetVisit(visitId, {
          date: format(date, 'yyyy-MM-dd'),
          reason: reason.trim(),
          doctor: '',
          status: 'scheduled',
          diagnosis: diagnosis.trim(),
          prescriptions: prescriptions.trim(),
          symptoms: symptoms.trim(),
        });
      } else {
        await storage.addVetVisit({
          date: format(date, 'yyyy-MM-dd'),
          reason: reason.trim(),
          doctor: '',
          status: 'scheduled',
          diagnosis: diagnosis.trim(),
          prescriptions: prescriptions.trim(),
          symptoms: symptoms.trim(),
        });
      }

      Alert.alert(
        'Готово',
        visitId ? 'Визит успешно обновлен' : 'Визит успешно добавлен',
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
        'Не удалось сохранить визит',
        [{ text: 'OK' }]
      );
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
        <View>
          <DateTimePicker
            value={date}
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

    if (Platform.OS === 'android' && showDatePicker) {
      return (
        <DateTimePicker
          value={date}
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

        {renderDatePicker()}

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={24} color={colors.text.light} />
          <Text style={styles.saveButtonText}>
            {visitId ? 'Сохранить изменения' : 'Добавить'}
          </Text>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text.primary,
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
    maxHeight: 200,
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