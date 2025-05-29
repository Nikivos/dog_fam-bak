import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeatherWidget } from '../components/WeatherWidget';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

type TabParamList = {
  Главная: undefined;
  Прогулка: undefined;
  Питание: undefined;
  Тренировки: undefined;
  Профиль: undefined;
};

type NavigationProp = BottomTabNavigationProp<TabParamList>;

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleStartWalk = () => {
    navigation.jumpTo('Прогулка');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Привет! 👋</Text>
        <Text style={styles.title}>Добро пожаловать в DogFam</Text>

        {/* Погода */}
        <View style={styles.card}>
          <WeatherWidget />
        </View>

        {/* Статистика прогулок */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, styles.elevation]}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.statsContent}>
                <Text style={styles.statsTitle}>Сегодня</Text>
                <Text style={styles.statsValue}>5.2 км</Text>
                <Text style={styles.statsSubtitle}>1ч 20м</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.statsContent}>
                <Text style={styles.statsTitle}>За неделю</Text>
                <Text style={styles.statsValue}>24.5 км</Text>
                <Text style={styles.statsSubtitle}>8ч 45м</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Ближайшие события */}
        <View style={[styles.card, styles.elevation]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#4facfe" />
            <Text style={styles.cardTitle}>Ближайшие события</Text>
          </View>
          <View style={styles.eventList}>
            <View style={styles.eventItem}>
              <View style={[styles.eventIcon, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="medical" size={20} color="#FF2D55" />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Прививка от бешенства</Text>
                <Text style={styles.eventTime}>Через 5 дней</Text>
              </View>
            </View>
            <View style={styles.eventItem}>
              <View style={[styles.eventIcon, { backgroundColor: '#E5E5FF' }]}>
                <Ionicons name="cut" size={20} color="#5856D6" />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Груминг</Text>
                <Text style={styles.eventTime}>Через 2 недели</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.elevation]} onPress={handleStartWalk}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              <Ionicons name="map" size={24} color="#fff" />
              <Text style={styles.actionText}>Начать прогулку</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.elevation]}>
            <LinearGradient
              colors={['#FF9500', '#FF5E3A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              <Ionicons name="medical" size={24} color="#fff" />
              <Text style={styles.actionText}>Ветеринар</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.elevation]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              <Ionicons name="search" size={24} color="#fff" />
              <Text style={styles.actionText}>Найти компанию</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.elevation]}>
            <LinearGradient
              colors={['#FF2D55', '#FF2D55']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              <Ionicons name="heart" size={24} color="#fff" />
              <Text style={styles.actionText}>Дневник питания</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientCard: {
    padding: 16,
    height: 120,
  },
  statsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statsTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  eventList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
}); 