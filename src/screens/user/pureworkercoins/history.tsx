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
import {getPopularService} from '../../../utils/api/func';
import {useDispatch, useSelector} from 'react-redux';
import {
  claimCoins,
  getPurecoinHistory,
  getPurecoinStatus,
} from '../../../utils/api/purecoins';
import {
  addPopularServices,
  setPurecoins,
} from '../../../store/reducer/mainSlice';
import Textcomp from '../../../components/Textcomp';
import {toastAlertError} from '../../../utils/alert';
import tw from 'twrnc';
import {formatDateHistory3} from '../../../utils/utils';
import CoinIcon2 from '../../../assets/svg/coin2';
import { SIZES } from '../../../utils/position/sizes';

const PureCoinsHistory = () => {
  const navigation = useNavigation();

  const purecoinsHistory = useSelector(
    (state: any) => state.user.purecoinsHistory,
  );
  console.log(purecoinsHistory);

  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);

  const initgetPurecoinHistory = async () => {
    setisLoading(true);
    const res: any = await getPurecoinHistory('');
    if (res?.status === 201 || res?.status === 200) {
      // dispatch(setPurecoins(res?.data?.data));
    }
    setisLoading(false);
  };

  useEffect(() => {
    initgetPurecoinHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={tw``}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={images.back}
              resizeMode="contain"
              style={{width: 25, height: 25, tintColor: 'black'}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>History</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`h-6`} />
        {purecoinsHistory?.map((item, index) => {
          return (
            <View
              key={index}
              style={tw`flex flex-row border-b  border-[#0000001A] pb-3 justify-between mt-4  px-4`}>
              <View style={tw`items-start flex flex-row  `}>
                <CoinIcon2 style={{marginTop: 4}} />
                <View style={tw`items-start ml-2`}>
                  <View style={tw``}>
                    <Textcomp
                      text={`${item?.task}`}
                      size={14}
                      lineHeight={20}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                      style={{textAlign: 'center'}}
                    />
                  </View>

                  <View style={tw``}>
                    <Textcomp
                      text={`${formatDateHistory3(item?.updatedAt)}`}
                      size={12}
                      lineHeight={20}
                      color={'#000413'}
                      fontFamily={'Inter-Regular'}
                      style={{textAlign: 'center'}}
                    />
                  </View>
                </View>
              </View>
              <View style={tw``}>
                <Textcomp
                  text={`+ ${item?.coinsEarned}`}
                  size={16}
                  lineHeight={20}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                  style={{textAlign: 'center'}}
                />
              </View>
            </View>
          );
        })}
        {!purecoinsHistory ||
          (purecoinsHistory?.length < 1 && (
            <View
              style={[
                tw`mx-auto items-center `,
                {marginTop: SIZES.height * 0.35},
              ]}>
              <Textcomp
                text={'No Transactions Yet'}
                size={16.5}
                lineHeight={16.5}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
          ))}

        <View style={{height: 50}} />
      </ScrollView>
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
    // backgroundColor: colors.darkParpal,
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
  },

  coinsContainer: {
    height: 400,
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
  },

  coinTextInput: {
    color: colors.white,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 48,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginRight: 35,
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
    fontSize: 16,
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
    marginTop: 16,
    borderRadius: 8,
    width: '40%',
  },
  convertButtonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
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
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
  },
  dailyTasksSubtitle: {
    color: colors.grey,
    fontSize: 14,
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
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.semibold,
    marginLeft: 5,
    color: colors.black,
  },
  taskButtonSubtitle: {
    fontSize: 14,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.grey,
    marginVertical: 8,
  },
  claimButton: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    fontSize: 20,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    marginBottom: 10,
  },
  conversionModalMessage: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.grey,
    textAlign: 'center',
  },
});

export default PureCoinsHistory;
