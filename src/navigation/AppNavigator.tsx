import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, TabParamList } from '../types/navigation';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WalkScreen } from '../screens/WalkScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { MedicalScreen } from '../screens/MedicalScreen';
import { FeedingScreen } from '../screens/FeedingScreen';
import { colors } from '../theme/theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Профиль':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Прогулка':
              iconName = focused ? 'paw' : 'paw-outline';
              break;
            case 'Тренировки':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'Медицина':
              iconName = focused ? 'medical' : 'medical-outline';
              break;
            case 'Питание':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Профиль" 
        component={ProfileScreen}
        initialParams={{ petId: '1' }}
        options={{ title: 'Профиль' }}
      />
      <Tab.Screen 
        name="Прогулка" 
        component={WalkScreen}
        options={{ title: 'Прогулка' }}
      />
      <Tab.Screen 
        name="Тренировки" 
        component={TrainingScreen}
        options={{ title: 'Тренировки' }}
      />
      <Tab.Screen 
        name="Медицина" 
        component={MedicalScreen}
        initialParams={{ petId: '1' }}
        options={{ title: 'Медицина' }}
      />
      <Tab.Screen 
        name="Питание" 
        component={FeedingScreen}
        initialParams={{ petId: '1', petWeight: 30 }}
        options={{ title: 'Питание' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Главная"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 