import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import {SIZES} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInputs';
import TextWrapper from '../../components/TextWrapper';
import {generalStyles} from '../../constants/generalStyles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  addProfileData,
  addUserData,
  addcompleteProfile,
} from '../../store/reducer/mainSlice';
import {
  completeProfile,
  deletePortfolio,
  getProfile,
  getProviderNew,
  getUser,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import FastImage from 'react-native-fast-image';
import CustomLoading from '../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';
import Snackbar from 'react-native-snackbar';
import {ToastLong, ToastShort} from '../../utils/utils';
import TickIcon from '../../assets/svg/Tick';
import Modal from 'react-native-modal/dist/modal';
import PortComp from '../profile/comp/portComp4';
import AddCircle from '../../assets/svg/AddCircle';
import EditComp from '../profile/comp/EditComp';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const Account = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const profileData = useSelector((state: any) => state.user.profileData);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(profileData?.profilePic || '');
  let profilePicture = useRef('');
  const [description, setDescription] = useState(profileData?.description);
  const category = useSelector((state: any) => state.user.pickedServices);
  const userData = useSelector((state: any) => state.user.userData);
  console.log('protfolio:', profileData);
  useEffect(() => {
    const initGetProfile = async () => {
      const res: any = await getProfile(userData?._id);
      console.log('dddddddd-----', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
        setDescription(res?.data?.profile?.description);
      }
    };
    initGetProfile();
  }, [dispatch]);
  //image upload
  const options = {mediaType: 'photo', selectionLimit: 1};
  const openLibraryfordp2 = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets[0]);
        // setPhotoUri(resp?.assets[0].uri);
        setImageUrl(resp?.assets[0].uri);
        const data = await uploadImgorDoc(resp?.assets[0]);
        console.warn('processed pic', data);
        // dispatch(addcompleteProfile({profilePic: data}));
        await upload(data);
      }
    });
    // launchCamera
  };
  const openLibraryfordp = () => {
    launchCamera(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        const fileSize = resp.assets[0].fileSize; // File size in bytes
        // const fileSizeInMB = fileSize / (1024 * 1024); // Convert to megabytes
        // if (fileSizeInMB > 1) {
        //   ToastShort('Image size exceeds 1MB. Please choose a smaller image.');
        //   return;
        // }
        console.log('resp', resp?.assets[0]);
        setImageUrl(resp?.assets[0].uri);
        const data = await uploadImgorDoc(resp?.assets[0]);
        console.warn('processed pic', data);
        // dispatch(addcompleteProfile({profilePic: data}));
        // const res: any = await completeProfile({profilePic: data});
        await upload(data);
      }
    });
  };
  const opencamerafordp4 = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      cameraType: 'front',
      rotation: 360,
    };
    try {
      if (Platform.OS === 'ios') {
        const openCamera = async () => {
          const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
          try {
            if (cameraStatus === RESULTS.GRANTED) {
              await launchCamera(options, async (resp: unknown) => {
                if (resp?.assets?.length > 0) {
                  setisLoading(true);
                  console.log('resp', resp?.assets[0]);
                  setImageUrl(resp?.assets[0].uri);
                  const data = await uploadImgorDoc(resp?.assets[0]);
                  console.warn('processed pic', data);
                  dispatch(addcompleteProfile({profilePic: data}));
                  const res: any = await completeProfile({profilePic: data});
                  setisLoading(false);
                }
              });
            } else {
              const newCameraStatus = await request(PERMISSIONS.IOS.CAMERA);
              if (newCameraStatus === RESULTS.GRANTED) {
                // Camera permission granted after request, open camera
                await launchCamera(options, async (resp: unknown) => {
                  if (resp?.assets?.length > 0) {
                    setisLoading(true);
                    console.log('resp', resp?.assets[0]);
                    setImageUrl(resp?.assets[0].uri);
                    const data = await uploadImgorDoc(resp?.assets[0]);
                    console.warn('processed pic', data);
                    dispatch(addcompleteProfile({profilePic: data}));
                    const res: any = await completeProfile({profilePic: data});
                    setisLoading(false);
                  }
                });
              } else {
                console.log('Camera permission denied');
              }
            }
          } catch (error) {
            setisLoading(false);
          } finally {
            setisLoading(false);
            setisLoading(false);
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
              setImageUrl(resp?.assets[0].uri);
              const data = await uploadImgorDoc(resp?.assets[0]);
              console.warn('processed pic', data);
              dispatch(addcompleteProfile({profilePic: data}));
              const res: any = await completeProfile({profilePic: data});
            }
          });
        } else {
          console.log('Camera permission denied2');
          ToastShort('Camera permission denied2');
        }
      }
    } catch (error) {}
  };
  // const opencamerafordp4 = async () => {
  //   const options = {
  //     mediaType: 'photo',
  //     selectionLimit: 1,
  //     cameraType: 'front',
  //   };
  //   try {
  //     if (Platform.OS === 'ios') {
  //       const openCamera = async () => {
  //         const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);

  //         if (cameraStatus === RESULTS.GRANTED) {
  //           // Camera permission is granted, open camera here
  //           await launchCamera(options, async (resp: unknown) => {
  //             if (resp?.assets?.length > 0) {
  //               console.log('resp', resp?.assets[0]);
  //               setImageUrl(resp?.assets[0].uri);
  //               await uploadImgorDoc(resp?.assets[0]);
  //               console.warn('processed pic', data);
  //               dispatch(addcompleteProfile({profilePic: data}));
  //               const res: any = await completeProfile({profilePic: data});
  //             }
  //           });
  //         } else {
  //           // Camera permission is not granted, request it
  //           const newCameraStatus = await request(PERMISSIONS.IOS.CAMERA);
  //           if (newCameraStatus === RESULTS.GRANTED) {
  //             // Camera permission granted after request, open camera
  //             await launchCamera(options, async (resp: unknown) => {
  //               if (resp?.assets?.length > 0) {
  //                 console.log('resp', resp?.assets[0]);
  //                 setImageUrl(resp?.assets[0].uri);
  //                 await uploadImgorDoc(resp?.assets[0]);
  //                 console.warn('processed pic', data);
  //                 dispatch(addcompleteProfile({profilePic: data}));
  //                 const res: any = await completeProfile({profilePic: data});
  //               }
  //             });
  //           } else {
  //             // Camera permission denied
  //             console.log('Camera permission denied');
  //           }
  //         }
  //       };
  //       openCamera();
  //     } else {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //         {
  //           title: 'App Camera Permission',
  //           message: 'Pureworker needs access to your camera to takee picture',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('Camera permission given');
  //         await launchCamera(options, async (resp: unknown) => {
  //           if (resp?.assets?.length > 0) {
  //             console.log('resp', resp?.assets[0]);
  //             setImageUrl(resp?.assets[0].uri);
  //             await uploadImgorDoc(resp?.assets[0]);
  //           }
  //         });
  //       } else {
  //         console.log('Camera permission denied2');
  //       }
  //     }
  //   } catch (error) {}
  //   // launchCamera
  // };
  const upload = async (param: string) => {
    const res: any = await completeProfile({profilePic: param});
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
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
    setisLoading(false);
  };
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setisLoading(true);
    const res: any = await uploadAssetsDOCorIMG(param);
    if (res?.status === 201 || res?.status === 200) {
      console.log('ApartmentType', res?.data);
      setisLoading(false);
      return res?.data?.doc?.url;
    }
    setisLoading(false);
  };
  const updateProfile = async (param: any) => {
    const res: any = await completeProfile(param);
    console.log('Update result:', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      ToastLong('Profile Updated');
      navigation.navigate('Home');
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
    setisLoading(false);
  };
  const _deletePortfolio = async (param: any) => {
    console.log(param);
    try {
      const res: any = await deletePortfolio(param);
      console.log('delete result:', res?.data);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastLong('Portfolio deleted successfully');
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
    } catch (error) {
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
    } finally {
      const initGetProfile = async () => {
        const res: any = await getProfile(userData?._id);
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addProfileData(res?.data?.profile));
        }
      };
      initGetProfile();
      setisLoading(false);
    }
  };
  const [addModal, setaddModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  useEffect(() => {
    const initGetProviderNew = async () => {
      const res: any = await getProviderNew(userData?._id);
      console.log('portfolio--', res?.data?.profile?.portfolios);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
      }
    };
    initGetProviderNew();
  }, []);
  const [deleteModal, setdeleteModal] = useState(false);
  return (
    <>
      <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
        <ScrollView>
          <View
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? 12
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
          <View style={tw`px-[5%]`}>
            <TextWrapper
              children=""
              fontType={'semiBold'}
              style={{fontSize: 20, marginTop: 30, color: colors.black}}
            />
            <TouchableOpacity
              onPress={async () => {
                // openLibraryfordp();
                opencamerafordp4();
              }}>
              <TouchableOpacity
                onPress={async () => {
                  opencamerafordp4();
                }}
                style={[
                  generalStyles.contentCenter,
                  {
                    width: 145,
                    height: 145,
                    borderRadius: 145,
                    alignSelf: 'center',
                    backgroundColor: colors.greyLight1,
                  },
                ]}>
                {!profileImageLoading ? (
                  <>
                    {!profileData?.profilePic && imageUrl?.length < 1 ? (
                      <TextWrapper
                        children="Upload Profile Photo"
                        fontType={'semiBold'}
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          color: colors.black,
                        }}
                      />
                    ) : (
                      <FastImage
                        style={[
                          tw``,
                          {
                            width: 145,
                            height: 145,
                            borderRadius: 145,
                          },
                        ]}
                        source={{
                          uri: profileData?.profilePic || imageUrl,
                          headers: {Authorization: 'someAuthToken'},
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                  </>
                ) : (
                  <ActivityIndicator
                    style={{marginTop: 0}}
                    size={'large'}
                    color={colors.parpal}
                  />
                )}
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  right: 50,
                  top: 10,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    // openLibraryfordp();
                    opencamerafordp4();
                  }}>
                  <Image
                    source={images.edit}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: 20,
                      tintColor: '#000',
                    }}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => setImageUrl('')}>
                <Image
                  source={images.bin}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 20,
                    tintColor: '#000',
                  }}
                />
              </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
            <TextWrapper
              children="Description"
              isRequired={true}
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
                  height: 130,
                }}
                style={{backgroundColor: colors.greyLight1}}
                labelText={
                  'Introduce yourself and enter your profile description.'
                }
                state={description}
                setState={setDescription}
                multiline={true}
                nbLines={5}
              />
            </View>

            <View style={tw`mt-[5%] hidden`}>
              <TextWrapper
                children="Services Intro"
                fontType={'semiBold'}
                style={{fontSize: 20, marginTop: 30, color: colors.black}}
              />
              {profileData?.services?.length
                ? profileData?.services?.map((item: any, index: any) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: index === 0 ? 15 : 0,
                          marginBottom: 15,
                          marginHorizontal: 0,
                          width: SIZES.width * 0.8,
                        }}>
                        <View
                          key={index}
                          style={{
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.lightBlack,
                            height: 30,
                            width: 'auto',
                            borderRadius: 5,
                          }}>
                          <TextWrapper
                            fontType={'semiBold'}
                            style={{
                              fontSize: 12,
                              color: '#fff',
                            }}>
                            {/* {item} */}
                            {item?.name}
                          </TextWrapper>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            // dispatch(removeCategory(item));
                            navigation.navigate('EditService', {
                              index: index,
                              name: item?.name,
                            });
                          }}>
                          <Image
                            source={images.edit}
                            resizeMode="contain"
                            style={{
                              width: 20,
                              height: 20,
                              marginLeft: 20,
                              tintColor: '#000',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                : null}
              <Button
                onClick={() => {
                  navigation.navigate('AddServices');
                  // handleProfileSetup();
                }}
                style={{
                  width: SIZES.width * 0.9,
                  backgroundColor: colors.lightBlack,
                  marginTop: 20,
                }}
                textStyle={{color: colors.primary}}
                text={'Add Services'}
              />
            </View>
            <TextWrapper
              children="Services"
              isRequired={true}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />
            <View style={tw`mt-2`}>
              <Textcomp
                text={'You can edit, delete or add a new service.'}
                size={12}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
              {profileData?.services?.length > 0
                ? profileData?.services?.map((item: any, index: any) => {
                    const d = [];
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 13,
                          marginHorizontal: 0,
                          marginTop: 10,
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <View style={tw`flex flex-row items-center w-6/10`}>
                          <View
                            key={index}
                            style={{
                              paddingHorizontal: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: colors.lightBlack,
                              height: 'auto',
                              width: 'auto',
                              borderRadius: 5,
                              paddingVertical: 5,
                            }}>
                            {/* <TextWrapper
                              fontType={'semiBold'}
                              style={{
                                fontSize: 12,
                                color: '#fff',
                              }}>
                              {item?.name}
                            </TextWrapper> */}
                            <Textcomp
                              // numberOfLines={3}
                              text={`${item?.name}`}
                              size={12}
                              lineHeight={18.75}
                              color={colors.white}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </View>
                          {d?.length > 0 && (
                            <TickIcon style={{width: 20, marginLeft: 10}} />
                          )}
                        </View>
                        <View style={tw`flex flex-row`}>
                          <TouchableOpacity
                            style={[tw`border bg-white  rounded px-2 py-0.5`]}
                            onPress={() => {
                              const newPortfolioItem = {
                                service: '',
                                description: '',
                                images: [],
                              };
                              seteditModal(true);
                              setSelectedService(item);
                            }}>
                            <Textcomp
                              text={'Edit'}
                              size={16}
                              lineHeight={18.75}
                              color={colors.parpal}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={tw`border bg-white ml-3 rounded px-2 py-0.5`}
                            onPress={() => {
                              setSelectedService(item);
                              // ToastShort('Coming soon!.');
                              setdeleteModal(true);
                            }}>
                            <Textcomp
                              text={'Delete'}
                              size={16}
                              lineHeight={18.75}
                              color={'#D20713'}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                : null}
            </View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  if (false) {
                    ToastShort('Maximum portfolio');
                  } else {
                    // push({
                    //   description: '',
                    //   images: [],
                    // });
                  }
                  setaddModal(true);
                }}
                style={[
                  tw`flex flex-row ml-auto  items-center  py-4 rounded-lg  `,
                ]}>
                <AddCircle style={{marginRight: 4}} />
                <Textcomp
                  text={'Add new service'}
                  size={16}
                  lineHeight={16}
                  color={colors.parpal}
                  fontFamily={'Inter-Bold'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                updateProfile({description: description});
              }}
              style={tw`mx-auto mt-8 py-4 bg-[${colors.darkPurple}] w-4/10 rounded-lg items-center justify-center`}>
              <Textcomp
                text={'Save'}
                size={17}
                lineHeight={17}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>

            {/* {userData?.liveTest === false && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FaceDetection', {page: 'Account'});
                }}
                style={tw`mx-auto mt-10 py-3 bg-[${colors.darkPurple}] w-8/10 rounded-lg items-center justify-center`}>
                <Textcomp
                  text={'Complete Liveness Check'}
                  size={14}
                  lineHeight={17}
                  color={colors.white}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            )} */}
          </View>
          <View style={tw`h-30`} />
        </ScrollView>
        <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
      </SafeAreaView>
      <Modal
        isVisible={addModal}
        onModalHide={() => {
          setaddModal(false);
        }}
        style={{width: SIZES.width, height: SIZES.height, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setaddModal(false)}
        swipeThreshold={200}
        onBackButtonPress={() => setaddModal(false)}>
        <View
          style={[
            tw`bg-[#EBEBEB]  mx-auto mt-auto   p-4 pb-8`,
            {borderRadius: 20, maxHeight: SIZES.height * 0.8},
          ]}>
          <View style={tw`mx-auto`} />
          <View style={[tw``]}>
            <View style={[tw` mt-4`]}>
              <Textcomp
                text={'Add Service Data'}
                size={16}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw` mt-1`]}>
              <Textcomp
                text={'Select Service.'}
                size={10}
                lineHeight={12}
                color={'#000413'}
                style={tw`underline`}
                fontFamily={'Inter-Medium'}
              />
            </View>
          </View>
          <View>
            <PortComp
              lindex={0}
              dlist={[]}
              service={selectedService}
              pdata={{
                service: '',
                description: '',
                images: [],
              }}
              portfolioData={[]}
              handlePortfolioItemChange={(i: any, data: any) =>
                // handlePortfolioItemChange(0, data)
                {}
              }
              close={() => {
                setaddModal(false);
                //
                const initGetProviderNew = async () => {
                  const res: any = await getProviderNew(userData?._id);
                  console.log('providerdatttttaaaaa', res?.data);
                  console.log('portfolio--', res?.data?.profile?.portfolios);
                  if (res?.status === 201 || res?.status === 200) {
                    dispatch(addProfileData(res?.data?.profile));
                  }
                };
                initGetProviderNew();
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setaddModal(false);
            }}
            style={tw`absolute right-0 top-[-2]`}>
            <Image
              resizeMode="contain"
              source={images.cancelCircle}
              style={{
                width: 30,
                height: 30,
                tintColor: '#000413',
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isVisible={editModal}
        onModalHide={() => {
          seteditModal(false);
        }}
        style={{width: SIZES.width, height: SIZES.height, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => seteditModal(false)}
        swipeThreshold={200}
        onBackButtonPress={() => seteditModal(false)}>
        <View
          style={[
            tw`bg-[#EBEBEB]  mx-auto mt-auto   p-4 pb-8`,
            {borderRadius: 20, maxHeight: SIZES.height * 0.8},
          ]}>
          <View style={tw`mx-auto`} />
          <View style={[tw``]}>
            <View style={[tw` mt-4`]}>
              <Textcomp
                text={'Edit Service Data'}
                size={16}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw` mt-1`]}>
              <Textcomp
                text={'Customers need assurance of your service proficiency.'}
                size={10}
                lineHeight={12}
                color={'#000413'}
                fontFamily={'Inter-Regular'}
              />
            </View>
          </View>
          <View>
            <EditComp
              lindex={0}
              dlist={[]}
              service={selectedService}
              pdata={{
                service: '',
                description: '',
                images: [],
              }}
              portfolioData={profileData?.portfolios}
              handlePortfolioItemChange={(i: any, data: any) =>
                // handlePortfolioItemChange(0, data)
                {}
              }
              close={() => {
                seteditModal(false);
                //
                const initGetProviderNew = async () => {
                  const res: any = await getProviderNew(userData?._id);
                  console.log('providerdatttttaaaaa', res?.data);
                  console.log('portfolio--', res?.data?.profile?.portfolios);
                  if (res?.status === 201 || res?.status === 200) {
                    dispatch(addProfileData(res?.data?.profile));
                  }
                };
                initGetProviderNew();
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              seteditModal(false);
            }}
            style={tw`absolute right-0 top-[-2]`}>
            <Image
              resizeMode="contain"
              source={images.cancelCircle}
              style={{
                width: 30,
                height: 30,
                tintColor: '#000413',
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={deleteModal}
        onModalHide={() => {
          setdeleteModal(false);
        }}
        style={{width: SIZES.width, height: SIZES.height, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setdeleteModal(false)}
        swipeThreshold={200}
        onBackButtonPress={() => setdeleteModal(false)}>
        <View
          style={[
            tw`bg-[#EBEBEB] w-9/10 mx-auto my-auto   p-4 pb-8`,
            {borderRadius: 20, maxHeight: SIZES.height * 0.8},
          ]}>
          <View style={[tw``]}>
            <View style={[tw` mt-4`]}>
              <Textcomp
                text={'Delete Service Data'}
                size={16}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>

            <View style={[tw` mt-4 items-center`]}>
              <Textcomp
                text={'Are you sure you want to delete This Service ?'}
                size={16}
                lineHeight={16}
                color={'#000413'}
                style={{textAlign: 'center'}}
                fontFamily={'Inter'}
              />
            </View>

            <View style={[tw`flex flex-row`]}>
              <TouchableOpacity
                onPress={() => {
                  setdeleteModal(false);
                }}
                style={tw`mx-auto mt-8 py-4 bg-[${colors.darkPurple}] w-4/10 rounded-lg items-center justify-center`}>
                <Textcomp
                  text={'Cancel'}
                  size={17}
                  lineHeight={17}
                  color={colors.primary}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const portfolio = profileData?.portfolios?.filter(
                    (portfolio: {service: any}) =>
                      portfolio.service === selectedService?._id,
                  );
                  const payload = {
                    portfolioID: portfolio?.[0]._id,
                    serviceID: selectedService?._id,
                  };
                  _deletePortfolio(payload);
                }}
                style={tw`mx-auto mt-8 py-4 bg-[#ff0000] w-4/10 rounded-lg items-center justify-center`}>
                <Textcomp
                  text={'Delete'}
                  size={17}
                  lineHeight={17}
                  color={colors.white}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Account;
