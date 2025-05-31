import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalkScreen } from '../screens/WalkScreen';
import { WalkStatsScreen } from '../screens/WalkStatsScreen';
import { MedicalScreen } from '../screens/MedicalScreen';
import { AddVaccinationScreen } from '../screens/AddVaccinationScreen';
import { AddVetVisitScreen } from '../screens/AddVetVisitScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Medical" 
        component={MedicalScreen}
        options={{
          title: 'Медицина',
        }}
      />
      <Stack.Screen 
        name="Walk" 
        component={WalkScreen}
        options={{
          title: 'Прогулка',
        }}
      />
      <Stack.Screen 
        name="WalkStats" 
        component={WalkStatsScreen}
        options={{
          title: 'Статистика прогулок',
        }}
      />
      <Stack.Screen 
        name="AddVaccination" 
        component={AddVaccinationScreen}
        options={{
          title: 'Новая вакцинация',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AddVetVisit" 
        component={AddVetVisitScreen}
        options={{
          title: 'Новый визит',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}; 