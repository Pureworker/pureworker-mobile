import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal/dist/modal';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderDetails = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [locationItems, setLocationItems] = useState([
    {label: 'Online(Job will be done virtually)', value: 'Online'},
    {label: 'Offline(Job will be done at your location)', value: 'Offline'},
    {label: 'Both', value: 'Both'},
  ]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [description, setDescription] = useState('');
  const [showDate, setshowDate] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<IOSMode | AndroidMode>('date');
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // updateDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode(type);
  };
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
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
                text={'Confirm with John Pedro before hiring'}
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
            </View>
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
                  text={'N'}
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
                onChangeText={() => {}}
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

            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                // is24Hour={false}
                display="default"
                onChange={onChange}
              />
            )}

            {/* {showDate && (
              <Modal
                isVisible={true}
                onBackButtonPress={() => setshowDate(false)}
                onBackdropPress={() => setshowDate(false)}
                swipeThreshold={200}
                style={{
                  width: WIDTH_SCREEN,
                  padding: 0,
                  margin: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onSwipeComplete={() => setshowDate(false)}>
                <View
                  style={[
                    tw`, w-[95%] bg-white`,
                    {height: HEIGHT_WINDOW * 0.325},
                  ]}>
                  <View style={tw``}>
                    <Calendar
                      // markedDates={bookedDates}
                      onDayPress={day => {
                        // Implement your logic here when a day is pressed
                        console.log('Selected day:', day);
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setshowDate(false);
                    }}
                    style={tw`bg-[${colors.primary}] rounded-xl mx-auto p-4 px-6`}>
                    <Textcomp
                      text={'Select'}
                      fontSize={18}
                      color={'#FFFFFF'}
                      style={[tw`text-left mt-2`, {fontWeight: '400'}]}
                      family={'Inter'}
                      lineHeight={19}
                    />
                  </TouchableOpacity>
                </View>
              </Modal>
            )} */}

            <View
              style={[
                tw`flex flex-row items-center  rounded-lg mt-5`,
                {height: perHeight(40)},
              ]}>
              <TouchableOpacity
                onPress={() => setshowDate(true)}
                style={[
                  tw`flex flex-row rounded-lg`,
                  {width: perWidth(200), backgroundColor: colors.greyLight1},
                ]}>
                <View style={tw`border-r w-1/3  flex-1`}>
                  <TextInput
                    style={[
                      tw`  my-auto flex-1 px-4 text-black`,
                      {fontFamily: 'Inter-Medium'},
                    ]}
                    keyboardType="numeric"
                    onChangeText={() => {}}
                    // editable={false}
                  />
                </View>
                <View style={tw`border-r w-1/3  flex-1`}>
                  <TextInput
                    style={[
                      tw`  my-auto flex-1 px-4 text-black`,
                      {fontFamily: 'Inter-Medium'},
                    ]}
                    keyboardType="numeric"
                    onChangeText={() => {}}
                    // editable={false}
                  />
                </View>
                <View style={tw` w-1/3`}>
                  <TextInput
                    style={[
                      tw` py-4 ml-3 text-black`,
                      {fontFamily: 'Inter-Medium'},
                    ]}
                    keyboardType="numeric"
                    onChangeText={() => {}}
                    // editable={false}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={[
                  tw`ml-1 rounded-lg flex  flex-row`,
                  {
                    width: perWidth(130),
                    height: perHeight(40),
                    backgroundColor: colors.greyLight1,
                  },
                ]}>
                <View style={tw`border-r w-1/2  flex-1`}>
                  <TextInput
                    style={[
                      tw`  my-auto flex-1 px-4 text-black`,
                      {fontFamily: 'Inter-Medium'},
                    ]}
                    keyboardType="numeric"
                    onChangeText={() => {}}
                  />
                </View>
                <View style={tw` w-1/2`}>
                  <TextInput
                    style={[
                      tw`flex-1 py-2  px-4 text-black`,
                      {fontFamily: 'Inter-Medium'},
                    ]}
                    keyboardType="numeric"
                    onChangeText={() => {}}
                  />
                </View>
              </View>
            </View>
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
                borderWidth: 0,
              }}
            />
          </View>
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
                keyboardType="numeric"
                onChangeText={() => {}}
              />
            </View>
          </View>

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
                navigation.navigate('OrderReview');
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
        <View style={tw`h-30`} />
      </ScrollView>
      <View style={tw`h-1 w-full mb-5 bg-black`} />
    </View>
  );
};

export default OrderDetails;
