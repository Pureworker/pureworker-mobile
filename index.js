/**
 * @format
 */

import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: "https://aaf6ecb52ce579d3e2a85f314f1773ad@o4506399508725760.ingest.sentry.io/4506410437509120",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

if (Text.defaultProps) {
    Text.defaultProps.allowFontScaling = false;
  } else {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }

AppRegistry.registerComponent(appName, () => App);
