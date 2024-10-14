import { Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SIZES, perHeight, perWidth } from '../../utils/position/sizes';
import React, { useState } from 'react';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import Review from '../Review';
import FastImage from 'react-native-fast-image';
import { metersToKilometers } from '../../utils/utils';
import Modal from 'react-native-modal/dist/modal';
import VerifiedTag from '../../assets/svg/verifiedtag';
import socket from '../../utils/socket';

const PairedCustomers = ({ item, index, navigation }: any) => {
  // console.log('close-order', item?.isIdentityVerified);
  const [showModal, setshowModal] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          socket.connect();
          // setInfoModal(false);
          console.log('ERRRRRRRRRRRRR', item);
          navigation.navigate('Inbox', {
            id: item?.user._id,
            name: item?.user.firstName,
          });
        }}
        style={[
          tw` mt-2 items-center border-[#FFC727] justify-between bg-[${colors.darkPurple}]`,
          {
            // height: perWidth(140),
            // width: 'auto',
            borderWidth: 3,
            borderRadius: 14,
            marginLeft: index === 0 ? 10 : 3,
            paddingHorizontal: perWidth(12),
            paddingVertical: perWidth(8),
          },
        ]}>
        <View style={tw`flex flex-row `}>
          <View style={[tw``]}>
            <View
              style={[tw`flex flex-row items-center justify-center`, { width: perWidth(105) }]}>
              {item?.isIdentityVerified && <VerifiedTag />}
              <Textcomp
                text={
                  item?.user.firstName
                    ? `${item?.user.firstName} ${item?.user.lastName}.`
                    : `${item?.fullName}`
                }
                size={12}
                lineHeight={14}
                numberOfLines={1}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View
              style={[tw`flex flex-row gap-1`, { marginTop: perHeight(4) }]}>
              <Textcomp
                text={'Service:'}
                size={12}
                lineHeight={12}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={1}
              />
              <Textcomp
                text={item?.service?.name ?? ''}
                size={12}
                lineHeight={12}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={1}
              />
            </View>
          </View>

        </View>
        <TouchableOpacity
          onPress={() => {
            socket.connect();
            // setInfoModal(false);
            console.log('ERRRRRRRRRRRRR', item);
            navigation.navigate('Inbox', {
              id: item?.user._id,
              name: item?.user.firstName,
            });
          }}
          style={[
            tw`bg-[#FFCD1E] mx-auto items-center justify-center mt-2`,
            {
              width: '100%',
              height:
                Platform.OS === 'ios' ? perHeight(25) : perHeight(25),
              borderRadius: 7,
              // marginTop: perHeight(10),
            },
          ]}>
          <Textcomp
            text={'Chat'}
            size={Platform.OS === 'ios' ? 14 : 13}
            lineHeight={16}
            color={colors.black}
            fontFamily={'Inter-Medium'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
};

export default PairedCustomers;
