import React from 'react';
import {OtpInput} from 'react-native-otp-entry';
import {StyleSheet} from 'react-native';
import colors from '../constants/colors';

const OtpInputComponent: React.FC<{
  onFilled?: () => void;
  onTextChange?: (v: any) => void | undefined;
  numberOfDigits?: number;
  autoFocus?: boolean;
}> = ({onFilled, onTextChange, numberOfDigits = 6, autoFocus = true}) => {
  return (
    <OtpInput
      numberOfDigits={numberOfDigits}
      focusColor={colors.primary}
      autoFocus={autoFocus}
      focusStickBlinkingDuration={500}
      onTextChange={onTextChange}
      onFilled={onFilled}
      hideStick
      secureTextEntry
      theme={{
        containerStyle: styles.container,
        inputsContainerStyle: styles.inputsContainer,
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
        focusStickStyle: styles.focusStick,
        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    // backgroundColor: colors.white,
  },
  inputsContainer: {},
  pinCodeContainer: {
    backgroundColor: colors.white,
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  pinCodeText: {
    borderColor: colors.black,
    color: 'black',
  },
  focusStick: {
    color: colors.primary,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  activePinCodeContainer: {
    borderColor: colors.darkPurple,
  },
});

export default OtpInputComponent;
