import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetList } from '../components/PetList';
import { PetForm } from '../components/PetForm';
import { Pet } from '../types/pet';

export type ProfileStackParamList = {
  PetList: undefined;
  PetForm: { pet?: Pet } | undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PetList"
        component={PetList}
        options={{
          title: 'Мои питомцы',
        }}
      />
      <Stack.Screen
        name="PetForm"
        component={PetForm}
        options={({ route }) => ({
          title: route.params?.pet ? 'Редактировать питомца' : 'Добавить питомца',
          presentation: 'modal',
        })}
      />
    </Stack.Navigator>
  );
}; 