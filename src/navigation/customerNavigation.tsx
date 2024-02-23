import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Home from '../screens/Home';
import Home from '../screens/user/Home';
import TermAndCondition from '../screens/TermAndCondition';
import FAQ from '../screens/FAQ';
import ProfileStep1 from '../screens/profile/ProfileStep1';
import PRofileStep2 from '../screens/profile/ProfileStep2';
import ProfileStep3 from '../screens/profile/ProfileStep3';
import ProfileStep4 from '../screens/profile/ProfileStep4';
import ProfileStep5 from '../screens/profile/ProfileStep5';
import DrawerMenu from './drawerMenu';
import Services from '../screens/user/services';
import _Services from '../screens/user/_services';
import CloseToYou from '../screens/user/closeToYou';
import ServiceProviderProfile from '../screens/user/serviceProviderProfile';
import OrderDetails from '../screens/user/orderDetails';
import OrderReview from '../screens/user/orderReview';
import PaymentConfirmed from '../screens/user/paymentConfirmed';
import PaymentMethod from '../screens/user/paymentMethod';
import TransactionHistory from '../screens/user/transactionHistory';
import FundingHistory from '../screens/user/fundingHistory';
import PaymentMethod2 from '../screens/user/paymentMethod2';
import BecomeAServiceProvider from '../screens/user/becomeAServiceProvider';
import ViewLocation from '../screens/user/viewLocation';
import EditAccount from '../screens/user/editAccount';
import TipServiceProvider from '../screens/user/TipServiceProvider';
import OrderActive from '../screens/user/orderActive';
import Inbox from '../screens/user/chat/inbox';
import Withdraw from '../screens/user/withdraw';
import FaceDetection from '../screens/faceDetection';
// import HelloWorldView from '../tracking/TrackView';

const Stack = createNativeStackNavigator();

export default function CustomerNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homes"
        component={DrawerMenu}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="TermAndCondition"
        component={TermAndCondition}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQ}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ListServices"
        component={Services}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="CloseToYou"
        component={CloseToYou}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="_Services"
        component={_Services}
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
      <Stack.Screen
        name="ServiceProviderProfile"
        component={ServiceProviderProfile}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="OrderReview"
        component={OrderReview}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="PaymentConfirmed"
        component={PaymentConfirmed}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="PaymentMethod2"
        component={PaymentMethod2}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="FundingHistory"
        component={FundingHistory}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="BecomeAServiceProvider"
        component={BecomeAServiceProvider}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="ViewLocation"
        component={ViewLocation}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="TipServiceProvider"
        component={TipServiceProvider}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="OrderActive"
        component={OrderActive}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="FaceDetection"
        component={FaceDetection}
        options={{headerShown: false, animationEnabled: false}}
      />
      {/* <Stack.Screen
        name="Tracking"
        component={HelloWorldView}
        options={{headerShown: false, animationEnabled: false}}
      /> */}
    </Stack.Navigator>
  );
}
