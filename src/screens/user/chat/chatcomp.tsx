import {View} from 'react-native';
import React from 'react';
import tw from 'twrnc';

import Textcomp from '../../../components/Textcomp';
import {perHeight, perWidth} from '../../../utils/position/sizes';
import colors from '../../../constants/colors';

interface params {
  text: string;
  type: string;
}

export default function Index({type, text}: params) {
  return (
    <View
      style={[
        tw`bg-[${type === 'me' ? colors.parpal : '#011B33'}] ${
          type === 'me' ? 'mr-auto' : 'ml-auto'
        }`,
        {
          borderRadius: 6,
          minWidth: perWidth(60),
          maxWidth: perWidth(270),
          paddingVertical: perHeight(10),
          paddingHorizontal: perWidth(10),
          minHeight: perHeight(36),
          marginTop: perHeight(12),
        },
      ]}>
      <Textcomp
        fontSize={14}
        lineHeight={21}
        text={text}
        color={'#FFFFFF'}
        style={{fontWeight: '500'}}
        family={'Inter'}
      />
    </View>
  );
}
