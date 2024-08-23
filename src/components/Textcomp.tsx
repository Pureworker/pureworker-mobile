import {View, Text} from 'react-native';
import React from 'react';

interface props {
  text: string;
  size: number;
  color: string;
  style?: any;
  lineHeight?: number;
  fontFamily?: string;
  numberOfLines?: number;
}

export default function Textcomp({
  text,
  size,
  color,
  style,
  lineHeight,
  fontFamily,
  numberOfLines
}: props) {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        style,
        {
          color: color,
          fontSize: size || 14,
          lineHeight: lineHeight,
          fontFamily: fontFamily || 'Inter-Regular',
        },
      ]}>
      {text}
    </Text>
  );
}
