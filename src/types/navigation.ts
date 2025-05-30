import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Главная: NavigatorScreenParams<TabParamList>;
  ДобавитьВакцинацию: { petId: string };
  ДобавитьДегельминтизацию: { petId: string };
  ДобавитьВизит: { petId: string };
  ДобавитьЛекарство: { petId: string };
  ДобавитьДиагноз: { petId: string };
};

export type TabParamList = {
  Профиль: { petId: string };
  Прогулка: undefined;
  Тренировки: undefined;
  Медицина: { petId: string };
  Питание: { petId: string; petWeight: number };
}; 