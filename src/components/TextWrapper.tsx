import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

type TexWrapperProps = {
  style: any
  children: string
  fontType: string
  isRequired?: boolean
}

const TextWrapper = (props: TexWrapperProps) => {
  const { style, children, fontType, isRequired = false } = props;
  var fontSize;
  if (
    style == undefined ||
    style.fontSize == undefined ||
    style.fontSize == null
  ) {
    fontSize = 14;
  } else {
    fontSize = style.fontSize;
  }

  var fontFamily;
  switch (fontType) {
    case 'medium':
      fontFamily = 'Inter-Medium';
      break;
    case 'bold':
      fontFamily = 'Inter-Bold';
      break;
    case 'semiBold':
      fontFamily = 'Inter-SemiBold';
      break;
    case 'normal':
    default:
      fontFamily = 'Inter-Regular';
      break;
  }

  return (
    <Text {...props} style={[style, { fontSize, fontFamily }]}>
      {children}
      {isRequired && <Text style={{color: '#D20713', fontSize: 15}} >*</Text>}
    </Text>
  );
};

TextWrapper.prototype = {
  onTest: PropTypes.string,
};

export default TextWrapper;