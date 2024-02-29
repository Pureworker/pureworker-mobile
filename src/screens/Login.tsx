import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import images from '../constants/images';
import TextInputs from '../components/TextInputs';
import commonStyle from '../constants/commonStyle';
import Button from '../components/Button';
import Snackbar from 'react-native-snackbar';
import MyStatusBar from '../components/MyStatusBar';
import colors from '../constants/colors';
import { validateEmail } from '../constants/utils';
import { StackNavigation } from '../constants/navigation';
import { signIn } from '../utils/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [seconds, setSeconds] = useState(30);
  const navigation = useNavigation<StackNavigation>();
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
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      } else {
        const loginData = {
          email: email.toLowerCase().trim(),
        };
        const res:any = await signIn(loginData);

        if (res?.status === 200 || res?.status === 201) {
          navigation.navigate('TokenVerification', {
            email: email,
            type: 'login',
          });
        } else {
          if (
            res?.error?.message === 'Account has not been verified' ||
            res?.error?.data?.message === 'Account has not been verified'
          ) {
            Snackbar.show({
              text: 'Signup Process Incomplete. Please verify your email.',
              duration: Snackbar.LENGTH_LONG,
              textColor: '#fff',
              backgroundColor: '#88087B',
            });
            await AsyncStorage.setItem(
              'AuthToken2',
              `${res?.error?.error?.data}`,
            );
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
              duration: Snackbar.LENGTH_LONG,
              textColor: '#fff',
              backgroundColor: '#88087B',
            });
          }
        }
        setisLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
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
