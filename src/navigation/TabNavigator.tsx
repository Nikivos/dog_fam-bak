import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { WalkScreen } from '../screens/WalkScreen';
import { WalkStatsScreen } from '../screens/WalkStatsScreen';
import { FeedingScreen } from '../screens/FeedingScreen';
import { MedicalScreen } from '../screens/MedicalScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { WalkStackParamList, RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const WalkStackNav = createStackNavigator<WalkStackParamList>();

const WalkStack = () => (
  <WalkStackNav.Navigator>
    <WalkStackNav.Screen
      name="Walk"
      component={WalkScreen}
      options={{ 
        headerShown: false,
        title: 'Прогулка'
      }}
    />
    <WalkStackNav.Screen
      name="WalkStats"
      component={WalkStatsScreen}
      options={{ title: 'Статистика прогулок' }}
    />
  </WalkStackNav.Navigator>
);

export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text.secondary,
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
        paddingBottom: 8,
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Профиль"
      component={ProfileScreen}
      initialParams={{ petId: '1' }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="WalkStack"
      component={WalkStack}
      options={{
        title: 'Прогулка',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="map" size={size} color={color} />
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
      name="Медицина"
      component={MedicalScreen}
      initialParams={{ petId: '1' }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="medical" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Питание"
      component={FeedingScreen}
      initialParams={{ petId: '1', petWeight: 30 }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="restaurant" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
); 