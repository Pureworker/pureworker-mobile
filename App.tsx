import 'react-native-gesture-handler';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {Dimensions, Text, View} from 'react-native';
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

Sentry.init({
  dsn: 'https://aaf6ecb52ce579d3e2a85f314f1773ad@o4506399508725760.ingest.sentry.io/4506410437509120',
});

const Stack = createStackNavigator();
const {width} = Dimensions.get('screen');

const App = () => {
  const [user, setUser] = useState(null);
  

  // useEffect(() => {
  //   codePush.sync({
  //     // updateDialog: true,
  //     installMode: codePush.InstallMode.IMMEDIATE,
  //   });
  // }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  //
  // Initialize BackgroundGeolocation
  // BackgroundGeolocation.configure({
  //   desiredAccuracy: 10,
  //   stationaryRadius: 50,
  //   distanceFilter: 50,
  //   notificationTitle: 'Background tracking',
  //   notificationText: 'enabled',
  //   debug: true,
  //   startOnBoot: false,
  //   stopOnTerminate: false,
  //   locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  //   interval: 60000, // 1 minute
  //   fastestInterval: 5000, // 5 seconds
  //   activitiesInterval: 10000, // 10 seconds
  // });

  // // Start tracking
  // BackgroundGeolocation.start();

  BackgroundGeolocation.onLocation(location => {
    // Send location data to your server
    console.log('BACKGROUND:', location);
    axios
      .post('https://api.pureworker.com/api/location', {long: 24, lat: 25})
      .then(response => {
        console.log('Location sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending location:', error);
      });
  });

  //Background Calls
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // minutes
      stopOnTerminate: false,
      startOnBoot: true,
    },
    async taskId => {
      // Perform background fetch tasks here
      axios
        .post('https://api.pureworker.com/api/location', {long: 40, lat: 41})
        .then(response => {
          console.log('BACKGROUND:Location sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending location:', error);
        });
      console.log('[BackgroundFetch] Task ID:', taskId);
      BackgroundFetch.finish(taskId);
    },
    error => {
      console.error('[BackgroundFetch] Failed to configure:', error);
    },
  );
  //

  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');

  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      location => {
        console.warn('[onLocation2]', location);
        axios
          .post('https://api.pureworker.com/api/location', {
            long: location?.coords?.longitude,
            lat: location?.coords?.latitude,
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
        setLocation(JSON.stringify(location, null, 2));
      },
    );

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
      event => {
        console.warn('[onMotionChange]', event);
      },
    );

    const onActivityChange: Subscription =
      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onActivityChange]', event);
      });

    const onProviderChange: Subscription =
      BackgroundGeolocation.onProviderChange(event => {
        console.warn('[onProviderChange]', event);
      });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: 'https://api.pureworker.com/api/location',
      // batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      // autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      // headers: {
      //   // <-- Optional HTTP headers
      //   'X-FOO': 'bar',
      // },
      // params: {
      //   // <-- Optional HTTP params
      //   auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      // },
    }).then(state => {
      setEnabled(state.enabled);
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
        'data-here:',
        state,
      );
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  React.useEffect(() => {
    // if (enabled) {
    //   BackgroundGeolocation.start();
    // } else {
    //   BackgroundGeolocation.stop();
    //   setLocation('');
    // }
    BackgroundGeolocation.start();
  }, [enabled]);

  //
  const get = async () => {
    let _fcmtoken = await AsyncStorage.getItem('fcmtoken');
    console.log(_fcmtoken);
  };

  useEffect(() => {
    requestUserPermission();
    // GetFCMToken(userData);
    NotificationListner();
    get();
  }, []);

  function HomeStack() {
    const userType = useSelector((state: any) => state.user.isLoggedIn);
    console.log('user_', userType);
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
