import type { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type WalkStackParamList = {
  Walk: undefined;
  WalkStats: undefined;
};

export type RootTabParamList = {
  Профиль: { petId: string };
  WalkStack: NavigatorScreenParams<WalkStackParamList>;
  Тренировки: undefined;
  Медицина: { petId: string };
  Питание: { petId: string; petWeight: number };
};

export type TabParamList = {
  Home: undefined;
  Walk: undefined;
  Training: undefined;
  Medical: undefined;
  Питание: {
    petId: string;
    petWeight: number;
  };
};

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Walk: undefined;
  Feeding: undefined;
  Training: undefined;
  Medical: undefined;
  AddVaccination: undefined;
  AddVetVisit: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 