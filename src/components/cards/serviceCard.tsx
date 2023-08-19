import {Image, TouchableOpacity, View} from 'react-native';
import {perHeight, perWidth} from '../../utils/position/sizes';
import React from 'react';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';

const ServiceCard = ({item, index, navigation}: any) => {
  
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ServiceProviderProfile', {service: item})}
      style={[
        tw` mt-4 border-[#FFC727]`,
        {
          height: perWidth(130),
          width: perWidth(150),
          borderWidth: 3,
          borderRadius: 20,
          marginLeft: index == 0 ? 10 : 3,
        },
      ]}>
      <Image
        resizeMode="cover"
        style={{
          width: perWidth(145),
          height: '65%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        source={{uri: item?.potfolioImageFirst}}
      />
      <View
        style={[
          tw`bg-[${colors.darkPurple}] flex-1`,
          {borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
        ]}>
        <View style={[tw``, {marginLeft: 10, marginTop: perHeight(6)}]}>
          <Textcomp
            text={item?.description}
            size={12}
            lineHeight={14}
            color={colors.white}
            numberOfLines={2}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ServiceCard;
