import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList>;
};

export type RootTabParamList = {
  Профиль: undefined;
  WalkStack: undefined;
  Тренировки: undefined;
  MedicalStack: undefined;
  Питание: undefined;
};

export type WalkStackParamList = {
  Walk: undefined;
  WalkStats: undefined;
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

export type MedicalStackParamList = {
  Medical: undefined;
  AddVaccination: undefined;
  AddVetVisit: undefined;
  EditVaccination: { id: string };
  EditVetVisit: { id: string };
  VaccinationDetails: { id: string };
  VetVisitDetails: { id: string };
};

export type NavigationProp = NativeStackNavigationProp<MedicalStackParamList>;

// Добавляем тип для навигации в медицинском стеке
export type MedicalStackNavigationProp = NativeStackNavigationProp<MedicalStackParamList>; 