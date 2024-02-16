import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import tw from 'twrnc';
import {
  useCreateServiceMutation,
  useGetUserDetailQuery,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import PotfolioWrapper from '../../components/PotfolioWrapper';
import Snackbar from 'react-native-snackbar';
import {SIZES, perWidth} from '../../utils/position/sizes';
import {
  completeProfile,
  getProfile,
  getProviderNew,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {addProfileData, addformStage} from '../../store/reducer/mainSlice';
import {ToastShort} from '../../utils/utils';
import Modal from 'react-native-modal/dist/modal';
import Textcomp from '../../components/Textcomp';
import PortComp from './comp/portComp3';
import Textarea from 'react-native-textarea';
type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};
import {generalStyles} from '../../constants/generalStyles';
import TextInputs from '../../components/TextInputs';
import {addcompleteProfile} from '../../store/reducer/mainSlice';
import FastImage from 'react-native-fast-image';
import TickIcon from '../../assets/svg/Tick';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import EditComp from './comp/EditComp';
const ProfileStep21 = () => {
  const navigation = useNavigation<StackNavigation>();
  const route: Route = useRoute();
  const category = useSelector((state: any) => state.user.pickedServices);
  const ProviderData = useSelector((state: any) => state.user.profileData);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );

  const [allPotfolio, setAllPotfolio] = useState<any>([]);
  const [description, setDescription] = useState(
    ProviderData?.description ?? completeProfileData?.description ?? '',
    // ? ProviderData?.description
    // : completeProfileData?.description
    // ? completeProfileData?.description
    // : '',
  );
  const [shortDescription, setShortDescription] = useState('');
  const [potfolioImageUrl, setPotfolioImageUrl] = useState<any>([]);
  const [isLoading, setisLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(ProviderData?.profilePic || '');
  const dispatch = useDispatch();

  const handleProfileSetup = async () => {
    if (portfolioToServiceCount?.length > 0) {
      const payload_data = portfolioToServiceCount;
      const payload_data2 = payload_data;
      const payload_data1 = payload_data;

      if (serviceList?.length < 1 || !serviceList) {
        ToastShort('ServiceList is null');
        console.log('====================================');
        console.log(categoryId);
        console.log('====================================');
        return;
      }
      payload_data1?.map((item, index) => {
        const name = item.service;
        // const filteredObject = serviceList?.filter(
        //   (obj: any) => obj?.label === name,
        // );
        const filteredObject = serviceList.find(
          (obj: any) => obj.name === item.service,
        );
        console.log('here', filteredObject, serviceList);
        if (filteredObject?._id) {
          payload_data2[index].service = filteredObject?._id;
        } else {
          console.error('error on modification', filteredObject);
        }
      });
      console.log(payload_data2);
      //
      setisLoading(true);
      const res: any = await completeProfile({portfolio: payload_data2});
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('ProfileStep3');
        dispatch(addformStage(3));
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);

      //
    } else {
      Snackbar.show({
        text: 'Please fill add atleast 1 portfolio',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

  const handleNext = async () => {
    if (!description) {
      ToastShort('Description is required!. ');
      return;
    }
    if (
      !imageUrl ||
      imageUrl ===
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    ) {
      ToastShort('Please upload a Profile Picture.');
      return;
    }

    // const d = ProviderData?.portfolios?.filter(s => s.service === item?._id);
    const ProviderDataLength = ProviderData?.portfolios?.length;
    const serviceLength = ProviderData?.services?.length;
    if (ProviderDataLength !== serviceLength) {
      ToastShort('Please fill all service data!.');
      return;
    }

    setisLoading(true);
    const res: any = await completeProfile({
      profilePic: completeProfileData?.profilePic || imageUrl,
      description: description,
    });
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      navigation.navigate('ProfileStep3');
      dispatch(addformStage(3));
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };
  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [portfolioToServiceCount, setportfolioToServiceCount] = useState([
    // {
    //   service: '',
    //   description: '',
    //   images: [],
    // },
  ]);
  const [serviceList, setserviceList] = useState([]);
  const options = {mediaType: 'photo', selectionLimit: 1};
  const [addModal, setaddModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);
  const categoryId = useSelector((state: any) => state.user.pickedServicesId);

  const [storedPortfolios, setstoredPortfolios] = useState([]);
  useEffect(() => {
    const initGetProfile = async () => {
      const res: any = await getProfile(userData?._id);
    };
    const initGetProviderNew = async () => {
      const res: any = await getProviderNew(userData?._id);
      // console.log('providerdatttttaaaaa', res?.data);
      // console.log('portfolio--', res?.data?.profile?.portfolios);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
        // setDescription(res?.data?.profile?.description);
      }
    };
    // initGetProfile();
    initGetProviderNew();
  }, []);
  // Function to handle changes in a portfolio item
  const handlePortfolioItemChange = (index: any, updatedData: any) => {
    // Create a copy of the current portfolio data
    const updatedPortfolioData = [...portfolioToServiceCount];
    updatedPortfolioData[index] = updatedData; // Update the data at the specified index
    setportfolioToServiceCount(updatedPortfolioData); // Update the state with the new data
    console.log('All Data here', updatedPortfolioData);
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
        dispatch(addcompleteProfile({profilePic: data}));
        const res: any = await completeProfile({profilePic: data});
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
                setImageUrl(resp?.assets[0].uri);
                const data = await uploadImgorDoc(resp?.assets[0]);
                console.warn('processed pic', data);
                dispatch(addcompleteProfile({profilePic: data}));
                const res: any = await completeProfile({profilePic: data});

                // await uploadImgorDoc(resp?.assets[0]);
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
                  setImageUrl(resp?.assets[0].uri);
                  const data = await uploadImgorDoc(resp?.assets[0]);
                  console.warn('processed pic', data);
                  dispatch(addcompleteProfile({profilePic: data}));
                  const res: any = await completeProfile({profilePic: data});
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
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    try {
      setisLoading(true);
      const res: any = await uploadAssetsDOCorIMG(param);
      if (res?.status === 201 || res?.status === 200) {
        console.log('ApartmentType', res?.data);
        setisLoading(false);
        return res?.data?.url;
      }
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };
  const [editModal, seteditModal] = useState(false);
  const profileData = useSelector((state: any) => state.user.profileData);

  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <Header
        style={{backgroundColor: colors.greyLight}}
        imageStyle={{tintColor: colors.black}}
        textStyle={{
          color: colors.black,
          fontFamily: commonStyle.fontFamily.semibold,
        }}
        title={'Complete your Registration'}
        image={images.back}
        func={() => {
          navigation.navigate('ProfileStep1');
        }}
      />
      <ProfileStepWrapper active={'two'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Service Data"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <View style={{zIndex: nationalityOpen ? 0 : 2}}>
            <TextWrapper
              children="Profile"
              fontType={'semiBold'}
              style={{fontSize: 20, marginTop: 30, color: colors.black}}
            />
            <View>
              <TouchableOpacity
                onPress={() => {
                  // openLibraryfordp();
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
                  <TouchableOpacity>
                    {!completeProfileData?.profilePic &&
                    imageUrl?.length < 1 ? (
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
                          uri: completeProfileData?.profilePic || imageUrl,
                          headers: {Authorization: 'someAuthToken'},
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                  </TouchableOpacity>
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
                  right: 40,
                  top: 10,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
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
            </View>
            <TextWrapper
              children="Description"
              isRequired={true}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />
            <View style={styles.container1}>
              <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={(text: string) => {
                  setDescription(text);
                  dispatch(addcompleteProfile({description: text}));
                }}
                defaultValue={description}
                maxLength={300}
                placeholder={
                  'Introduce yourself and enter your profile description.'
                }
                placeholderTextColor={'black'}
                underlineColorAndroid={'transparent'}
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
                style={{backgroundColor: colors.green, flex: 1}}
                labelText={
                  'Introduce yourself and enter your profile description.'
                }
                state={description}
                setState={text => {
                  setDescription(text);
                  dispatch(addcompleteProfile({description: description}));
                }}
                multiline={true}
                nbLines={20}
              />
              <TextInput
                multiline={true}
                style={{
                  height: 130,
                  borderRadius: 8,
                  backgroundColor: colors.greyLight1,
                  marginTop: 0,
                  padding: 10,
                }}
                placeholder="Introduce yourself and enter your profile description."
                value={description}
                onChangeText={(text: string) => {
                  setDescription(text);
                  dispatch(addcompleteProfile({description: description}));
                }}
              />
            </View> */}
            <TextWrapper
              children="Service Intro"
              isRequired={true}
              fontType={'semiBold'}
              style={{fontSize: 16, marginTop: 20, color: colors.black}}
            />
            <View style={tw`mt-2`}>
              <Textcomp
                text={'Click on edit to add service description'}
                size={12}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
              {category?.length > 0
                ? category?.map((item: any, index: any) => {
                    const d = ProviderData?.portfolios?.filter(
                      s => s.service === item?._id,
                    );
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
                        <View style={tw`flex flex-row items-center `}>
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
                              {item?.name}
                            </TextWrapper>
                          </View>
                          {d?.length > 0 && (
                            <TickIcon style={{width: 20, marginLeft: 10}} />
                          )}
                        </View>

                        <TouchableOpacity
                          style={tw`border bg-white rounded px-2 py-0.5`}
                          onPress={() => {
                            // const newPortfolioItem = {
                            //   service: '',
                            //   description: '',
                            //   images: [],
                            // };
                            if (d?.length > 0) {
                              seteditModal(true);
                              setSelectedService(item);
                            } else {
                              setaddModal(true);
                              setSelectedService(item);
                            }
                          }}>
                          <Textcomp
                            text={d?.length > 0 ? 'Done' : 'Edit'}
                            size={16}
                            lineHeight={18.75}
                            color={colors.parpal}
                            fontFamily={'Inter-SemiBold'}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                : null}
            </View>
            {allPotfolio.map((item: any, index: number) => {
              return (
                <PotfolioWrapper
                  key={index}
                  index={index}
                  item={item}
                  allPotfolio={allPotfolio}
                  setAllPotfolio={setAllPotfolio}
                  setShortDescription={setShortDescription}
                  setPotfolioImageUrl={setPotfolioImageUrl}
                  setEditKey={setEditKey}
                />
              );
            })}
            <View>
              {portfolioToServiceCount?.map((item, index) => {
                return (
                  <PortComp
                    key={index}
                    lindex={index}
                    dlist={serviceList}
                    portfolioData={portfolioToServiceCount}
                    handlePortfolioItemChange={(i: any, data: any) => {
                      handlePortfolioItemChange(index, data);
                      console.log('====================================');
                      console.log(index, data);
                      console.log('====================================');
                    }}
                  />
                );
              })}
            </View>
            {allPotfolio.length === 3 && (
              <View
                style={{
                  backgroundColor: colors.greyLight1,
                  height: 80,
                  borderRadius: 5,
                }}>
                <Image
                  source={images.cross}
                  resizeMode="contain"
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 20,
                    marginTop: 10,
                    tintColor: '#000',
                  }}
                />
                <TextWrapper
                  children="Maximum number of portfolios added."
                  isRequired={false}
                  fontType={'normal'}
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    marginTop: 13,
                    color: colors.black,
                  }}
                />
              </View>
            )}

            {!isLoading ? (
              <View style={{marginHorizontal: 25, marginTop: 75}}>
                <Button
                  onClick={() => {
                    // handleProfileSetup();

                    handleNext();
                    console.log('modified data2', portfolioToServiceCount);
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginHorizontal: 40,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Next'}
                />
              </View>
            ) : (
              <ActivityIndicator
                style={{marginTop: 95, marginBottom: 40}}
                size={'large'}
                color={colors.parpal}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={addModal}
        onModalHide={() => {
          setaddModal(false);
        }}
        style={{width: SIZES.width, height: SIZES.height, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setaddModal(false)}
        swipeThreshold={200}
        // swipeDirection={['down']}
        // onSwipeComplete={() => setaddModal(false)}
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
                text={'Customers need assurance of your service proficiency.'}
                size={10}
                lineHeight={12}
                color={'#000413'}
                fontFamily={'Inter-Regular'}
              />
            </View>
          </View>
          <View>
            <PortComp
              lindex={0}
              dlist={serviceList}
              service={selectedService}
              pdata={{
                service: '',
                description: '',
                images: [],
              }}
              portfolioData={portfolioToServiceCount}
              handlePortfolioItemChange={(i: any, data: any) =>
                handlePortfolioItemChange(0, data)
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
    </View>
  );
};
const styles = StyleSheet.create({
  container2: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    height: 180,
    padding: 10,
    backgroundColor: colors.greyLight1,
    borderRadius: 15,
    marginTop: 10,
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: 'black',
  },
});

export default ProfileStep21;
