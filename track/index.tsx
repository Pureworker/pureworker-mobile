import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  HttpEvent,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
  ConnectivityChangeEvent,
} from 'react-native-background-geolocation';

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
  // url: 'http://yourserver.com/locations',
  batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
  autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
  // headers: {              // <-- Optional HTTP headers
  //   'X-FOO': "bar"
  // },
  // params: {               // <-- Optional HTTP params
  //   "auth_token": "maybe_your_server_authenticates_via_token_YES?"
  // }
}).then(state => {
  BackgroundGeolocation.getCurrentPosition({
    samples: 1,
    extras: {
      getCurrentPosition: true,
    },
  });
  // BackgroundGeolocation.start();
});
