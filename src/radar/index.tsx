import Radar from 'react-native-radar';
import {ToastShort} from '../utils/utils';

export const Init = userId => {
  console.error('ERRROOORR: init radar ');

  Radar.initialize(
    'prj_test_pk_33815e3a9a5209b3f5e234a8a28428bdb446430a',
    false,
  );
  Radar.setUserId('taiwo');
  Radar.setDescription('example_description');
  Radar.setLogLevel('debug');

  Radar.getPermissionsStatus().then(status => {
    // do something with status
    if (status === 'GRANTED_BACKGROUND') {
      ToastShort('Radar GRANTED_BACKGROUND');
    } else if (status === 'GRANTED_FOREGROUND') {
      ToastShort('Radar GRANTED_FOREGROUND');
    } else if (status === 'DENIED') {
      ToastShort('Radar DENIED');
      request();
    } else if (status === 'NOT_DETERMINED') {
      ToastShort('Radar NOT_DETERMINED');
      request();
    } else if (status === 'UNKNOWN') {
      ToastShort('Radar UNKNOWN');
      request();
    }
  });
};

const request = () => {
  // request foreground location permissions
  Radar.requestPermissions(false)
    .then(status => {
      ToastShort(`Radar-FOREGROUND REQUEST: ${status}`);
      // request background location permissions
      Radar.requestPermissions(true)
        .then(status => {
          ToastShort(`Radar-BACKGROUND_REQUEST: ${status}`);
          // do something with status
        })
        .catch(err => {
          // optionally, do something with err
          ToastShort(`Radar rquest background`);
          console.log(err);
        });
    })
    .catch(err => {
      ToastShort('Radar request foreground');
      console.log(err);
      // optionally, do something with err
    });
};

const startBackground = () => {
  Radar.startTrackingResponsive();
};

const StartTrip = () => {
  Radar.startTrip({
    tripOptions: {
      externalId: '299',
      destinationGeofenceTag: 'store',
      destinationGeofenceExternalId: '123',
      mode: 'car',
    },
    trackingOptions: {
      desiredStoppedUpdateInterval: 30,
      fastestStoppedUpdateInterval: 30,
      desiredMovingUpdateInterval: 30,
      fastestMovingUpdateInterval: 30,
      desiredSyncInterval: 20,
      desiredAccuracy: 'high',
      stopDuration: 0,
      stopDistance: 0,
      replay: 'none',
      sync: 'all',
      showBlueBar: true,
      syncGeofences: false,
      syncGeofencesLimit: 0,
      beacons: false,
      foregroundServiceEnabled: true,
    },
  }).then(result => {
    // do something with result.status
  });
};

interface Passedstatus {
  status: string;
}
//'arrived' or  'unknown'
const updateTrip = status => {
  Radar.updateTrip({
    status: 'arrived',
    options: {
      externalId: '299',
      metadata: {
        parkingSpot: '5',
      },
    },
  }).then(result => {
    // do something with result.status
  });
};
