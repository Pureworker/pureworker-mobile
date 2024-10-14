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
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal/dist/modal';
import VerifiedTag from '../../assets/svg/verifiedtag';
import socket from '../../utils/socket';

const PairedCustomers4 = ({ item, index, navigation }: any) => {
  const [showModal, setshowModal] = useState(false);

  // console.log('closetoyouitem:', item?.profilePic);

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
          tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
          {
            // height: perWidth(135),
            width: SIZES.width * 0.95,
            borderWidth: 0,
            borderRadius: 5,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-col `}>
          <View
            style={[tw`flex flex-row gap-1`, { width: perWidth(105), marginTop: perHeight(4) }]}>
            <Textcomp
              text={'Name:'}
              size={12}
              lineHeight={12}
              color={colors.primary}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={1}
            />
            <Textcomp
              text={`${item?.user?.firstName} ${item?.user?.lastName}` ?? ''}
              size={12}
              lineHeight={12}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={1}
            />
          </View>
          <View
            style={[tw`flex flex-row gap-1`, { width: perWidth(105), marginTop: perHeight(4) }]}>
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
          <View style={tw`flex flex-row justify-end relative mt-10 `}>
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
                  width: 'auto',
                  height:
                    Platform.OS === 'ios' ? perHeight(25) : perHeight(25),
                  borderRadius: 7,
                  paddingHorizontal: perWidth(20),
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  right: 0,
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
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default PairedCustomers4;
