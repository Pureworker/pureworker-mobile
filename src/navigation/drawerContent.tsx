import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import tw from 'twrnc';
// import {useStoreActions, useStoreState} from 'easy-peasy';
import { perHeight, perWidth } from '../utils/position/sizes';
import images from '../constants/images';
import Textcomp from '../components/Textcomp';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/reducer/mainSlice';
import {useGetUserDetailQuery} from '../store/slice/api';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../constants/navigation';
import { BUSINESS, FREELANCER } from '../constants/userType';

const DrawerContent = () => {
  const navigation = useNavigation<StackNavigation>()
  const navLinks = [
    { label: 'Wallet', route: 'Wallet', icon: images.wallet },
    { label: 'Support', route: 'Support', icon: images.help },
    { label: 'Account Info', route: 'Account', icon: images.info },
  ];
  const navLinks2 = [
    { label: 'Log out', route: 'Logout', icon: images.wallet },
    {
      label: 'Deactivate Account',
      route: 'DeactivateAccount',
      icon: images.deactivte,
    },
    { label: 'Privacy Policy', route: 'PrivacyPolicy', icon: images.support },
  ];
  const dispatch = useDispatch();

  const handleNavigation = (route: string) => {
    if (route === 'Logout') {
      dispatch(logout());
    } else {
      navigation.navigate(route);
    }
  };

  const userType = useSelector((state: any) => state.user.isLoggedIn);
  // console.log('user_', userType);
  // if (!userType.userType === 'CUSTOMER') {
  //
  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];

  const [PhotoUri, setPhotoUri] = useState('');
  const options = {mediaType: 'photo', selectionLimit: 1};
  const openLibraryfordp = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        // console.log('resp', resp?.assets);
        console.log('resp', resp?.assets[0]);
        setPhotoUri(resp?.assets[0].uri);
      }
    });
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        width: perWidth(265),
        flex: 1,
        backgroundColor: '#EBEBEB',
        marginHorizontal: 5,
      }}>
      <View style={[tw`pt-4  `, {}]}>
        <View
          style={[
            tw`bg-[#2D303C] flex flex-row px-2 w-[90%] mx-auto rounded-lg items-center`,
            { marginTop: perHeight(10), height: perHeight(88) },
          ]}>
          <TouchableOpacity
            style={[tw`bg-red-300 rounded-full`, {width: 50, height: 50}]}
            onPress={() => {
              // openLibraryfordp();
              if (userType.userType === BUSINESS || userType.userType == FREELANCER) {
                navigation.navigate('ProfileStep1')
              }
            }}>
            <Image
              resizeMode="cover"
              style={{width: 50, height: 50, borderRadius: 25}}
              source={PhotoUri.length > 5 ? {uri: PhotoUri} : images.profile}
            />
          </TouchableOpacity>
          <View style={tw``}>
            <View style={tw``}>
              <Textcomp
                text={`${getUser?.firstName}`}
                size={14}
                color={'#ffffff'}
                style={[tw`ml-3`, { lineHeight: 14 }, { fontWeight: '500' }]}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Rating');
              }}
              style={tw`mt-3 flex flex-row`}>
              <View style={tw``}>
                <Textcomp
                  text={'4.8 '}
                  size={14}
                  color={'#FFCD1E'}
                  style={[tw`ml-3`, { lineHeight: 14 }, { fontWeight: '500' }]}
                />
              </View>
              <View>
                <Image
                  resizeMode="contain"
                  style={{ width: 14, height: 14, tintColor: '#FFCD1E' }}
                  source={images.star_2}
                />
              </View>
              <View>
                <Textcomp
                  text={'Rating'}
                  size={14}
                  color={'#FFCD1E'}
                  style={[tw`ml-1`, { lineHeight: 14 }, { fontWeight: '500' }]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            tw`bg-[#2D303C] px-2 w-[90%] pb-6 pt-3 mx-auto rounded-lg`,
            { marginTop: perHeight(70) },
          ]}>
          {navLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleNavigation(link.route);
              }}
              style={[
                tw` w-full  border-[#F2F2F2]  flex flex-row items-center`,
                { marginTop: index === 0 ? 0 : perHeight(19) },
              ]}>
              {
                <Image
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                  source={link.icon}
                />
              }
              <Textcomp
                text={link.label}
                size={14}
                color={'#FFFFFF'}
                style={[tw`ml-3`, { lineHeight: 14 }, { fontWeight: '500' }]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            tw`bg-[#2D303C] px-2 w-[90%] pb-6 pt-3 mx-auto rounded-lg`,
            { marginTop: perHeight(60) },
          ]}>
          {navLinks2.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleNavigation(link.route);
              }}
              style={[
                tw` w-full  border-[#F2F2F2]  flex flex-row items-center`,
                { marginTop: index === 0 ? 0 : perHeight(19) },
              ]}>
              {
                <Image
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                  // source={images.info}
                  source={link.icon}
                />
              }
              <Textcomp
                text={link.label}
                size={14}
                color={'#FFFFFF'}
                style={[tw`ml-3`, { lineHeight: 14 }, { fontWeight: '500' }]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {userType.userType === 'CUSTOMER' && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BecomeAServiceProvider');
            }}
            style={[
              tw`bg-[#2D303C] px-2 py-4 w-[90%] mx-auto `,
              { marginTop: perHeight(40), borderRadius: 5 },
            ]}>
            <Textcomp
              text={'Become a Service Provider'}
              size={14}
              color={'#FFCD1E'}
              style={[tw`ml-3`, { lineHeight: 14 }, { fontWeight: '500' }]}
            />
          </TouchableOpacity>
        )}
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
