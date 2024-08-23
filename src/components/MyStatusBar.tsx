import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        {...props}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : props.barStyle}
      />
    </SafeAreaView>
  </View>
);

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default MyStatusBar;
