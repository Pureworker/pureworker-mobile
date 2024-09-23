import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import SpinWheel from './SpinWheel';
import {useNavigation} from '@react-navigation/native';
import SpinningWheel from './SpinningWheel';
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';
import {claimCoins, getPurecoinStatus} from '../../../utils/api/purecoins';
import {toastAlertError} from '../../../utils/alert';
import {useDispatch, useSelector} from 'react-redux';
import {setPurecoins} from '../../../store/reducer/mainSlice';
import CustomButton from '../../../components/Button';
import images from '../../../constants/images';
import {SIZES} from '../../../utils/position/sizes';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../../components/customLoading';

const SpinToWinScreen = () => {
  const navigation = useNavigation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [value_picked, setvalue_picked] = useState('');

  const handleSpin = () => {
    setIsSpinning(true);
  };
  const purecoins = useSelector((state: any) => state.user.purecoins);

  const initClaimCoins = async (param: string) => {
    setisLoading(true);
    setvalue_picked(param);
    let val = param?.split(' ');
    console.log('====================================');
    console.log(val?.[0], {
      coins: val?.[0],
      task: 'Transaction',
    });
    console.log('====================================');

    // if (purecoins?.hasCompletedTransaction) {
    //   toastAlertError(
    //     'You have already claimed your daily coins today.',
    //     'Pureworker',
    //   );
    //   return;
    // }
    const res: any = await claimCoins({
      coins: val?.[0],
      task: 'Transaction',
    });
    if (res?.status === 201 || res?.status === 200) {
      setIsModalVisible(true);
      initgetPurecoinStatus();
    } else {
      console.log(res);
      toastAlertError(`${res?.error?.message}`, 'Pureworker');
    }
    setisLoading(false);
  };

  const dispatch = useDispatch();
  const initgetPurecoinStatus = async () => {
    setisLoading(true);
    const res: any = await getPurecoinStatus('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setPurecoins(res?.data?.data));
    }
    setisLoading(false);
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
        <SpinningWheel
          func={(val: string) => {
            initClaimCoins(val);
          }}
        />
      </View>

      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onModalHide={() => {
            setIsModalVisible(false);
          }}
          style={{width: SIZES.width, marginHorizontal: 0}}
          deviceWidth={SIZES.width}>
          <View
            style={[
              tw`bg-[#EBEBEB] w-9/10 mx-auto  p-4 pb-8`,
              {borderRadius: 20},
            ]}>
            <View style={tw`mx-auto`}>
              <View style={tw`mb-4`}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={images.coin}
                    style={{width: 50, height: 50}}
                    resizeMode="contain"
                  />

                  <Text style={styles.modalTitle}>
                    Congratulations, you won!
                  </Text>
                  <Text style={styles.modalSubtitle}>{value_picked}</Text>
                </View>
              </View>
              <CustomButton
                text="Claim and Continue"
                onClick={() => {
                  // Claim item logic here
                  // Navigate back to PureCoins Home
                  setIsModalVisible(false);
                  navigation.goBack();
                }}
                style={styles.modalButton}
                textStyle={styles.modalButtonText}
              />
            </View>
          </View>
        </Modal>
      )}
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
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
    fontSize: 14,
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

  modalContainer: {
    backgroundColor: colors.grey,
    borderColor: colors.primary,
    padding: 100,
    borderRadius: 10,
    // position: 'absolute',
    // top: '40%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',

    width: SIZES.width * 0.9,
    transform: [{translateX: -20}, {translateY: -20}],
  },

  modalTitle: {
    color: colors.black,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },

  modalSubtitle: {
    color: colors.parpal,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: '#2D303C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.bold,
  },
});

export default SpinToWinScreen;
