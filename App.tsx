import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Alert, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store/store';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {navigationRef} from './RootNavigation';
import CustomerNavigation from './src/navigation/customerNavigation';
import VendorNavigation from './src/navigation/vendorNavigation';
import OnboardingStack from './src/navigation/OnboardStack';
import {
  GetFCMToken,
  NotificationListner,
  requestUserPermission,
} from './src/utils/pushnotification_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteContext} from './src/utils/context/route_context';
import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import SettingsService from './src/tracking/SettingsService';
import {
  PERMISSIONS,
  check,
  request,
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';
import {ToastLong, ToastShort} from './src/utils/utils';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {addIsNetwork} from './src/store/reducer/mainSlice';
Sentry.init({
  dsn: 'https://aaf6ecb52ce579d3e2a85f314f1773ad@o4506399508725760.ingest.sentry.io/4506410437509120',
});
const App = () => {
  const [user, setUser] = useState(null);
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
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const validate = (value: string) => {
    if (value == null) {
      return false;
    }
    if (value.length === 0) {
      return false;
    }
    return true;
  };
  const onClickNavigate = async (route: string) => {
    if (!validate(route) || !validate(org) || !validate(username)) {
      return;
    }

    // Have we shown the one-time Alert for "background permission disclosure"?
    const hasDisclosedBackgroundPermission =
      (await AsyncStorage.getItem(
        '@transistorsoft:hasDisclosedBackgroundPermission',
      )) == 'true';

    if (Platform.OS === 'android' && !hasDisclosedBackgroundPermission) {
      // For Google Play Console Submission:  "disclosure for background permission".
      // This is just a simple one-time Alert.  This is your own responsibility to do this.
      Alert.alert(
        'Background Location Access',
        [
          'BG Geo collects location data to enable tracking your trips to work and calculate distance travelled even when the app is closed or not in use.',
          'This data will be uploaded to tracker.transistorsoft.com where you may view and/or delete your location history.',
        ].join('\n\n'),
        [
          {
            text: 'Close',
            onPress: () => {
              onDiscloseBackgroundPermission(route);
            },
          },
        ],
      );
      return;
    }
    const settingsService = SettingsService.getInstance();
    settingsService.playSound('OPEN');
    // navigation.navigate(route, {
    //   screen: route,
    //   params: {
    //     username: username,
    //     org: org,
    //   },
    // });
  };
  const onDiscloseBackgroundPermission = async (route: string) => {
    await AsyncStorage.setItem(
      '@transistorsoft:hasDisclosedBackgroundPermission',
      'true',
    );
    onClickNavigate(route);
  };
  const [events, setEvents] = React.useState<any[]>([]);
  const [enabled, setEnabled] = React.useState(false);
  const bgGeoEventSubscriptions: Subscription[] = [];
  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);
  React.useEffect(() => {
    // BackgroundGeolocation.start();
    return () => {};
  }, []);
  const subscribe = (subscription: Subscription) => {
    bgGeoEventSubscriptions.push(subscription);
  };
  /// Helper method to unsubscribe from all registered BackgroundGeolocation event-listeners.
  const unsubscribe = () => {
    bgGeoEventSubscriptions.forEach((subscription: Subscription) =>
      subscription.remove(),
    );
  };
  const addEvent = (name: string, params: any) => {
    let timestamp = new Date();
    const event = {
      expanded: false,
      timestamp: `${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`,
      name: name,
      params: JSON.stringify(params, null, 2),
    };
    setEvents(previous => [...previous, event]);
  };
  const fetchUserLocation = async () => {
    const permissionStatus = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );
    console.log('loc_status', permissionStatus);
    if (permissionStatus === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          return {
            latitude: position.coords.latitude, // Replace with actual latitude
            longitude: position.coords.longitude, // Replace with actual longitude
          };
        },
        error => console.log('Error getting location2:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 60000},
      );
    } else {
      console.warn('Location permission denied');
      return {
        latitude: 0,
        longitude: 0,
      };
    }
  };
  const get = async () => {
    let _fcmtoken = await AsyncStorage.getItem('fcmtoken');
  };
  useEffect(() => {
    requestUserPermission();
    // GetFCMToken(userData);
    NotificationListner();
    // get();
  }, []);
  useEffect(() => {
    const checkNotificationPermission = async () => {
      try {
        const status = await check(
          Platform.select({
            ios: PERMISSIONS.IOS.NOTIFICATIONS,
            android: PERMISSIONS.ANDROID.NOTIFICATIONS,
          }),
        );
        console.log('Notification permission status:', status);
        return status;
      } catch (error) {
        console.error('Error checking notification permission:', error);
        return null;
      }
    };
    const requestNotificationPermission = async () => {
      try {
        const status = await request(
          Platform.select({
            ios: PERMISSIONS.IOS.NOTIFICATIONS,
            android: PERMISSIONS.ANDROID.NOTIFICATIONS,
          }),
        );

        if (status === RESULTS.GRANTED) {
          console.log('Notification permission granted');
          ToastShort('Notification permission granted');
          // You can handle further actions here upon permission granted
        } else {
          console.log('Notification permission denied');
          ToastShort('Notification permission denied');
          // You can handle further actions here upon permission denied
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        // Handle error, if any
      }
    };
    const requestNotificationPermissions2 = async () => {
      try {
        const {status, settings} = await requestNotifications([
          'alert',
          'badge',
          'sound',
        ]);
        console.log('Notification permissions status:', status);
        console.log('Notification settings:', settings);

        if (status === 'granted') {
          // Permissions granted, you can proceed with your notification logic
        } else {
          // Permissions denied, handle accordingly (show a message, etc.)
          Alert.alert(
            'Permission Denied',
            'You need to enable notifications for this app.',
          );
        }
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };
    const handleRequestNotificationPermission = async () => {
      const status = await checkNotificationPermission();
      if (status === RESULTS.DENIED) {
        await requestNotificationPermission();
      }
    };
    handleRequestNotificationPermission();
    requestNotificationPermissions2();
  }, []);
  function HomeStack() {
    const userType = useSelector((state: any) => state.user.isLoggedIn);
    // console.log('user_', userType);
    if (userType.userType === 'CUSTOMER') {
      return <CustomerNavigation />;
    } else {
      return <VendorNavigation />;
    }
  }
  // eslint-disable-next-line react/no-unstable-nested-components
  const MainStack = () => {
    const loggedIn = useSelector((state: any) => state.user.isLoggedIn);
    const userData = useSelector((state: any) => state.user.userData);
    useEffect(() => {
      requestUserPermission();
      GetFCMToken(userData);
      NotificationListner();
      get();
    }, [userData]);

    const dispatch = useDispatch();
    const [isConnected, setIsConnected] = useState(true); // Initial state assuming network is connected
    const isNetwork = useSelector((state: any) => state.user.isNetwork);
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        // setIsConnected(state.isConnected);
        if (!state.isConnected) {
          ToastLong('Network  disconnected. Please check!');
        }
        dispatch(addIsNetwork(!!state.isConnected));
      });
      return () => {
        unsubscribe(); // Clean up the event listener
      };
    }, []);

    // useEffect(() => {
    //   Show toast message when network connection is lost
    //   if (!isNetwork) {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Network Error',
    //       text2: 'Please check your internet connection',
    //       position: 'bottom',
    //       visibilityTime: 3000, // 3 seconds
    //       autoHide: true,
    //     });
    //   }
    // }, [isNetwork]);

    if (loggedIn && loggedIn.token) {
      return <HomeStack />;
    } else {
      return <OnboardingStack />;
    }
  };
  const [currentState, setCurrentState] = React.useState('1');
  const updateState = async (newState: any) => {
    try {
      await AsyncStorage.setItem('routeState', newState);
      setCurrentState(newState);
    } catch (error) {
      console.error('Error saving state to AsyncStorage:', error);
    }
  };
  useEffect(() => {
    // Load the state from AsyncStorage during component mount
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('routeState');
        if (storedState !== null) {
          setCurrentState(storedState);
        }
      } catch (error) {
        console.error('Error loading state from AsyncStorage:', error);
      }
    };
    loadState();
  }, []);
  useEffect(() => {}, []); // Empty dependency array to run this effect once on component mount
  Geolocation.setRNConfiguration({
    authorizationLevel: 'always', // Request "always" location permission
    skipPermissionRequests: false, // Prompt for permission if not granted
  });
  const linking = {
    prefixes: ['pureworker://', 'https://pureworker.page.link'],
    config: {
      screens: {
        Homes: {
          screens: {
            Referrals: 'referrals',
          },
        },
      },
    },
  };
  return (
    <>
      <RouteContext.Provider
        value={{currentState, setCurrentState: updateState}}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer ref={navigationRef} linking={linking}>
              <MainStack />
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
// export default codePush(codePushOptions)(App);
export default App;
