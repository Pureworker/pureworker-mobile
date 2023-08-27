import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import Review from '../Review';
import Review2 from '../Review2';

export default function RateyourExperience({navigation, visible, func}: any) {
  const [InfoModal, setInfoModal] = useState(visible);
  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        func(false);
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}
      onBackdropPress={() => func(false)}
      swipeThreshold={200}
      swipeDirection={['down']}
      onSwipeComplete={() => func(false)}
      onBackButtonPress={() => func(false)}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity
          onPress={() => func(false)}
          style={tw`flex-1`}
        />
        <View style={tw`h-[70%] mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Rate your Experience'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={
                  'Please rate your and describe your experience. Your answer will help other buyers to communicate with the service provider.  '
                }
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={[
                tw`px-[7.5%] mt-4 flex flex-col justify-between `,
                {},
              ]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Rate your Experience'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2 value={3} />
            </View>
            <View
              style={[
                tw`px-[7.5%] mt-4 flex flex-col justify-between `,
                {},
              ]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Recommend to a Friend'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2 value={3} />
            </View>
            <View
              style={[
                tw`px-[7.5%] mt-4 flex flex-col justify-between `,
                {},
              ]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Service as Described'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2 value={3} />
            </View>
            <View style={[tw`px-[7.5%] mt-4`, {}]}>
              <TextInput
                multiline
                style={[
                  tw`bg-[#EBEBEB] px-4 rounded-lg`,
                  {height: perHeight(60)},
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                func(false);
              }}
              style={[
                {
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 20,
                },
                tw`mx-auto`,
              ]}>
              <Textcomp
                text={'Done'}
                size={14}
                lineHeight={17}
                color={'#FFC727'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              tw`bg-black mt-auto mb-4`,
              {height: 2, width: WIDTH_WINDOW * 0.95},
            ]}
          />
        </View>
      </View>
    </Modal>
  );
}
