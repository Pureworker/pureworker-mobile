import React, {useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Modal from 'react-native-modal/dist/modal';
import {triggerPhoneVerification} from '../../utils/api/func';
import {ToastShort} from '../../utils/utils';

export default function WalletModal({
  onClose,
  onClose2,
  navigation,
  visible,
}: any) {
  const [isLoading, setisLoading] = useState(false);
  const initPhoneOtp = async () => {
    setisLoading(true);
    const res: any = await triggerPhoneVerification('');
    console.log('tttttt', res);
    if (res?.status === 201 || res?.status === 200) {
      // dispatch(addUserData(res?.data?.user));

      navigation.navigate('CreatePin');
      onClose();
      ToastShort('Otp sent!.');
    }
    if (res?.status === 400) {
      console.log(res?.error);
      ToastShort(`Error: ${res?.error?.message}`);
    }
    setisLoading(false);
  };
  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        onClose();
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => onClose()} style={tw`flex-1`} />
        <View
          style={[
            tw`  items-center mt-auto bg-[#D9D9D9] `,
            {
              marginBottom: Platform.OS === 'ios' ? -20 : 0,
              height: Platform.OS === 'ios' ? '27.5%' : '28%',
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View style={tw` mt-6`}>
            <Textcomp
              text={'Create Transaction Pin'}
              size={14}
              lineHeight={17}
              color={'#000000'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>

          <View style={tw` w-9/10 mt-4`}>
            <Textcomp
              text={
                'Creating a transaction PIN is essential for protecting your account from unauthorized transactions.'
              }
              size={12}
              lineHeight={18}
              color={'#3A3A3A'}
              fontFamily={'Inter-Regular'}
              style={tw`text-center`}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              initPhoneOtp();
              // navigation.navigate('CreatePin');
              // onClose();
            }}
            style={[
              {
                width: perWidth(316),
                height: perHeight(40),
                borderRadius: 13,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.parpal,
                marginTop: 20,
              },
              tw`mx-auto`,
            ]}>
            <Textcomp
              text={'Continue'}
              size={14}
              lineHeight={17}
              color={'#FFFFFF'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
