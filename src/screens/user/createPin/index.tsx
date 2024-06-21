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
import {getUser, verifyPhoneNumber} from '../../../utils/api/func';
import {addUserData} from '../../../store/reducer/mainSlice';
type Route = {
  key: string;
  name: string;
  params: {
    email: string;
  };
};
const CreatePin = ({navigation}: any) => {
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
  const initGetUsers = async () => {
    // setisLoading(true);
    const res: any = await getUser('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
      // }
      // setisLoading(false);
    }
  };
  const veriFyOTP = async () => {
    try {
      setisLoading(true);
      if (code.length < 6) {
        Alert.alert('Alert!!', 'Enter a valid OTP.');
        return;
      }
      const loginData = {
        otp: code,
      };
      const res = await verifyPhoneNumber(loginData);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('CreatePinPage');
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
    } catch (error) {
    } finally {
      await initGetUsers();
    }
  };
  const resetCountdown = () => {
    setSeconds(30); // Reset the countdown time
    setResendPressed(false); // Reset the resendPressed state
  };
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
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondss = seconds % 60;
  const condition: number = 10;
  const valueOfMint = secondss < condition ? `0${secondss}` : secondss;
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
              text={'Verify Phone number'}
              size={16}
              lineHeight={19}
              color={colors.black}
              fontFamily={'Inter-Bold'}
            />
            <View style={tw`mt-2`}>
              <Textcomp
                text={
                  'To enhance the security of your account, please verify your phone number. Enter the OTP sent to your phone number'
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
              style={{width: '87.5%', height: 200}}
              pinCount={6}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code: any) => {
                setCode(code);
              }}
              //   onCodeFilled={setCode}
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
              marginTop: 24,
            }}>
            <Text style={{color: '#3A3A3A', alignSelf: 'center'}}>
              Resend code in{' '}
            </Text>
            {seconds === 0 && (
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  resendOTP();
                }}>
                <Text style={{color: colors.primary}}>Resend</Text>
              </TouchableOpacity>
            )}
            {seconds !== 0 && (
              <Text
                style={{
                  color: colors.black,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {'0' + minutes + ':' + valueOfMint}
              </Text>
            )}
          </View>

          {!isLoading ? (
            <View style={{}}>
              <Button
                onClick={() => {
                  veriFyOTP();
                }}
                text={'Proceed'}
                textStyle={{color: '#fff'}}
                style={{
                  backgroundColor: colors.parpal,
                  marginHorizontal: 25,
                  marginTop: 152,
                }}
                disable={code.length < 6}
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

export default CreatePin;
