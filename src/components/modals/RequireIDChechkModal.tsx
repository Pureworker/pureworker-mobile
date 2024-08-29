import {View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import images from '../../constants/images';
import {SIZES, perHeight} from '../../utils/position/sizes';
import Modal from 'react-native-modal';
// import WelcomeImage from '../assets/svg/welcome';
import {useSelector} from 'react-redux';
import Textcomp from '../Textcomp';

export default function RequireIDChechkModal({close, navigation}: any) {
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const [show] = useState(true);
  const list = [
    {
      title: 'Create an Account',
    },
    {
      title: 'Find a Service',
    },
    {
      title: 'Choose a Service Provider',
    },
    {
      title: 'Hire',
    },
    {
      title: 'Wait for the Completion of the Job',
    },
    {
      title: 'Rate and Review',
    },
  ];
  return (
    <Modal
      isVisible={show}
      onModalHide={() => {}}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}>
      <View
        style={[tw`bg-[#EBEBEB] w-9/10 mx-auto  p-4 pb-8`, {borderRadius: 20}]}>
        {/* <View style={tw`mx-auto`}>
          <WelcomeImage />
        </View> */}
        <View style={[tw`mx-auto`]}>
          <View style={[tw` mt-1`]}>
            <Textcomp
              text={'Verify Your Identity'}
              size={16}
              lineHeight={20}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View style={[tw`mx-auto mt-2`]}>
            <Textcomp
              text={
                "To enhance your Pureworker experience and ensure secure transactions, we kindly request you to complete your profile verification. This simple process involves taking a selfie and uploading your NIN or BVN. By verifying your identity, you'll enjoy faster transactions and increased credibility."
              }
              size={13}
              lineHeight={18}
              color={'#000413'}
              fontFamily={'Inter-Regular'}
              style={{
                textAlign: 'left',
              }}
            />
          </View>
        </View>
        <View style={[tw`mr-auto mt-4 flex flex-row justify-between`]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PhotoUploadScreen');
              close();
            }}
            style={[
              tw`bg-[#88087B] items-center py-3 rounded-lg`,
              {width: SIZES.width * 0.375},
            ]}>
            <Textcomp
              text={'Verify now'}
              size={13}
              lineHeight={14}
              color={'#FFFFFF'}
              fontFamily={'Inter-Bold'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              close();
            }}
            style={[
              tw`border border-[#88087B] items-center py-3 ml-3 rounded-lg`,
              {width: SIZES.width * 0.375},
            ]}>
            <Textcomp
              text={'Remind me later'}
              size={13}
              lineHeight={14}
              color={'#000000'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          onPress={() => {
            close();
          }}
          style={tw`absolute right-0 top-[-2]`}>
          <Image
            resizeMode="contain"
            source={images.cancelCircle}
            style={{
              width: 30,
              height: 30,
              tintColor: '#000413',
              marginLeft: 5,
            }}
          />
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
}
