import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme/theme';

export type TextVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof colors.text;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        typography[variant],
        { color: colors.text[color] },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}; 