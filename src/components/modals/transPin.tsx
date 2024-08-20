import React, {useState} from 'react';
import {View, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Modal from 'react-native-modal/dist/modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import OtpInputComponent from '../OtpInputs';

export default function TransPin({onClose, onSubmit}: any) {
  const [_code, setCode] = useState('');

  return (
    <Modal
      isVisible={true}
      onModalHide={() => {
        onClose();
      }}
      avoidKeyboard={true}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => onClose()} style={tw`flex-1`} />
        <View
          style={[
            tw`  items-center mt-auto bg-[#D9D9D9] `,
            {
              marginBottom: Platform.OS === 'ios' ? -20 : -20,
              height: Platform.OS === 'ios' ? '80.5%' : '80%',
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

          {/* <View style={tw`mx-auto  items-center `}>
            <OTPInputView
              style={{width: '67.5%', height: 200}}
              pinCount={4}
              autoFocusOnLoad={true}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code: any) => {
                setCode(code);
                onSubmit(code);
              }}
              // onCodeFilled={setCode}
            />
          </View> */}

          <View style={tw`mx-auto mt-8 items-center w-4/5`}>
            <OtpInputComponent
              numberOfDigits={4}
              onTextChange={v => setCode(v)}
              onFilled={(text) => {
                console.log(text);
                
                onSubmit(text);
              }}
            />
          </View>

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
