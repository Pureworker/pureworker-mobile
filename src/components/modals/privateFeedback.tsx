import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';

export default function PrivateFeedback({navigation, visible, func}: any) {
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
        <View style={tw`h-[50%]  mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Private Feedback(optional)'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={
                  'How was your overall experience with this service provider? This is a personal message to the service provider. It won’t be public.'
                }
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-4 flex flex-row w-[60%] justify-between mx-auto`, {}]}>
              <Image source={images.profile} style={[tw``, {width: 40, height: 40}]} />
              <Image source={images.profile} style={[tw``, {width: 40, height: 40}]} />
              <Image source={images.profile} style={[tw``, {width: 40, height: 40}]} />
            </View>
            <View style={[tw`px-[7.5%] mt-4`, {}]}>
              <TextInput multiline style={[tw`bg-[#EBEBEB] px-4 rounded-lg`,  {height: perHeight(80)}]} />
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
