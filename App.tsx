import 'react-native-gesture-handler';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {Alert, Dimensions, PermissionStatus, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store/store';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useSelector} from 'react-redux';
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
// import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';
import BackgroundFetch from 'react-native-background-fetch';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import SettingsService from './src/tracking/SettingsService';
import {registerTransistorAuthorizationListener} from './src/tracking/authorization';
import ENV from './src/tracking/ENV';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {ToastShort} from './src/utils/utils';
Sentry.init({
  dsn: 'https://aaf6ecb52ce579d3e2a85f314f1773ad@o4506399508725760.ingest.sentry.io/4506410437509120',
});







// mark-messages-as-read
// unread-chats






const Stack = createStackNavigator();
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
  //<<<<<<<<<<----------------------------> BACKGROUD TRACKING ---------------------------------------_>>>>>>>>>>>>>>>>>>>>>>>>>
  const [org, setOrg] = React.useState('Grandida');
  const [username, setUsername] = React.useState('Grandida');
  const [deviceModel, setDeviceModel] = React.useState('');
  React.useLayoutEffect(() => {
    // Restore org/username from AsyncStorage.
    AsyncStorage.getItem('@transistorsoft:org').then(value => {
      if (value != null) {
        setOrg(value);
      }
    });
    AsyncStorage.getItem('@transistorsoft:username').then(value => {
      if (value != null) {
        setUsername(value);
      }
    });
    // Set DeviceModel.
    BackgroundGeolocation.getDeviceInfo().then(deviceInfo => {
      setDeviceModel(deviceInfo.model);
    });
    onClickNavigate('Home');
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
      // Re-direct to registration screen
      // onClickRegister();
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
  //Plugin
  /// State.
  const [events, setEvents] = React.useState<any[]>([]);
  const [enabled, setEnabled] = React.useState(false);
  const bgGeoEventSubscriptions: Subscription[] = [];

  React.useEffect(() => {
    initBackgroundFetch(); // <-- optional
    // initBackgroundGeolocation();
    // registerTransistorAuthorizationListener(navigation);
    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      unsubscribe();
    };
  }, []);
  React.useEffect(() => {
    BackgroundGeolocation.start();
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
  /// Adds events to List
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
  /// Configure the BackgroundGeolocation plugin.
  const initBackgroundGeolocation = async () => {
    // Listen to events.  Each BackgroundGeolocation event-listener returns a subscription instance
    // with a .remove() method for removing the event-listener.  You should collect a list of these
    // subcribers and .remove() them all when the View is destroyed or refreshed during dev live-reload.
    subscribe(
      BackgroundGeolocation.onProviderChange(event => {
        console.log('[onProviderChange]', event);
        addEvent('onProviderChange', event);
        axios
          .post(
            'https://api.pureworker.com/api/location3',
            {
              long: 'long',
              lat: 'lat',
              _type: 'PROVIDER',
              ...event,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .then(response => {
            console.log(
              'BACKGROUND:Location sent successfully:',
              response.data,
            );
          })
          .catch(error => {
            console.error('Error sending location:', error);
          });

        axios
          .post(
            'https://api.pureworker.com/api/location2',
            {
              long: 'prov:lng',
              lat: 'prov:lat',
              // ...event,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .then(response => {
            console.log(
              'BACKGROUND:Location sent successfully:',
              response.data,
            );
          })
          .catch(error => {
            console.error('Error Provider', error);
          });
      }),
    );
    subscribe(
      BackgroundGeolocation.onLocation(
        location => {
          console.log('[onLocation]', location);
          addEvent('onLocation', location);
          axios
            .post(
              'https://api.pureworker.com/api/location3',
              {
                long: location?.coords?.longitude,
                lat: location?.coords?.latitude,
                _type: 'Location',
                ...location,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            )

            .then(response => {
              console.log(
                'BACKGROUND:Location sent successfully:',
                response.data,
              );
            })
            .catch(error => {
              console.error('Error sending location:', error);
            });
        },
        error => {
          console.warn('[onLocation] ERROR: ', error);
        },
      ),
    );
    subscribe(
      BackgroundGeolocation.onMotionChange(location => {
        console.log('[onMotionChange]', location);
        addEvent('onMotionChange', location);
      }),
    );
    subscribe(
      BackgroundGeolocation.onGeofence(event => {
        console.log('[onGeofence]', event);
        addEvent('onGeofence', event);
      }),
    );
    subscribe(
      BackgroundGeolocation.onConnectivityChange(event => {
        console.log('[onConnectivityChange]', event);
        addEvent('onConnectivityChange', event);
      }),
    );
    subscribe(
      BackgroundGeolocation.onEnabledChange(enabled => {
        console.log('[onEnabledChange]', enabled);
        addEvent('onEnabledChange', {enabled: enabled});
      }),
    );

    subscribe(
      BackgroundGeolocation.onHttp(event => {
        console.log('[onHttp]', event);
        addEvent('onHttp', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onActivityChange]', event);
        addEvent('onActivityChange', event);
        axios
          .post(
            'https://api.pureworker.com/api/location3',
            {
              _type: 'Activity',
              ...event,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .then(response => {
            console.log('BACKGROUND:ACTIVITY succesfully', response.data);
          })
          .catch(error => {
            console.error('Error ONHTTP:', error);
          });
      }),
    );
//     }).then(state => {
//       setEnabled(state.enabled);
//       console.log(
//         '- BackgroundGeolocation is configured and ready: ',
//         state.enabled,
//         'data-here:',
//         state,
    subscribe(
      BackgroundGeolocation.onPowerSaveChange(enabled => {
        console.log('[onPowerSaveChange]', enabled);
        addEvent('onPowerSaveChange', {isPowerSaveMode: enabled});
      }),
    );
    /// Get an authorization token from demo server at tracker.transistorsoft.com
    const token =
      await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
        org,
        username,
        ENV.TRACKER_HOST,
      );
    /// Configure the plugin.
    const state = await BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      transistorAuthorizationToken: token,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
    }).then(() => {
      BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        extras: {
          getCurrentPosition: true,
        },
      });
      // BackgroundGeolocation.start();
    });
    /// Add the current state as first item in list.
    addEvent('Current state', state);
    /// Set the default <Switch> state (disabled)
    setEnabled(state?.enabled);
  };

  const initBackgroundFetch = async () => {
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: true,
      },
      taskId => {
        console.log('[BackgroundFetch] ', taskId);
        axios
          .post('http://localhost:3005/api/location3', {
            long: `background:${taskId}`,
            lat: `back:${taskId}`,
          })
          .then(response => {
            console.log(
              'BACKGROUND:Location sent successfully:',
              response.data,
            );
          })
          .catch(error => {
            console.error('Error sending location:', error);
          });
        BackgroundFetch.finish(taskId);
      },
      taskId => {
        console.log('[BackgroundFetch] TIMEOUT: ', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  };
  //
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

    const handleRequestNotificationPermission = async () => {
      const status = await checkNotificationPermission();
      if (status === RESULTS.DENIED) {
        await requestNotificationPermission();
      }
    };
    handleRequestNotificationPermission();
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

    if (loggedIn && loggedIn.token) {
      return <HomeStack />;
    } else {
      return <OnboardingStack />;
    }
  };
  // const [currentState, setCurrentState] = React.useState(
  //   useContext(RouteContext).initState,
  // );
  const [currentState, setCurrentState] = React.useState('1');
  const updateState = async (newState: any) => {
    // Update the state and save it to AsyncStorage
    try {
      await AsyncStorage.setItem('routeState', newState);
      setCurrentState(newState);
    } catch (error) {
      console.error('Error saving state to AsyncStorage:', error);
    }
  };
  // const {currentState, setCurrentState} = useContext(RouteContext);
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
  }, []); // Empty dependency array to run this effect once on component mount

  return (
    <>
      <RouteContext.Provider
        value={{currentState, setCurrentState: updateState}}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer ref={navigationRef}>
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
// export default App;
export default codePush(codePushOptions)(App);

// Installed Packages
/*****
 *
 * - react-native-notifications
 * - react-native-push-notification
 * */

