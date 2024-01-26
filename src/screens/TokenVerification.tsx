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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import OtpInputs from 'react-native-otp-inputs';
import {useDispatch} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import tw from 'twrnc';
import Loading from '../components/SpinnerScreen';
import Button from '../components/Button';
import colors from '../constants/colors';
import MyStatusBar from '../components/MyStatusBar';
import {
  useCreateOtpMutation,
  useResetOtpMutation,
  useVerifyOtpMutation,
} from '../store/slice/api';
import {loggedIn, setwelcomeModal} from '../store/reducer/mainSlice';
import {resendOtp, verifyLogin, verifyUser} from '../utils/api/auth';
import OtpInputComponent from '../components/OtpInputs';
import {perHeight} from '../utils/position/sizes';
import {updateUserData} from '../utils/api/func';
import Toast from 'react-native-toast-message';
import {ToastShort} from '../utils/utils';
type Route = {
  key: string;
  name: string;
  params: {
    email: string;
  };
};
const TokenVerification = () => {
  const route: Route = useRoute();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const [verification, {isLoading}] = useVerifyOtpMutation();
  const [createOtp] = useCreateOtpMutation();
  const [resetOtp] = useResetOtpMutation();

  const [seconds, setSeconds] = useState(30);
  const [isLoading, setisLoading] = useState(false);
  const [resendPressed, setResendPressed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0) {
      // resetOTP();
    }
  }, [seconds]);
  const resetOTP = () => {
    resetOtp({email: route.params?.email})
      .unwrap()
      .then((data: any) => {})
      .catch((error: any) => {
        console.log('err', error);
        Snackbar.show({
          text: error.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      });
  };
  const resetCountdown = () => {
    setSeconds(30); // Reset the countdown time
    setResendPressed(false); // Reset the resendPressed state
  };
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
        resetCountdown();
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
    setisLoading(true);
    if (code.length < 6) {
      Alert.alert('Alert!!', 'Enter a valid OTP.');
      return;
    }
    const loginData = {
      email: route.params?.email?.toLowerCase(),
      token: code,
    };

    if (route.params?.type === 'login') {
      const res = await verifyLogin(loginData);
      if (res?.status === 200 || res?.status === 201) {
        dispatch(
          loggedIn({
            token: res?.data?.token,
            type: res?.data?.user.accountType?.toUpperCase(),
          }),
        );
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
    } else {
      const res = await verifyUser(code);
      console.log('verify-here', res, 'data:', res?.data?.message);
      if (res?.status === 200 || res?.status === 201) {
        dispatch(
          loggedIn({
            // token: res?.data?.message?.token,
            // type: res?.data?.message?.user?.accountType?.toUpperCase(),
            token: res?.data?.token,
            type: res?.data?.user.accountType?.toUpperCase(),
          }),
        );
        dispatch(setwelcomeModal(true));
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setisLoading(false);
      }
    }
    setisLoading(false);
  };
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondss = seconds % 60;
  const condition: number = 10;
  const valueOfMint = secondss < condition ? `0${secondss}` : secondss;
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <MyStatusBar
        translucent
        barStyle="light-content"
        backgroundColor="#000"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: '#000'}}>
        <Text
          style={{
            fontSize: 27,
            color: '#fff',
            alignSelf: 'center',
            marginTop: 50,
          }}>
          OTP verification
        </Text>
        <Text style={{color: '#fff', alignSelf: 'center', marginTop: 8}}>
          We sent an OTP to your email
        </Text>
        <Text style={{color: '#fff', alignSelf: 'center'}}>
          address!{' '}
          <Text style={{color: colors.primary, alignSelf: 'center'}}>
            {route.params?.email}
          </Text>
        </Text>
        <View style={tw`mx-auto  items-center  mt-4`}>
          <OTPInputView
            style={{width: '87.5%', height: 200}}
            pinCount={6}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              setCode(code);
            }}
            // onCodeFilled={setCode}
          />
        </View>
        {/* <View style={[tw`px-[5%] `, {marginTop: perHeight(50)}]}>
          <OtpInputComponent onTextChange={v => setCode(v)} />
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', alignSelf: 'center', marginTop: 24}}>
            Didn't receive your code?{' '}
          </Text>
          {seconds === 0 && (
            <TouchableOpacity
              style={{marginTop: 25}}
              onPress={() => {
                resendOTP();
              }}>
              <Text style={{color: colors.primary}}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{color: colors.primary, textAlign: 'center'}}>
          {'0' + minutes + ':' + valueOfMint}
        </Text>
        {
          !isLoading ? (
            <View style={{}}>
              <Button
                onClick={() => {
                  veriFyOTP();
                }}
                text={'Submit'}
                textStyle={{color: '#fff'}}
                style={{
                  backgroundColor: colors.parpal,
                  marginHorizontal: 25,
                  marginTop: 152,
                }}
                disable={code.length < 6}
              />
            </View>
          ) : null
          // <ActivityIndicator
          //   style={{marginTop: 332}}
          //   size={'large'}
          //   color={colors.parpal}
          // />
        }
      </ScrollView>
      {isLoading && <Loading />}
    </KeyboardAvoidingView>
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
    backgroundColor: 'white',
    fontWeight: '600',
    borderColor: colors.white,
  },
  underlineStyleHighLighted: {
    borderColor: '#88087B',
  },
});

export default TokenVerification;
