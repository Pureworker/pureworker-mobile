import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  AndroidMode,
  IOSMode,
  StackNavigation,
} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../utils/position/sizes';
import DropDownPicker from 'react-native-dropdown-picker';
import commonStyle from '../../constants/commonStyle';
import TextWrapper from '../../components/TextWrapper';
import colors from '../../constants/colors';
import TextInputs from '../../components/TextInput2';
import Modal from 'react-native-modal/dist/modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {
  HEIGHT_WINDOW,
  WIDTH_SCREEN,
  WIDTH_WINDOW,
} from '../../constants/generalStyles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {DateTime} from 'luxon';

const OrderDetails = () => {
  const navigation = useNavigation<StackNavigation>();
  const route: any = useRoute();
  const providerData = route.params?.data;
  const service = route.params?.service;
  const dispatch = useDispatch();

  console.log('PPPPP---', route.params);

  const [locationItems, setLocationItems] = useState([
    {label: 'Online (your business renders services online)', value: 'Online'},
    {
      label:
        'Offline (your business renders services at the customer’s location)',
      value: 'Offline',
    },
    {label: 'Hybrid', value: 'Hybrid'},
  ]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [description, setDescription] = useState('');
  const [showDate, setshowDate] = useState(false);
  const [price, setPrice] = useState(0);
  const [address, setaddress] = useState('');
  const [scheduleTime, setscheduleTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<IOSMode | AndroidMode>('date');
  const [mode2, setMode2] = useState<IOSMode | AndroidMode>('time');
  const [show, setShow] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [schdeuleIsoDate, setschdeuleIsoDate] = useState('');
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setandroidshowDate(false);
  };
  console.log(providerData);
  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleCreate = async () => {
    if (locationValue !== 'Online') {
      if (!address) {
        Snackbar.show({
          text: 'Address is required for Offline or Hybrid Jobs',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
    }
    // setisLoading(true);
    const Data: any = {
      serviceProvider:
        providerData?._id || providerData?.id || providerData?.user?._id,
      totalPrice: price,
      amount: Number(price),
      description: description,
      scheduledDeliveryDate: date,
      scheduledDeliveryTime: scheduleTime,
      location: `${locationValue}`.toUpperCase(),
      address: address,
      paymentStatus: 'PAID',
      service: service,
      date: schdeuleIsoDate,
      displayDate: displayDate,
    };
    console.log('WWWWW', Data, providerData);
    if (
      providerData?._id &&
      price &&
      description &&
      schdeuleIsoDate &&
      // scheduleTime &&
      locationValue
    ) {
      if (locationValue === 'Online') {
        delete Data.address;
      }
      navigation.navigate('OrderReview', Data);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      // setisLoading(false);
    }
    // setisLoading(false);
  };

  const showTimePicker = () => {
    setMode('time');
    setShow(true);
  };

  const hidePicker = () => {
    setShow(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShow(Platform.OS === 'ios');
    if (selectedTime !== undefined) {
      // Handle the time change logic if needed
      // For now, we're just setting the time
      setscheduleTime(selectedTime);
      setandroidshowTime(false);
    }
  };

  const [androidshowTime, setandroidshowTime] = useState(false);
  const [androidshowDate, setandroidshowDate] = useState(false);
  const [displayDate, setdisplayDate] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  // const handleConfirm = date => {
  //   console.log(typeof date);
  //   console.warn(
  //     'A date has been picked: ',
  //     date,
  //     DateTime.fromISO(`${date}`).toISO()
  //   );
  //   hideDatePicker();
  // };
  const handleConfirm = (date: any) => {
    const f = `${date}`;
    const jsDate = new Date(f);
    const luxonDateTime = DateTime.fromJSDate(jsDate);
    const isoString = luxonDateTime.toISO();
    console.log(isoString);
    setschdeuleIsoDate(isoString);
    setdisplayDate(f);
    hideDatePicker();
  };

  function formatToCustomString(date) {
    const jsDate = new Date(date);
    const luxonDateTime = DateTime.fromJSDate(jsDate);

    return luxonDateTime.toLocaleString({
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? 10
              // getStatusBarHeight(true)
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
            text={'Order Details'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <ScrollView>
        <View style={tw``}>
          <View
            style={[
              tw`border-b border-[#00000033] pb-1 mx-4 px-4`,
              {marginTop: perHeight(22)},
            ]}>
            <View style={tw``}>
              <Textcomp
                text={'Order Details'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={`Confirm with ${
                  providerData?.businessName
                    ? providerData?.businessName
                    : `${providerData?.firstName} ${providerData?.lastName}`
                } before hiring`}
                size={11}
                lineHeight={14}
                color={'#000413'}
                fontFamily={'Inter'}
              />
            </View>
          </View>
          <View
            style={[
              tw`border-b border-[#00000033] pb-4 mx-4 px-4`,
              {marginTop: perHeight(5)},
            ]}>
            <TextWrapper
              children="Job Description"
              isRequired={false}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />
            <View
              style={{
                height: 130,
                borderRadius: 8,
                backgroundColor: colors.greyLight1,
                marginTop: 13,
              }}>
              {/* <TextInputs
                styleInput={{
                  color: colors.black,
                  paddingHorizontal: 18,
                  fontSize: 12,
                }}
                style={{
                  backgroundColor: colors.green,
                  height: 130,
                  borderRadius: 0,
                }}
                labelText={
                  'Enter brief description about the service to be rendered'
                }
                state={description}
                setState={text => {
                  setDescription(text);
                }}
                multiline={true}
                nbLines={5}
              /> */}
              <TextInput
                multiline
                placeholder="Enter brief description about the service to be rendered"
                style={[
                  tw` px-4 rounded-lg text-black`,
                  {
                    height: perHeight(80),
                    backgroundColor: colors.greyLight1,
                    color: 'black',
                  },
                ]}
                onChangeText={text => {
                  setDescription(text);
                }}
                placeholderTextColor={'black'}
              />
            </View>
            {/* <View
              style={{
                height: 130,
                borderRadius: 8,
                backgroundColor: colors.greyLight1,
                marginTop: 13,
              }}>
              <TextInputs
                styleInput={{
                  color: colors.black,
                  paddingHorizontal: 18,
                  fontSize: 12,
                }}
                style={{backgroundColor: colors.greyLight1}}
                labelText={
                  'Enter brief description about the service to be rendered'
                }
                state={description}
                setState={setDescription}
                multiline={true}
                nbLines={5}
              />
            </View> */}
          </View>
          <View
            style={[
              tw`border-b border-[#00000033] pb-4 mx-4 px-4`,
              {marginTop: perHeight(5)},
            ]}>
            <TextWrapper
              children="Agreed Price"
              isRequired={false}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />

            <View
              style={[
                tw`flex flex-row px-3 items-center  rounded-lg mt-5`,
                {backgroundColor: colors.greyLight1, height: perHeight(40)},
              ]}>
              <View style={tw``}>
                <Textcomp
                  text={'₦'}
                  size={17}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[
                  tw`flex-1 py-2 ml-3 text-black`,
                  {fontFamily: 'Inter-Medium'},
                ]}
                keyboardType="numeric"
                onChangeText={text => {
                  setPrice(text);
                }}
              />
            </View>
          </View>
          <View
            style={[
              tw`border-b border-[#00000033] pb-4 mx-4 px-4`,
              {marginTop: perHeight(5)},
            ]}>
            <TextWrapper
              children="Scheduled Delivery Date"
              isRequired={false}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
            />

            <TouchableOpacity
              onPress={() => {
                setDatePickerVisibility(!isDatePickerVisible);
              }}
              style={[
                tw`w-full px-4 justify-center rounded-lg mt-3`,
                {backgroundColor: colors.greyLight1, height: perHeight(40)},
              ]}>
              <Textcomp
                text={`${
                  displayDate ? formatToCustomString(displayDate) : 'Pick date'
                }`}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-Regular'}
              />
            </TouchableOpacity>

            {/* {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                display="default"
                onChange={onChange}
              />
            )}

            {Platform.OS === 'ios' && (
              <View
                style={[
                  tw`flex flex-row items-center  rounded-lg mt-5`,
                  {height: perHeight(40)},
                ]}>
                <View
                  style={[
                    tw`items-center`,
                    {
                      minHeight: 50,
                      width: perWidth(150),
                    },
                  ]}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    // is24Hour={false}
                    display="default"
                    onChange={onChange}
                    style={{
                      flex: 1,
                    }}
                    disabled={false}
                  />
                </View>
                <View>
                  <DateTimePicker
                    testID="clock"
                    value={date}
                    mode={mode2}
                    display="default"
                    onChange={text => {
                      setscheduleTime(text);
                    }}
                    style={{
                      flex: 1,
                    }}
                  />
                </View>
              </View>
            )}

            {Platform.OS === 'android' && (
              <>
                <View style={tw`flex flex-row items-center`}>
                  <TouchableOpacity
                    style={[
                      tw`bg-[${colors.greyLight}] px-3 py-2  rounded-lg `,
                      {
                        backgroundColor: colors.greyLight1,
                        maxWidth: WIDTH_WINDOW * 0.5,
                      },
                    ]}
                    onPress={() => {
                      setandroidshowDate(!androidshowDate);
                    }}>
                    <Textcomp
                      text={`${date ? date : 'Date'}`}
                      // fontSize={18}
                      size={18}
                      color={'#000000'}
                      style={[tw`text-left mt-2`, {fontWeight: '600'}]}
                      family={'Inter'}
                      lineHeight={19}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      tw`bg-[${colors.greyLight}] px-4 py-2 rounded-lg ml-4 `,
                      {backgroundColor: colors.greyLight1},
                    ]}
                    onPress={() => {
                      setandroidshowTime(!androidshowTime);
                    }}>
                    <Textcomp
                      text={`${scheduleTime ? scheduleTime : '00:00'}`}
                      // fontSize={18}
                      size={18}
                      color={'#000000'}
                      style={[tw`text-left mt-2`, {fontWeight: '600'}]}
                      family={'Inter'}
                      lineHeight={19}
                    />
                  </TouchableOpacity>
                </View>

                {androidshowDate && (
                  <Modal
                    isVisible={true}
                    onBackButtonPress={() => {
                      setandroidshowDate(!androidshowDate);
                    }}
                    onBackdropPress={() => {
                      setandroidshowDate(!androidshowDate);
                    }}
                    style={{
                      width: WIDTH_SCREEN,
                      padding: 0,
                      margin: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onSwipeComplete={hidePicker}>
                    <View
                      style={[
                        tw`, w-[95%] bg-white`,
                        {height: HEIGHT_WINDOW * 0.325},
                      ]}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        display="default"
                        onChange={onChange}
                        style={{
                          flex: 1,
                        }}
                        disabled={false}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setandroidshowDate(false);
                          setandroidshowTime(false);
                        }}
                        style={tw`bg-[${colors.primary}] rounded-xl mx-auto p-4 px-6`}>
                        <Textcomp
                          text={'Select'}
                          size={18}
                          color={'#FFFFFF'}
                          style={[tw`text-left mt-2`, {fontWeight: '400'}]}
                          family={'Inter'}
                          lineHeight={19}
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
                {androidshowTime && (
                  <Modal
                    isVisible={true}
                    onBackButtonPress={() => {
                      setandroidshowTime(!androidshowTime);
                    }}
                    onBackdropPress={() => {
                      setandroidshowTime(!androidshowTime);
                    }}
                    style={{
                      width: WIDTH_SCREEN,
                      padding: 0,
                      margin: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onSwipeComplete={hidePicker}>
                    <View
                      style={[
                        tw`, w-[95%] bg-white`,
                        {height: HEIGHT_WINDOW * 0.325},
                      ]}>
                      <DateTimePicker
                        testID="timePicker"
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, selectedTime) => {
                          handleTimeChange(event, selectedTime);
                          hidePicker();
                        }}
                      />
                      <TouchableOpacity
                        onPress={hidePicker}
                        style={tw`bg-[${colors.primary}] rounded-xl mx-auto p-4 px-6`}>
                        <Textcomp
                          text={'Select'}
                          // fontSize={18}
                          size={18}
                          color={'#FFFFFF'}
                          style={[tw`text-left mt-2`, {fontWeight: '400'}]}
                          family={'Inter'}
                          lineHeight={19}
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
              </>
            )} */}
          </View>

          <View
            style={{
              zIndex: 1,
              // marginTop: 15,
              minHeight: 150,
              marginHorizontal: perWidth(25),
              width: perWidth(321),
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.bold,
                color: '#000000',
                marginTop: 15,
                marginBottom: 15,
              }}>
              Location
            </Text>
            <DropDownPicker
              open={locationOpen}
              value={locationValue}
              items={locationItems}
              setOpen={setLocationOpen}
              setValue={setLocationValue}
              setItems={setLocationItems}
              showArrowIcon={true}
              ArrowDownIconComponent={({style}) => (
                <Image
                  resizeMode="contain"
                  style={{width: 15, height: 15, tintColor: '#010B2D'}}
                  source={!locationOpen && images.polygonForward}
                />
              )}
              ArrowUpIconComponent={({style}) => (
                <Image
                  resizeMode="contain"
                  style={{width: 15, height: 15, tintColor: '#010B2D'}}
                  source={locationOpen && images.polygonDown}
                />
              )}
              zIndex={10}
              dropDownContainerStyle={{
                borderWidth: 0,
              }}
              labelStyle={{
                fontFamily: commonStyle.fontFamily.regular,
                fontSize: 14,
                color: '#000',
              }}
              placeholderStyle={{
                fontFamily: commonStyle.fontFamily.regular,
                fontSize: 14,
                color: '#9E9E9E',
              }}
              style={{
                backgroundColor: '#D9D9D9',
                borderColor: '#9E9E9E14',
              }}
              listMode="FLATLIST"
              showTickIcon={false}
              textStyle={{
                color: '#9E9E9E',
              }}
              listParentLabelStyle={{
                color: '#000',
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.regular,
              }}
              listItemContainerStyle={{
                backgroundColor: 'D9D9D9',
                borderColor: 'red',
                opacity: 1,
                marginTop: 5,
                borderWidth: 0,
              }}
            />
          </View>

          {locationValue && locationValue !== 'Online' && (
            <View
              style={[
                tw`border-b border-[#00000033] pb-4 mx-4 px-4`,
                {marginTop: perHeight(5)},
              ]}>
              <TextWrapper
                children="Enter Address(if offline)"
                isRequired={false}
                fontType={'semiBold'}
                style={{fontSize: 16, marginTop: 20, color: colors.black}}
              />

              <View
                style={[
                  tw`flex flex-row px-3 items-center  rounded-lg mt-4`,
                  {backgroundColor: colors.greyLight1, height: perHeight(40)},
                ]}>
                <TextInput
                  style={[
                    tw`flex-1 py-2 ml-3 text-black`,
                    {fontFamily: 'Inter-Medium'},
                  ]}
                  keyboardType="default"
                  onChangeText={text => {
                    setaddress(text);
                  }}
                />
              </View>
            </View>
          )}

          <View style={tw`mx-auto flex flex-row justify-between mt-8`}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={[
                tw`bg-[${colors.darkPurple}] items-center justify-center`,
                {
                  width: perWidth(110),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                },
              ]}>
              <Textcomp
                text={'Cancel'}
                size={12}
                lineHeight={14}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('OrderReview');
                handleCreate();
              }}
              style={[
                tw`bg-[${colors.primary}] items-center justify-center`,
                {
                  width: perWidth(110),
                  height:
                    Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                  borderRadius: 7,
                  marginLeft: perWidth(46),
                },
              ]}>
              <Textcomp
                text={'Submit'}
                size={12}
                lineHeight={14}
                color={colors.black}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`h-80`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
      <View style={tw`h-1 w-full mb-5 bg-black`} />
    </SafeAreaView>
  );
};

export default OrderDetails;
