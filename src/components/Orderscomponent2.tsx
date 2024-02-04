import {Image, View, TouchableOpacity, Platform, Alert} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useEffect, useState} from 'react';
import images from '../constants/images';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  acceptOrder,
  cancelOrder,
  completedOrder,
  declineOrder,
  getProviderOrders,
  onMYOrder,
  startOrder,
  updateStatusOrder,
} from '../utils/api/func';
import Snackbar from 'react-native-snackbar';
import OrderDispute from './modals/orderDispute';
import RateyourExperience from './modals/rateyourexperience';
import ScheduledDeliveryDate from './modals/scheduledDeliveryDate';
import {useDispatch, useSelector} from 'react-redux';
import {addproviderOrders} from '../store/reducer/mainSlice';

const Orderscomponent2 = ({item, index, status}: any) => {
  const [saved, setsaved] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [orderDispute, setorderDispute] = useState(false);
  const [scheduledDeliveryDate, setscheduledDeliveryDate] = useState(false);
  const [rateYourExperience, setrateYourExperience] = useState(false);

  console.log(item);

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
  // const handleUpdateStatus = async (param: any) => {
  //   setisLoading(true);
  //   if (item?._id) {
  //     const res = await updateStatusOrder(item?._id, param);
  //     if (res?.status === 200 || res?.status === 201) {
  //       // navigation.navigate('PaymentConfirmed');
  //       await initGetOrders();
  //       Alert.alert('successful');
  //     } else {
  //       Snackbar.show({
  //         text: res?.error?.message
  //           ? res?.error?.message
  //           : res?.error?.data?.message
  //           ? res?.error?.data?.message
  //           : 'Oops!, an error occured',
  //         duration: Snackbar.LENGTH_SHORT,
  //         textColor: '#fff',
  //         backgroundColor: '#88087B',
  //       });
  //     }
  //     setisLoading(false);
  //   } else {
  //     Snackbar.show({
  //       text: 'Please fill all fields',
  //       duration: Snackbar.LENGTH_SHORT,
  //       textColor: '#fff',
  //       backgroundColor: '#88087B',
  //     });
  //     setisLoading(false);
  //   }
  //   setisLoading(false);
  // };
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
    setisLoading(true);
    if (item?._id) {
      const res = await completedOrder(item?._id, {...val});
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

  const handleAccept = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await acceptOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        // navigation.navigate('PaymentConfirmed');
        await initGetOrders();
        Alert.alert('Order Accepted');
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

  const handleOnMyWay = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await onMYOrder(item?._id);
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
        Alert.alert('Order Now in transist.');
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

  return (
    <>
      <View
        style={[
          tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
          {
            height: perWidth(195),
            width: SIZES.width * 0.95,
            borderWidth: 0,
            borderRadius: 5,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-row `}>
          <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
            <Image
              resizeMode="cover"
              style={{
                width: perWidth(50),
                height: perWidth(50),
                borderRadius: perWidth(50) / 2,
              }}
              source={images.welcome}
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

              <View style={[tw``, {}]}>
                <Textcomp
                  text={`₦ ${item?.totalPrice}`}
                  size={14}
                  lineHeight={16}
                  color={colors.white}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            </View>
            <View
              style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
              <Textcomp
                text={`${item?.description}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
            </View>
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
              text={`Address: ${item?.address}`}
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
              text={`Date & Time: ${item?.scheduledDeliveryDate}`}
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
                handleAccept();
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
        {status === 'INPROGRESS' && (
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
                setorderDispute(true);
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
                text={'Dispute '}
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
          <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={() => {}}
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
                text={'Dispute '}
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
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDispute(text);
        }}
        visible={orderDispute}
      />
      <ScheduledDeliveryDate
        navigation={null}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setscheduledDeliveryDate(text);
        }}
        visible={scheduledDeliveryDate}
      />
      <RateyourExperience
        navigation={null}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setrateYourExperience(text);
        }}
        visible={rateYourExperience}
        OnFinish={(values: any) => {
          handleComplete(values);
        }}
      />
    </>
  );
};
export default Orderscomponent2;
