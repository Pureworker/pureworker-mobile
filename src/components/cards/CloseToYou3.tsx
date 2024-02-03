import {Image, TouchableOpacity, View} from 'react-native';
import {perHeight, perWidth} from '../../utils/position/sizes';
import React from 'react';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';

const ClosetoYou3 = ({item, index, navigation}: any) => {
  // console.log('on-order', item);
  function formatDate(dateString: string | number | Date) {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Orders', item)}
      style={[
        tw` mt-4 border-[#FFC727] justify-between bg-[${colors.darkPurple}]`,
        {
          height: perWidth(130),
          width: perWidth(200),
          borderWidth: 3,
          borderRadius: 20,
          marginLeft: index === 0 ? 10 : 3,
          paddingHorizontal: perWidth(16),
          paddingVertical: perWidth(14),
        },
      ]}>
      <View style={tw`flex flex-row `}>
        <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
          {/* <Image
            resizeMode="cover"
            style={{
              width: perWidth(50),
              height: perWidth(50),
              borderRadius: perWidth(50) / 2,
            }}
            source={{uri: item?.profilePicture}}
          /> */}
          <FastImage
            style={[
              tw``,
              {
                width: perWidth(50),
                height: perWidth(50),
                borderRadius: perWidth(50) / 2,
              },
            ]}
            source={{
              uri:
                item?.profilePicture ||
                'https://res.cloudinary.com/dr0pef3mn/image/upload/v1694275934/Assets/1694275933654-Ellipse%2014.png.png',
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />

          <View
            style={[
              tw`absolute bottom-0 border-2 right-1 rounded-full`,
              {width: 8, height: 8, backgroundColor: colors.green},
            ]}
          />
        </View>
        <View style={[tw``, {marginLeft: perWidth(12)}]}>
          <View style={[tw``, {}]}>
            <Textcomp
              text={
                item?.user?.businessName
                  ? item?.user?.businessName
                  : `${item?.user?.firstName} ${item?.user?.lastName?.charAt(
                      0,
                    )}.`
              }
              size={12}
              lineHeight={14}
              color={colors.primary}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View style={[tw``, {width: perWidth(105), marginTop: perHeight(4)}]}>
            <Textcomp
              text={item?.description}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={2}
            />
          </View>
          <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
            <Textcomp
              // text={`$${price[0]?.priceMax ? price[0]?.priceMax : 0}/hr`}
              text={`₦ ${item?.totalPrice}`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
      </View>

      <View
        style={[
          tw`flex flex-row justify-between items-center `,
          {marginTop: perHeight(3)},
        ]}>
        <View style={tw`flex flex-row items-center`}>
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
            style={[tw`ml-1`, {width: perWidth(70), marginTop: perWidth(1)}]}>
            <Textcomp
              text={item?.address}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={[tw``, {width: perWidth(70), marginTop: perWidth(1)}]}>
          <Textcomp
            text={formatDate(item?.createdAt)}
            size={11}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-Medium'}
          />
        </View>
        {/*  <StarRating
          style={{width: perWidth(40)}}
          starStyle={{marginHorizontal: 0}}
          maxStars={5}
          starSize={10}
          rating={4}
          onChange={() => {}}
        /> */}
      </View>
      {/* <View
      style={[
        tw` flex-1`,
        {borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
      ]}>
      <View style={[tw``, {marginLeft: 10, marginTop: perHeight(6)}]}>
        <Textcomp
          text={'Plumbing'}
          size={12}
          lineHeight={14}
          color={colors.white}
          fontFamily={'Inter-SemiBold'}
        />
      </View>
    </View> */}
    </TouchableOpacity>
  );
};

export default ClosetoYou3;
