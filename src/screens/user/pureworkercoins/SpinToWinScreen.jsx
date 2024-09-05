import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import SpinWheel from './SpinWheel';
import {useNavigation} from '@react-navigation/native';
import SpinningWheel from './SpinningWheel';
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';


const SpinToWinScreen = () => {
  const navigation = useNavigation();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={colors.black} />
          <Text style={styles.headerText}>Wheel to spin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => navigation.navigate('Rules')}>
          <Text style={styles.headerText}>Rules</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Win coins by spinning the wheel.
        </Text>
      </View>
      {/* Spin Wheel */}
      <View style={styles.spinWheelContainer}>
        <SpinningWheel />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  headerText: {
    marginLeft: 10,
    color: colors.black,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    backgroundColor: colors.bgBlue,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    marginVertical: 20,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.darkParpal,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.darkParpal,
    fontFamily: commonStyle.fontFamily.medium,
  },
  spinWheelContainer: {
    flexGrow: 1,
    alignItems: 'center',
    // marginVertical: 20,
  },
  spinWheel: {
    width: 300,
    height: 300,
  },
  spinButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  spinButton: {
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  spinButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
  },
});

export default SpinToWinScreen;
