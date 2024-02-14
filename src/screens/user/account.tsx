import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import {useGetUserDetailQuery} from '../../store/slice/api';
import {addUserData} from '../../store/reducer/mainSlice';
import {getUser} from '../../utils/api/func';

const Account = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  // const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  // const getUser = getUserData ?? [];

  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      // console.log('dddddddd', res);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      // setloading(false);
    };
    initGetUsers();
  }, []);

  //selectors
  const userData = useSelector((state: any) => state.user.userData);

  // console.log(getUser);
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
          paddingBottom: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={images.back}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-auto`}>
          <Textcomp
            text={'Account'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </TouchableOpacity>
      </View>
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
              navigation.navigate('EditAccount');
            }}
            style={tw``}>
            <Textcomp
              text={'Edit'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={`${userData?.firstName}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'First name'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
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
                  text={`${userData?.lastName}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Last name'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
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
                  text={`${userData?.email}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'email'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
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
                  text={`${userData?.phoneNumber}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Phone Number'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
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
                  text={`${
                    userData?.address === undefined ? '' : userData?.address
                  }`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Address'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          {/* <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={`${userData?.nationality}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Nationality'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View> */}
          <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={`${convertTimestampToFormattedDate(userData?.dob)}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Date of Birth'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          {/* <View
            style={[
              tw`bg-[${colors.darkPurple}] mt-4 pl-5 justify-center`,
              {height: perHeight(60)},
            ]}>
            <View>
              <View style={tw``}>
                <Textcomp
                  text={`${userData?.gender}`}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mt-2`}>
                <Textcomp
                  text={'Gender'}
                  size={14}
                  lineHeight={15}
                  color={'#FFFFFF80'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View> */}
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
    </View>
  );
};

export default Account;
