import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { WalkScreen } from '../screens/WalkScreen';
import { WalkStatsScreen } from '../screens/WalkStatsScreen';
import { FeedingScreen } from '../screens/FeedingScreen';
import { MedicalScreen } from '../screens/MedicalScreen';
import { AddVaccinationScreen } from '../screens/AddVaccinationScreen';
import { AddVetVisitScreen } from '../screens/AddVetVisitScreen';
import { EditVaccinationScreen } from '../screens/EditVaccinationScreen';
import { EditVetVisitScreen } from '../screens/EditVetVisitScreen';
import { VaccinationDetailsScreen } from '../screens/VaccinationDetailsScreen';
import { VetVisitDetailsScreen } from '../screens/VetVisitDetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { RootTabParamList, WalkStackParamList, MedicalStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const WalkStack = createStackNavigator<WalkStackParamList>();
const MedicalStack = createStackNavigator<MedicalStackParamList>();

const WalkStackNavigator = () => {
  return (
    <WalkStack.Navigator>
      <WalkStack.Screen
        name="Walk"
        component={WalkScreen}
        options={{ headerShown: false }}
      />
      <WalkStack.Screen
        name="WalkStats"
        component={WalkStatsScreen}
        options={{ headerShown: false }}
      />
    </WalkStack.Navigator>
  );
};

const MedicalStackNavigator = () => {
  return (
    <MedicalStack.Navigator>
      <MedicalStack.Screen
        name="Medical"
        component={MedicalScreen}
        options={{ headerShown: false }}
      />
      <MedicalStack.Screen
        name="AddVaccination"
        component={AddVaccinationScreen}
        options={{
          title: 'Добавить вакцинацию',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <MedicalStack.Screen
        name="AddVetVisit"
        component={AddVetVisitScreen}
        options={{
          title: 'Добавить визит',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <MedicalStack.Screen
        name="EditVaccination"
        component={EditVaccinationScreen}
        options={{
          title: 'Редактировать вакцинацию',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <MedicalStack.Screen
        name="EditVetVisit"
        component={EditVetVisitScreen}
        options={{
          title: 'Редактировать визит',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <MedicalStack.Screen
        name="VaccinationDetails"
        component={VaccinationDetailsScreen}
        options={{
          title: 'Детали вакцинации',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <MedicalStack.Screen
        name="VetVisitDetails"
        component={VetVisitDetailsScreen}
        options={{
          title: 'Детали визита',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
    </MedicalStack.Navigator>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'WalkStack') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Тренировки') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'MedicalStack') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Питание') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen
        name="Профиль"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="WalkStack"
        component={WalkStackNavigator}
        options={{
          headerShown: false,
          title: 'Прогулки',
        }}
      />
      <Tab.Screen
        name="Тренировки"
        component={TrainingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MedicalStack"
        component={MedicalStackNavigator}
        options={{
          headerShown: false,
          title: 'Здоровье',
        }}
      />
      <Tab.Screen
        name="Питание"
        component={FeedingScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}; 