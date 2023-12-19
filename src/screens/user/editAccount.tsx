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
import Header from '../../components/Header';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useGetUserDetailQuery} from '../../store/slice/api';
import {ToastLong} from '../../utils/utils';
import Toast from 'react-native-toast-message';
import {addUserData} from '../../store/reducer/mainSlice';
import {updateUserData} from '../../utils/api/func';
import CustomLoading from '../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';

const EditAccount = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const userData = useSelector((state: any) => state.user.userData);

  const [locationItems, setLocationItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Others', value: 'Others'},
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
  console.log(locationValue);

  const initGetUsers = async () => {
    const res: any = await getUser('');
    console.log('dddddddd', res);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
    // setloading(false);
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
      await initGetUsers();
      setloading(false);
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
              text={'Account'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <View style={[tw`mt-4`, {marginHorizontal: perWidth(20)}]}>
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
                    nationality,
                    dob,
                    gender,
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
              {height: perHeight(60)},
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
              {height: perHeight(60)},
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
              {height: perHeight(60)},
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
              {height: perHeight(60)},
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
              {height: perHeight(60)},
            ]}>
            <View>
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
                value={address}
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
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
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
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
              <TextInput
                style={[tw` text-white py-3 w-9/10`, {fontSize: 16}]}
                onChangeText={text => {
                  setdob(text);
                }}
                value={dob}
              />
            </View>
          </View>
          <ScrollView horizontal>
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
                  placeholder="Select Gender"
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
                    width: 250,
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
            </View>
          </ScrollView>
        </View>
        <View style={tw`h-80`} />
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
      <Spinner visible={loading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default EditAccount;
