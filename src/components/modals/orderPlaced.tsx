import {View, TouchableOpacity, Image, TextInput, Platform} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';

export default function OrderPlaced({navigation, visible, func, item}: any) {
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
        <View
          style={tw`h-[${
            Platform.OS === 'ios' ? '30.5%' : '35%'
          }] mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Order Placed'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-2.5`, {}]}>
              <Textcomp
                text={`Job Description: ${item?.description}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-2.5`, {}]}>
              <Textcomp
                text={`Scheduled Delivery: ${item?.scheduledDeliveryDate}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-2.5`, {}]}>
              <Textcomp
                text={`Location: ${item?.location}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-2.5`, {}]}>
              <Textcomp
                text={`Address: ${item?.address}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-2.5`, {}]}>
              <Textcomp
                text={`Price: ₦ ${item?.totalPrice}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
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
