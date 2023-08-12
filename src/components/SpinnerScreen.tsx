import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const SpinnerScreen = () => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={'large'} color={'green'} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    height: 50,
    marginBottom: 10
  },
});

export default SpinnerScreen;
