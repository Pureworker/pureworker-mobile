import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import socket from '../../utils/socket';

export default function OrderInProgress({
  navigation,
  visible,
  func,
  item,
}: any) {
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
        <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
        <View style={[tw`h-[33.5%] mt-auto bg-[#D9D9D9]`,{marginBottom: -20}]}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Order In Progress'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={'Your order is currently in progress.'}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                func(false);
                socket.connect();
                navigation.navigate('Inbox', {
                  id: item?.serviceProvider?._id,
                  name: `${item?.serviceProvider?.firstName} ${item?.serviceProvider?.lastName}`,
                });
              }}
              style={[
                {
                  width: perWidth(315),
                  height: perHeight(40),
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 50,
                },
                tw`mx-auto`,
              ]}>
              <Textcomp
                text={'Contact Service Provider'}
                size={14}
                lineHeight={17}
                color={'#FFC727'}
                fontFamily={'Inter-Bold'}
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
