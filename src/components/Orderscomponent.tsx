import {Image, View, TouchableOpacity, Platform, Alert} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useState} from 'react';
import images from '../constants/images';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
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

const Orderscomponent2 = ({item, index, status, navigation, editable}: any) => {
  const [saved, setsaved] = useState(false);
  const [InfoModal, setInfoModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [modalSection, setmodalSection] = useState('All');

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

  return (
    <>
      <>
        <TouchableOpacity
          disabled={editable ? editable : false}
          onPress={() => navigation.navigate('OrderActive', {data: item})}
          style={[
            tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
            {
              height: perWidth(130),
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
              <View style={tw`ml-auto`}>
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
              </View>
            </View>
          </View>
          <View>
            <View
              style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
              <Textcomp
                text={`${
                  item?.serviceProvider?.firstName +
                  ' ' +
                  item?.serviceProvider?.lastName?.charAt(0)
                }.`}
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
                text={`${formatDateToCustomFormat(item?.createdAt)}`}
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
            <View style={tw`h-[35%]  mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                }}
                style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
              />

              <TouchableOpacity
                onPress={() => setmodalSection('Cancel')}
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
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  navigation.navigate('ViewLocation');
                }}
                style={[
                  tw`flex mt-10 flex-row`,
                  {marginHorizontal: perWidth(30), marginTop: perHeight(25)},
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
              <TouchableOpacity
                style={[
                  tw`flex mt-10 flex-row`,
                  {marginHorizontal: perWidth(30), marginTop: perHeight(25)},
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
                    'Orders can only be canceled 5 hours before scheduled delivery time'
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
      </Modal>
    </>
  );
};
export default Orderscomponent2;
