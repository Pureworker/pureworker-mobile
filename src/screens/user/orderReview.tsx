import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import {createOrder} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {ToastLong, ToastShort} from '../../utils/utils';
import Modal from 'react-native-modal/dist/modal';
// import CheckBox from '@react-native-community/checkbox';
import CheckBox from 'react-native-check-box';
import {addIntermediateOrder} from '../../store/reducer/mainSlice';

const OrderReview = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setisLoading] = useState(false);

  const [needAMount, setneedAMount] = useState(null);
  const [insufficientModal, setinsufficientModal] = useState(false);

  const _data = route.params;

  const userData = useSelector((state: any) => state.user.userData);
  const interOrder = useSelector((state: any) => state.user.interOrder);
  console.log('here', `${_data?.scheduledDeliveryDate}`, _data);
  const dispatch = useDispatch();
  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    return formattedTime;
  }

  console.log(
    formatTimestampToTime(_data.scheduledDeliveryTime?.nativeEvent?.timestamp),
  );

  const handleCreate = async () => {
    setready(false);
    // setisLoading(true);
    const scheduledDeliveryDate = new Date(_data.scheduledDeliveryDate);
    const formattedScheduledDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(scheduledDeliveryDate);

    const tp = Number(_data?.totalPrice) + Number(_data?.totalPrice * 0.075);

    const _d = {
      serviceProvider: _data.serviceProvider,
      totalPrice: Number(_data?.totalPrice) + Number(_data?.totalPrice * 0.075),
      amount: Number(_data.totalPrice),
      vatAmount: Number(_data?.totalPrice * 0.075),
      description: _data.description,
      scheduledDeliveryDate: _data.date,
      location: `${_data.location}`.toLowerCase(),
      address: _data.address,
      // paymentStatus: 'PAID',
      service: _data?.service,
    };
    let Data;

    if (route.params?.from && route.params?.from === 'Funding') {
      Data = interOrder;
    } else {
      Data = {
        serviceProvider: _data.serviceProvider,
        totalPrice:
          Number(_data?.totalPrice) + Number(_data?.totalPrice * 0.075),
        amount: Number(_data.totalPrice),
        vatAmount: Number(_data?.totalPrice * 0.075),
        description: _data.description,
        scheduledDeliveryDate: _data.date,
        location: `${_data.location}`.toLowerCase(),
        address: _data.address,
        // paymentStatus: 'PAID',
        service: _data?.service,
      };
    }

    console.log(Data);
    try {
      if (Number(userData?.wallet?.availableBalance) < Number(tp)) {
        console.log('Here');
        let _need = Number(userData?.wallet?.availableBalance) - Number(tp);
        setneedAMount(_need);
        dispatch(addIntermediateOrder(_d));
        setTimeout(() => {
          setinsufficientModal(true);
        }, 1000);

        // ToastLong('Insufficient Balance.');
        // Snackbar.show({
        //   text: 'Insufficient Balance.',
        //   duration: Snackbar.LENGTH_LONG,
        //   textColor: '#fff',
        //   backgroundColor: '#88087B',
        // });
        return;
      }
      if (Data?.serviceProvider) {
        const res = await createOrder(Data);
        console.log(res?.data);
        if (res?.status === 200 || res?.status === 201) {
          navigation.navigate('PaymentConfirmed');
          ToastShort('Your Order has been Placed.');
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
          // ToastShort(
          //   `${
          //     res?.error?.message
          //       ? res?.error?.message
          //       : res?.error?.data?.message
          //       ? res?.error?.data?.message
          //       : 'Oops!, an error occured'
          //   }`,
          // );
        }
        setisLoading(false);
      } else {
        Snackbar.show({
          text: 'Please fill all fields',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        ToastShort('Please fill all fields');
        setisLoading(false);
      }
    } catch (error) {
      ToastShort(`Error: ${error}`);
      setisLoading(false);
      setisLoading(false);
    } finally {
      setisLoading(false);
    }
  };

  const [ready, setready] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  //discount
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [isPromoValid, setIsPromoValid] = useState(false);

  const [invallidPromo, setinvallidPromo] = useState(false);

  const validatePromoCode = () => {
    const validPromoCodes = {
      DISCOUNT10: 10, // 10% discount
      DISCOUNT15: 15, // 15% discount
    };

    if (validPromoCodes[promoCode]) {
      setDiscount((validPromoCodes[promoCode] / 100) * _data.totalPrice);
      setIsPromoValid(true);
      ToastShort('Promo code applied successfully!');
    } else {
      setDiscount(0);
      setIsPromoValid(false);
      setinvallidPromo(true);
      // ToastShort('Invalid promo code.');
    }
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View
        style={[
          {
            flex: 1,
          },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw` `}
          contentContainerStyle={{}}>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Order Review'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>
          <View style={tw` `}>
            <View style={tw`border-b pb-3 border-[#0004132E] mx-[2%] `}>
              <View
                style={[
                  tw`flex flex-row justify-between `,
                  {paddingLeft: perWidth(32), marginTop: perHeight(25)},
                ]}>
                <View style={tw`w-10/10`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Order Details'}
                      size={17}
                      lineHeight={17}
                      color={'#000413'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw`mt-3`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Job Description'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    <View style={[tw` mt-2`, {maxHeight: 200, minHeight: 50}]}>
                      <Textcomp
                        text={`${_data?.description} ${
                          _data.description?.split('')?.length > 60 ? '...' : ''
                        }`}
                        size={12}
                        lineHeight={14}
                        color={'#000413'}
                        fontFamily={'Inter'}
                        numberOfLines={10}
                      />
                    </View>
                  </View>

                  {/* <View style={tw``}>
                  <Image
                    resizeMode="contain"
                    style={[tw``, {width: 15, height: 15}]}
                    source={images.arrow_up}
                  />
                  <View style={tw`mt-1.5 bg-red-400`}>
                    <Textcomp
                      text={`₦${_data?.totalPrice}`}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                </View> */}
                  <View style={tw`mt-1.5`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Amount:'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    <View style={tw`mt-1`}>
                      <Textcomp
                        // text={'$2000'}
                        text={`₦${_data?.totalPrice}`}
                        size={15}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter'}
                      />
                    </View>
                  </View>

                  <View style={tw`mt-1.5`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Scheduled Delivery Date:'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    <View style={tw``}>
                      <Textcomp
                        text={`${_data?.displayDate}`}
                        size={12}
                        lineHeight={14}
                        color={'#000413'}
                        fontFamily={'Inter'}
                      />
                    </View>
                  </View>
                  <View style={tw`mt-1.5`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Location:'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    <View style={tw``}>
                      <Textcomp
                        text={`${_data?.location}`}
                        size={12}
                        lineHeight={14}
                        color={'#000413'}
                        fontFamily={'Inter'}
                      />
                    </View>
                  </View>
                  <View style={tw`mt-1.5`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Address:'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    <View style={tw``}>
                      <Textcomp
                        text={`${
                          _data?.address === undefined ? '' : _data?.address
                        }`}
                        size={12}
                        lineHeight={14}
                        color={'#000413'}
                        fontFamily={'Inter'}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={tw`border-b pb-6 border-[#0004132E] mx-[2%] `}>
              <View
                style={[
                  tw`flex flex-row justify-between `,
                  {paddingLeft: perWidth(32), marginTop: perHeight(25)},
                ]}>
                <View>
                  <View style={tw``}>
                    <Textcomp
                      text={'Order Summary'}
                      size={17}
                      lineHeight={17}
                      color={'#000413'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw`mt-3`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'Subtotal'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                  </View>
                  <View style={tw`mt-2`}>
                    <View style={tw``}>
                      <Textcomp
                        text={'VAT'}
                        size={14}
                        lineHeight={15}
                        color={'#000413'}
                        fontFamily={'Inter-Medium'}
                      />
                    </View>
                    {/* {isPromoValid && ( */}

                    {!showPromoInput && (
                      <View style={tw`mt-2`}>
                        <Textcomp
                          text={'Promo code'}
                          size={14}
                          lineHeight={15}
                          color={'#000413'}
                          fontFamily={'Inter-Medium'}
                        />
                      </View>
                    )}
                    {/* )} */}
                  </View>
                </View>
                <View style={tw`items-end pr-3`}>
                  <Image
                    resizeMode="contain"
                    style={[tw`mr-3`, {width: 15, height: 15}]}
                    source={images.arrow_up}
                  />

                  <View style={tw`mt-2`}>
                    <Textcomp
                      text={`₦${_data?.totalPrice}`}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                  <View style={tw`mt-2`}>
                    <Textcomp
                      text={`₦${_data?.totalPrice * 0.075}`}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>

                  {!showPromoInput && (
                    <TouchableOpacity
                      style={tw`mt-3`}
                      onPress={() => setShowPromoInput(true)}>
                      <Textcomp
                        text={'Enter a Code'}
                        size={14}
                        lineHeight={15}
                        color={'#88087B'}
                        fontFamily={'Inter-Medium'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {showPromoInput && (
                <View
                  style={tw`mx-auto w-8.75/10 border rounded-lg mt-4 mr-4 `}>
                  <View style={[tw` flex flex-row  `]}>
                    <TextInput
                      style={[tw` p-2 flex-1  text-black `, {height: 50}]}
                      placeholder="Promo code"
                      value={promoCode}
                      onChangeText={setPromoCode}
                    />

                    <TouchableOpacity
                      onPress={validatePromoCode}
                      style={tw` p-2 rounded ml-auto my-auto`}>
                      <Textcomp
                        text={'Apply'}
                        size={14}
                        lineHeight={15}
                        color={'#88087B'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {isPromoValid && (
                <View
                  style={[
                    tw`flex flex-row justify-between mr-3`,
                    {paddingLeft: perWidth(32)},
                  ]}>
                  <View style={tw`mt-2`}>
                    <Textcomp
                      text={'Promo code'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>

                  <View style={tw`mt-2`}>
                    <Textcomp
                      text={`-₦${discount.toFixed(2)}`}
                      size={14}
                      lineHeight={15}
                      color={'#88087B'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                </View>
              )}
            </View>
            <View
              style={tw`mt-4 flex flex-row justify-between pl-[10%] pr-[5%]`}>
              <View style={tw``}>
                <Textcomp
                  text={'Total'}
                  size={14}
                  lineHeight={15}
                  color={'#000413'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={tw``}>
                <Textcomp
                  text={`₦${
                    Number(_data?.totalPrice) +
                    Number(_data?.totalPrice * 0.075)
                  }`}
                  size={14}
                  lineHeight={15}
                  color={'#000413'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            </View>

            <View style={tw`mt-[20%] `}>
              <TouchableOpacity
                onPress={() => {
                  setready(true);
                }}
                style={[
                  tw`bg-[${colors.darkPurple}] items-center rounded-lg justify-center mx-auto py-3`,
                  {width: perWidth(260)},
                ]}>
                <Textcomp
                  text={'Pay Now'}
                  size={14}
                  lineHeight={15}
                  color={colors.primary}
                  fontFamily={'Inter-Bold'}
                />
              </TouchableOpacity>
              <View style={tw`mx-auto mt-2`}>
                <Textcomp
                  text={'Your payment information is secure'}
                  size={12}
                  lineHeight={14.5}
                  color={'#00041380'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          <View style={[tw``, {height: 150}]} />
          <View style={tw`w-full h-0.5  bg-black  mb-[7.5%]`} />
        </ScrollView>
      </View>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
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
          <View style={[tw`p-4 mt-auto bg-[#D9D9D9]`, {minHeight: '65%'}]}>
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
                  lineHeight={18.5}
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
                  text={
                    'Provide accurate descriptions as the scope of work cannot be modified once submitted.'
                  }
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    '⁠Prioritize safety, both yours and the service provider’s, during the job.'
                  }
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-2 h-2  mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    '⁠Pureworker is not liable for any issues or disputes that arise from interactions with service providers conducted outside the app.'
                  }
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2 mb-4`}>
                <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={'⁠No inappropriate touching or verbal sexual remarks.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <View style={tw`mt-auto`}>
                <View style={tw`ml-4`}>
                  <Textcomp
                    text={'Note: Pureworker charges a 15% fee on all orders.'}
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View style={tw`flex flex-row items-center mb-4 ml-4`}>
                  {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  style={{backgroundColor: 'white'}}
                  boxType={'square'}
                  onTintColor={colors.parpal}
                  onCheckColor={colors.parpal}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
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
              </View>

              <TouchableOpacity
                // disabled={!toggleCheckBox}
                style={tw`bg-[${colors.parpal}] w-[85%] py-4 mb-4 items-center  mx-auto rounded`}
                onPress={() => {
                  if (toggleCheckBox) {
                    handleCreate();
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

      <Modal
        isVisible={invallidPromo}
        onModalHide={() => {
          setinvallidPromo(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setinvallidPromo(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setinvallidPromo(false)}
        onBackButtonPress={() => setinvallidPromo(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setinvallidPromo(false)}
            style={tw`flex-1`}
          />
          <View
            style={[
              tw`p-4 mt-auto bg-[#D9D9D9]`,
              {minHeight: '30%', marginBottom: -20},
            ]}>
            <TouchableOpacity
              onPress={() => {
                setinvallidPromo(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View style={tw`flex-1`}>
              <View style={tw`pt-3 mt-1 mx-auto`}>
                <Textcomp
                  text={'Invalid Promo Code'}
                  size={18}
                  lineHeight={21.5}
                  color={'black'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={tw`mt-6 mx-auto`}>
                <Textcomp
                  text={
                    'The promo code you entered has expired or does not apply to your order.'
                  }
                  size={16}
                  lineHeight={20.5}
                  color={'black'}
                  fontFamily={'Inter-Regular'}
                  style={tw`items-center text-center`}
                />
              </View>
              <View style={tw`mt-4`} />

              <TouchableOpacity
                style={tw`bg-[${colors.parpal}] w-[50%] py-4 mb-4 items-center  mx-auto rounded`}
                onPress={() => {
                  setinvallidPromo(false);
                }}>
                <Textcomp
                  text={'Cancel'}
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

      <Modal
        isVisible={insufficientModal}
        onModalHide={() => {
          setinsufficientModal(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setinsufficientModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setinsufficientModal(false)}
        onBackButtonPress={() => setinsufficientModal(false)}>
        <View style={tw` h-full w-full items-center bg-black bg-opacity-5`}>
          <View
            style={[
              tw`p-4 mb-auto  mt-auto bg-[#D9D9D9]`,
              {
                minHeight: Platform.OS === 'ios' ? '37.5%' : '42.5%',
                marginHorizontal: '1.5%',
                borderRadius: 20,
              },
            ]}>
            <View style={tw`flex-1`}>
              <View style={tw`pt-2 mt-1 mx-auto`}>
                <Textcomp
                  text={'Insufficient Funds'}
                  size={18}
                  lineHeight={21.5}
                  color={'black'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={tw`mt-6 mx-auto`}>
                <Textcomp
                  text={`You don't have enough money in your account for this transaction.   `}
                  size={16}
                  lineHeight={20.5}
                  color={'black'}
                  fontFamily={'Inter-Regular'}
                  style={tw`items-center text-center`}
                />

                <Textcomp
                  text={`
Current balance is NGN ${userData?.wallet?.availableBalance}. 
You need NGN ${Math.abs(needAMount)} more
                     `}
                  size={16}
                  lineHeight={20.5}
                  color={colors.parpal}
                  fontFamily={'Inter-Bold'}
                  style={tw`items-center text-center`}
                />
              </View>
              <View style={tw`mt-4`} />

              <View style={tw`flex flex-row`}>
                <TouchableOpacity
                  style={tw`bg-[${colors.grey}] w-[45%] py-4 mb-4 items-center  mx-auto rounded`}
                  onPress={() => {
                    setinsufficientModal(false);
                  }}>
                  <Textcomp
                    text={'Cancel'}
                    size={14}
                    lineHeight={14.5}
                    color={'white'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-[${colors.parpal}] w-[45%] py-4 mb-4 items-center  mx-auto rounded`}
                  onPress={() => {
                    navigation.navigate('PaymentMethod2', {
                      from: 'OrderReview',
                    });
                    setinsufficientModal(false);
                  }}>
                  <Textcomp
                    text={'Add Funds'}
                    size={14}
                    lineHeight={14.5}
                    color={'white'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrderReview;
