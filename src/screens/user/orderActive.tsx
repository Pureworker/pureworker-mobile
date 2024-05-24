import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInput2';
import CloseToYouCard2 from '../../components/cards/closeToYou2';
import Orderscomponent from '../../components/Orderscomponent';
import ServiceproviderReview from '../../components/modals/serviceproviderReview';
import PrivateFeedback from '../../components/modals/privateFeedback';
import RateyourExperience from '../../components/modals/rateyourexperience';
import OrderCompleted from '../../components/modals/OrderCompleted';
import OrderDispute from '../../components/modals/orderDispute';
import OrderDelivered from '../../components/modals/orderDelivered';
import OrderInProgress from '../../components/modals/OrderinProgress';
import OrderPlaced from '../../components/modals/orderPlaced';
import ScheduledDeliveryDate from '../../components/modals/scheduledDeliveryDate';
import colors from '../../constants/colors';
import {
  cancelOrder,
  completedOrder,
  getOrderDetailbyID,
  getProviderLocation,
  getUserOrders,
} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {
  addViewOrder,
  addcustomerOrders,
  addproviderOrders,
  setProviderLocation,
} from '../../store/reducer/mainSlice';
import Orderscomponent3 from '../../components/Orderscomponent3';
import Checked from '../../assets/svg/checked';
import {
  ToastLong,
  ToastShort,
  formatDate3,
  formatDateToCustomFormat,
} from '../../utils/utils';
import ContactSupportIcon from '../../assets/svg/contactSupport';
import Cross from '../../assets/svg/Cross';
import socket from '../../utils/socket';
import Modal from 'react-native-modal/dist/modal';
import OrdersDeclineReason from '../../components/OrdersDeclineReason';
import LocationIcon2 from '../../assets/svg/Location2';
import TipProvider from '../../assets/svg/tipProvider';
import CompleteTick from '../../assets/svg/complete';
import CalendarIcon from '../../assets/svg/calendar';

const OrderActive = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [activeSection, setactiveSection] = useState('Active');
  const viewOrder = useSelector((state: any) => state.user.viewOrder);
  const orders = [0, 1, 2, 3];
  const item = route.params.data;
  const passedData = viewOrder ?? route.params.data;
  console.log(passedData?.serviceProvider);
  // console.log(route.params.data);
  const fetchOrderByID = async () => {
    // setisLoading(true);
    try {
      const res: any = await getOrderDetailbyID(passedData?._id ?? item?._id);
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addViewOrder(res?.data?.data?.order));
      }
      setisLoading(false);
    } catch (error) {
      ToastShort('Error Fetching Order Data.');
    } finally {
      setisLoading(false);
    }
  };
  //modals
  const [serviceProviderModal, setserviceProviderModal] = useState(false);
  const [privateFeedback, setprivateFeedback] = useState(false);
  const [rateYourExperience, setrateYourExperience] = useState(false);
  const [orderCompleted, setorderCompleted] = useState(false);
  const [orderDispute, setorderDispute] = useState(false);
  const [orderDelivered, setorderDelivered] = useState(false);
  const [orderInProgress, setorderInProgress] = useState(false);
  const [orderPlacing, setorderPlacing] = useState(false);
  const [scheduledDeliveryDate, setscheduledDeliveryDate] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);
  // console.log('data:', userData);
  const [isLoading, setisLoading] = useState(false);
  const initGetOrders2 = async () => {
    setisLoading(true);
    const res: any = await getUserOrders('');
    console.log('oooooooo', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addcustomerOrders(res?.data?.data));
    }
    // setloading(false);
    setisLoading(false);
  };
  const handleComplete = async (val: any) => {
    setisLoading(true);
    try {
      if (item?._id) {
        const res = await completedOrder(item?._id, {...val});
        if (res?.status === 200 || res?.status === 201) {
          // navigation.navigate('PaymentConfirmed');
          // await initGetOrders();
          await initGetOrders2();
          await fetchOrderByID();
          setrateYourExperience(false);
          Alert.alert('successful');
        } else {
          Snackbar.show({
            text: res?.error?.message
              ? res?.error?.message
              : res?.error?.data?.message
              ? res?.error?.data?.message
              : 'Oops!, an error occured',
            duration: Snackbar.LENGTH_LONG,
            textColor: '#fff',
            backgroundColor: '#88087B',
          });
          setrateYourExperience(false);
        }
        setisLoading(false);
      } else {
        Snackbar.show({
          text: 'Please fill all fields',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setisLoading(false);
      }
    } catch (error) {
      Snackbar.show({
        text: `${error?.message ?? 'AN error occured'}`,
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    } finally {
      await fetchOrderByID();
      await initGetOrders();
      setisLoading(false);
    }
  };
  useEffect(() => {
    // setorderDelivered(true);
  }, []);
  const links = [
    {
      title: 'Order Placed',
      func: () => setorderPlacing(true),
      check: [
        'PENDING',
        'ACCEPTED',
        'TRACK',
        'INPROGRESS',
        'COMPLETED',
        'DISPUTE',
        'DECLINED',
      ],
    },
    {
      title: 'Order Accepted',
      // func: () => setorderDelivered(true),
      func: () => {},
      check: ['PENDING', 'ACCEPTED'],
    },
    {
      title: 'Service Provider in Transit',
      func: () => {},
      check: ['PENDING', 'ACCEPTED', 'TRACK'],
    },
    {
      title: 'Order In Progress',
      func: () => setorderInProgress(true),
      check: ['PENDING', 'ACCEPTED', 'TRACK', 'INPROGRESS'],
    },
    {
      title: 'Order Completed',
      func: () => setorderCompleted(true),
      check: ['PENDING', 'ACCEPTED', 'TRACK', 'INPROGRESS', 'COMPLETED'],
    },
    {
      title: 'Order Declined',
      func: () => {},
      check: ['DECLINED'],
    },
    {
      title: 'Order Cancelled',
      func: () => {},
      check: ['CANCELLED'],
    },
    // {
    //   title: 'Thank you for the tip',
    //   func: () => {},
    // },
    {
      title: 'Order Dispute',
      func: () => setorderDispute(true),
    },
    // {
    //   title: 'Rate Your Experience',
    //   func: () => setrateYourExperience(true),
    // },
    // {
    //   title: 'Private Feedback',
    //   func: function () {
    //     setprivateFeedback(!privateFeedback);
    //     console.log('hey', privateFeedback);
    //   },
    // },
    {
      title: 'Service Provider Review',
      func: () => setserviceProviderModal(true),
    },
    // {
    //   title: 'Scheduled Delivery Date',
    //   func: () => setscheduledDeliveryDate(true),
    // },
  ];
  // const providerLinks = [
  //   {
  //     title: 'Private Feedback',
  //     func: function () {
  //       setprivateFeedback(!privateFeedback);
  //       console.log('hey', privateFeedback);
  //     },
  //   },
  //   {
  //     title: 'Rate your Customer',
  //     func: () => setrateYourExperience(true),
  //   },
  //   {
  //     title: 'Service Provider Review',
  //     func: () => setserviceProviderModal(true),
  //   },
  //   {
  //     title: 'Order Completed',
  //     func: () => setorderCompleted(true),
  //   },
  //   {
  //     title: 'Order Dispute',
  //     func: () => setorderDispute(true),
  //   },
  //   {
  //     title: 'Order Delivered',
  //     func: () => setorderDelivered(true),
  //   },
  //   {
  //     title: 'Order In Progress',
  //     func: () => setorderInProgress(true),
  //   },
  //   {
  //     title: 'Scheduled Delivery Date',
  //     func: () => setscheduledDeliveryDate(true),
  //   },
  //   {
  //     title: 'Order Placed',
  //     func: () => setorderPlacing(true),
  //   },
  // ];
  const orderStatus = [
    'PENDING',
    'INPROGRESS',
    'ACCEPTED',
    'DISPUTE',
    'COMPLETED',
    'DECLINED',
    'CANCELLED',
    'TRACK',
  ];
  const supportUser = useSelector((store: any) => store.user.supportUser);
  const initGetOrders = async () => {
    setisLoading(true);
    const res: any = await getUserOrders('');
    console.log('oooooooo', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addcustomerOrders(res?.data?.data));
    }
    setisLoading(false);
  };
  const [modalSection, setmodalSection] = useState('All');
  const [InfoModal, setInfoModal] = useState(false);

  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handleCancel = async () => {
    try {
      setisLoading(true);
      if (passedData?._id) {
        const res = await cancelOrder(passedData?._id, {
          reason:
            selectedReason.toLowerCase() === 'others'
              ? otherReason
              : selectedReason,
        });
        if (res?.status === 200 || res?.status === 201) {
          // await initGetOrders();
          await fetchOrderByID();
          Alert.alert('successful');
        } else {
          ToastLong(
            `${
              res?.error?.message
                ? res?.error?.message
                : res?.error?.data?.message
                ? res?.error?.data?.message
                : 'Oops!, an error occured'
            }`,
          );
        }
        setisLoading(false);
        setInfoModal(false);
        setmodalSection('All');
      } else {
        Snackbar.show({
          text: 'Please fill all fields',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setisLoading(false);
        setInfoModal(false);
        setmodalSection('All');
      }
    } catch (error) {
      ToastLong(`${error?.data?.message ?? 'Oops!, an error occured'}`);
      // Snackbar.show({
      //   text: `${error?.data?.message ?? 'An error occured!.'}`,
      //   duration: Snackbar.LENGTH_LONG,
      //   textColor: '#fff',
      //   backgroundColor: '#88087B',
      // });
      setisLoading(false);
      setInfoModal(false);
      setmodalSection('All');
    } finally {
      await fetchOrderByID();
      await initGetOrders();
      setisLoading(false);
      setInfoModal(false);
      setmodalSection('All');
      navigation.goBack();
    }
  };
  const handleSelectedReasons = reason => {
    setSelectedReason(reason);
  };

  const [showModal, setShowModal] = useState(false);

  function isCurrentTimeGreaterThanScheduledTime(
    scheduledTime: string | number | Date,
  ) {
    // Convert scheduledTime to a Date object
    const scheduledDateTime = new Date(scheduledTime);

    // Calculate the current time 2 hours ahead
    const currentTimePlusTwoHours = new Date();
    currentTimePlusTwoHours.setHours(currentTimePlusTwoHours.getHours() + 2);

    // Compare the current time with the scheduled time plus 2 hours
    return scheduledDateTime > currentTimePlusTwoHours;
  }
  // console.log(
  //   isCurrentTimeGreaterThanScheduledTime(passedData?.scheduledDeliveryDate),passedData?.scheduledDeliveryDate
  // );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrderByID();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleToLocation = async () => {
    try {
      setisLoading(true);
      // const res: any = await getProviderLocation('65cb95af993d69fb83faf837');
      const res: any = await getProviderLocation(passedData?._id);
      console.log('location.........', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        if (res?.data?.data !== null) {
          dispatch(setProviderLocation(res?.data?.data));
          // navigation.navigate('ViewLocation', {...data});
          navigation.navigate('ViewLocation', {
            id: item?.serviceProvider._id || item?.serviceProvider?.id,
            item: item,
          });
        } else {
          ToastShort('Providers Location not available at the moment');
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? 10
              : StatusBar.currentHeight &&
                StatusBar.currentHeight + getStatusBarHeight(true),
        }}
      />
      {!searchModal ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingBottom: 5,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'Orders'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              setsearchModal(true);
            }}>
            <Image
              source={images.search}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>
      ) : (
        <View
          style={[
            tw`items-center justify-center`,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              paddingBottom: 5,
            },
          ]}>
          <TouchableOpacity onPress={() => setsearchModal(false)}>
            <Image
              source={images.cross}
              style={{height: 20, width: 20, tintColor: 'black'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInputs
            style={{marginTop: 10, width: '70%'}}
            labelText={'Search for orders'}
            state={searchInput}
            setState={setsearchInput}
          />
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={images.search}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={tw`flex-1`}>
        {/* <View style={tw`flex flex-row mt-4 opacity-20`}>
          <View
            style={tw`w-1/2 border-b-2  items-center ${
              activeSection === 'Active'
                ? 'border-[#88087B]'
                : 'border-[#000000]'
            }`}>
            <Textcomp
              text={'Active'}
              size={14}
              lineHeight={16}
              color={activeSection === 'Active' ? '#88087B' : '#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View
            style={tw`w-1/2 border-b-2 items-center ${
              activeSection === 'Closed'
                ? 'border-[#88087B]'
                : 'border-[#000000]'
            }`}>
            <Textcomp
              text={'Closed'}
              size={14}
              lineHeight={16}
              color={activeSection === 'Closed' ? '#88087B' : '#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View> */}

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {orders.length < 1 ? (
            <View style={[tw`flex-1 items-center`, {}]}>
              <View style={[tw``, {marginTop: perHeight(90)}]}>
                <Image
                  source={images.profile}
                  style={{height: 120, width: 120}}
                  resizeMode="contain"
                />
              </View>
              <View style={tw`mx-auto mt-3`}>
                <Textcomp
                  text={'No Orders Yet'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
                <Textcomp
                  text={'Every successful something starts with nothing'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                  style={{textAlign: 'center'}}
                />
              </View>
              <View style={tw`mx-auto mt-3`}>
                <Textcomp
                  text={'Your next big idea starts here'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                  style={{textAlign: 'center'}}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Services');
                }}
                style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
                <Textcomp
                  text={'Explore services'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#88087B'}
                  fontFamily={'Inter-Bold'}
                  style={{textAlign: 'center'}}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {activeSection === 'Active' && (
                <View style={[tw`items-center`, {flex: 1}]}>
                  <Orderscomponent3
                    navigation={navigation}
                    // item={item.item}
                    // index={item.index}
                    editable={true}
                    item={passedData}
                    index={item?.index}
                    status={passedData?.status}
                    showall={true}
                  />
                  <View
                    style={[
                      tw`bg-[#2D303C] flex-1 mb-2 rounded p-4 mt-1`,
                      {width: perWidth(355)},
                    ]}>
                    <ScrollView contentContainerStyle={tw`flex-1`}>
                      {isCurrentTimeGreaterThanScheduledTime(
                        passedData?.scheduledDeliveryDate,
                      ) &&
                        passedData?.status === 'ACCEPTED' && (
                          //
                          <TouchableOpacity
                            onPress={() => {
                              setscheduledDeliveryDate(true);
                            }}
                            style={tw`flex flex-row items-center ml-auto `}>
                            <CalendarIcon style={tw`mr-2`} />
                            <Textcomp
                              text={'Modify Delivery Date'}
                              size={11}
                              lineHeight={17}
                              color={'#FFF'}
                              fontFamily={'Inter-Semibold'}
                              style={tw`underline `}
                            />
                          </TouchableOpacity>
                        )}
                      {links?.map((item, index) => {
                        if (item?.title === 'Service Provider Review') {
                          if (userData?.accountType === 'customer') {
                          } else {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row bg-red-400`}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={item?.title}
                                      size={14.5}
                                      lineHeight={16.5}
                                      color={'#FFFFFF'}
                                      fontFamily={'Inter-Bold'}
                                      style={{textAlign: 'center'}}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Completed') {
                          if (passedData?.isCompletedByProvider === true) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`${
                                        passedData?.serviceProvider
                                          ?.businessName ??
                                        passedData?.serviceProvider?.fullName ??
                                        `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } has completed the job. Click Job Complete and review ${
                                        passedData?.serviceProvider
                                          ?.businessName ??
                                        passedData?.serviceProvider?.fullName ??
                                        `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } so they get paid.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                          if (passedData?.status === 'COMPLETED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              </>
                            );
                          }
                        } else if (item.title === 'Order In Progress') {
                          if (
                            passedData?.status === 'INPROGRESS' ||
                            // passedData?.status !== 'TRACK' ||
                            passedData?.status === 'COMPLETED'
                          ) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`${
                                        passedData?.serviceProvider
                                          ?.businessName ??
                                        passedData?.serviceProvider?.fullName ??
                                        `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } has started the job. Pay attention.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Delivered') {
                          if (passedData?.status === 'COMPLETED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View
                                    style={[
                                      tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                      {height: 50},
                                    ]}
                                  />
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Dispute') {
                          if (
                            passedData?.status === 'DISPUTE'
                            // ||passedData?.status === 'CANCELLED'
                          ) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View
                                    style={[
                                      tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                      {height: 50},
                                    ]}
                                  />
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Declined') {
                          if (passedData?.status === 'DECLINED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`${
                                        passedData?.serviceProvider
                                          ?.businessName ??
                                        passedData?.serviceProvider?.fullName ??
                                        `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } has declined your order.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Cancelled') {
                          if (passedData?.status === 'CANCELLED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={'You cancelled the order.'}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Rate Your Experience') {
                          if (passedData?.status === 'COMPLETED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  {/* <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              /> */}
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View
                                    style={[
                                      tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                      {height: 50},
                                    ]}
                                  />
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Private Feedback') {
                          if (passedData?.status === 'COMPLETED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  {/* <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              /> */}
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View
                                    style={[
                                      tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                      {height: 50},
                                    ]}
                                  />
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Scheduled Delivery Date') {
                          if (
                            passedData?.status === 'PENDING' ||
                            passedData?.status === 'ACCEPTED'
                          ) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  {/* <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              /> */}
                                  <Checked style={{marginRight: 10}} />
                                  <Textcomp
                                    text={item?.title}
                                    size={14.5}
                                    lineHeight={16.5}
                                    color={'#FFFFFF'}
                                    fontFamily={'Inter-Bold'}
                                    style={{textAlign: 'center'}}
                                  />
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View
                                    style={[
                                      tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                      {height: 50},
                                    ]}
                                  />
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Placed') {
                          if (true) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`Waiting for ${
                                        passedData?.serviceProvider
                                          ?.businessName
                                          ? `${passedData?.serviceProvider?.businessName}`
                                          : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } to accept your order.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Order Accepted') {
                          if (
                            passedData?.status === 'ACCEPTED' ||
                            passedData?.status === 'TRACK' ||
                            passedData?.status === 'INPROGRESS' ||
                            passedData?.status === 'COMPLETED' ||
                            passedData?.status === 'CANCELLED'
                          ) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`${
                                        passedData?.serviceProvider
                                          ?.businessName
                                          ? `${passedData?.serviceProvider?.businessName}`
                                          : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } has accepted your order.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (
                          item.title === 'Service Provider in Transit'
                        ) {
                          if (
                            (passedData?.status === 'TRACK' ||
                              passedData?.status === 'INPROGRESS' ||
                              passedData?.status === 'COMPLETED' ||
                              passedData?.status === 'COMPLETED') &&
                            passedData?.location !== 'online'
                          ) {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={`${
                                        passedData?.serviceProvider
                                          ?.businessName
                                          ? `${passedData?.serviceProvider?.businessName}`
                                          : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      } is on the way. Click View Location to see ${
                                        passedData?.serviceProvider
                                          ?.businessName
                                          ? `${passedData?.serviceProvider?.businessName}`
                                          : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      }  movements.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else if (item.title === 'Thank you for the tip') {
                          if (passedData?.status === 'COMPLETED') {
                            return (
                              <>
                                <TouchableOpacity
                                  key={index}
                                  style={[tw`flex flex-row items-center `, {}]}
                                  onPress={() => {
                                    item.func();
                                  }}>
                                  <Checked style={{marginRight: 10}} />
                                  <View
                                    style={[
                                      tw`flex flex-row  justify-between `,
                                      {width: perWidth(290)},
                                    ]}>
                                    <View>
                                      <Textcomp
                                        text={item?.title}
                                        size={14.5}
                                        lineHeight={16.5}
                                        color={'#FFFFFF'}
                                        fontFamily={'Inter-Bold'}
                                        style={{textAlign: 'center'}}
                                      />
                                    </View>
                                    <View>
                                      <Textcomp
                                        text={''}
                                        size={10}
                                        lineHeight={16.5}
                                        color={'#BABABA'}
                                        fontFamily={'Inter-Regular'}
                                        style={{
                                          textAlign: 'center',
                                        }}
                                      />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                {index < links.length - 1 && (
                                  <View style={tw`flex flex-row `}>
                                    <View
                                      style={[
                                        tw`border-l-2  ml-2 border-[${colors.primary}] `,
                                        {height: 50},
                                      ]}
                                    />
                                    <Textcomp
                                      text={` you tipped ${
                                        passedData?.serviceProvider
                                          ?.businessName
                                          ? `${passedData?.serviceProvider?.businessName}`
                                          : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`
                                      }  N500.`}
                                      size={12}
                                      lineHeight={16.5}
                                      color={'#BABABA'}
                                      fontFamily={'Inter-Regular'}
                                      style={{
                                        textAlign: 'left',
                                        marginLeft: 20,
                                      }}
                                    />
                                  </View>
                                )}
                              </>
                            );
                          }
                        } else {
                          return (
                            <>
                              <TouchableOpacity
                                key={index}
                                style={[tw`flex flex-row items-center `, {}]}
                                onPress={() => {
                                  item.func();
                                }}>
                                {/* <View
                              style={[
                                tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                {width: 10, height: 10},
                              ]}
                            /> */}
                                <Checked style={{marginRight: 10}} />
                                <Textcomp
                                  text={item?.title}
                                  size={14.5}
                                  lineHeight={16.5}
                                  color={'#FFFFFF'}
                                  fontFamily={'Inter-Bold'}
                                  style={{textAlign: 'center'}}
                                />
                              </TouchableOpacity>
                              {index < links.length - 1 && (
                                <View
                                  style={[
                                    tw`border-l-2  ml-2 border-[${colors.primary}] w-full`,
                                    {height: 50},
                                  ]}
                                />
                              )}
                            </>
                          );
                        }
                      })}

                      <View
                        style={[
                          tw`flex flex-row mt-auto  justify-between ml-auto`,
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            socket.connect();

                            navigation.navigate('Inbox', {
                              id: supportUser?._id || supportUser?.id,
                              name: 'Support',
                            });
                          }}
                          style={[
                            {
                              height: perHeight(30),
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',

                              backgroundColor: '#B9B7B3',
                              marginTop: 20,
                            },
                            tw`flex flex-row px-3`,
                          ]}>
                          <ContactSupportIcon style={tw`mr-2`} />
                          <Textcomp
                            text={'Contact Support'}
                            size={11}
                            lineHeight={17}
                            color={'#000000'}
                            fontFamily={'Inter-Semibold'}
                          />
                        </TouchableOpacity>

                        {passedData?.status === 'TRACK' &&
                          passedData?.location !== 'online' && (
                            <TouchableOpacity
                              onPress={() => {
                                // navigation.navigate('ViewLocation', {
                                //   id:
                                //     item?.serviceProvider._id ||
                                //     item?.serviceProvider?.id,
                                //   item: item,
                                // });
                                handleToLocation();
                              }}
                              style={[
                                {
                                  height: perHeight(30),
                                  borderRadius: 8,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: colors.primary,
                                  marginTop: 20,
                                },
                                tw`flex flex-row px-3 mx-4`,
                              ]}>
                              <LocationIcon2 style={tw`mr-2`} />
                              <Textcomp
                                text={'View Location'}
                                size={11}
                                lineHeight={17}
                                color={'#000000'}
                                fontFamily={'Inter-Semibold'}
                              />
                            </TouchableOpacity>
                          )}

                        {(passedData?.status === 'COMPLETED') && (
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('TipServiceProvider', {
                                item: item,
                              });
                            }}
                            style={[
                              {
                                height: perHeight(30),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                marginTop: 20,
                              },
                              tw`flex flex-row px-3 mx-4`,
                            ]}>
                            <TipProvider style={tw`mr-2`} />
                            <Textcomp
                              text={'Tip Service Provider'}
                              size={11}
                              lineHeight={17}
                              color={'#000000'}
                              fontFamily={'Inter-Semibold'}
                            />
                          </TouchableOpacity>
                        )}

                        {passedData?.status === 'INPROGRESS' && (
                          <TouchableOpacity
                            onPress={() => {
                              setrateYourExperience(true);
                            }}
                            style={[
                              {
                                height: perHeight(30),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.primary,
                                marginTop: 20,
                              },
                              tw`flex flex-row px-3 mx-4`,
                            ]}>
                            <CompleteTick style={tw`mr-2`} />
                            <Textcomp
                              text={'Job Complete '}
                              size={11}
                              lineHeight={17}
                              color={'#000000'}
                              fontFamily={'Inter-Semibold'}
                            />
                          </TouchableOpacity>
                        )}

                        {passedData?.status !== 'DECLINED' &&
                          passedData?.status !== 'INPROGRESS' &&
                          passedData?.status !== 'COMPLETED' &&
                          passedData?.status !== 'CANCELLED' &&
                          passedData?.status !== 'TRACK' && (
                            <TouchableOpacity
                              onPress={() => {
                                setInfoModal(true);
                                setmodalSection('reason');
                              }}
                              style={[
                                {
                                  height: perHeight(30),
                                  borderRadius: 8,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: colors.primary,
                                  marginTop: 20,
                                },
                                tw`flex flex-row px-3 mx-4`,
                              ]}>
                              <Cross style={tw`mr-2`} />
                              <Textcomp
                                text={'Cancel Order'}
                                size={11}
                                lineHeight={17}
                                color={'#000000'}
                                fontFamily={'Inter-Semibold'}
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </ScrollView>
                  </View>
                  <View
                    style={[
                      tw`bg-[#2D303C]  rounded p-4 pb-1 mt-0`,
                      {width: perWidth(355)},
                    ]}>
                    <View style={tw`flex flex-row`}>
                      <Textcomp
                        text={'Location: '}
                        size={14.5}
                        lineHeight={16.5}
                        color={'#FFFFFF'}
                        fontFamily={'Inter-Bold'}
                        style={{textAlign: 'center'}}
                      />
                      <View style={tw` w-[80%]`}>
                        <Textcomp
                          text={`${
                            passedData?.location === 'online'
                              ? 'online'
                              : passedData?.address
                          }`}
                          size={
                            passedData?.location !== 'online'
                              ? passedData?.address?.split(' ')?.length > 5
                                ? 11
                                : 13.5
                              : 13.5
                          }
                          lineHeight={16.5}
                          color={'#FFFFFF'}
                          fontFamily={'Inter-Regular'}
                          style={{textAlign: 'left', marginLeft: 10}}
                          numberOfLines={2}
                        />
                        {passedData?.address?.split(' ')?.length > 8 && (
                          <TouchableOpacity
                            style={tw`ml-auto`}
                            onPress={() => {
                              setShowModal(true);
                            }}>
                            <Textcomp
                              text={'...see more'}
                              size={12}
                              lineHeight={15}
                              color={'green'}
                              fontFamily={'Inter-Bold'}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={tw`flex mt-2 flex-row`}>
                      <Textcomp
                        text={'Delivery Date:'}
                        size={14.5}
                        lineHeight={16.5}
                        color={'#FFFFFF'}
                        fontFamily={'Inter-Bold'}
                        style={{textAlign: 'center'}}
                      />
                      <Textcomp
                        text={`${formatDate3(
                          passedData?.scheduledDeliveryDate,
                        )}`}
                        size={12.5}
                        lineHeight={16.5}
                        color={'#FFFFFF'}
                        fontFamily={'Inter-Regular'}
                        style={{textAlign: 'center', marginLeft: 10}}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        socket.connect();
                        navigation.navigate('Inbox', {
                          id:
                            passedData?.serviceProvider._id ||
                            passedData?.serviceProvider?.id,
                          name: passedData?.serviceProvider?.businessName
                            ? `${passedData?.serviceProvider?.businessName}`
                            : `${passedData?.serviceProvider?.firstName} ${passedData?.serviceProvider?.lastName}`,
                        });
                      }}
                      style={[
                        {
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.primary,
                          marginTop: 12,
                        },
                        tw`flex flex-row px-3 mx-4 py-2 ml-auto`,
                      ]}>
                      <Textcomp
                        text={`Contact ${
                          passedData?.serviceProvider?.businessName ??
                          passedData?.serviceProvider?.firstName
                        }`}
                        size={11}
                        lineHeight={17}
                        color={'#000000'}
                        fontFamily={'Inter-Semibold'}
                      />
                    </TouchableOpacity>
                  </View>
                  {false && (
                    <TouchableOpacity
                      onPress={() => {
                        setrateYourExperience(true);
                      }}
                      style={[
                        {
                          width: perWidth(316),
                          height: perHeight(40),
                          borderRadius: 13,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.darkPurple,
                          marginTop: 20,
                        },
                        tw`mx-auto mt-[25%]`,
                      ]}>
                      <Textcomp
                        text={'Mark job as completed'}
                        size={14}
                        lineHeight={17}
                        color={'#FFC727'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      <ServiceproviderReview
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setserviceProviderModal(text);
        }}
        visible={serviceProviderModal}
        item={item}
      />
      <PrivateFeedback
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setprivateFeedback(text);
        }}
        visible={privateFeedback}
        item={item}
      />
      <RateyourExperience
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setrateYourExperience(text);
        }}
        visible={rateYourExperience}
        item={item}
        OnFinish={(values: any) => {
          handleComplete(values);
        }}
      />
      <OrderCompleted
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderCompleted(text);
        }}
        visible={orderCompleted}
        item={item}
      />
      <OrderDispute
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDispute(text);
        }}
        visible={orderDispute}
        item={item}
      />
      <OrderDelivered
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDelivered(text);
        }}
        visible={orderDelivered}
        item={item}
      />
      <OrderInProgress
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderInProgress(text);
        }}
        visible={orderInProgress}
        item={item}
      />
      <OrderPlaced
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderPlacing(text);
        }}
        visible={orderPlacing}
        item={item}
      />
      <ScheduledDeliveryDate
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setscheduledDeliveryDate(text);
        }}
        visible={scheduledDeliveryDate}
        item={item}
        fetch={async () => await fetchOrderByID()}
      />

      <Modal
        isVisible={InfoModal}
        onModalHide={() => {
          false;
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setInfoModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setInfoModal(false)}
        onBackButtonPress={() => setInfoModal(false)}>
        <OrdersDeclineReason
          selectedReason={selectedReason}
          handleSelectedReasons={handleSelectedReasons}
          otherReason={otherReason}
          setOtherReason={setOtherReason}
          handleCancel={handleCancel}
          setModalSection={() => {
            setInfoModal(false);
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isVisible={showModal}
        onModalHide={() => {
          setShowModal(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setShowModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={tw`flex-1`}
          />
          <View style={[tw`mx-auto w-4/5`, styles.modalContent]}>
            <Textcomp
              text={`${passedData?.address}`}
              size={14}
              lineHeight={18}
              color={colors.black}
              fontFamily={'Inter-Regular'}
            />
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}>
              <Text style={{color: colors.primary, fontSize: 16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default OrderActive;
