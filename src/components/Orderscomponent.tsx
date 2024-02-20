import {Image, View, TouchableOpacity, Platform, Alert} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useState} from 'react';
import images from '../constants/images';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Modal from 'react-native-modal';
import {HEIGHT_WINDOW, WIDTH_WINDOW} from '../constants/generalStyles';
import {useDispatch} from 'react-redux';
import {
  cancelOrder,
  getProviderLocation,
  getUserOrders,
} from '../utils/api/func';
import {
  addcustomerOrders,
  setProviderLocation,
} from '../store/reducer/mainSlice';
import socket from '../utils/socket';
import Chat from '../assets/svg/Chat';
import Location from '../assets/svg/Location';
import DisputeIcon from '../assets/svg/Dispute';
import Cross from '../assets/svg/Cross';
import Snackbar from 'react-native-snackbar';
import {ToastShort} from '../utils/utils';
import OrdersDeclineReason from './OrdersDeclineReason';
import FastImage from 'react-native-fast-image';
import OrderDispute from './modals/orderDispute';

const Orderscomponent = ({
  item,
  index,
  status,
  navigation,
  editable,
  showall,
}: any) => {
  const [saved, setsaved] = useState(false);
  const [InfoModal, setInfoModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [modalSection, setmodalSection] = useState('All');
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handleSelectedReasons = reason => {
    setSelectedReason(reason);
  };
  console.log('OrderDetails', item);

  function formatDateToCustomFormat(dateString) {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options,
    );
    return formattedDate;
  }
  const dispatch = useDispatch();
  const initGetOrders = async () => {
    setisLoading(true);
    const res: any = await getUserOrders('');
    console.log('oooooooo', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addcustomerOrders(res?.data?.data));
    }
    // setloading(false);
    setisLoading(false);
  };
  const handleCancel = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await cancelOrder(item?._id, {
        reason:
          selectedReason.toLowerCase() === 'others'
            ? otherReason
            : selectedReason,
      });
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
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
      }
      setisLoading(false);
      setInfoModal(false);
      setmodalSection('All');
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
      setInfoModal(false);
      setmodalSection('All');
    }
    setisLoading(false);
    setInfoModal(false);
    setmodalSection('All');
  };

  const handleToLocation = async (data: any) => {
    try {
      setisLoading(true);
      // const res: any = await getProviderLocation('65cb95af993d69fb83faf837');
      const res: any = await getProviderLocation(data.id);
      console.log('location.........', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        if (res?.data?.data !== null) {
          dispatch(setProviderLocation(res?.data?.data));
          navigation.navigate('ViewLocation', {...data});
        } else {
          ToastShort('Providers Location not available at the moment');
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <>
      <>
        <TouchableOpacity
          disabled={editable ? editable : false}
          onPress={() => navigation.navigate('OrderActive', {data: item})}
          style={[
            tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
            {
              height: perWidth(135),
              width: SIZES.width * 0.95,
              borderWidth: 0,
              borderRadius: 5,
              paddingHorizontal: perWidth(16),
              paddingVertical: perWidth(14),
            },
          ]}>
          <View style={tw`flex flex-row `}>
            <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
              {/* {item?.serviceProvider?.profilePic ? (
                <Image
                  resizeMode="cover"
                  style={{
                    width: perWidth(50),
                    height: perWidth(50),
                    borderRadius: perWidth(50) / 2,
                  }}
                  source={{uri: item?.serviceProvider?.profilePic}}
                />
              ) : (
                <Image
                  resizeMode="cover"
                  style={{
                    width: perWidth(50),
                    height: perWidth(50),
                    borderRadius: perWidth(50) / 2,
                  }}
                  source={images.welcome}
                />
              )} */}

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
                    item?.serviceProvider?.profilePic ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                  // 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1694275934/Assets/1694275933654-Ellipse%2014.png.png',
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
                <View style={[tw``, {}]}>
                  <Textcomp
                    // text={`₦ ${item?.amount || item?.totalPrice}`}
                    text={`₦ ${item?.totalPrice || item?.amount}`}
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
              <View style={tw`ml-auto`}>
                {status === 'INPROGRESS' &&
                  item?.isCompletedByProvider === false && (
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
                {(status === 'COMPLETED' ||
                  item?.isCompletedByProvider === true) && (
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
                {status === 'TRACK' && (
                  <View style={[tw``, {}]}>
                    <Textcomp
                      text={'IN TRANSIT'}
                      size={14}
                      lineHeight={16}
                      color={'#EB001B'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
          <View>
            <View
              style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
              <Textcomp
                text={
                  item?.serviceProvider?.businessName
                    ? item?.serviceProvider?.businessName
                    : `${
                        item?.serviceProvider?.firstName +
                        ' ' +
                        item?.serviceProvider?.lastName?.charAt(0)
                      }.`
                }
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>
          <View style={tw`flex flex-row mt-auto justify-between`}>
            <View>
              <Textcomp
                text={`${formatDateToCustomFormat(
                  item?.scheduledDeliveryDate,
                )}`}
                size={14}
                lineHeight={16}
                color={colors.white}
                fontFamily={'Inter-Bold'}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw` absolute right-[0%]  pr-4 bottom-[5%] py-2 w-[25%] items-end`}
          onPress={() => {
            setInfoModal(true);
          }}>
          <Image
            resizeMode="contain"
            style={[
              {
                width: perWidth(4),
                height: perWidth(12),
              },
              tw`ml-4`,
            ]}
            source={images.menu2}
          />
        </TouchableOpacity>
      </>
      <Modal
        isVisible={InfoModal}
        onModalHide={() => {
          setInfoModal(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setInfoModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setInfoModal(false)}
        onBackButtonPress={() => setInfoModal(false)}>
        {modalSection === 'All' && (
          <View style={tw` h-full w-full bg-black bg-opacity-5`}>
            <TouchableOpacity
              onPress={() => setInfoModal(false)}
              style={tw`flex-1`}
            />
            <View
              style={tw`h-[${
                status !== 'PENDING' ? '35%' : '22.5%'
              }]  mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                }}
                style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
              />

              {status !== 'DECLINED' &&
                status !== 'INPROGRESS' &&
                status !== 'COMPLETED' && (
                  <TouchableOpacity
                    onPress={() => {
                      // setmodalSection('Cancel')
                      setmodalSection('reason');
                      // handleCloseReasonModal();
                      // if (status === 'CANCELLED') {
                      //   ToastShort('This Order has already')
                      // }else{

                      // }
                    }}
                    style={[
                      tw`flex mt-10 flex-row`,
                      {marginHorizontal: perWidth(30)},
                    ]}>
                    <Cross />
                    <View style={[tw``, {marginLeft: perWidth(36)}]}>
                      <Textcomp
                        text={'Cancel Order'}
                        size={14}
                        lineHeight={17}
                        color={'#000000'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                onPress={() => {
                  socket.connect();
                  setInfoModal(false);
                  navigation.navigate('Inbox', {
                    id: item?.serviceProvider._id || item?.serviceProvider?.id,
                    name: item?.serviceProvider?.fullName
                      ? `${item?.serviceProvider?.fullName}`
                      : `${item?.serviceProvider?.firstName} ${item?.serviceProvider?.lastName}`,
                  });
                }}
                style={[
                  tw`flex mt-10 flex-row`,
                  {marginHorizontal: perWidth(30), marginTop: perHeight(25)},
                ]}>
                <Chat />
                <View style={[tw``, {marginLeft: perWidth(25)}]}>
                  <Textcomp
                    text={'Contact Service Provider'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  navigation.navigate('ViewLocation', {
                    id: item?.serviceProvider._id || item?.serviceProvider?.id,
                    item: item,
                  });
                }}
                style={[
                  tw`flex mt-10 flex-row`,
                  {
                    marginHorizontal: perWidth(30),
                    marginTop: perHeight(25),
                  },
                ]}>
                <Location />
                <View style={[tw``, {marginLeft: perWidth(30)}]}>
                  <Textcomp
                    text={'View Location'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </TouchableOpacity> */}
              {status === 'TRACK' && item?.location !== 'online' && (
                <TouchableOpacity
                  onPress={() => {
                    setInfoModal(false);
                    navigation.navigate('ViewLocation', {
                      id:
                        item?.serviceProvider._id || item?.serviceProvider?.id,
                      item: item,
                    });
                  }}
                  style={[
                    tw`flex mt-10 flex-row`,
                    {
                      marginHorizontal: perWidth(30),
                      marginTop: perHeight(25),
                    },
                  ]}>
                  <Location />
                  <View style={[tw``, {marginLeft: perWidth(30)}]}>
                    <Textcomp
                      text={'View Location'}
                      size={14}
                      lineHeight={17}
                      color={'#000000'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                </TouchableOpacity>
              )}
              {status !== 'PENDING' && (
                <TouchableOpacity
                  onPress={() => {
                    // setInfoModal(false);
                    setmodalSection('dispute');
                  }}
                  style={[
                    tw`flex mt-10 flex-row`,
                    {
                      marginHorizontal: perWidth(30),
                      marginTop: perHeight(25),
                    },
                  ]}>
                  <DisputeIcon />
                  <View style={[tw``, {marginLeft: perWidth(36)}]}>
                    <Textcomp
                      text={'Order Dispute'}
                      size={14}
                      lineHeight={17}
                      color={'#000000'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {/* <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: WIDTH_WINDOW * 0.95},
                ]}
              /> */}
            </View>
          </View>
        )}
        {modalSection === 'Cancel' && (
          <View style={tw` h-full w-full bg-black bg-opacity-5`}>
            <TouchableOpacity
              onPress={() => setInfoModal(false)}
              style={tw`flex-1`}
            />
            <View style={tw`h-[35%]  mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                }}
                style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
              />
              <View style={[tw`mt-6`, {marginLeft: perWidth(36)}]}>
                <Textcomp
                  text={'Cancel Order'}
                  size={16}
                  lineHeight={18.75}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>

              <View
                style={[
                  tw``,
                  {marginLeft: perWidth(36), marginTop: perHeight(20)},
                ]}>
                <Textcomp
                  text={
                    'Orders can only be canceled 2 hours before scheduled delivery time'
                  }
                  size={12}
                  lineHeight={16.75}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <TouchableOpacity
                onPress={async () => {
                  await handleCancel();
                }}
                style={[
                  {
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 40,
                  },
                  tw`mx-auto`,
                ]}>
                <Textcomp
                  text={'Okay'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>

              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: WIDTH_WINDOW * 0.95},
                ]}
              />
            </View>
          </View>
        )}
        {modalSection === 'Cancel2' && (
          <View style={tw` h-full w-full bg-black bg-opacity-5`}>
            <TouchableOpacity
              onPress={() => {
                setInfoModal(false);
                setmodalSection('All');
              }}
              style={tw`flex-1`}
            />
            <View style={tw`h-[30%]  mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                }}
                style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
              />
              {/* <View style={[tw`mt-6`, {marginLeft: perWidth(36)}]}>
                <Textcomp
                  text={'Cancel Order'}
                  size={16}
                  lineHeight={18.75}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View> */}

              <View
                style={[
                  tw``,
                  {marginLeft: perWidth(36), marginTop: perHeight(20)},
                ]}>
                <Textcomp
                  text={'Are you sure you want to cancel this order ?'}
                  size={16}
                  lineHeight={18.75}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <TouchableOpacity
                onPress={async () => {
                  if (status === 'ACCEPTED' || status === 'PENDING') {
                    // setmodalSection('Cancel');
                    await handleCancel();
                  } else {
                    setmodalSection('All');
                    Snackbar.show({
                      text: 'You can’t cancel this order. Only Pending and Accepted Orders can be canceled.',
                      duration: Snackbar.LENGTH_SHORT,
                      textColor: '#fff',
                      backgroundColor: '#88087B',
                    });
                  }
                }}
                style={[
                  {
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 40,
                  },
                  tw`mx-auto`,
                ]}>
                <Textcomp
                  text={'Proceed'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  // await handleCancel();
                  setmodalSection('All');
                }}
                style={[
                  {
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FF0000',
                    marginTop: 20,
                  },
                  tw`mx-auto`,
                ]}>
                <Textcomp
                  text={'Cancel'}
                  size={14}
                  lineHeight={17}
                  color={'white'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {modalSection === 'reason' && (
          <OrdersDeclineReason
            selectedReason={selectedReason}
            handleSelectedReasons={handleSelectedReasons}
            otherReason={otherReason}
            setOtherReason={setOtherReason}
            handleCancel={handleCancel}
            setModalSection={setmodalSection}
            isLoading={isLoading}
          />
        )}

        {modalSection === 'dispute' && (
          <OrderDispute
            navigation={null}
            item={item}
            func={(text) => {
              setInfoModal(false);
              setmodalSection('All');
            }}
            visible={true}
          />
        )}
      </Modal>
    </>
  );
};
export default Orderscomponent;
