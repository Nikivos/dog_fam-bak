import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { Pet } from '../types/pet';
import { PetStorage } from '../data/petStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export const PetList = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const petStorage = PetStorage.getInstance();

  const loadPets = async () => {
    const loadedPets = await petStorage.getAllPets();
    console.log('Loaded pets:', loadedPets); // Добавим для отладки
    setPets(loadedPets);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [])
  );

  const handleAddPet = () => {
    navigation.navigate('PetForm');
  };

  const handleEditPet = (pet: Pet) => {
    navigation.navigate('PetForm', { pet });
  };

  const handleDeletePet = async (pet: Pet) => {
    Alert.alert(
      'Удаление питомца',
      `Вы уверены, что хотите удалить ${pet.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await petStorage.deletePet(pet.id);
            await loadPets();
          },
        },
      ]
    );
  };

  const renderPetItem = ({ item: pet }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => handleEditPet(pet)}
    >
      <View style={styles.petInfo}>
        {pet.photo ? (
          <Image source={{ uri: pet.photo }} style={styles.petPhoto} />
        ) : (
          <View style={[styles.petPhoto, styles.placeholderPhoto]}>
            <Text style={styles.placeholderText}>{pet.name[0]}</Text>
          </View>
        )}
        <View style={styles.petDetails}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePet(pet)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Количество питомцев: {pets.length}</Text>
      <FlatList
        data={pets}
        renderItem={renderPetItem}
        keyExtractor={(pet) => pet.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              У вас пока нет добавленных питомцев
            </Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  petPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  placeholderPhoto: {
    backgroundColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#666',
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  debugText: {
    padding: 10,
    color: '#666',
  },
}); 