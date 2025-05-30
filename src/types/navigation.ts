import type { NavigatorScreenParams } from '@react-navigation/native';

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

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList>;
  ДобавитьВакцинацию: { petId: string };
  ДобавитьДегельминтизацию: { petId: string };
  ДобавитьВизит: { petId: string };
  ДобавитьЛекарство: { petId: string };
  ДобавитьДиагноз: { petId: string };
}; 