import {
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
// import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {DateTime} from 'luxon';
import {getUserOrders, rescheduleOrder} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {useDispatch} from 'react-redux';
import {addcustomerOrders} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../customLoading';

export default function ScheduledDeliveryDate({
  navigation,
  visible,
  func,
  item,
}: any) {
  const [InfoModal, setInfoModal] = useState(visible);

  function getTimeDifference(targetDate: string | number | Date) {
    const currentDate: any = new Date();
    const targetDateObj: any = new Date(targetDate);

    // Calculate the time difference in milliseconds
    const timeDifference = targetDateObj - currentDate;

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );

    return {days, hours, minutes};
  }
  const {days, hours, minutes} = getTimeDifference(item?.scheduledDeliveryDate);
  console.log(days, item?.scheduledDeliveryDate);
  function formatDate(inputDateStr: string | number | Date) {
    const inputDate = new Date(inputDateStr);

    // Adjust the date and time to GMT+1
    inputDate.setUTCHours(inputDate.getUTCHours() + 1);

    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1; // Months are zero-based
    const year = inputDate.getUTCFullYear();

    const formattedDate = `${day}/${month < 10 ? '0' : ''}${month}/${year}`;

    return formattedDate;
  }
  const [change, setchange] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [schdeuleIsoDate, setschdeuleIsoDate] = useState('');
  const [displayDate, setdisplayDate] = useState('');
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date: any) => {
    const f = `${date}`;
    const jsDate = new Date(f);
    const luxonDateTime = DateTime.fromJSDate(jsDate);
    const isoString = luxonDateTime.toISO();
    console.log('ios--', isoString);
    setschdeuleIsoDate(isoString);
    setdisplayDate(f);
    hideDatePicker();
  };
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
  const [isLoading, setisLoading] = useState(false);
  const handleUpdate = async () => {
    setisLoading(true);
    try {
      if (item?._id) {
        const res = await rescheduleOrder(item?._id, {
          scheduledDate: schdeuleIsoDate,
        });
        if (res?.status === 200 || res?.status === 201) {
          // navigation.navigate('PaymentConfirmed');
          setschdeuleIsoDate('');
          await initGetOrders();
          Alert.alert('Order Date Rescheduled');
          setDatePickerVisibility(false);
          func(false);
          navigation.goBack();
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
          setschdeuleIsoDate('');
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
    } finally {
      setschdeuleIsoDate('');
      setisLoading(false);
    }

    setisLoading(false);
  };
  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        func(false);
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}
      onBackdropPress={() => func(false)}
      swipeThreshold={200}
      swipeDirection={['down']}
      onSwipeComplete={() => func(false)}
      onBackButtonPress={() => func(false)}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
        <View
          style={tw` h-[${
            Platform.OS === 'ios' ? '37.5%' : '40.5%'
          }] mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4 mt-3`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Scheduled Delivery Date'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={`Expected delivery ${formatDate(
                  schdeuleIsoDate === ''
                    ? item?.scheduledDeliveryDate
                    : schdeuleIsoDate,
                )}`}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>

            {/* {!change && ( */}
            <View
              style={[
                tw`mx-[7.5%] bg-[#EBEBEB] flex flex-row justify-between px-6 rounded-full mt-6 py-2.5 items-center`,
                {},
              ]}>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    // text={`${getTimeDifference(schdeuleIsoDate)?.days || days}`}
                    text={`${
                      isNaN(getTimeDifference(schdeuleIsoDate)?.days)
                        ? days
                        : getTimeDifference(schdeuleIsoDate)?.days
                    }`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Days'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    // text={`${
                    //   getTimeDifference(schdeuleIsoDate)?.hours || hours
                    // }`}
                    text={`${
                      isNaN(getTimeDifference(schdeuleIsoDate)?.hours)
                        ? hours
                        : getTimeDifference(schdeuleIsoDate)?.hours
                    }`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Hours'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    // text={`${
                    //   getTimeDifference(schdeuleIsoDate)?.minutes || minutes
                    // }`}
                    text={`${
                      isNaN(getTimeDifference(schdeuleIsoDate)?.minutes)
                        ? minutes
                        : getTimeDifference(schdeuleIsoDate)?.minutes
                    }`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Minutes'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
            </View>
            {/* )} */}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
            />

            {schdeuleIsoDate ? (
              <TouchableOpacity
                onPress={() => {
                  // func(false);
                  handleUpdate();
                }}
                style={[
                  {
                    width: perWidth(315),
                    height: perHeight(40),
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 50,
                  },
                  tw`mx-auto`,
                ]}>
                <Textcomp
                  text={'Save Delivery Date'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-Bold'}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  // func(false);
                  setchange(true);
                  setDatePickerVisibility(true);
                }}
                style={[
                  {
                    width: perWidth(315),
                    height: perHeight(40),
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 50,
                  },
                  tw`mx-auto`,
                ]}>
                <Textcomp
                  text={'Change Delivery Date'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-Bold'}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              tw`bg-black mt-auto mb-4`,
              {height: 2, width: WIDTH_WINDOW * 0.95},
            ]}
          />
        </View>
      </View>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </Modal>
  );
}
