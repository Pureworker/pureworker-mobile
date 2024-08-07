import {
  Image,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useState} from 'react';
import images from '../constants/images';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import Modal from 'react-native-modal';
import {WIDTH_WINDOW} from '../constants/generalStyles';
import {useDispatch} from 'react-redux';
import {cancelOrder, getUserOrders} from '../utils/api/func';
import {addcustomerOrders} from '../store/reducer/mainSlice';
import socket from '../utils/socket';
import Chat from '../assets/svg/Chat';
import Location from '../assets/svg/Location';
import DisputeIcon from '../assets/svg/Dispute';
import Cross from '../assets/svg/Cross';
import Snackbar from 'react-native-snackbar';
import OrdersDeclineReason from './OrdersDeclineReason';
import FastImage from 'react-native-fast-image';
import {ToastLong} from '../utils/utils';

const Orderscomponent3 = ({
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
  const dispatch = useDispatch();
  const initGetOrders = async () => {
    setisLoading(true);
    const res: any = await getUserOrders('');
    console.log('oooooooo', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addcustomerOrders(res?.data?.data));
    }
    setisLoading(false);
  };
  const handleCancel = async () => {
    setisLoading(true);
    if (item?._id) {
      const res = await cancelOrder(item?._id, {reason: 'Incorrect Request'});
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
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
        // Snackbar.show({
        //   text: res?.error?.message
        //     ? res?.error?.message
        //     : res?.error?.data?.message
        //     ? res?.error?.data?.message
        //     : 'Oops!, an error occured',
        //   duration: Snackbar.LENGTH_LONG,
        //   textColor: '#fff',
        //   backgroundColor: '#88087B',
        // });
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
    setisLoading(false);
    setInfoModal(false);
    setmodalSection('All');
  };
  const [selectedReason, setSelectedReason] = useState<string>('');
  const handleSelectedReasons = reason => {
    setSelectedReason(reason);
  };
  const [otherReason, setOtherReason] = useState('');

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <>
        <TouchableOpacity
          disabled={editable ? editable : false}
          onPress={() => navigation.navigate('OrderActive', {data: item})}
          style={[
            tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
            {
              //   height: perWidth(135),
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
                    item?.serviceProvider?.profilePic ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.cacheOnly
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
                    text={`₦ ${item?.totalPrice || item?.amount}`}
                    size={14}
                    lineHeight={16}
                    color={colors.white}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={tw`ml-auto`}>
                  {status === 'INPROGRESS' 
                  // &&
                  //   item?.isCompletedByProvider === false 
                    && (
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
                  {(status === 'COMPLETED' 
                  // ||
                  //   item?.isCompletedByProvider === true
                    ) && (
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
                        color={'#FFC727'}
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
          {/* <View style={tw`flex flex-row mt-3 justify-between`}>
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
          </View> */}
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

              <TouchableOpacity
                onPress={() => {
                  // setmodalSection('Cancel')
                  // setmodalSection('Cancel2');
                  // if (status === 'CANCELLED') {
                  //   ToastShort('This Order has already')
                  // }else{
                  setmodalSection('reason');

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

              <TouchableOpacity
                onPress={() => {
                  socket.connect();
                  setInfoModal(false);
                  navigation.navigate('Inbox', {
                    id: item?.serviceProvider._id || item?.serviceProvider?.id,
                    name: `${item?.serviceProvider?.firstName} ${item?.serviceProvider?.lastName}`,
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
              {status === 'TRACK' && item?.location !== 'online' && (
                <TouchableOpacity
                  onPress={() => {
                    setInfoModal(false);
                    navigation.navigate('ViewLocation');
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
                    setInfoModal(false);
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

              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: WIDTH_WINDOW * 0.95},
                ]}
              />
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
                    await handleCancel();
                  } else {
                    setmodalSection('All');
                    Snackbar.show({
                      text: 'You can’t cancel this order. Only Pending and Accepted Orders can be canceled.',
                      duration: Snackbar.LENGTH_LONG,
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
              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: WIDTH_WINDOW * 0.95},
                ]}
              />
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
    </>
  );
};
export default Orderscomponent3;

const styles = StyleSheet.create({
  container: {
    // Your container styles here
  },
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
