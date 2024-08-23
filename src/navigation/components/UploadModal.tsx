import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal/dist/modal';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import tw from 'twrnc';
import colors from '../../constants/colors';
import Textcomp from '../../components/Textcomp';

export default function UploadModal({
  visible,
  OnClose,
  takePhoto,
  pickGallery,
}: any) {
  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        OnClose();
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => OnClose()} style={tw`flex-1`} />

        <View
          style={[
            tw`h-[25%]   items-center mt-auto bg-[#D9D9D9]`,
            {marginBottom: -20},
          ]}>
          <TouchableOpacity
            onPress={() => {
              OnClose();
            }}
            style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
          />
          <TouchableOpacity
            onPress={() => {
              takePhoto();
            }}
            style={{
              width: perWidth(316),
              height: perHeight(40),
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.darkPurple,
              marginTop: 18,
            }}>
            <Textcomp
              text={'Open Camera'}
              size={14}
              lineHeight={17}
              color={'#FFC727'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              pickGallery();
            }}
            style={{
              width: perWidth(316),
              height: perHeight(40),
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.darkPurple,
              marginTop: 10,
            }}>
            <Textcomp
              text={'Choose from Gallery'}
              size={14}
              lineHeight={17}
              color={'#FFC727'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
