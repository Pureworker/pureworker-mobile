import {ALERT_TYPE, Dialog, Toast} from 'react-native-alert-notification';

const toastAlertSuccess = (message = '', title = 'Success') => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: title,
    textBody: message,
  });
};

const toastAlertError = (message = '', title = 'Error') => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: title,
    textBody: message,
  });
};

const toastAlertWarn = (message = '', title = 'Error') => {
  Toast.show({
    type: ALERT_TYPE.WARNING,
    title: title,
    textBody: message,
  });
}

  const toasAlerttInfo = (message = '', title = 'Error') => {
    Toast.show({
      type: "INFO",
      title: title,
      textBody: message,
    });
  };

export {toastAlertSuccess, toastAlertError, toastAlertWarn, toasAlerttInfo};
