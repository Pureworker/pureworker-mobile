import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import HomeScreen from '../screens/vendor/Home';
import TabIcon from '../components/TabIcon';
import images from '../constants/images';
import {SIZES, perHeight} from '../utils/position/sizes';
import {Platform} from 'react-native';
import DrawerContent from './drawerContent';
import Wallet from '../screens/vendor/Wallet';
import Orders from '../screens/vendor/Orders';
import Support from '../screens/vendor/support';
import Account from '../screens/vendor/account';
import Ratings from '../screens/common/ratings';
import DeactivateAccount from '../screens/common/deactivateAccount';
import PrivacyPolicy from '../screens/common/privacyPolicy';
import Chat from '../screens/user/chat/index';
import Index from '../screens/user/notification';
import VendorHomeStack from './vendorHome';
import AddAddress from '../screens/common/addAddress';
import TabServices from '../screens/user/tab_servicess2';
import Referrals from '../screens/common/referrals';
// import {registerTransistorAuthorizationListener} from '../tracking/authorization';
import useChat from '../hooks/useChat';
import {useSelector} from 'react-redux';
import TrackRiderLocation from '../tracking/trkLocation';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {getUnreadMessages} = useChat();
  const unreadChats = useSelector((state: any) => state.user.unreadChats);
  const navigation = useNavigation();
  

  useEffect(() => {
    getUnreadMessages();
  }, []);

  const [accessToken, setToken]: any = useState(null);
  useEffect(() => {
    const getToken = async () => {
      const _token = await AsyncStorage.getItem('AuthToken');
      if (_token && _token !== null) {
        setToken(_token);
      } else {
        setToken(null);
      }
    };
    getToken();
  }, []);

  // React.useEffect(() => {
  //   registerTransistorAuthorizationListener(navigation);
  //   return () => {
  //     // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
  //     // during development live-reload.  Without this, event-listeners will accumulate with
  //     // each refresh during live-reload.
  //     // unsubscribe();
  //   };
  // }, []);
  Geolocation.setRNConfiguration({
    authorizationLevel: 'always', // Request "always" location permission
    skipPermissionRequests: false, // Prompt for permission if not granted
  });
  // Watch for position updates
  const watchId = Geolocation.watchPosition(
    async position => {
      console.log('POSITION:', position);
      const _token = await AsyncStorage.getItem('AuthToken');
      // Send the position data to the server
      axios
        .post(
          'https://api.pureworker.com/api/location',
          {
            long: position.coords.longitude,
            lat: position.coords.latitude,
            _type: 'PROVIDER',
          },
          {
            headers: {
              Authorization: `Bearer ${_token}`,
            },
          },
        )
        .then(response => {
          console.log(
            '[PROVIDER-WATCH]: Watchposition sent successfully:',
            response.data,
          );
        })
        .catch(error => {
          console.error('Error sending location2:', error, accessToken);
        });
    },
    error => {
      console.log(error);
    },
    {
      distanceFilter: 5, // Minimum distance (in meters) to update the location
      interval: 900000, // Update interval (in milliseconds), which is 15 minutes
      fastestInterval: 300000, // Fastest update interval (in milliseconds)
      accuracy: {
        android: 'highAccuracy',
        ios: 'best',
      },
      showsBackgroundLocationIndicator: true,
      pausesLocationUpdatesAutomatically: false,
      activityType: 'fitness', // Specify the activity type (e.g., 'fitness' or 'other')
      useSignificantChanges: false,
      deferredUpdatesInterval: 0,
      deferredUpdatesDistance: 0,
      foregroundService: {
        notificationTitle: 'Tracking your location',
        notificationBody: 'Enable location tracking to continue', // Add a notification body
      },
    },
  );
  //
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#00041380',
        tabBarLabelStyle: {
          fontWeight: '600',
          fontFamily: 'Inter-Regular',
        },
        tabBarStyle: {
          backgroundColor: '#F6F6F6',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: SIZES.width,
          height: Platform.OS === 'ios' ? perHeight(70) : perHeight(70),
        },
      }}>
      <Tab.Screen
        name="Home"
        // component={HomeScreen}
        component={VendorHomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={images.home} name={'Home'} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={images.orders} name={'Orders'} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={TabServices}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={images.menu} name={'Services'} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chat}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={images.chat} name={'Chats'} />
          ),
          tabBarBadge: unreadChats ? unreadChats : undefined,
          tabBarBadgeStyle: {
            backgroundColor: 'orange',
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Index}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              icon={images.notification}
              name={'Notifications'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerMenu = () => {
  return (
    <PaperProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Wallet"
          component={Wallet}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Support"
          component={Support}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Account"
          component={Account}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="DeactivateAccount"
          component={DeactivateAccount}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Rating"
          component={Ratings}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="AddAddress"
          component={AddAddress}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Referrals"
          component={Referrals}
          options={{headerShown: false}}
        />
        {/* Add other drawer screens as needed */}
      </Drawer.Navigator>
      <TrackRiderLocation />
    </PaperProvider>
  );
};

export default DrawerMenu;
