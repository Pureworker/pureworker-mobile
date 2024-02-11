import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import HomeScreen from '../screens/user/Home';
import TabIcon from '../components/TabIcon';
import images from '../constants/images';
import {SIZES, perHeight} from '../utils/position/sizes';
import {Platform, Text} from 'react-native';
import DrawerContent from './drawerContent';
import Wallet from '../screens/user/Wallet';
import Orders from '../screens/user/Orders';
import Support from '../screens/user/support';
import Account from '../screens/user/account';
// import PrivacyPolicy from '../screens/user/privacy-policy';
// import DeactivateAccount from '../screens/user/deactivateAccount';
import FAQ from '../screens/FAQ';
import DeactivateAccount from '../screens/common/deactivateAccount';
import {Rating} from 'react-native-ratings';
import Ratings from '../screens/common/ratings';
import PrivacyPolicy from '../screens/common/privacyPolicy';
import Index from '../screens/user/notification';
import Chat from '../screens/user/chat/index';
import TabServices from '../screens/user/tab_services';
import AddAddress from '../screens/common/addAddress';
import Referrals from '../screens/common/referrals';
import {useSelector} from 'react-redux';
import useChat from '../hooks/useChat';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {getUnreadMessages} = useChat();
  const unreadChats = useSelector((state: any) => state.user.unreadChats);
  const unreadNotification = useSelector(
    (state: any) => state.user.unreadNotification,
  );

  console.log(unreadChats, ' ................... uuuuuuuuuuuuuuuuuuuuuuuuuuu');

  useEffect(() => {
    getUnreadMessages();
  }, []);

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
          height: Platform.OS === 'ios' ? perHeight(73) : perHeight(70),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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
          tabBarBadge: unreadNotification ? unreadNotification : undefined,
          tabBarBadgeStyle: {
            backgroundColor: 'orange',
          },
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
          // component={Support}
          component={FAQ}
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
          name="Referrals"
          component={Referrals}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="AddAddress"
          component={AddAddress}
          options={{headerShown: false}}
        />
        {/* Add other drawer screens as needed */}
      </Drawer.Navigator>
    </PaperProvider>
  );
};

export default DrawerMenu;
