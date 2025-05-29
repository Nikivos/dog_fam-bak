import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ProfileStack } from './ProfileStack';
import { WalkScreen } from '../screens/WalkScreen';
import { FeedingScreen } from '../screens/FeedingScreen';
import { MedicalScreen } from '../screens/MedicalScreen';
import { VaccinationForm } from '../components/VaccinationForm';
import { DewormingForm } from '../components/DewormingForm';
import { VetVisitForm } from '../components/VetVisitForm';
import { MedicationForm } from '../components/MedicationForm';
import { HealthConditionForm } from '../components/HealthConditionForm';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreens = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTitleStyle: {
        color: '#000',
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Главная"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Прогулка"
      component={WalkScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="map" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Питание"
      component={FeedingScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="restaurant" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Тренировки"
      component={TrainingScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="fitness" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Профиль"
      component={ProfileStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TabScreens"
      component={TabScreens}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Medical"
      component={MedicalScreen}
      options={{ title: 'Медицинский дневник' }}
    />
    <Stack.Screen
      name="AddVaccination"
      component={VaccinationForm}
      options={{ title: 'Новая прививка' }}
    />
    <Stack.Screen
      name="AddDeworming"
      component={DewormingForm}
      options={{ title: 'Новая дегельминтизация' }}
    />
    <Stack.Screen
      name="AddVetVisit"
      component={VetVisitForm}
      options={{ title: 'Новый визит к ветеринару' }}
    />
    <Stack.Screen
      name="AddMedication"
      component={MedicationForm}
      options={{ title: 'Новый медикамент' }}
    />
    <Stack.Screen
      name="AddHealthCondition"
      component={HealthConditionForm}
      options={{ title: 'Новое заболевание' }}
    />
  </Stack.Navigator>
);

export const TabNavigator = MainStack; 