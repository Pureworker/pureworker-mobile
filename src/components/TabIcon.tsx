import React from 'react';
import {View, Image} from 'react-native';
import tw from 'twrnc';
import Text1 from './Textcomp';
import {perHeight} from '../utils/position/sizes';
import { color } from 'react-native-reanimated';
import colors from '../constants/colors';

const TabIcon = ({focused, icon, name}) => {
  return (
    <View
      style={[tw`m-auto `, {alignItems: 'center', justifyContent: 'center'}]}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          tintColor: focused ? colors.black : '#00041380',
        }}
      />
      <View style={[{marginTop: perHeight(8)}]}>
        <Text1
          text={name}
          size={10}
          color={focused ? colors.black : '#00041380'}
          lineHeight={11.75}
          style={{fontWeight: '600'}}
        />
      </View>
    </View>
  );
};

export default TabIcon;
