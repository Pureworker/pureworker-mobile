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
import DrawerMenu from './drawerMenu2';
import EditServices from '../screens/vendor/editService';
import TransactionHistory from '../screens/user/transactionHistory';
import AddServices from '../screens/vendor/addServices';
import Congratulations from '../screens/profile/congratulations';
// import Withdraw from '../screens/vendor/withdraw';
import Inbox from '../screens/user/chat/inbox';
import _Services from '../screens/vendor/_services';
import Withdraw from '../screens/user/withdraw';

const Stack = createNativeStackNavigator();

export default function VendorNavigation() {
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
      {/* <Stack.Screen
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
      /> */}
      <Stack.Screen
        name="Congratulations"
        component={Congratulations}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="EditService"
        component={EditServices}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="AddServices"
        component={AddServices}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="_VServices"
        component={_Services}
        options={{headerShown: false, animationEnabled: false}}
      />
    </Stack.Navigator>
  );
}