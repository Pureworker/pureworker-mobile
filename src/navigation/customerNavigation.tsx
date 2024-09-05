import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TermAndCondition from '../screens/TermAndCondition';
import FAQ from '../screens/FAQ';
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
import {useInitialData} from './initialData';
import CreatePin from '../screens/user/createPin';
import CreatePinPage from '../screens/user/createPin/create';
import CreatePinSuccess from '../screens/user/createPin/success';
import SpinToWinScreen from '../screens/user/pureworkercoins/SpinToWinScreen';
import ProductDisplay from '../screens/user/postjobs/ProductDisplay';
import MyJobs from '../screens/user/postjobs/MyJobs';
// import HelloWorldView from '../tracking/TrackView';

const Stack = createNativeStackNavigator();

export default function CustomerNavigation() {
  useInitialData();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homes"
        component={DrawerMenu}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="TermAndCondition"
        component={TermAndCondition}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQ}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="ListServices"
        component={Services}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="CloseToYou"
        component={CloseToYou}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="_Services"
        component={_Services}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="ServiceProviderProfile"
        component={ServiceProviderProfile}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="OrderReview"
        component={OrderReview}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="PaymentConfirmed"
        component={PaymentConfirmed}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="PaymentMethod2"
        component={PaymentMethod2}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="FundingHistory"
        component={FundingHistory}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="BecomeAServiceProvider"
        component={BecomeAServiceProvider}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="ViewLocation"
        component={ViewLocation}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="TipServiceProvider"
        component={TipServiceProvider}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="OrderActive"
        component={OrderActive}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="CreatePin"
        component={CreatePin}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="CreatePinPage"
        component={CreatePinPage}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="CreatePinSuccess"
        component={CreatePinSuccess}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="FaceDetection"
        component={FaceDetection}
        options={{headerShown: false, animation: 'none'}}
      />

      <Stack.Screen
        name="SpinToWinScreen"
        component={SpinToWinScreen}
        options={{headerShown: false, animation: 'none'}}
      />

      <Stack.Screen
        name="ProductDisplay"
        component={ProductDisplay}
        options={{headerShown: false, animation: 'none'}}
      />
      <Stack.Screen
        name="MyJobs"
        component={MyJobs}
        options={{headerShown: false, animation: 'none'}}
      />

      {/* <Stack.Screen
        name="Tracking"
        component={HelloWorldView}
        options={{headerShown: false, animation: 'none'}}
      /> */}
    </Stack.Navigator>
  );
}
