import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';

import TextInputs from '../components/TextInputs';
import {useDispatch} from 'react-redux';
import commonStyle from '../constants/commonStyle';
import Button from '../components/Button';
import Snackbar from 'react-native-snackbar';
import MyStatusBar from '../components/MyStatusBar';
import {useLoginMutation} from '../store/slice/api';
import colors from '../constants/colors';
import {validateEmail} from '../constants/utils';
import {StackNavigation} from '../constants/navigation';
import {signIn} from '../utils/api/auth';

const {width, height} = Dimensions.get('screen');

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [seconds, setSeconds] = useState(30);

  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  // const [login, {isLoading}] = useLoginMutation();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleLogin = async () => {
    setisLoading(true);
    if (email) {
      if (!validateEmail(email)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      } else {
        const loginData = {
          email: email.toLowerCase().trim(),
          // password: password,
        };
        const res = await signIn(loginData);

        if (res?.status === 200 || res?.status === 201) {
          navigation.navigate('TokenVerification', {
            email: email,
            type: 'login',
          });
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
        // login(loginData).unwrap()
        //   .then((data: any) => {
        //     if (data) {
        //       navigation.navigate('TokenVerification', { email: email })
        //     }
        //   })
        //   .catch((error: any) => {
        //     console.log('err', error);
        // Snackbar.show({
        //   text: error.data.message, duration: Snackbar.LENGTH_SHORT, textColor: '#fff', backgroundColor: '#88087B',
        // });
        //   });
        setisLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        backgroundColor: '#000',
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={images.cross}
          style={{
            height: 20,
            width: 20,
            marginLeft: 25,
            marginBottom: 10,
            marginTop:
              Platform.OS === 'ios'
                ? 20
                : StatusBar.currentHeight && StatusBar.currentHeight + 40,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <ScrollView>
        <MyStatusBar
          translucent
          barStyle="light-content"
          backgroundColor="#000"
        />
        <View style={{flex: 1}}>
          <View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: 36,
                  fontFamily: commonStyle.fontFamily.bold,
                  color: '#fff',
                  marginTop: 65,
                  marginLeft: 25,
                }}>
                Login
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 5,
                  marginLeft: 25,
                }}>
                Input your email to log in
              </Text>
            </View>
            <View style={{marginHorizontal: 25}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 60,
                }}>
                Email
              </Text>
              <TextInputs
                style={{marginTop: 10}}
                labelText={'Enter Email'}
                state={email}
                setState={text => {
                  setEmail(text?.trim());
                }}
                keyBoardType={'email-address'}
              />
            </View>
          </View>
          {!isLoading ? (
            <View style={{marginHorizontal: 25, marginTop: 75}}>
              <Button
                onClick={() => {
                  handleLogin();
                }}
                text={'Login'}
              />
            </View>
          ) : (
            <ActivityIndicator
              style={{marginTop: 95}}
              size={'large'}
              color={colors.parpal}
            />
          )}
          <Text
            style={{
              fontSize: 13,
              marginTop: 16,
              textAlign: 'center',
              color: '#fff',
              fontFamily: commonStyle.fontFamily.regular,
            }}>
            Don’t have an account?{' '}
            <Text
              onPress={() => navigation.navigate('CustomerSignup')}
              style={{
                fontSize: 13,
                textDecorationLine: 'underline',
                color: colors.primary,
                fontFamily: commonStyle.fontFamily.regular,
              }}>
              Register
            </Text>
          </Text>
        </View>
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
