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
          console.log('BACKGROUND:Location sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending location4:', error);
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
          console.log('BACKGROUND:Location sent successfully:', response.data);
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
            console.error('Error sending location6:', error);
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

// Function to fetch user's location (replace this with your actual implementation)
const fetchUserLocation2 = async () => {
  // Implement logic to fetch the user's location here
  // This could involve using a geolocation API or accessing device sensors
  // For simplicity, let's return a mock location object
  return {
    latitude: 123.456, // Replace with actual latitude
    longitude: 789.012, // Replace with actual longitude
  };
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
          console.log('BACKGROUND:Location sent successfully:', response.data);
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
    // BackgroundGeolocation.getDeviceInfo().then(deviceInfo => {
    //   setDeviceModel(deviceInfo.model);
    // });
    onClickNavigate('Home');
  }, []);