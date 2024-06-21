import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Modal from 'react-native-modal/dist/modal';
import {addUserData} from '../../store/reducer/mainSlice';
import {getUser} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import socket from '../../utils/socket';
import {formatAmount2} from '../../utils/validations';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export default function TransPin({onClose, navigation, onSubmit}: any) {
  const [_code, setCode] = useState('');
  return (
    <Modal
      isVisible={true}
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
              height: Platform.OS === 'ios' ? '70.5%' : '40%',
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
              text={'Enter Transaction Pin'}
              size={14}
              lineHeight={17}
              color={'#000000'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>

          <View style={tw`mx-auto  items-center `}>
            <OTPInputView
              style={{width: '67.5%', height: 200}}
              pinCount={4}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code: any) => {
                setCode(code);
                onSubmit(code);

              }}
              // onCodeFilled={setCode}
            />
          </View>
          {/* <TouchableOpacity onPress={() => {}} style={tw`ml-auto mr-8`}>
            <Textcomp
              text={'Forgot Pin?'}
              size={14}
              lineHeight={17}
              color={colors.parpal}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity> */}

          {/* <View style={tw` w-9/10 mt-4`}>
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
              navigation.navigate('CreatePin');
              onClose();
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
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  underlineStyleBase: {
    height: 56,
    width: 51,
    fontSize: 32,
    borderRadius: 8,
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    fontWeight: '600',
    borderColor: colors.white,
  },
  underlineStyleHighLighted: {
    borderColor: '#88087B',
  },
});
