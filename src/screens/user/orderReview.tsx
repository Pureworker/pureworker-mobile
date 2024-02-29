import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
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

const OrderReview = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setisLoading] = useState(false);
  const _data = route.params;
  const userData = useSelector((state: any) => state.user.userData);
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

    const Data = {
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
    console.log(Data);
    try {
      if (Number(userData?.wallet?.availableBalance) < Number(tp)) {
        ToastLong('Insufficient Balance.');
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
            duration: Snackbar.LENGTH_SHORT,
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
          duration: Snackbar.LENGTH_SHORT,
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
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView style={tw`flex-1 h-full `} contentContainerStyle={{flex: 1}}>
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
        <View style={tw`flex-1  h-full`}>
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
                    text={`N ${_data?.totalPrice * 0.075}`}
                    size={14}
                    lineHeight={15}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={tw`mt-4 flex flex-row justify-between pl-[10%] pr-[5%]`}>
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
                  Number(_data?.totalPrice) + Number(_data?.totalPrice * 0.075)
                }`}
                size={14}
                lineHeight={15}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
          </View>

          <View style={tw`mt-auto mb-[8%]`}>
            <TouchableOpacity
              onPress={() => {
                setready(true);
                // handleCreate();
                // navigation.navigate('PaymentMethod2', {amount: 4000});
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
          <View style={tw`w-full h-0.5  bg-black  mb-[7.5%]`} />
        </View>
      </ScrollView>
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

              <View style={tw`flex flex-row items-center mt-auto mb-4 ml-4`}>
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
    </SafeAreaView>
  );
};

export default OrderReview;
