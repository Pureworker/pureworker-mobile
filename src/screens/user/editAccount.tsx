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
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import commonStyle from '../../constants/commonStyle';
import DropDownPicker from 'react-native-dropdown-picker';

const EditAccount = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [locationItems, setLocationItems] = useState([
    {label: 'Online', value: 'Online'},
    {label: 'Offline', value: 'Offline'},
    {label: 'Both', value: 'Both'},
  ]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [description, setDescription] = useState('');

  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setemail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [address, setaddress] = useState('');
  const [nationality, setnationality] = useState('');
  const [dob, setdob] = useState('');
  const [gender, setgender] = useState('');
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
              <TouchableOpacity onPress={() => {}} style={tw``}>
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
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
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
              />
            </View>
          </View>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
            ]}>
            {/* <View>
              <View style={tw``}>
                <Textcomp
                  text={'Gender'}
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
              />
            </View> */}
          </View>
          <View
            style={{
              zIndex: 1,
              minHeight: 250,
              marginHorizontal: perWidth(5),
              width: SIZES.width * 0.95,
              backgroundColor: colors.darkPurple,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.bold,
                color: '#000000',
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
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
    </View>
  );
};

export default EditAccount;
