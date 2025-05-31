import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ImageViewerScreenRouteProp = RouteProp<RootStackParamList, 'ImageViewer'>;

export const ImageViewerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ImageViewerScreenRouteProp>();
  const { imageUri } = route.params;

  const handleConfirm = () => {
    navigation.navigate('AddPet', { photoUri: imageUri });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark" size={30} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
}); 