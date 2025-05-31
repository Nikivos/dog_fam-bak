import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeContext';

interface PetCardUIProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  imageUri?: string;
  onPress: () => void;
}

export const PetCardUI: React.FC<PetCardUIProps> = ({
  name,
  breed,
  age,
  imageUri,
  onPress,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }, shadows.medium]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../../assets/default-pet.png')}
          style={[styles.image, { borderRadius: borderRadius.md }]}
        />
        <View style={styles.info}>
          <Text variant="h2" style={{ color: colors.text.primary }}>{name}</Text>
          <Text variant="body2" style={{ color: colors.text.secondary }}>{breed}</Text>
          <Text variant="body2" style={{ color: colors.text.secondary }}>{age}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
}); 