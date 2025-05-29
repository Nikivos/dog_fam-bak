import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '../types/pet';

// Временные данные для демонстрации
const mockPet: Pet = {
  id: '1',
  name: 'Барон',
  breed: 'Немецкая овчарка',
  birthDate: '2020-05-15',
  weight: 32,
  photo: 'https://placekitten.com/200/200', // Временное фото
  gender: 'male',
  vaccinations: [
    {
      id: '1',
      name: 'Бешенство',
      date: '2023-06-01',
      nextDate: '2024-06-01',
    },
  ],
  medicalRecords: [
    {
      id: '1',
      date: '2023-12-15',
      description: 'Ежегодный осмотр',
      doctor: 'Иванов И.И.',
      clinic: 'ВетКлиника',
    },
  ],
  allergies: ['Курица'],
};

export const ProfileScreen = () => {
  const [pet, setPet] = useState<Pet>(mockPet);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const handleEditPress = () => {
    Alert.alert('Редактирование', 'Здесь будет форма редактирования профиля');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: pet.photo }} style={styles.photo} />
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Возраст</Text>
            <Text style={styles.infoValue}>{calculateAge(pet.birthDate)} лет</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Вес</Text>
            <Text style={styles.infoValue}>{pet.weight} кг</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Пол</Text>
            <Text style={styles.infoValue}>
              {pet.gender === 'male' ? 'Мальчик' : 'Девочка'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Прививки</Text>
          {pet.vaccinations.map((vaccination) => (
            <View key={vaccination.id} style={styles.vaccinationItem}>
              <Text style={styles.vaccinationName}>{vaccination.name}</Text>
              <Text style={styles.vaccinationDate}>
                Следующая: {vaccination.nextDate}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Медицинская карта</Text>
          {pet.medicalRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <Text style={styles.recordDescription}>{record.description}</Text>
              <Text style={styles.recordDoctor}>{record.doctor}</Text>
            </View>
          ))}
        </View>

        {pet.allergies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Аллергии</Text>
            {pet.allergies.map((allergy, index) => (
              <Text key={index} style={styles.allergyItem}>
                • {allergy}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    padding: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  breed: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  vaccinationItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  vaccinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vaccinationDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  recordItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  recordDoctor: {
    fontSize: 14,
    color: '#666',
  },
  allergyItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    paddingLeft: 10,
  },
}); 