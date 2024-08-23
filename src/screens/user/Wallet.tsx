import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Modal from 'react-native-modal/dist/modal';
import {addUserData} from '../../store/reducer/mainSlice';
import {getUser, triggerPhoneVerification} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import socket from '../../utils/socket';
import {formatAmount2} from '../../utils/validations';
import WalletModal from '../../components/modals/WalletModal';
import TransPin from '../../components/modals/transPin';

const Wallet = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [InfoModal, setInfoModal] = useState(false);
  const [ContactAgent, setContactAgent] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [setWalletPin, setSetWalletPin] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log(`he--${setWalletPin}`, userData?.hasPinCreated);
  // if (!userData?.hasPinCreated) {
  //   setSetWalletPin(true);
  // }
  //   }, [userData?.hasPinCreated]),
  // );

  console.log('bbb', userData?.hasPinCreated, 'setWallet', setWalletPin);

  const initGetUsers = async () => {
    setisLoading(true);
    const res: any = await getUser('');
    console.log('dddddddd', res);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
    setisLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      initGetUsers();
    }, []),
  );

  useEffect(() => {
    const initGetUsers_ = async () => {
      setisLoading(true);
      const res: any = await getUser('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      setisLoading(false);
      // setloading(false);
    };
    // initGetUsers_();
  }, [dispatch, navigation]);
  const supportUser = useSelector((store: any) => store.user.supportUser);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    initGetUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
      <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={tw`flex-1 h-full `}
          contentContainerStyle={{flex: 1}}>
          <View
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? 10
                  : // getStatusBarHeight(true)
                    StatusBar.currentHeight &&
                    StatusBar.currentHeight + getStatusBarHeight(true),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <TouchableOpacity style={tw``} onPress={() => navigation.goBack()}>
              <Image
                source={images.cross}
                style={{height: 25, width: 25, tintColor: 'black'}}
                resizeMode="contain"
                // onMagicTap={() => navigation.goBack()}
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Wallet'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View style={tw`flex-1  h-full`}>
            <View style={[tw``, {marginHorizontal: perWidth(30)}]}>
              <View
                style={[
                  tw`mx-auto flex flex-row justify-between  w-full `,
                  {marginTop: perHeight(20)},
                ]}>
                <View style={tw``}>
                  <Textcomp
                    text={'Wallet'}
                    size={16}
                    lineHeight={18}
                    color={'#000413'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <TouchableOpacity
                  style={tw``}
                  onPress={() => {
                    initGetUsers();
                  }}>
                  <Image
                    source={images.refresh}
                    style={{height: 17, width: 17, tintColor: 'black'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  tw`flex flex-row bg-[#D9D9D9] items-center px-3`,
                  {
                    height: perHeight(55),
                    marginTop: perHeight(34),
                    borderRadius: 5,
                  },
                ]}>
                <View style={tw``}>
                  <Image
                    source={images.info}
                    style={{height: 17, width: 17, tintColor: 'black'}}
                    resizeMode="contain"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    // setInfoModal(true);
                    socket.connect();
                    setInfoModal(false);
                    navigation.navigate('Inbox', {
                      id: supportUser?._id || supportUser?.id,
                      name: 'Support',
                    });
                  }}
                  style={tw`ml-3`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Having Payment issues?'}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw``, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      text={'Contact support'}
                      size={12}
                      lineHeight={14}
                      color={'#88087B'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  tw`flex flex-col bg-[#2D303C] px-2.5`,
                  {
                    height: perHeight(90),
                    marginTop: perHeight(27),
                    borderRadius: 5,
                    paddingVertical: perHeight(9),
                  },
                ]}>
                {/* <View style={tw``}>
                <Image
                  source={images.info}
                  style={{height: 17, width: 17, tintColor: 'black'}}
                  resizeMode="contain"
                />
              </View> */}
                <View style={tw`ml-3`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Balance'}
                      size={13}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw``, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      text={`₦ ${formatAmount2(
                        userData?.wallet?.availableBalance,
                      )}`}
                      size={14}
                      lineHeight={16}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>

                  <View style={tw`flex flex-row`}>
                    <TouchableOpacity
                      onPress={() => {
                        if (!userData?.hasPinCreated) {
                          setSetWalletPin(true);
                        } else {
                          navigation.navigate('PaymentMethod2');
                        }
                      }}
                      style={[
                        tw`bg-black items-center justify-center rounded-full`,
                        {
                          marginTop: perHeight(20),
                          width: perWidth(100),
                          height: perHeight(21),
                        },
                      ]}>
                      <Textcomp
                        text={'Fund wallet'}
                        size={14}
                        lineHeight={16}
                        color={colors.primary}
                        fontFamily={'Inter-Bold'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (!userData?.hasPinCreated) {
                          setSetWalletPin(true);
                        } else {
                          navigation.navigate('Withdraw');
                        }
                      }}
                      style={[
                        tw`bg-black items-center justify-center rounded-full ml-4`,
                        {
                          marginTop: perHeight(20),
                          width: perWidth(100),
                          height: perHeight(21),
                        },
                      ]}>
                      <Textcomp
                        text={'Withdraw'}
                        size={14}
                        lineHeight={16}
                        color={colors.primary}
                        fontFamily={'Inter-Bold'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* <View
                style={[
                  tw`border-t  border-b`,
                  {marginTop: perHeight(36), height: perHeight(95)},
                ]}>
                <View style={[tw``, {marginTop: perHeight(13)}]}>
                  <Textcomp
                    text={'Add a card'}
                    size={16}
                    lineHeight={18}
                    color={'#000413'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={[tw`flex flex-row items-center  mt-4`, {}]}>
                  <View style={tw``}>
                    <Image
                      source={images.wallet2}
                      style={{height: 25, width: 25, tintColor: 'black'}}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={tw`ml-3`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Add a debit/credit card'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>
                    <View
                      style={[tw`flex flex-row`, {marginTop: perHeight(5)}]}>
                      <View>
                        <Image
                          source={images.star}
                          style={{
                            height: 12,
                            width: 12,
                            tintColor: colors.primary,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={tw`ml-2`}>
                        <Textcomp
                          text={'Recommended'}
                          size={12}
                          lineHeight={14}
                          color={'#000000'}
                          fontFamily={'Inter-Medium'}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View> */}
              <View
                style={[
                  tw` `,
                  {marginTop: perHeight(20), height: perHeight(115)},
                ]}>
                <View style={[tw``, {marginTop: perHeight(13)}]}>
                  <Textcomp
                    text={'Financial history'}
                    size={16}
                    lineHeight={18}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (!userData?.hasPinCreated) {
                      setSetWalletPin(true);
                    } else {
                      navigation.navigate('FundingHistory');
                    }
                  }}
                  style={[
                    tw`flex flex-row items-center bg-[#2D303C] px-3 rounded-full mr-auto`,
                    {
                      marginTop: perHeight(15),
                      height: perHeight(40),
                      width: perWidth(180),
                    },
                  ]}>
                  <View>
                    <Image
                      source={images.fundingHistory}
                      style={{
                        height: 25,
                        width: 27,
                        tintColor: '#FFCD1E',
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={tw`ml-2`}>
                    <Textcomp
                      text={'Funding history'}
                      size={12}
                      lineHeight={14}
                      color={'#FFCD1E'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!userData?.hasPinCreated) {
                      setSetWalletPin(true);
                    } else {
                      navigation.navigate('TransactionHistory');
                    }
                  }}
                  style={[
                    tw`flex flex-row items-center bg-[#2D303C] px-3 rounded-full `,
                    {
                      marginTop: perHeight(15),
                      height: perHeight(40),
                      width: perWidth(180),
                    },
                  ]}>
                  <View>
                    <Image
                      source={images.transactionHistory}
                      style={{
                        height: 25,
                        width: 27,
                        tintColor: '#FFCD1E',
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={tw`ml-2`}>
                    <Textcomp
                      text={'Transaction history'}
                      size={13}
                      lineHeight={14}
                      color={'#FFCD1E'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
      </SafeAreaView>

      {!InfoModal && (
        <WalletModal
          visible={setWalletPin}
          navigation={navigation}
          onClose={() => setSetWalletPin(false)}
          onClose2={() => navigation.goBack()}
        />
      )}

      {!setWalletPin && (
        <Modal
          isVisible={InfoModal}
          onModalHide={() => {
            setInfoModal(false);
            setContactAgent(false);
          }}
          style={{width: SIZES.width, marginHorizontal: 0}}
          deviceWidth={SIZES.width}>
          <View style={tw` h-full w-full bg-black bg-opacity-5`}>
            <TouchableOpacity
              onPress={() => setInfoModal(false)}
              style={tw`flex-1`}
            />
            {!ContactAgent && (
              <View
                style={[
                  tw`h-[25%]  items-center mt-auto bg-[#D9D9D9]`,
                  {
                    marginBottom: -20,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setInfoModal(false);
                    setContactAgent(false);
                  }}
                  style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
                />
                <TouchableOpacity
                  onPress={() => {
                    setInfoModal(false);
                    navigation.navigate('FAQ');
                  }}
                  style={{
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 18,
                  }}>
                  <Textcomp
                    text={'FAQs'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setContactAgent(true);
                  }}
                  style={{
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 10,
                  }}>
                  <Textcomp
                    text={'Connect to an Agent'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </TouchableOpacity>
              </View>
            )}

            {ContactAgent && (
              <View
                style={tw`h-[10%] justify-center items-center mt-auto bg-[#D9D9D9]`}>
                <View>
                  <Textcomp
                    text={'An Agent will contact you as soon as possible'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </View>
            )}
          </View>
        </Modal>
      )}

    </>
  );
};

export default Wallet;
