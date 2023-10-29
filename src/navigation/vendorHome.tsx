import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// onboarding
import Signup from '../screens/Signup';
import PRofileStep1 from '../screens/profile/ProfileStep1';
import ProfileStep3 from '../screens/profile/ProfileStep3';
import PRofileStep2 from '../screens/profile/ProfileStep2';
import ProfileStep4 from '../screens/profile/ProfileStep4';
import ProfileStep5 from '../screens/profile/ProfileStep5';
import ProfileStep1 from '../screens/profile/ProfileStep1';
import Home from '../screens/vendor/Home';
import ProfileStep21 from '../screens/profile/profileStep21';

const Stack = createNativeStackNavigator();

export default function VendorHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Index"
        component={Home}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ProfileStep1"
        component={ProfileStep1}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ProfileStep2"
        component={PRofileStep2}
        options={{headerShown: false, animationEnabled: false}}
      />
            <Stack.Screen
        name="ProfileStep21"
        component={ProfileStep21}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ProfileStep3"
        component={ProfileStep3}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ProfileStep4"
        component={ProfileStep4}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ProfileStep5"
        component={ProfileStep5}
        options={{headerShown: false, animationEnabled: false}}
      />
    </Stack.Navigator>
  );
}
