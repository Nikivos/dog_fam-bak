import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

interface ContainerProps extends ViewProps {
  padding?: keyof typeof spacing;
  center?: boolean;
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'md',
  center = false,
  backgroundColor = colors.background,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          padding: spacing[padding],
          backgroundColor,
        },
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 