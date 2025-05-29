import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { WalkScreen } from '../screens/WalkScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

type TabParamList = {
  Главная: undefined;
  Прогулки: undefined;
  Тренировки: undefined;
  Профиль: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Главная':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Прогулки':
            iconName = focused ? 'paw' : 'paw-outline';
            break;
          case 'Тренировки':
            iconName = focused ? 'trophy' : 'trophy-outline';
            break;
          case 'Профиль':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4facfe',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Главная" component={HomeScreen} />
    <Tab.Screen name="Прогулки" component={WalkScreen} />
    <Tab.Screen name="Тренировки" component={TrainingScreen} />
    <Tab.Screen name="Профиль" component={ProfileScreen} />
  </Tab.Navigator>
); 