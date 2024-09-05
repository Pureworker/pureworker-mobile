/* eslint-disable no-bitwise */
/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, persistor} from './src/store/store';
import SplashScreen from 'react-native-splash-screen';
import CustomerNavigation from './src/navigation/customerNavigation';
import VendorNavigation from './src/navigation/vendorNavigation';
import OnboardingStack from './src/navigation/OnboardStack';
import {
  GetFCMToken,
  NotificationListner,
  requestUserPermission,
} from './src/utils/pushnotification_helper';
import {RouteContext} from './src/utils/context/route_context';
import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import {
  PERMISSIONS,
  check,
  request,
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';
import {ToastLong} from './src/utils/utils';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {addIsNetwork} from './src/store/reducer/mainSlice';
import VersionCheck from 'react-native-version-check';
import SpInAppUpdates from 'sp-react-native-in-app-updates';
import {AlertNotificationRoot} from 'react-native-alert-notification';

Sentry.init({
  dsn: 'https://aaf6ecb52ce579d3e2a85f314f1773ad@o4506399508725760.ingest.sentry.io/4506410437509120',
});

const inAppUpdates = new SpInAppUpdates(false); // isDebug

const App = () => {
  const [currentState, setCurrentState] = useState('1');

  const dispatch = useDispatch();
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const userData = useSelector((state: any) => state.user.userData);
  const isNetwork = useSelector((state: any) => state.user.isNetwork);

  const bgGeoEventSubscriptions: any[] = [];

  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    GetFCMToken(userData);
    NotificationListner();
    checkNotificationPermissions();

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      dispatch(addIsNetwork(!!state.isConnected));
      if (!state.isConnected) {
        ToastLong('Network disconnected. Please check!');
      }
    });

    return () => {
      unsubscribeNetInfo();
      unsubscribeBackgroundGeo();
    };
  }, [userData]);

  const unsubscribeBackgroundGeo = () => {
    bgGeoEventSubscriptions.forEach(subscription => subscription.remove());
  };

  const fetchUserLocation = async () => {
    const permissionStatus = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (permissionStatus === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        },
        error => console.log('Error getting location:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 60000},
      );
    } else {
      console.warn('Location permission denied');
      return {latitude: 0, longitude: 0};
    }
  };

  const checkNotificationPermissions = useCallback(async () => {
    const status = await check(
      Platform.select({
        ios: PERMISSIONS.IOS.NOTIFICATIONS,
        android: PERMISSIONS.ANDROID.NOTIFICATIONS,
      }),
    );
    if (status === RESULTS.DENIED) {
      await requestNotificationPermissions();
    }
  }, []);

  const requestNotificationPermissions = async () => {
    const {status} = await requestNotifications(['alert', 'badge', 'sound']);
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Enable notifications for this app.');
    }
  };

  const handleUpdate = async () => {
    const latestVersion = await VersionCheck.getLatestVersion({
      provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
    });
    const currentVersion = VersionCheck.getCurrentVersion();

    if (latestVersion > currentVersion) {
      Alert.alert(
        'Update Required',
        'A new version of the app is available. Please update to continue using the app.',
        [
          {
            text: 'Update Now',
            onPress: async () => {
              const url =
                Platform.OS === 'ios'
                  ? await VersionCheck.getAppStoreUrl({
                      appID: 'com.grandida.pureworker',
                    })
                  : await VersionCheck.getPlayStoreUrl({
                      packageName: 'com.pure_worker_app',
                    });
              Linking.openURL(url);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  const HomeStack = () => {
    return userType?.userType === 'CUSTOMER' ? (
      <CustomerNavigation />
    ) : (
      <VendorNavigation />
    );
  };

  const MainStack = () => {
    return userType?.token ? <HomeStack /> : <OnboardingStack />;
  };

  return (
    <>
      <RouteContext.Provider value={{currentState, setCurrentState}}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer
              linking={{
                prefixes: ['pureworker://', 'https://pureworker.page.link'],
              }}>
              <AlertNotificationRoot>
                <MainStack />
              </AlertNotificationRoot>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </RouteContext.Provider>
      <Toast config={toastConfig} visibilityTime={5000} autoHide={true} />
    </>
  );
};

const codePushOptions = {
  checkFrequency:
    codePush.CheckFrequency.ON_APP_RESUME |
    codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};
export default App;
// export default codePush(codePushOptions)(App);
