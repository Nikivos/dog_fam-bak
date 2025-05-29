import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Vaccination,
  Deworming,
  VetVisit,
  Medication,
  HealthCondition,
  getVaccinations,
  getDewormings,
  getVetVisits,
  getMedications,
  getHealthConditions,
} from '../data/medicalStorage';

type RootStackParamList = {
  Medical: { petId: string };
  AddVaccination: { petId: string };
  AddDeworming: { petId: string };
  AddVetVisit: { petId: string };
  AddMedication: { petId: string };
  AddHealthCondition: { petId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type MedicalScreenRouteProp = RouteProp<RootStackParamList, 'Medical'>;

export const MedicalScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MedicalScreenRouteProp>();
  const petId = route.params.petId;

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [dewormings, setDewormings] = useState<Deworming[]>([]);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [conditions, setConditions] = useState<HealthCondition[]>([]);

  useEffect(() => {
    if (petId) {
      loadData();
    }
  }, [petId]);

  const loadData = async () => {
    try {
      const [vacc, deworm, visits, meds, conds] = await Promise.all([
        getVaccinations(petId),
        getDewormings(petId),
        getVetVisits(petId),
        getMedications(petId),
        getHealthConditions(petId),
      ]);

      setVaccinations(vacc);
      setDewormings(deworm);
      setVetVisits(visits);
      setMedications(meds);
      setConditions(conds);
    } catch (error) {
      console.error('Error loading medical data:', error);
    }
  };

  const renderSection = (title: string, items: any[], onAdd: () => void) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#4facfe" />
        </TouchableOpacity>
      </View>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Нет записей</Text>
      ) : (
        items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => {/* TODO: Handle edit */}}
          >
            <LinearGradient
              colors={['#fff', '#f8f9fa']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.itemGradient}
            >
              <Text style={styles.itemTitle}>{item.name || item.reason || item.medicine}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
              {item.nextDate && (
                <Text style={styles.itemNextDate}>
                  Следующий приём: {item.nextDate}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  if (!petId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Ошибка: не указан ID питомца</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderSection('Прививки', vaccinations, () =>
          navigation.navigate('AddVaccination', { petId })
        )}
        {renderSection('Дегельминтизация', dewormings, () =>
          navigation.navigate('AddDeworming', { petId })
        )}
        {renderSection('Визиты к ветеринару', vetVisits, () =>
          navigation.navigate('AddVetVisit', { petId })
        )}
        {renderSection('Медикаменты', medications, () =>
          navigation.navigate('AddMedication', { petId })
        )}
        {renderSection('Заболевания', conditions, () =>
          navigation.navigate('AddHealthCondition', { petId })
        )}
      </ScrollView>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 24,
  },
  itemCard: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemGradient: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
  itemNextDate: {
    fontSize: 14,
    color: '#4facfe',
    marginTop: 4,
  },
}); 