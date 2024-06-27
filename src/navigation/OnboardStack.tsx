import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// onboarding
import Login from '../screens/Login';
import OnBoarding from '../screens/OnBoarding';
// home
import TokenVerification from '../screens/TokenVerification';
import BusinessSignup from '../screens/BusinessSignup';
import CustomerSignup from '../screens/CustomerSignup';
import Signup from '../screens/Signup';
import Register from '../screens/register';
import WaitingList from '../screens/waitingList';
import SelectCountry from '../screens/SelectCountry';
import {useSelector} from 'react-redux';
import {ActivityIndicator, View} from 'react-native';
import colors from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  const language = useSelector((state: any) => state.user.language);
  if (language === undefined) {
    console.log('====Language undefined====');
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <ActivityIndicator size="large" color={colors.parpal} />
      </View>
    );
  }
  if (language === null) {
    return (
      <Stack.Navigator
        // initialRouteName={'SelectCountry'}
        initialRouteName="OnBoarding1"
      >
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="BusinessSignup"
          component={BusinessSignup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="CustomerSignup"
          component={CustomerSignup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="OnBoarding1"
          component={OnBoarding}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="TokenVerification"
          component={TokenVerification}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="waitingList"
          component={WaitingList}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="SelectCountry"
          component={SelectCountry}
          options={{headerShown: false, animationEnabled: false}}
        />
      </Stack.Navigator>
    );
  }
  if (language !== null) {
    return (
      <Stack.Navigator
        initialRouteName={'OnBoarding1'}
        // initialRouteName="OnBoarding1"
      >
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="BusinessSignup"
          component={BusinessSignup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="CustomerSignup"
          component={CustomerSignup}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="OnBoarding1"
          component={OnBoarding}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="TokenVerification"
          component={TokenVerification}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="waitingList"
          component={WaitingList}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="SelectCountry"
          component={SelectCountry}
          options={{headerShown: false, animationEnabled: false}}
        />
      </Stack.Navigator>
    );
  }
}
