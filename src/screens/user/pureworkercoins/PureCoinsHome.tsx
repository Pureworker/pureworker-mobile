import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import images from '../../../constants/images';
import commonStyle from '../../../constants/commonStyle';
import CustomButton from '../../../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import SpinWheel from '../../../assets/svg/SpinWheel';
import {useDispatch, useSelector} from 'react-redux';
import {
  claimCoins,
  getPurecoinHistory,
  getPurecoinStatus,
} from '../../../utils/api/purecoins';
import {
  setPurecoins,
  setPurecoinsHistory,
} from '../../../store/reducer/mainSlice';
import Textcomp from '../../../components/Textcomp';
import {toastAlertError, toastAlertWarn} from '../../../utils/alert';
import {SIZES} from '../../../utils/position/sizes';

const PureCoinsHome = () => {
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginCoinVisible, setIsLoginCoinVisible] = useState(true);
  const [isConversionModalVisible, setConversionModalVisible] = useState(false);
  const [conversionModalContent, setConversionModalContent] = useState({});

  const purecoins = useSelector((state: any) => state.user.purecoins);

  const handleConvertToNaira = (isSuccess: boolean) => {
    // const isSuccess = true;
    if (isSuccess) {
      setConversionModalContent({
        title: 'Conversion Successful!',
        message:
          'Your coins have been successfully converted to Naira. Kindly check your wallet to confirm.',
        icon: images.conversionSuccess,
      });
    } else {
      setConversionModalContent({
        title: 'Oops!',
        message:
          'You must achieve a minimum of one thousand coins before you can convert to Naira.',
        icon: images.conversionFail,
      });
    }
    setConversionModalVisible(true);
  };

  const handleCloseConversionModal = () => {
    setConversionModalVisible(false);
  };

  const handleClaim = () => {
    setIsModalVisible(true);
    setIsLoginCoinVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const initgetPurecoinStatus = async () => {
    setisLoading(true);
    const res: any = await getPurecoinStatus('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setPurecoins(res?.data?.data));
    }
    setisLoading(false);
  };
  const initgetPurecoinHistory = async () => {
    setisLoading(true);
    const res: any = await getPurecoinHistory('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setPurecoinsHistory(res?.data?.data));
    }
    setisLoading(false);
  };

  const initClaimCoins = async param => {
    setisLoading(true);

    const res: any = await claimCoins({
      coins: 10,
      task: param,
    });
    if (res?.status === 201 || res?.status === 200) {
      setIsModalVisible(true);
      setIsLoginCoinVisible(false);
      initgetPurecoinStatus();
      // dispatch(addPopularServices(res?.data?.data));
    } else {
      console.log(res);
      toastAlertError(`${res?.error?.message}`);
    }
    setisLoading(false);
  };

  useEffect(() => {
    initgetPurecoinStatus();
    initgetPurecoinHistory();
  }, []);

  const userType = useSelector((state: any) => state.user.isLoggedIn);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={colors.white}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.headerText}>Pure Coins</Text>
        </View>

        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => navigation.navigate('Rules')}>
          <Text style={styles.headerText}>Rules</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coinsContainer}>
          <View style={styles.coinsBox}>
            {isLoginCoinVisible && (
              <View style={styles.coinItem}>
                <Image
                  source={images.loginCoin}
                  style={{width: 50, height: 50}}
                  resizeMode="contain"
                />
                <Text style={styles.coinLabel}>Log-in</Text>
              </View>
            )}

            {userType.userType === 'CUSTOMER' ? (
              <View style={styles.coinItem}>
                <Image
                  source={images.transactionCoin}
                  style={{width: 50, height: 50}}
                  resizeMode="contain"
                />
                <Text style={styles.coinLabel}>Transaction</Text>
              </View>
            ) : (
              <View style={styles.coinItem}>
                <Image
                  source={images.transactionCoin}
                  style={{width: 50, height: 50}}
                  resizeMode="contain"
                />
                <Text style={styles.coinLabel}>Spin Wheel</Text>
              </View>
            )}
          </View>

          <View style={styles.pureCoinsDisplay}>
            <View style={styles.pureCoinsValueContainer}>
              <Text style={styles.pureCoinsText}>Pure coins</Text>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.white}
              />
            </View>
            <View style={styles.coinTextContainer}>
              <TextInput
                placeholder={`${purecoins?.totalCoins}`}
                placeholderTextColor={colors.white}
                style={styles.coinTextInput}
                editable={false}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PureCoinsHistory');
                }}
                style={styles.coinTextArrowContainer}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <CustomButton
              text={'Convert to Naira'}
              onClick={() => {
                if (purecoins?.totalCoins === 1000) {
                  handleConvertToNaira(true);
                } else {
                  handleConvertToNaira(false);
                }
              }}
              style={styles.convertButton}
              textStyle={styles.convertButtonText}
            />
          </View>
        </View>

        <View style={styles.dailyTasksContainer}>
          <Text style={styles.dailyTasksTitle}>Daily Tasks</Text>
          <Text style={styles.dailyTasksSubtitle}>
            Complete daily challenges to earn rewards!
          </Text>

          <View style={styles.taskButtonsContainer}>
            <View style={styles.taskButton}>
              <View style={styles.iconContainer}>
                <AntDesign name="logout" size={25} color={colors.black} />
                <Text style={styles.taskButtonTitle}>Log-in</Text>
              </View>
              <Text style={styles.taskButtonSubtitle}>
                Claim two coins by opening Pureworker app daily.
              </Text>

              <CustomButton
                text={'Claim'}
                onClick={() => {
                  if (purecoins?.hasClaimedDaily) {
                    toastAlertError(
                      'You have already claimed your daily coins today.',
                      'Pureworker',
                    );
                    return;
                  } else {
                    initClaimCoins('Daily Claim');
                  }
                }}
                height={40}
                textStyle={{
                  color: colors.white,
                  fontSize: 15,
                  fontFamily: commonStyle.fontFamily.semibold,
                }}
                disable={purecoins?.hasClaimedDaily}
                style={styles.claimButton}
              />
            </View>

            {userType.userType === 'CUSTOMER' ? (
              <View style={styles.taskButton}>
                <View style={styles.iconContainer}>
                  <SpinWheel />
                  <Text style={styles.taskButtonTitle}>Transaction</Text>
                </View>
                <Text style={styles.taskButtonSubtitle}>
                  Order for a service to claim more coins. Transact now, earn
                  more
                </Text>
                <CustomButton
                  text={'Claim'}
                  onClick={() => {
                    if (purecoins?.hasCompletedTransaction) {
                      toastAlertWarn(
                        'You have already completed a transaction today',
                        'Pureworker',
                      );
                    } else {
                      initClaimCoins('Transaction');
                    }
                  }}
                  height={40}
                  textStyle={{
                    color: colors.white,
                    fontSize: 15,
                    fontFamily: commonStyle.fontFamily.semibold,
                  }}
                  disable={purecoins?.hasCompletedTransaction}
                  style={styles.claimButton}
                />
              </View>
            ) : (
              <View style={styles.taskButton}>
                <View style={styles.iconContainer}>
                  <SpinWheel />
                  <Text style={styles.taskButtonTitle}>Spin Wheel</Text>
                </View>
                <Text style={styles.taskButtonSubtitle}>
                  Spin the wheel for a chance to win big prizes.
                </Text>
                <CustomButton
                  text={'Spin'}
                  onClick={() => {
                    if (purecoins?.hasCompletedTransaction) {
                      toastAlertWarn(
                        'You have already completed a transaction today',
                        'Pureworker',
                      );
                    } else {
                      navigation.navigate('SpinToWinScreen');
                    }
                  }}
                  height={40}
                  textStyle={{
                    color: colors.white,
                    fontSize: 15,
                    fontFamily: commonStyle.fontFamily.semibold,
                  }}
                  style={styles.claimButton}
                  disable={purecoins?.hasCompletedTransaction}
                />
              </View>
            )}
          </View>
        </View>
        <View style={{height: 50}} />
      </ScrollView>

      {/* Modal for showing the "Coins claimed" message */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Image
                  source={images.coin}
                  style={{width: 50, height: 50}}
                  resizeMode="contain"
                />

                <View style={{}}>
                  <Textcomp
                    text={"Coins claimed! Don't stop now."}
                    size={20}
                    lineHeight={28}
                    color={'#000413'}
                    fontFamily={'Inter-Bold'}
                    style={{textAlign: 'center'}}
                  />
                </View>

                <View style={{}}>
                  <Textcomp
                    text={'Come back tomorrow to claim more'}
                    size={14}
                    lineHeight={20}
                    color={'#000413'}
                    fontFamily={'Inter-Regular'}
                    style={{textAlign: 'center'}}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* MODAL FOR CONVERSION */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isConversionModalVisible}
        onRequestClose={handleCloseConversionModal}>
        <Pressable
          style={styles.conversionModalOverlay}
          onPress={handleCloseConversionModal}>
          <View style={styles.conversionModalContainer}>
            <Image
              source={conversionModalContent.icon}
              style={styles.conversionModalIcon}
            />
            <Text style={styles.conversionModalTitle}>
              {conversionModalContent.title}
            </Text>
            <Text style={styles.conversionModalMessage}>
              {conversionModalContent.message}
            </Text>
          </View>
        </Pressable>
      </Modal>
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
    backgroundColor: colors.darkParpal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  headerText: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.medium,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  coinsContainer: {
    height: Platform.OS === 'ios' ? SIZES.height * 0.425 : SIZES.height * 0.455,
    backgroundColor: colors.darkParpal,
    paddingBottom: 50,
  },

  coinsBox: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 100,
  },
  coinItem: {
    alignItems: 'center',
  },

  coinTextContainer: {
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: colors.white,
    marginTop: 4,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    width: 'auto',
  },

  coinTextInput: {
    color: colors.white,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 48,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginRight: 35,
    width: 'auto',
  },

  coinTextArrowContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
  },

  coinLabel: {
    color: colors.white,
    fontSize: 12,
    marginTop: 2,
    fontFamily: commonStyle.fontFamily.regular,
  },
  pureCoinsDisplay: {
    alignItems: 'center',
    marginTop: 16,
  },
  pureCoinsText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.medium,
  },
  pureCoinsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pureCoinsValue: {
    color: colors.white,
    fontSize: 48,
    fontFamily: commonStyle.fontFamily.bold,
  },
  convertButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 40,
    marginTop: 50,
    borderRadius: 8,
    height: 40,
    width: '40%',
  },
  convertButtonText: {
    color: colors.black,
    fontSize: 14,
    lineHeight: 15,
    fontFamily: commonStyle.fontFamily.semibold,
  },
  dailyTasksContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dailyTasksTitle: {
    color: colors.black,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.bold,
  },
  dailyTasksSubtitle: {
    color: colors.grey,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    fontFamily: commonStyle.fontFamily.regular,
    marginBottom: 16,
  },
  taskButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  taskButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    width: '49%',
    borderColor: colors.greyLight1,
    borderWidth: 2,
    justifyContent: 'space-between',
  },
  taskButtonTitle: {
    fontSize: 12.5,
    lineHeight: 14.5,
    fontFamily: commonStyle.fontFamily.semibold,
    marginLeft: 5,
    color: colors.black,
  },
  taskButtonSubtitle: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.grey,
    marginVertical: 8,
  },
  claimButton: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 30,
    width: '60%',
  },
  claimButtonText: {
    color: colors.white,
    fontSize: 14,

    fontFamily: commonStyle.fontFamily.bold,
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    marginVertical: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.grey,
  },

  conversionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  conversionModalContainer: {
    width: 350,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  conversionModalIcon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  conversionModalTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.black,
    marginBottom: 10,
  },
  conversionModalMessage: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.grey,
    textAlign: 'center',
  },
});

export default PureCoinsHome;
