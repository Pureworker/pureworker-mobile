import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import images from '../constants/images';
import Textcomp from '../components/Textcomp';
import {useDispatch, useSelector} from 'react-redux';
import {addUserData, logout} from '../store/reducer/mainSlice';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../constants/navigation';
import Modal from 'react-native-modal/dist/modal';
import colors from '../constants/colors';
import {getUser, updateUserData, uploadAssetsDOCorIMG} from '../utils/api/func';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import socket from '../utils/socket';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import LocationIcon3 from '../assets/svg/LocationIcon3';
const DrawerContent = () => {
  const navigation = useNavigation<StackNavigation>();
  const navLinks = [
    {label: 'Wallet', route: 'Wallet', icon: images.wallet, notint: false},
    {label: 'Support', route: 'Support', icon: images.support, notint: false},
    {
      label: 'Account Info',
      route: 'Account',
      icon: images.accountinfo,
      notint: false,
    },
    {
      label: 'Change Address',
      route: 'AddAddress',
      icon: images.location1,
      icon2: <LocationIcon3 />,
      notint: true,
    },
    {label: 'Referrals', route: 'Referrals', icon: images.info, notint: false},
  ];
  const navLinks2 = [
    {label: 'Log out', route: 'Logout', icon: images.logout},
    {
      label: 'Deactivate Account',
      route: 'DeactivateAccount',
      icon: images.deactivate,
    },
    {
      label: 'Privacy Policy',
      // route: 'AddAddress',
      route: 'PrivacyPolicy',
      icon: images.privacy,
    },
    {
      label: 'Rate Our App',
      route: 'PrivacyPolicy',
      icon: images.rate,
      linkPlay:
        'https://play.google.com/store/apps/details?id=com.pure_worker_app',
      linkApple: 'https://apps.apple.com/us/app/pureworker/id6462559964',
    },

    // {
    //   label: 'FaceDetection',
    //   route: 'FaceDetection',
    //   icon: images.rate,
    // },
    // {
    //   label: 'Tracking',
    //   route: 'Tracking',
    //   icon: images.rate,
    // },
  ];
  const handleRateApp = (linkPlay, linkApple) => {
    // Check the platform
    if (Platform.OS === 'android') {
      // If Android, open the Play Store link
      Linking.openURL(linkPlay).catch(err =>
        console.error('An error occurred: ', err),
      );
    } else if (Platform.OS === 'ios') {
      // If iOS, open the App Store link
      Linking.openURL(linkApple).catch(err =>
        console.error('An error occurred: ', err),
      );
    }
  };
  const dispatch = useDispatch();
  const [InfoModal, setInfoModal] = useState(false);
  const [ContactAgent, setContactAgent] = useState(false);
  const [loading, setloading] = useState(false);
  const handleNavigation = (route: string) => {
    if (route === 'Logout') {
      dispatch(logout());
    } else {
      navigation.navigate(route);
    }
  };
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const userData = useSelector((state: any) => state.user.userData);
  const supportUser = useSelector((store: any) => store.user.supportUser);
  const [PhotoUri, setPhotoUri] = useState('');
  const options = {mediaType: 'photo', selectionLimit: 1};
  const openLibraryfordp = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: any) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets[0]);
        setPhotoUri(resp?.assets[0].uri);
        //
        await uploadImgorDoc(resp?.assets[0]);
        // console.log('processed pic', data);
        // const res = await updateUserData({profilePic: data});
        // await initUpdate({profilePic: data});
      }
    });
  };
  const openLibraryfordp2 = () => {
    console.warn('processed called');
    launchCamera(options, async (resp: any) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets[0]);
        setPhotoUri(resp?.assets[0].uri);

        await uploadImgorDoc(resp?.assets[0]);
      }
    });
  };
  const opencamerafordp4 = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      cameraType: 'front',
    };
    try {
      if (Platform.OS === 'ios') {
        const openCamera = async () => {
          const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);

          if (cameraStatus === RESULTS.GRANTED) {
            // Camera permission is granted, open camera here
            await launchCamera(options, async (resp: unknown) => {
              if (resp?.assets?.length > 0) {
                console.log('resp', resp?.assets[0]);
                setPhotoUri(resp?.assets[0].uri);

                await uploadImgorDoc(resp?.assets[0]);
              }
            });
          } else {
            // Camera permission is not granted, request it
            const newCameraStatus = await request(PERMISSIONS.IOS.CAMERA);
            if (newCameraStatus === RESULTS.GRANTED) {
              // Camera permission granted after request, open camera
              await launchCamera(options, async (resp: unknown) => {
                if (resp?.assets?.length > 0) {
                  console.log('resp', resp?.assets[0]);
                  setPhotoUri(resp?.assets[0].uri);

                  await uploadImgorDoc(resp?.assets[0]);
                }
              });
            } else {
              // Camera permission denied
              console.log('Camera permission denied');
            }
          }
        };
        openCamera();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'Pureworker needs access to your camera to takee picture',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
          await launchCamera(options, async (resp: unknown) => {
            if (resp?.assets?.length > 0) {
              console.log('resp', resp?.assets[0]);
              setPhotoUri(resp?.assets[0].uri);
              await uploadImgorDoc(resp?.assets[0]);
            }
          });
        } else {
          console.log('Camera permission denied2');
        }
      }
    } catch (error) {}
    // launchCamera
  };
  const initGetUsers = async () => {
    const res: any = await getUser('');
    console.log('drawerdata', res?.data?.user);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
      setPhotoUri(userData?.profilePic);
    }
  };
  console.log(userData?.profilePic);
  const initUpdate = async (param: any) => {
    setloading(true);
    const res: any = await updateUserData(param);
    // console.log('expected-res',res?.data);
    if ([200, 201].includes(res?.status)) {
      // await initGetData();
      await initGetUsers();
      // Toast.show({
      //   type: 'success',
      //   text1: 'Picture uploaded successfully 🚀. ',
      // });
    } else {
      // Toast.show({
      //   type: 'error',
      //   text1: `${
      //     res?.error?.message ? res?.error?.message : 'Oops! An error occured!'
      //   } 🚀. `,
      // });
    }
    setloading(false);
  };
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setloading(true);
    const res: any = await uploadAssetsDOCorIMG(param);

    if (res?.status === 201 || res?.status === 200) {
      console.log('image:', res);

      setloading(false);
      await initUpdate({profilePic: res?.data.url});
      // return res?.data.url;
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
    }
    setloading(false);
  };
  return (
    <>
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
              {marginTop: perHeight(10), height: perHeight(88)},
            ]}>
            <TouchableOpacity
              style={[tw`rounded-full`, {width: 50, height: 50}]}
              onPress={() => {
                opencamerafordp4();
                // if (
                //   userType.userType === BUSINESS ||
                //   userType.userType === FREELANCER
                // ) {
                //   navigation.navigate('ProfileStep1');
                // }
              }}>
              <FastImage
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
                source={{
                  uri:
                    userData?.profilePic ||
                    // 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1694546301/pure/1694546297671-profile-picture.png.png',
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
            <View style={tw``}>
              <View style={tw``}>
                <View style={tw``}>
                  <Textcomp
                    text={`${userData?.firstName || userData?.businessName}`}
                    size={14}
                    color={'#ffffff'}
                    style={[tw`ml-3`, {lineHeight: 14}, {fontWeight: '500'}]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Rating');
                  }}
                  style={tw`mt-3 flex flex-row items-center`}>
                  <View style={tw``}>
                    <Textcomp
                      text={`${Number(userData?.averageRating).toFixed(2)}`}
                      size={14}
                      color={'#FFCD1E'}
                      style={[
                        tw`ml-3 mr-1`,
                        {lineHeight: 14},
                        {fontWeight: '500'},
                      ]}
                    />
                  </View>
                  <View>
                    <Image
                      resizeMode="contain"
                      style={{width: 14, height: 14, tintColor: '#FFCD1E'}}
                      source={images.star_2}
                    />
                  </View>
                  <View>
                    <Textcomp
                      text={'Rating'}
                      size={14}
                      color={'#FFCD1E'}
                      style={[tw`ml-2`, {lineHeight: 14}, {fontWeight: '500'}]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[
              tw` px-2 w-[90%] pb-0 pt-3 mx-auto rounded-lg`,
              {marginTop: perHeight(40)},
            ]}>
            {navLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (link.route === 'Support') {
                    setInfoModal(true);
                  } else {
                    handleNavigation(link.route);
                  }
                }}
                style={[
                  tw` w-full  border-[#F2F2F2]  flex flex-row items-center`,
                  {marginTop: index === 0 ? 0 : perHeight(18)},
                ]}>
                {link?.icon2 ? (
                  link?.icon2
                ) : (
                  <Image
                    resizeMode="contain"
                    style={[
                      {
                        width: 20,
                        height: 20,
                        // tintColor: link?.notint === true ? null : '#000000',
                      },
                      link?.notint === false && {
                        tintColor: '#000000',
                      },
                    ]}
                    source={link.icon}
                  />
                )}
                <Textcomp
                  text={link.label}
                  size={14}
                  color={'#000000'}
                  style={[tw`ml-3`, {lineHeight: 14}, {fontWeight: '600'}]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={[
              tw` px-2 w-[90%] border-t pb-6  mx-auto rounded-lg`,
              {
                marginTop: perHeight(20),
                paddingTop: Platform.OS === 'ios' ? 30 : 20,
              },
            ]}>
            {navLinks2.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (link.label === 'Rate Our App') {
                    handleRateApp(link.linkPlay, link.linkApple);
                  } else {
                    handleNavigation(link.route);
                  }
                }}
                style={[
                  tw` w-full  border-[#F2F2F2]  flex flex-row items-center`,
                  {marginTop: index === 0 ? 0 : perHeight(19)},
                ]}>
                {
                  <Image
                    resizeMode="contain"
                    style={{width: 20, height: 20, tintColor: '#000000'}}
                    // source={images.info}
                    source={link.icon}
                  />
                }
                <Textcomp
                  text={link.label}
                  size={14}
                  color={'#000000'}
                  style={[tw`ml-3`, {lineHeight: 14}, {fontWeight: '600'}]}
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
                {marginTop: perHeight(25), borderRadius: 5},
              ]}>
              <Textcomp
                text={'Become a Service Provider'}
                size={14}
                color={'#FFCD1E'}
                style={[tw`ml-3`, {lineHeight: 14}, {fontWeight: '500'}]}
              />
            </TouchableOpacity>
          )}
          <View style={[tw`mt-4 ml-3`, {}]}>
            <Textcomp
              text={`Version: ${Platform.OS === 'ios' ? '1.0.6.1' : '1.0.6.1'}`}
              size={14}
              color={'#000000'}
              style={[
                tw`ml-3 text-left`,
                {lineHeight: 14},
                {fontWeight: '900'},
              ]}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <Modal
        isVisible={InfoModal}
        onModalHide={() => {
          setInfoModal(false);
          setContactAgent(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setInfoModal(false)}
            style={tw`flex-1`}
          />
          {!ContactAgent && (
            <View style={tw`h-[20%]  items-center mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  setContactAgent(false);
                }}
                style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
              />
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  navigation.navigate('FAQ');
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 18,
                }}>
                <Textcomp
                  text={'FAQs'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setContactAgent(true);
                  socket.connect();
                  setInfoModal(false);
                  navigation.navigate('Inbox', {
                    id: supportUser?._id || supportUser?.id,
                    name: 'Support',
                  });
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 10,
                }}>
                <Textcomp
                  text={'Connect to an Agent'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          )}

          {ContactAgent && (
            <View
              style={tw`h-[10%] justify-center items-center mt-auto bg-[#D9D9D9]`}>
              <View>
                <Textcomp
                  text={'An Agent will contact you as soon as possible'}
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
      <Spinner visible={loading} />
    </>
  );
};
export default DrawerContent;
