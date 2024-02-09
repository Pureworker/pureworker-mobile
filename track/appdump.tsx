
  //<<<<<<<<<<----------------------------> BACKGROUD TRACKING ---------------------------------------_>>>>>>>>>>>>>>>>>>>>>>>>>

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

  //----comment start here
  // BackgroundGeolocation.onLocation(location => {
  //   // Send location data to your server
  //   console.log('BACKGROUND:', location);
  //   // axios
  //   //   .post('http://localhost:3005/api/location3', {long: 24, lat: 25})
  //   //   .then(response => {
  //   //     console.log('Location sent successfully:', response.data);
  //   //   })
  //   //   .catch(error => {
  //   //     console.error('Error sending location:', error);
  //   //   });
  // });

  // //Background Calls
  // BackgroundFetch.configure(
  //   {
  //     minimumFetchInterval: 15, // minutes
  //     stopOnTerminate: false,
  //     startOnBoot: true,
  //   },
  //   async taskId => {
  //     // Perform background fetch tasks here
  //     // axios
  //     //   .post('http://localhost:3005/api/location3', {long: 40, lat: 41})
  //     //   .then(response => {
  //     //     console.log('BACKGROUND:Location sent successfully:', response.data);
  //     //   })
  //     //   .catch(error => {
  //     //     console.error('Error sending location:', error);
  //     //   });
  //     console.log('[BackgroundFetch] Task ID:', taskId);
  //     BackgroundFetch.finish(taskId);
  //   },
  //   error => {
  //     console.error('[BackgroundFetch] Failed to configure:', error);
  //   },
  // );
  // //

  // const [enabled, setEnabled] = React.useState(false);
  // const [location, setLocation] = React.useState('');

  // React.useEffect(() => {
  //   /// 1.  Subscribe to events.
  //   const onLocation: Subscription = BackgroundGeolocation.onLocation(
  //     location => {
  //       console.warn('[onLocation2]', location);
  //       // axios
  //       // .post('http://localhost:3005/api/location3', {long: location?.coords?.longitude, lat: location?.coords?.latitude})
  //       // .then(response => {
  //       //   console.log('BACKGROUND:Location sent successfully:', response.data);
  //       // })
  //       // .catch(error => {
  //       //   console.error('Error sending location:', error);
  //       // });
  //       setLocation(JSON.stringify(location, null, 2));
  //     },
  //   );

  //   const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
  //     event => {
  //       console.warn('[onMotionChange]', event);
  //     },
  //   );

  //   const onActivityChange: Subscription =
  //     BackgroundGeolocation.onActivityChange(event => {
  //       console.log('[onActivityChange]', event);
  //     });

  //   const onProviderChange: Subscription =
  //     BackgroundGeolocation.onProviderChange(event => {
  //       console.warn('[onProviderChange]', event);
  //     });

  //   /// 2. ready the plugin.
  //   BackgroundGeolocation.ready({
  //     // Geolocation Config
  //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //     distanceFilter: 10,
  //     // Activity Recognition
  //     stopTimeout: 5,
  //     // Application config
  //     debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
  //     logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  //     stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
  //     startOnBoot: true, // <-- Auto start tracking when device is powered-up.
  //     // HTTP / SQLite config
  //     // url: 'https://api.pureworker.com/api/location',
  //     // batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
  //     // autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
  //     // headers: {
  //     //   // <-- Optional HTTP headers
  //     //   'X-FOO': 'bar',
  //     // },
  //     // params: {
  //     //   // <-- Optional HTTP params
  //     //   auth_token: 'maybe_your_server_authenticates_via_token_YES?',
  //     // },
  //   }).then(state => {
  //     setEnabled(state.enabled);
  //     console.log(
  //       '- BackgroundGeolocation is configured and ready: ',
  //       state.enabled, 'data-here:', state
  //     );
  //   });

  //   return () => {
  //     // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
  //     // during development live-reload.  Without this, event-listeners will accumulate with
  //     // each refresh during live-reload.
  //     onLocation.remove();
  //     onMotionChange.remove();
  //     onActivityChange.remove();
  //     onProviderChange.remove();
  //   };
  // }, []);

  // React.useEffect(() => {
  //   // if (enabled) {
  //   //   BackgroundGeolocation.start();
  //   // } else {
  //   //   BackgroundGeolocation.stop();
  //   //   setLocation('');
  //   // }
  //   BackgroundGeolocation.start();
  // }, [enabled]);
