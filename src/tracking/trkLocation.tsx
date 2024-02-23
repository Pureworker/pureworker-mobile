import React, {useEffect, useState} from 'react';
import {Alert, AppState, AppStateStatus, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';
import {ToastShort} from '../utils/utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrackRiderLocation = () => {
  const [status, setstatus] = useState();
  const [accessToken, setToken]: any = useState(null);
  const [position, setPosition] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
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
    // Function to track rider's location
    // const check = async () => {
    //   const permissionStatus = await request(
    //     Platform.OS === 'android'
    //       ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    //       : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    //   );
    //   setstatus(permissionStatus);
    //   return permissionStatus;
    // };

    const check = async () => {
      try {
        const isLocationEnabled = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            position => {
              resolve(true);
            },
            error => {
              resolve(false);
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
        });

        if (!isLocationEnabled) {
          // Location services are not enabled
          console.log('Location services are not enabled');
          return false;
        }

        // Location services are enabled, proceed to request permission
        const permissionStatus = await request(
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        setstatus(permissionStatus);
        return permissionStatus;
      } catch (error) {
        console.error('Error checking location services:', error);
        return false;
      }
    };

    const watchPosition = () => {
      try {
        const watchID = Geolocation.watchPosition(
          async position => {
            const _token = await AsyncStorage.getItem('AuthToken');
            const data = JSON.stringify(position);
            console.log('watchPosition', position.coords);
            setPosition(data);
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
                  '[BACKGROUND]: Watchposition sent successfully:',
                  response.data,
                );
              })
              .catch(error => {
                console.error('Error sending location3:', error);
              });
          },
          error => Alert.alert('WatchPosition Error', JSON.stringify(error)),
        );
        setSubscriptionId(watchID);
      } catch (error) {
        Alert.alert('WatchPosition Error', JSON.stringify(error));
      }
    };
    const clearWatch = () => {
      subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
      setSubscriptionId(null);
      setPosition(null);
    };
    check();
    let permissionStatus = status;
    console.log('[loc_status]', permissionStatus);
    // ToastShort(`Location permission : ${permissionStatus}`);
    const trackLocation = () => {
      if (permissionStatus === 'granted') {
        Geolocation.getCurrentPosition(
          async position => {
            // Handle retrieved position data
            const _token = await AsyncStorage.getItem('AuthToken');
            const {latitude, longitude} = position.coords;
            console.log('Current Location:', latitude, longitude);
            axios
              .post(
                'https://api.pureworker.com/api/location',
                {
                  long: longitude,
                  lat: latitude,
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
                  '[BACKGROUND]: Location sent successfully:',
                  response.data,
                );
              })
              .catch(error => {
                console.error('Error sending location1:', error);
              });
            // You can send the location data to your server for tracking
          },
          error => {
            // Handle any errors that occur during geolocation retrieval
            console.error('[Error] getting location.........:', error);
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
        // ToastShort('Location-permision is off');
      }
    };
    // Callback function to track location when app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' || nextAppState === 'background') {
        // Track location when app is brought to foreground or background
        trackLocation();
        watchPosition();
      }
    };
    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    // Initial tracking when component mounts
    trackLocation();
    // Cleanup function to unsubscribe from app state changes
    return () => {
      appStateSubscription.remove();
      clearWatch();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TrackRiderLocation;
