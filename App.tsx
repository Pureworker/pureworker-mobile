import 'react-native-gesture-handler';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {Dimensions} from 'react-native';
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
    <RouteContext.Provider value={{currentState, setCurrentState: updateState}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <MainStack />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </RouteContext.Provider>
  );
};

// const codePushOptions = {
//   // checkFrequency:
//   //   codePush.CheckFrequency.ON_APP_RESUME |
//   //   codePush.CheckFrequency.ON_APP_START,
//   installMode: codePush.InstallMode.IMMEDIATE,
// };
// export default codePush(App);
export default App;
