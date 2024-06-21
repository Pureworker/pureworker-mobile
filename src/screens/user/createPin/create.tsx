import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Button from '../../../components/Button';
import colors from '../../../constants/colors';
import Textcomp from '../../../components/Textcomp';
import images from '../../../constants/images';
import {verifyLogin} from '../../../utils/api/auth';
import {ToastShort} from '../../../utils/utils';
import { CreatePin } from '../../../utils/api/func';
type Route = {
  key: string;
  name: string;
  params: {
    email: string;
  };
};
const CreatePinPage = ({navigation}: any) => {
  const route: Route = useRoute();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(30);
  const [isLoading, setisLoading] = useState(false);
  const [resendPressed, setResendPressed] = useState(false);
  const resendOTP = async () => {
    setLoading(true);
    const param = {
      email: route.params?.email?.toLowerCase(),
      type: route.params?.type === 'login' ? 'signin' : 'signup',
    };
    try {
      console.log('Before resendOTP API call');
      const res = await resendOtp(param);
      console.log('After resendOTP API call', res);
      if ([200, 201].includes(res?.status)) {
        ToastShort('OTP has been sent to your email');
      } else {
        Toast.show({
          type: 'error',
          text1: `${
            res?.error?.message
              ? res?.error?.message
              : 'Oops! An error occurred!'
          } 🚀. `,
        });
      }
    } catch (error) {
      console.error('Error requesting otp resend:', error);
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred 🚀.',
      });
    } finally {
      setLoading(false);
    }
  };
  const veriFyOTP = async () => {
    // navigation.navigate('CreatePinSuccess');
    setisLoading(true);
    if (code.length < 4) {
      Alert.alert('Alert!!', 'Enter a valid Transaction Pin.');
      return;
    }
    const loginData = {
      pin: code,
      confirmPin: code,
    };
    const res = await CreatePin(loginData);
    if (res?.status === 200 || res?.status === 201) {
      navigation.navigate('CreatePinSuccess');
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: '#EBEBEB'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{height: 25, width: 25, tintColor: 'black'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Create Pin'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View style={tw`mx-4 mt-8`}>
            <Textcomp
              text={'Create a transaction Pin'}
              size={16}
              lineHeight={19}
              color={colors.black}
              fontFamily={'Inter-Bold'}
            />
            <View style={tw`mt-2`}>
              <Textcomp
                text={
                  'Creating a transaction PIN is essential for protecting your account from unauthorized transactions.'
                }
                size={12}
                lineHeight={14.5}
                color={'#3A3A3A'}
                fontFamily={'Inter-Regular'}
              />
            </View>
          </View>

          <View style={tw`mx-auto  items-center  mt-4`}>
            <OTPInputView
              style={{width: '67.5%', height: 200}}
              pinCount={4}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code: any) => {
                setCode(code);
              }}
              //   onCodeFilled={setCode}
            />
          </View>

          {!isLoading ? (
            <View style={{}}>
              <Button
                onClick={() => {
                  veriFyOTP();
                }}
                text={'Create Pin'}
                textStyle={{color: '#fff'}}
                style={{
                  backgroundColor: colors.parpal,
                  marginHorizontal: 25,
                  marginTop: 52,
                }}
                disable={code.length < 4}
              />
            </View>
          ) : null}
          {isLoading && <ActivityIndicator color={'white'} size={'small'} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  bordernohighlight: {
    borderColor: colors.primary,
    borderWidth: 1,
  },

  borderStyleHighLighted: {
    borderColor: colors.primary,
  },
  underlineStyleBase: {
    height: 56,
    width: 51,
    fontSize: 32,
    borderRadius: 8,
    borderWidth: 1,
    color: 'black',
    backgroundColor: '#D9D9D9',
    fontWeight: '600',
    borderColor: '#D9D9D9',
  },
  underlineStyleHighLighted: {
    borderColor: '#88087B',
  },
});

export default CreatePinPage;
