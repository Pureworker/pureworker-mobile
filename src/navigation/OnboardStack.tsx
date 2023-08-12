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

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator initialRouteName="OnBoarding1">
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
    </Stack.Navigator>
  );
}
