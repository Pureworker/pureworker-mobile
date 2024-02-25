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
  StyleSheet,
  Alert,
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
import commonStyle from '../../constants/commonStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import {useGetUserDetailQuery} from '../../store/slice/api';
import {ToastLong} from '../../utils/utils';
import Toast from 'react-native-toast-message';
import {addUserData} from '../../store/reducer/mainSlice';
import {getUser, updateUserData} from '../../utils/api/func';
import CustomLoading from '../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';

const EditAccount = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const userData = useSelector((state: any) => state.user.userData);

  const [locationItems, setLocationItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ]);
  const [loading, setloading] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState(userData?.gender || null);

  const [firstName, setfirstName] = useState(userData?.firstName || '');
  const [lastName, setlastName] = useState(userData?.lastName || '');
  const [email, setemail] = useState(userData?.email || '');
  const [phoneNumber, setphoneNumber] = useState(userData?.phoneNumber || '');
  const [address, setaddress] = useState(userData?.address || '');
  const [nationality, setnationality] = useState(userData?.nationality || '');
  const [dob, setdob] = useState(userData?.dob || '');
  const [gender, setgender] = useState(userData?.gender || '');
  const initGetUsers = async () => {
    try {
      const res = await getUser('');
      // console.log('dddddddd', res);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
    } catch (error) {
      console.error(
        'Error getting user data:',
        error,
        error?.response,
        error?.response?.data,
      );
      Alert.alert('Error');
      // Handle error appropriately
    }
  };

  const initUpdate = async (param: any) => {
    setloading(true);
    try {
      const res = await updateUserData(param);
      console.log(res);

      if ([200, 201].includes(res?.status)) {
        Toast.show({
          type: 'success',
          text1: 'Picture uploaded successfully 🚀. ',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `${
            res?.error?.message
              ? res?.error?.message
              : 'Oops! An error occurred!'
          } 🚀. `,
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred 🚀.',
      });
    } finally {
      setloading(false);
      await initGetUsers();
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    try {
      // Make a POST request to update user data
      await initUpdate({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        nationality,
        dob,
        gender,
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error appropriately
      // Alert.alert('Error', 'An unexpected error occurred');
      ToastLong('An unexpected error occurred');
      setloading(false);
    }
  };
  function convertTimestampToFormattedDate(timestamp) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Extract the day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getUTCFullYear();

    // Format the result
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
  }
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateConfirm = date => {
    // Handle the selected date
    console.log('Selected Date:', date);
    setdob(date);
    setDatePickerVisible(false);
  };
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView>
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
              text={'Edit Account'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <View style={[tw`mt-8`, {marginHorizontal: perWidth(20)}]}>
            <View style={tw`flex flex-row justify-between`}>
              <View style={tw``}>
                <Textcomp
                  text={'Account Info'}
                  size={17}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  initUpdate({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    address,
                    dob,
                  });
                }}
                style={tw``}>
                <Textcomp
                  text={'Save'}
                  size={17}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] pt-4 mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'First name'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setfirstName(text);
                }}
                value={firstName}
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'Last name'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setlastName(text);
                }}
                value={lastName}
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'Email'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setemail(text);
                }}
                value={email}
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'Phone Number'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setphoneNumber(text);
                }}
                value={phoneNumber}
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddAddress');
              }}
              style={tw``}>
              <View style={tw``}>
                <Textcomp
                  text={'Address'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setaddress(text);
                }}
                editable={false}
                value={address}
              />
            </TouchableOpacity>
          </View>
          {/* <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
                            {height: Platform.OS === "ios" ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'Nationality'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setnationality(text);
                }}
                value={nationality}
              />
            </View>
          </View> */}
          <TouchableOpacity
            onPress={() => {
              setDatePickerVisible(true);
            }}
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: Platform.OS === 'ios' ? perHeight(60) : perHeight(65)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={'Date of Birth'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={`${convertTimestampToFormattedDate(dob)}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </TouchableOpacity>
          {/* <ScrollView horizontal>
            <View
              style={[
                tw`bg-[${colors.darkPurple}]  mt-4 pl-5 justify-start`,
                {height: !locationOpen ? perHeight(100) : perHeight(180)},
              ]}>
              <View
                style={{
                  zIndex: 1,
                  minHeight: 50,
                  marginHorizontal: perWidth(5),
                  width: SIZES.width * 0.95,
                  backgroundColor: colors.darkPurple,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.bold,
                    color: '#FFFFFF80',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  Gender
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && {borderColor: colors.darkPurple},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={locationItems}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={gender}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    console.log(item.value);
                    setValue(item.value);
                    setgender(item.value);
                    setIsFocus(false);
                  }}
                  // renderLeftIcon={() => (

                  // )}
                />
              </View>
            </View>
          </ScrollView> */}
        </View>
        <View style={tw`h-80`} />
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
      <Spinner visible={loading} customIndicator={<CustomLoading />} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
};

export default EditAccount;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: SIZES.width * 0.85,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
