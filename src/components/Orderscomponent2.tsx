import {
  View,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import {
  acceptOrder,
  addRatingOrder,
  cancelOrder,
  declineOrder,
  getProviderOrders,
  onMYOrder,
  startOrder,
} from '../utils/api/func';
import Snackbar from 'react-native-snackbar';
import OrderDispute from './modals/orderDispute';
import ScheduledDeliveryDate from './modals/scheduledDeliveryDate';
import {useDispatch, useSelector} from 'react-redux';
import {addproviderOrders} from '../store/reducer/mainSlice';
import RateyourCustommer from './modals/rateYourCustomer';
import {ToastShort, formatDateHistory2} from '../utils/utils';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal/dist/modal';
import socket from '../utils/socket';
import CheckBox from 'react-native-check-box';
const Orderscomponent2 = ({item, index, status, showall, navigation}: any) => {
  const [saved, setsaved] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [orderDispute, setorderDispute] = useState(false);
  const [scheduledDeliveryDate, setscheduledDeliveryDate] = useState(false);
  const [rateYourExperience, setrateYourExperience] = useState(false);
  // console.log('ORDER:', item);
  useEffect(() => {
    const initGetOrders2 = async () => {
      setisLoading(true);
      const res: any = await getProviderOrders(userData?._id);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addproviderOrders(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetOrders2();
  }, []);
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const initGetOrders = async () => {
    setisLoading(true);
    const res: any = await getProviderOrders(userData?._id);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addproviderOrders(res?.data?.data));
    }
    setisLoading(false);
  };
  const handleCancel = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await cancelOrder(item?._id, {reason: 'Incorrect Request'});
      if (res?.status === 200 || res?.status === 201) {
        // navigation.navigate('PaymentConfirmed');
        await initGetOrders();
        Alert.alert('successful');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  const handleDecline = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await declineOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
        Alert.alert('Order Declined');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };

  const handleComplete = async (val: any) => {
    try {
      setisLoading(true);
      if (item?._id) {
        const res = await addRatingOrder(item?._id, {...val});
        if (res?.status === 200 || res?.status === 201) {
          await initGetOrders();
          Alert.alert('Rating successful!.');
          setrateYourExperience(false);
          setrateYourExperience(false);
        }
        setisLoading(false);
      } else {
        Snackbar.show({
          text: 'Please fill all fields',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setisLoading(false);
      }
    } catch (error) {
      Snackbar.show({
        text: error?.message
          ? error?.message
          : error?.data?.message
          ? error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setrateYourExperience(false);
    } finally {
      setisLoading(false);
      const initGetOrders2 = async () => {
        setisLoading(true);
        const res: any = await getProviderOrders(userData?._id);
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addproviderOrders(res?.data?.data));
        }
        setisLoading(false);
      };
      initGetOrders2();
      setrateYourExperience(false);
    }
  };

  const handleAccept = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await acceptOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        // navigation.navigate('PaymentConfirmed');
        await initGetOrders();
        Alert.alert('Order Accepted');
        setready(false);
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setready(false);
      }
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
      setready(false);
    }
    setisLoading(false);
    setready(false);
  };

  const handleOnMyWay = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await onMYOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
        Alert.alert('Order Now in Transit.');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  const handleStart = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await startOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
        Alert.alert('Order Now in progress!.');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  const [showModal, setShowModal] = useState(false);
  const supportUser = useSelector((store: any) => store.user.supportUser);

  const [ready, setready] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <>
      <View
        style={[
          tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
          {
            // height: perWidth(205),
            minHeight: perWidth(180),
            width: SIZES.width * 0.95,
            borderWidth: 0,
            borderRadius: 5,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-row `}>
          <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
            <FastImage
              style={[
                tw``,
                {
                  width: perWidth(50),
                  height: perWidth(50),
                  borderRadius: perWidth(50) / 2,
                },
              ]}
              source={{
                uri:
                  item?.user?.profilePic ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              style={[
                tw`absolute bottom-0 border-2 right-1 rounded-full`,
                {width: 8, height: 8, backgroundColor: colors.green},
              ]}
            />
          </View>
          <View style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
            <View style={[tw`flex flex-row justify-between`, {}]}>
              {status === 'INPROGRESS' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'IN PROGRESS'}
                    size={14}
                    lineHeight={16}
                    color={colors.primary}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'PENDING' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'PENDING'}
                    size={14}
                    lineHeight={16}
                    color={'#C705B3'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'ACCEPTED' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'ACCEPTED'}
                    size={14}
                    lineHeight={16}
                    color={'#29D31A'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'TRACK' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'IN TRANSIT'}
                    size={14}
                    lineHeight={16}
                    color={'#29D31A'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'COMPLETED' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'COMPLETED'}
                    size={14}
                    lineHeight={16}
                    color={'#FFC727'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'DECLINED' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'DECLINED'}
                    size={14}
                    lineHeight={16}
                    color={'#EB001B'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'CANCELLED' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'CANCELLED'}
                    size={14}
                    lineHeight={16}
                    color={'#EB001B'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}
              {status === 'DISPUTE' && (
                <View style={[tw``, {}]}>
                  <Textcomp
                    text={'DISPUTE'}
                    size={14}
                    lineHeight={16}
                    color={'#EB001B'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              )}

              <View style={[tw``, {}]}>
                <Textcomp
                  text={`₦ ${item?.agentAmount}`}
                  size={14}
                  lineHeight={16}
                  color={colors.white}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}
              style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
              <Textcomp
                text={`${item?.description}`}
                size={11}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
              {item?.description?.split(' ')?.length > 15 && (
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
            </TouchableOpacity>
            {/* <View
              style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
              <Textcomp
                text={`${item?.description}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
            </View> */}
          </View>
        </View>
        <View>
          <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
            <Textcomp
              text={
                item?.user?.businessName
                  ? `${item?.user?.businessName}`
                  : `${
                      item?.user?.firstName +
                      ' ' +
                      item?.user?.lastName?.charAt(0)
                    }.`
              }
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View>
          <View
            style={[
              tw` mx-auto`,
              {width: perWidth(300), marginTop: perWidth(5)},
            ]}>
            <Textcomp
              text={`Address: ${
                item?.location === 'online' ? 'NIL' : item?.address
              }`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-Regular'}
            />
          </View>

          <View
            style={[
              tw` mx-auto`,
              {width: perWidth(300), marginTop: perWidth(5)},
            ]}>
            <Textcomp
              text={`Date & Time: ${formatDateHistory2(
                item?.scheduledDeliveryDate,
              )}`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-Regular'}
            />
          </View>
          <View
            style={[
              tw` mx-auto`,
              {width: perWidth(300), marginTop: perWidth(5)},
            ]}>
            <Textcomp
              text={`Location: ${item?.location}`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-Regular'}
            />
          </View>
        </View>

        {status === 'PENDING' && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                // handleUpdateStatus('ACCEPTED');
                // handleAccept();
                setready(true);
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                text={'Accept'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleDecline();
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                text={'Decline '}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'ACCEPTED' && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            {item?.location === 'online' ? (
              <TouchableOpacity
                onPress={() => {
                  handleStart();
                }}
                style={[
                  tw`bg-[${colors.primary}] items-center justify-center`,
                  {
                    width: perWidth(90),
                    height:
                      Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                    borderRadius: 7,
                  },
                ]}>
                <Textcomp
                  text={'Start Job '}
                  size={12}
                  lineHeight={14}
                  color={colors.black}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  handleOnMyWay();
                }}
                style={[
                  tw`bg-[${colors.primary}] items-center justify-center`,
                  {
                    width: perWidth(90),
                    height:
                      Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                    borderRadius: 7,
                  },
                ]}>
                <Textcomp
                  text={'On My way'}
                  size={12}
                  lineHeight={14}
                  color={colors.black}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setscheduledDeliveryDate(true);
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                text={'Reschedule'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'TRACK' && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                handleStart();
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                text={'Start Job '}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setscheduledDeliveryDate(true);
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                text={'Reschedule'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'INPROGRESS' && item?.isCompletedByProvider !== true && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                // handleComplete();
                //bring up ratings Modal
                setrateYourExperience(true);
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(90),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                text={'Completed '}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // setorderDispute(true);
                socket.connect();
                navigation.navigate('Inbox', {
                  id: supportUser?._id || supportUser?.id,
                  name: 'Support',
                });
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(100),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                // text={'Dispute '}
                text={'Contact Support'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'INPROGRESS' && item?.isCompletedByProvider === true && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                // setorderDispute(true);
                socket.connect();
                navigation.navigate('Inbox', {
                  id: supportUser?._id || supportUser?.id,
                  name: 'Support',
                });
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(150),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  // marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                // text={'Dispute '}
                text={'Contact Support'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'COMPLETED' && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                setrateYourExperience(true);
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(190),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                text={'Review Customer '}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
        {status === 'DECLINED' && (
          <></>
          // <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          //   <TouchableOpacity
          //     onPress={() => {}}
          //     style={[
          //       tw`bg-[${colors.primary}] items-center justify-center`,
          //       {
          //         width: perWidth(190),
          //         height:
          //           Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
          //         borderRadius: 7,
          //       },
          //     ]}>
          //     <Textcomp
          //       text={'Dispute '}
          //       size={12}
          //       lineHeight={14}
          //       color={colors.black}
          //       fontFamily={'Inter-SemiBold'}
          //     />
          //   </TouchableOpacity>
          // </View>
        )}
        {status === 'CANCELLED' && (
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {
                // setorderDispute(true);
                socket.connect();
                navigation.navigate('Inbox', {
                  id: supportUser?._id || supportUser?.id,
                  name: 'Support',
                });
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(190),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                // text={'Dispute'}
                text={'Contact Support'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <OrderDispute
        navigation={null}
        item={item}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDispute(text);
        }}
        visible={orderDispute}
      />
      <ScheduledDeliveryDate
        navigation={null}
        // value={scheduledDeliveryDate}
        item={item}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setscheduledDeliveryDate(text);
        }}
        visible={scheduledDeliveryDate}
      />
      {/* <RateyourExperience
        navigation={null}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setrateYourExperience(text);
        }}
        visible={rateYourExperience}
        OnFinish={(values: any) => {
          handleComplete(values);
        }}
      /> */}
      {rateYourExperience && (
        <RateyourCustommer
          navigation={null}
          func={(text: boolean | ((prevState: boolean) => boolean)) => {
            setrateYourExperience(text);
          }}
          visible={rateYourExperience}
          OnFinish={(values: any) => {
            handleComplete(values);
          }}
          loading={isLoading}
        />
      )}

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
              text={`${item?.description}`}
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

      <Modal
        isVisible={ready}
        onModalHide={() => {
          setready(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setready(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setready(false)}
        onBackButtonPress={() => setready(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setready(false)}
            style={tw`flex-1`}
          />
          <View style={[tw`p-4 mt-auto bg-[#D9D9D9]`, {minHeight: '55%'}]}>
            <TouchableOpacity
              onPress={() => {
                setready(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View style={tw`flex-1`}>
              <View style={tw`pt-3`}>
                <Textcomp
                  text={'!!! IMPORTANT !!!'}
                  size={16}
                  lineHeight={14.5}
                  color={'black'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={tw`mt-10`}>
                <Textcomp
                  text={'Take note of the following:'}
                  size={14}
                  lineHeight={14.5}
                  color={'black'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-4`} />
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠Notify in advance if running late.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠⁠Get approval from the customer for any alterations.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2  mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠⁠Keep noise to a minimum.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠No inappropriate touching or verbal sexual remarks.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠⁠Do not ask for gifts or extra fees.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠⁠Be on time for the job.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠⁠ ⁠Maintain a professional look.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={`⁠Prioritize safety, both yours and the customer's, during the job.`}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={`⁠⁠Leave the work area as clean or cleaner than you found it.`}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <View style={tw`flex flex-row items-center mt-auto mb-4 ml-4`}>
                <CheckBox
                  style={{width: 30, padding: 10}}
                  onClick={() => {
                    setToggleCheckBox(!toggleCheckBox);
                  }}
                  isChecked={toggleCheckBox}
                  // leftText={'CheckBox'}
                />
                <View style={tw`ml-4`}>
                  <Textcomp
                    text={'I agree to the above terms.'}
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={tw`bg-[${colors.parpal}] w-[85%] py-4 mb-4 items-center  mx-auto rounded`}
                onPress={() => {
                  if (toggleCheckBox) {
                    handleAccept();
                  } else {
                    ToastShort(
                      'Terms and conditions required!. Please check the radio button',
                    );
                  }
                }}>
                <Textcomp
                  text={'Continue'}
                  size={14}
                  lineHeight={14.5}
                  color={'white'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    // width: '80%',
    // marginleft: '10%'
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});
export default Orderscomponent2;
