import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import {createOrder} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {ToastShort} from '../../utils/utils';

const OrderReview = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setisLoading] = useState(false);
  const _data = route.params;
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
    // setisLoading(true);

    const scheduledDeliveryDate = new Date(_data.scheduledDeliveryDate);
    const formattedScheduledDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(scheduledDeliveryDate);

    const Data = {
      serviceProvider: _data.serviceProvider,
      totalPrice: Number(_data?.totalPrice) + Number(_data?.totalPrice * 0.075),
      amount: Number(_data.totalPrice),
      description: _data.description,
      scheduledDeliveryDate: _data.date,
      location: `${_data.location}`.toLowerCase(),
      address: _data.address,
      // paymentStatus: 'PAID',
      service: _data?.service,
    };
    console.log(Data);
    try {
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
          ToastShort(
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
    }
    setisLoading(false);
  };
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView style={tw`flex-1 h-full `} contentContainerStyle={{flex: 1}}>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
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
              <View>
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
                  <View style={tw``}>
                    <Textcomp
                      text={`${_data?.description}`}
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
                      text={`${_data?.address}`}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
              </View>

              <View style={tw`items-center pr-3`}>
                <Image
                  resizeMode="contain"
                  style={[tw``, {width: 15, height: 15}]}
                  source={images.arrow_up}
                />

                <View style={tw`mt-1.5`}>
                  <Textcomp
                    // text={'$2000'}
                    text={`₦${_data?.totalPrice}`}
                    size={14}
                    lineHeight={15}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
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
                {/* <View style={tw`mt-2`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Promo code'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </View> */}
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
                {/* <TouchableOpacity onPress={() => {}} style={tw`mt-2`}>
                  <Textcomp
                    text={'Enter a Code'}
                    size={13}
                    lineHeight={15}
                    color={'#88087B'}
                    fontFamily={'Inter-Regular'}
                  />
                </TouchableOpacity> */}
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
                handleCreate();
                // navigation.navigate('PaymentConfirmed');
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
    </View>
  );
};

export default OrderReview;
