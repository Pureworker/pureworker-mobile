import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { PermissionsAndroid, Platform } from 'react-native';

import { addPushToken } from './api/func';
import { ToastLong } from './utils';

//
// import inAppMessaging from '@react-native-firebase/in-app-messaging';

async function requestUserPermission() {
  const _enabled = await messaging().hasPermission();
  if (_enabled) {
    await GetFCMToken({});
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (enabled) {
      GetFCMToken({});
      console.error('Authorization status:', authStatus);
    }
  }
}

const GetFCMToken = async (userData:any) => {
  let _fcmtoken = await AsyncStorage.getItem('fcmtoken');
  // await messaging().setAPNSToken('74657374696E67746F6B656E', 'unknown');
  //   await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log(`${Platform.OS} fcmTOKEN2`, token);
  //   if (Platform.OS === 'ios') {
  //     messaging()
  //       .registerDeviceForRemoteMessages() // no-op on Android and if already registered
  //       .then(() => messaging().getToken())
  //       .then(t => {
  //         console.log('fcmTOKEN2', t);
  //         // setToken(t);
  //         // setIsInitialized(true);
  //       });
  //   } else {
  try {
    let fcmtoken = await messaging().getToken();
    console.error(
      `${Platform.OS === 'ios' ? 'ios' : 'android'} fcmTOKEN`,
      fcmtoken,
    );
    if (!fcmtoken) {
    } else {
      const _token = await AsyncStorage.getItem('fcmtoken');
      if (userData?.fcmToken === fcmtoken) {
      } else {
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
        const initToken = async (param: any) => {
          const res = await addPushToken(param);
          console.log('res', res, res?.data);
          if (res.status && (res.status === 200 || res.status === 201)) {
            Toast.show({
              type: 'success',
              text1: 'Token Added successfully',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: res.error.data,
            });
          }
        };
        await initToken({fcmToken: fcmtoken});
      }
    }
  } catch (error) {
    console.log(error, 'error in fcmtoken');
  }
};
const NotificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification  caused  app to open from background state',
      remoteMessage.notification,
    );
  });
  //   messaging.getInitialNotification().then(remoteMessage => {
  //     console.log(
  //       'Notification caused  app to open from quit state:',
  //       remoteMessage.notification,
  //     );
  //   });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Notification',
      // text2: `${notification?._body}`,
      visibilityTime: 4000,
      topOffset: 30,
      bottomOffset: 60,
    });
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Notification on foreground state.....', remoteMessage);
    // Alert.alert('Push gotten here', remoteMessage?.data?.service);
    ToastLong('Notification Received!, Please check.');
    console.log('app opened');
  });
  /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
  // @ts-ignore
  //   notificationOpenedListener = messaging()
  //     .notifications()
  //     .onNotificationOpened(notificationOpen => {
  //       const {title, body, android, ios} = notificationOpen.notification;
  //       // showAlert(title, body);
  //       console.warn('notificationOpen', ios._notification);
  //     });
  //in app messaging
  // const inapp = async () => {
  //   await inAppMessaging().setMessagesDisplaySuppressed(true);
  // };
  // inapp();
  // async function bootstrap() {
  //   await inAppMessaging().setMessagesDisplaySuppressed(true);
  // }
};
export {requestUserPermission, NotificationListner, GetFCMToken};
// const getToken = async () => {
//   try {
//     fcmToken = await firebase.messaging().getToken();
//     if (fcmToken) {
//       // user has a device token
//       console.warn('fcmToken:...>>>', fcmToken);
//       await storeData2('fcmToken', fcmToken);
//     }
//     console.warn('fcmToken:', fcmToken);
//   } catch (e) {
//     console.warn('error', e);
//   }
// };

// ecmvRZYcTEm9nyGuHC-Nur:APA91bHlHx4Qi4zQrOO0g0885p7COsP-kLFCemPL5Ep4QRIHFnPvdJRZyKoKZHPNTs_cSq3Z3z7ynaTyJ58YF2fxOK_fHUeyp05JMvazByEA50ac0AogU4wmbBAjiY4ZN5kHrdjLGwKb
// assets/favicon.png"}, "body": "hey peeps", "title": "Hello Emma43"}
//  LOG  Notification on foreground state..... {"collapseKey": "com.kobosquare",
//  "data": {}, "from": "794214867033", "messageId": "0:1694267423188374%ae61f39bae61f39b",
//  "notification": {"android": {}, "body": "Lorem ipsu ", "title": "Kobo Test"}, "sentTime": 1694267423173,
//  "ttl": 2419200}
