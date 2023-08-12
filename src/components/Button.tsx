import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import commonStyle from '../constants/commonStyle';

type ButtonProps = {
  text: string;
  onClick: () => void;
  style?: any;
  disable?: boolean;
  textStyle?: any;
};

export default function ({
  text,
  onClick,
  style,
  disable = false,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onClick}
      style={[styles.start, style, commonStyle.shadow]}>
      <Text
        style={[
          {
            color: 'white',
            fontSize: 14,
            textAlign: 'center',
            fontFamily: commonStyle.fontFamily.medium,
          },
          textStyle,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  start: {
    height: 56,
    backgroundColor: '#88087B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
