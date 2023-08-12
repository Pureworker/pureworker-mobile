import {Image, View, TouchableOpacity} from 'react-native';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import React, {useState} from 'react';

import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';

import {Rating, AirbnbRating} from 'react-native-ratings';

const ServiceCard2 = ({item, index, navigation}: any) => {
  const [saved, setsaved] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ServiceProviderProfile');
      }}
      style={[
        tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
        {
          height: perWidth(130),
          width: SIZES.width * 0.95,
          borderWidth: 0,
          borderRadius: 5,
          // marginLeft: index === 0 ? 10 : 3,
          paddingHorizontal: perWidth(16),
          paddingVertical: perWidth(14),
        },
      ]}>
      <View style={tw`flex flex-row `}>
        <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
          <Image
            resizeMode="cover"
            style={{
              width: perWidth(50),
              height: perWidth(50),
              borderRadius: perWidth(50) / 2,
            }}
            source={images.welcome}
          />
          <View
            style={[
              tw`absolute bottom-0 border-2 right-1 rounded-full`,
              {width: 8, height: 8, backgroundColor: colors.green},
            ]}
          />
        </View>
        <View style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
          <View style={[tw`flex flex-row justify-between`, {}]}>
            <View style={[tw``, {}]}>
              <Textcomp
                text={'$15'}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setsaved(!saved);
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: perWidth(20),
                  height: perWidth(20),
                }}
                source={saved ? images.saved : images.save}
              />
            </TouchableOpacity>
          </View>
          <View style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
            <Textcomp
              text={
                'Plumber with many years of experience fixing pipes, washers and all form of...s'
              }
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={2}
            />
          </View>
          {/* <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={'$20/hr'}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View> */}
        </View>
      </View>
      <View>
        <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={'Steven W.s'}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>

      <View
        style={[
          tw`flex flex-row justify-between items-center `,
          {marginTop: perHeight(3)},
        ]}>
        <View style={tw`flex flex-row justify-between items-center`}>
          <View style={[tw``, {}]}>
            <Image
              resizeMode="cover"
              style={{
                width: perWidth(26),
                height: perWidth(26),
                borderRadius: perWidth(25) / 2,
              }}
              source={images.location}
            />
          </View>

          <View
            style={[tw`ml-1`, {width: perWidth(80), marginTop: perWidth(1)}]}>
            <Textcomp
              text={'2Km away'}
              size={12}
              lineHeight={14}
              color={colors.primary}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View
          style={[
            tw`ml-auto  items-end`,
            {width: perWidth(80), marginTop: perWidth(1)},
          ]}>
          <Rating
            type="custom"
            ratingImage={images.star2}
            ratingColor="white"
            ratingBackgroundColor="transparent"
            ratingCount={5}
            imageSize={10}
            onFinishRating={() => {}}
            style={{paddingVertical: 10}}
            showRating={false}
            readonly={true}
            startingValue={2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ServiceCard2;
