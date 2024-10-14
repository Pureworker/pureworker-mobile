import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ScrollView,
  Platform,
  RefreshControl,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../constants/images';
import TextInputs from '../../components/TextInput2';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Modal from 'react-native-modal/dist/modal';
import {
  getCategory,
  getPairedCustomers,
  getProviderOrders,
  getSupportUser,
  getUser,
} from '../../utils/api/func';
import {
  addSCategory,
  addUserData,
  addpairedCustomers,
  addproviderOrders,
  setidCheckModal,
  setwelcomeModal,
} from '../../store/reducer/mainSlice';
import ClosetoYou3 from '../../components/cards/CloseToYou3';
import {formatAmount, formatAmount2} from '../../utils/validations';
import FastImage from 'react-native-fast-image';
import socket from '../../utils/socket';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {ToastLong} from '../../utils/utils';
import WelcomeModal from '../../components/SignupModal';
import RequireIDChechkModal from '../../components/modals/RequireIDChechkModal';
import PairedCustomers from '../../components/cards/pairedCustomers';

const Home = ({navigation}: any) => {
  useEffect(() => {
    //Request location permission
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          // Permission granted, get user's location
          Geolocation.getCurrentPosition(
            (position: any) => {
              const {latitude, longitude} = position.coords;
              console.error(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            (error: any) => console.error(error),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 60000},
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [InfoModal, setInfoModal] = useState(false);
  const [ContactAgent, setContactAgent] = useState(false);
  const [OinProgress, setOinProgress] = useState([]);
  const [OinPending, setOinPending] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);
  // navigation.navigate('FaceDetection', {page: 'Profile'});
  // navigation.navigate('Congratulations');
  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      console.log('dddddddd', res?.data?.user);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      if (res?.data?.user?.isIdentitySubmitted !== false) {
        dispatch(setidCheckModal(true));
      }
      const _userData = res?.data?.user;
      if (
        !_userData?.geoLocation ||
        !_userData.geoLocation.coordinates ||
        (_userData.geoLocation.coordinates[0] === 0 &&
          _userData.geoLocation.coordinates[1] === 0) ||
        !_userData.geoLocation.coordinates.length
      ) {
        navigation.navigate('AddAddress');
        ToastLong('Address is required');
      } else {
        // Continue with your logic if geoLocation is valid
        // if (!_userData?.liveTest) {
        //   if (userData?.liveTest) {
        //   } else {
        //     navigation.navigate('FaceDetection');
        //     ToastLong('Virtual Interview is compulsory');
        //   }
        // }
      }
      const emitProviderOnlineStatus = () => {
        // Emit an event to the backend indicating that the customer is still connected
        socket.connect();
        socket.emit('provideronlinestatus', {
          customerId: userData?.id || userData?._id,
        });
      };
      emitProviderOnlineStatus();
    };
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getCategory('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addSCategory(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetPairedCustomers = async () => {
      setisLoading(true);
      const res: any = await getPairedCustomers('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addpairedCustomers(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetUsers();
    initGetPairedCustomers();
    getSupportUser('');
    initGetCategory();
  }, [dispatch]);
  const pairedCustomers = useSelector((state: any) => state.user.pairedCustomers);
  const providerOrders = useSelector((state: any) => state.user.providerOrders);
  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      // const res: any = await getProviderOrders('64f20fb6ee98ab7912406b14');
      const res: any = await getProviderOrders(userData?._id);
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addproviderOrders(res?.data?.data));
        let inProgress = providerOrders?.filter(
          (item: {status: string}) => item?.status === 'INPROGRESS',
        );
        let pending = providerOrders?.filter(
          (item: {status: string}) => item?.status === 'PENDING',
        );
        setOinProgress(inProgress);
        setOinPending(pending);
      }
      setisLoading(false);
    };
    initGetOrders();
    // }, [providerOrders, userData?._id]);
  }, []);
  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getProviderOrders(userData?._id);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addproviderOrders(res?.data?.data));
        // let inProgress = res?.data?.data?.filter(
        //   (item: {status: string}) => item?.status === 'INPROGRESS',
        // );
        let inProgress = res?.data?.data?.filter(
          (item: {status: string}) =>
            item?.status === 'INPROGRESS' || item?.status === 'TRACK',
        );
        let pending = res?.data?.data?.filter(
          (item: {status: string}) => item?.status === 'PENDING',
        );
        setOinProgress(inProgress);
        setOinPending(pending);
      }
      setisLoading(false);
    };
    initGetOrders();
    const intervalId = setInterval(initGetOrders, 2.5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    // let inProgress = providerOrders?.filter(
    //   (item: {status: string}) => item?.status === 'INPROGRESS',
    // );
    let inProgress = providerOrders?.filter(
      (item: {status: string}) =>
        item?.status === 'INPROGRESS' || item?.status === 'TRACK',
    );
    let pending = providerOrders?.filter(
      (item: {status: string}) => item?.status === 'PENDING',
    );
    setOinProgress(inProgress);
    setOinPending(pending);
  }, [providerOrders]);
  const formStage = useSelector((state: any) => state.user.formStage);
  const supportUser = useSelector((store: any) => store.user.supportUser);
  useEffect(() => {
    const emitProviderOnlineStatus = () => {
      // Emit an event to the backend indicating that the customer is still connected
      socket.connect();
      socket.emit('provideronlinestatus', {
        customerId: userData?.id || userData?._id,
      });
    };
    // Initial emit
    emitProviderOnlineStatus();
    // console.error('Emitted online');
    // Set up the interval to emit every 30 seconds
    const intervalId = setInterval(emitProviderOnlineStatus, 120000);
    return () => {
      // Clean up the interval when the component is unmounted
      clearInterval(intervalId);
      // Disconnect the socket when the component is unmounted
      socket.disconnect();
    };
  }, []);
  const welcomeModal = useSelector((state: any) => state.user.welcomeModal);
  const idcheckModal = useSelector((state: any) => state.user.idcheckModal);
  console.log(userData?.businessName);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    const initGetUsers = async () => {
      const res: any = await getUser('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      const _userData = res?.data?.user;
      if (
        !_userData?.geoLocation ||
        !_userData.geoLocation.coordinates ||
        (_userData.geoLocation.coordinates[0] === 0 &&
          _userData.geoLocation.coordinates[1] === 0) ||
        !_userData.geoLocation.coordinates.length
      ) {
        navigation.navigate('AddAddress');
        ToastLong('Address is required');
      } else {
      }
      const emitProviderOnlineStatus = () => {
        // Emit an event to the backend indicating that the customer is still connected
        socket.connect();
        socket.emit('provideronlinestatus', {
          customerId: userData?.id || userData?._id,
        });
      };
      emitProviderOnlineStatus();
    };
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getCategory('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addSCategory(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetPairedCustomers = async () => {
      setisLoading(true);
      const res: any = await getPairedCustomers('');
      console.log('pairedCustomers', res);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addpairedCustomers(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetUsers();
    getSupportUser('');
    initGetCategory();
    initGetPairedCustomers();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    socket.connect();
    socket.emit('authentication', userData);
    console.log('-idid', socket.id);
    return () => {
      // socket.disconnect();
    };
  }, [userData]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
        <View
          style={[
            tw`items-center justify-center`,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              paddingTop: Platform.OS === 'ios' ? 10 : 27.5,
            },
          ]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FastImage
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.parpal,
              }}
              source={
                userData?.profilePic
                  ? {
                      uri: userData?.profilePic,
                      headers: {Authorization: 'someAuthToken'},
                      priority: FastImage.priority.high,
                      // cache: FastImage.cacheControl.cacheOnly,
                    }
                  : images.profile
              }
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInfoModal(true);
            }}
            style={{
              backgroundColor: '#000',
              width: 40,
              height: 40,
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={images.question}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            tw`pb-3`,
            {marginLeft: perWidth(18), marginTop: perHeight(28)},
          ]}>
          <Textcomp
            // text={`Welcome ${userData?.firstName || userData?.businessName},`}
            // text={`Welcome ${
            //   userData?.firstName
            //     ? userData?.firstName !== undefined
            //       ? userData?.firstName
            //       : userData?.businessName === undefined
            //       ? ''
            //       : userData?.businessName
            //     : ''
            // },`}
            text={`Welcome ${
              userData?.firstName?.trimEnd() ||
              (userData?.businessName !== undefined
                ? userData?.businessName?.trimEnd()
                : '')
            },`}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {userData?.isVerified === 'incomplete' && formStage !== 6 ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('ProfileStep21');
                  if (formStage === 1) {
                    navigation.navigate('ProfileStep1');
                  } else if (formStage === 2) {
                    navigation.navigate('ProfileStep2');
                  } else if (formStage === 3) {
                    navigation.navigate('ProfileStep3');
                  } else if (formStage === 4) {
                    navigation.navigate('ProfileStep4');
                  } else if (formStage === 5) {
                    navigation.navigate('ProfileStep5');
                  } else if (formStage === 21) {
                    navigation.navigate('ProfileStep21');
                  }
                }}
                style={[
                  tw`bg-[#2D303C] mx-auto items-center justify-center`,
                  {
                    width:
                      Platform.OS === 'ios' ? perWidth(309) : perWidth(315),
                    height:
                      Platform.OS === 'ios' ? perHeight(30) : perHeight(35),
                    borderRadius: 7,
                    marginTop: perHeight(10),
                  },
                ]}>
                <Textcomp
                  text={'Complete your registration to accept orders'}
                  size={Platform.OS === 'ios' ? 14 : 13}
                  lineHeight={16}
                  color={colors.primary}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    'https://youtu.be/4sOGNUYIIjU?si=usMWyV9xFkGUzmqU',
                  );
                }}
                style={[
                  tw` mr-auto ml-[30%] flex flex-row items-center justify-center`,
                  {
                    width: perWidth(335),
                    height: perHeight(30),
                    borderRadius: 7,
                    // marginTop: perHeight(43),
                  },
                ]}>
                <Textcomp
                  text={'Watch How'}
                  size={14}
                  lineHeight={18}
                  color={colors.parpal}
                  fontFamily={'Inter-Bold'}
                  style={tw`text-center underline`}
                />
              </TouchableOpacity>
            </>
          ) : null}
          {userData?.isVerified === 'review' && (
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                // navigation.navigate('ProfileStep11');
                // navigation.navigate('ProfileStep3');
              }}
              style={[
                tw`bg-[#2D303C] mx-auto items-center justify-center`,
                {
                  width: perWidth(309),
                  height: perHeight(30),
                  borderRadius: 7,
                  marginTop: perHeight(10),
                },
              ]}>
              <Textcomp
                text={'Your profile is under review...'}
                size={14}
                lineHeight={16}
                color={colors.primary}
                fontFamily={'Inter-Medium'}
              />
            </TouchableOpacity>
          )}
          {userData?.isVerified === 'rejected' && (
            <TouchableOpacity
              // disabled={true}
              onPress={() => {
                navigation.navigate('ProfileStep11');
              }}
              style={[
                tw`bg-[#2D303C] mx-auto flex flex-row items-center justify-center`,
                {
                  width: perWidth(309),
                  height: perHeight(30),
                  borderRadius: 7,
                  marginTop: perHeight(10),
                },
              ]}>
              <Textcomp
                text={'Profile verification failed '}
                size={14}
                lineHeight={16}
                color={'#D20713'}
                fontFamily={'Inter-Bold'}
              />
              <Textcomp
                text={' (Check your email)'}
                size={14}
                lineHeight={16}
                color={colors.primary}
                fontFamily={'Inter-Medium'}
              />
            </TouchableOpacity>
          )}
          {userData?.isVerified === 'approved' && (
            <></>
            // <TouchableOpacity
            //   disabled={true}
            //   onPress={() => {
            //     // navigation.navigate('ProfileStep1');
            //   }}
            //   style={[
            //     tw`bg-[#2D303C] mx-auto flex flex-row items-center justify-center`,
            //     {
            //       width: perWidth(309),
            //       height: perHeight(30),
            //       borderRadius: 7,
            //       marginTop: perHeight(43),
            //     },
            //   ]}>
            //   <Textcomp
            //     text={'Profile approved'}
            //     size={14}
            //     lineHeight={16}
            //     color={'#45FF27'}
            //     fontFamily={'Inter-Bold'}
            //   />
            //   <Textcomp
            //     text={' (You will start receiving orders)'}
            //     size={12}
            //     lineHeight={16}
            //     color={colors.primary}
            //     fontFamily={'Inter-Medium'}
            //   />
            // </TouchableOpacity>
          )}
          {/* Paired Customers */}
          {pairedCustomers?.length > 0 && <>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                { marginLeft: perWidth(16), marginTop: perHeight(14) },
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Paired Customers'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PairedCustomers');
                }}
                style={[tw`mr-4`]}>
                <Textcomp
                  text={'See All'}
                  size={14}
                  lineHeight={16}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
            </View>
            <Textcomp
              text={'The customers I need to your service. Message them to get more details.'}
              size={10}
              lineHeight={16}
              color={'#4A4949'}
              fontFamily={'Inter-Regular'}
              style={[tw`mx-4`]}
            />
            <View style={{ flex: 1 }}>
              <FlatList
                data={pairedCustomers}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={(item: any, index: any) => {
                  if (item.index === pairedCustomers?.length - 1) {
                    console.log('paired customers to you',item?.item);
                    return (
                      <>
                        <PairedCustomers
                          navigation={navigation}
                          item={item?.item}
                          index={index}
                          key={index}
                        />
                        <View style={{ marginRight: 50 }} />
                      </>
                    );
                  } else {
                    return (
                      <PairedCustomers
                        navigation={navigation}
                        item={item?.item}
                        index={index}
                      />
                    );
                  }
                }}
                style={{ paddingLeft: 20 }}
                keyExtractor={item => item.id}
              />
            </View>
          </>
          }
          <View
            style={[
              tw`flex flex-row`,
              {marginHorizontal: perWidth(27), marginTop: perHeight(21)},
            ]}>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`${providerOrders?.length}`}
                  size={36}
                  lineHeight={36}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
                <Image
                  resizeMode="contain"
                  source={images.orderlist}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Orders'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                  marginLeft: perWidth(31),
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`${OinPending?.length}`}
                  size={36}
                  lineHeight={36}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
                <Image
                  resizeMode="contain"
                  source={images.pending}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Pending Orders'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              tw`flex flex-row`,
              {marginHorizontal: perWidth(27), marginTop: perHeight(21)},
            ]}>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`₦${
                    userData?.wallet?.availableBalance
                      ? formatAmount2(userData?.wallet?.availableBalance)
                      : 0
                  }`}
                  size={20}
                  lineHeight={20}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Total Earning'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                  marginLeft: perWidth(31),
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  // text={'NGN249,0000'}
                  text={`₦${
                    userData?.wallet?.availableBalance
                      ? formatAmount2(userData?.wallet?.availableBalance)
                      : 0
                  }`}
                  size={20}
                  lineHeight={20}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Wallet'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>

          {/* Popular Section */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                {marginLeft: perWidth(18), marginTop: perHeight(22)},
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Orders in progress'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Orders');
                }}
                style={[tw`mr-4`]}>
                <Textcomp
                  text={'See All'}
                  size={14}
                  lineHeight={16}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
            </View>

            {OinProgress?.length < 1 ? (
              <View style={[tw`mt-4`, {marginLeft: perWidth(27)}]}>
                <Textcomp
                  text={'You have no orders in progress'}
                  size={18}
                  lineHeight={18}
                  color={'#88087B'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={OinProgress}
                  horizontal={true}
                  renderItem={(item: any) => {
                    return (
                      <ClosetoYou3
                        navigation={navigation}
                        item={item?.item}
                        index={item.index}
                      />
                    );
                  }}
                  keyExtractor={item => item?.id}
                />
              </View>
            )}
          </View>
          {/* Pending Orders */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                {marginLeft: perWidth(18), marginTop: perHeight(28)},
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Pending Orders'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Orders');
                }}
                style={[tw`mr-4`]}>
                <Textcomp
                  text={'See All'}
                  size={14}
                  lineHeight={16}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
            </View>
            {OinPending?.length < 1 ? (
              <View style={[tw`mt-4`, {marginLeft: perWidth(27)}]}>
                <Textcomp
                  text={'You have no orders pending'}
                  size={18}
                  lineHeight={18}
                  color={'#88087B'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={OinPending}
                  horizontal={true}
                  renderItem={(item: any) => {
                    return (
                      <ClosetoYou3
                        item={item?.item}
                        navigation={navigation}
                        index={item.index}
                      />
                    );
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </View>

          <View style={tw`h-50`} />
        </ScrollView>
      </View>
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
            <View style={tw`h-[20%]  items-center mt-auto bg-[#D9D9D9]`}>
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
                  // setContactAgent(true);
                  socket.connect();
                  setInfoModal(false);
                  console.log('ERRRRRRRRRRRRR', supportUser);
                  navigation.navigate('Inbox', {
                    id: supportUser?._id || supportUser?.id,
                    name: ' Support',
                  });
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

      {welcomeModal && welcomeModal === true && (
        <WelcomeModal
          close={() => {
            dispatch(setwelcomeModal(false));
          }}
        />
      )}
      {idcheckModal && idcheckModal === true && (
        <RequireIDChechkModal
          navigation={navigation}
          close={() => {
            dispatch(setidCheckModal(false));
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
