import notifee, {AndroidImportance} from '@notifee/react-native';
import {useEffect} from 'react';

const useNotifee = () => {
  const initiateNotification = async () => {
    console.log(
      'use notifee                   ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt ----------------------',
    );
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'main',
      name: 'Main Notifications',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      id: '1234',
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'main',
        },
      },
    });
  };

  // initiateNotification();
  // useEffect(() => {
  // });

  return {initiateNotification};
};

export default useNotifee;
