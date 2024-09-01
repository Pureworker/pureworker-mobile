import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import tw from 'twrnc';
import {useCreateServiceMutation} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {WIDTH_WINDOW, generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import {allCities, allCountry} from '../../constants/utils';
import Snackbar from 'react-native-snackbar';
import {
  completeProfile,
  getUser,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  addUserData,
  addcompleteProfile,
  addformStage,
} from '../../store/reducer/mainSlice';
import FastImage from 'react-native-fast-image';
import ServiceIntroComp from '../../components/serviceIntro';
import ServicePriceComp from '../../components/servicePrice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {SelectList} from 'react-native-dropdown-select-list';
import {ToastShort} from '../../utils/utils';

const PRofileStep2 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [allPotfolio, setAllPotfolio] = useState<any>([]);
  const [isLoading, setisLoading] = useState(false);
  const category = useSelector((state: any) => state.user.pickedServices);
  const categoryId = useSelector((state: any) => state.user.pickedServicesId);
  const [servicesDescription, setServicesDescription] = useState<any>([]); // State to store input values
  const [servicePrice, setServicePrice] = useState<any>([]); // State to store input values
  const [createService] = useCreateServiceMutation();
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);

  console.log('--ggggggg', servicesDescription);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  useEffect(() => {
    setNationalityItems([...allCountry]);
  }, []);
  const currentServiceIntro = useSelector(
    (state: any) => state.user.completeProfileData?.serviceIntro,
  );

  console.log('===========Cats=========================');
  console.log(category);
  console.log('====================================');
  function isMongoObjectId(str) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(str);
  }
  let categoryWithNames: any[] = [];
  const checkL = () => {
    let arr: any[] = [];
    category?.map(item => {
      if (isMongoObjectId(item.service)) {
      } else {
        arr.push(item);
      }
    });
    categoryWithNames = arr;
  };
  checkL();
  console.log('==========categorywithNames==========================');
  console.log(categoryWithNames);
  console.log('====================================');
  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = categoryWithNames.map(service => ({
        service: service.name,
        description: '',
      }));
      const updatedServiceIntro = [
        ...(currentServiceIntro || []),
        ...(updatedInputValues || []).filter(
          updatedItem =>
            !(currentServiceIntro || []).some(
              currentItem => currentItem.service === updatedItem.service,
            ),
        ),
      ];
      setServicesDescription([...updatedServiceIntro]);
      dispatch(addcompleteProfile({serviceIntro: updatedServiceIntro}));
    }
  }, [category]);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map(service => ({
        serviceName: service?.name,
        service: service?._id || service?.id,
        maxPrice: '',
        minPrice: '',
      }));
      const existingServicesMap = new Map(
        (currentPriceRange || []).map(item => [item.service, item]),
      );
      // Update existing items or add new items
      const updatedPriceRange = updatedInputValues.map(updatedItem =>
        existingServicesMap.has(updatedItem.service)
          ? {...existingServicesMap.get(updatedItem.service), ...updatedItem}
          : updatedItem,
      );
      // Update the Redux store with the updated array
      setServicePrice([...updatedPriceRange]);
      dispatch(addcompleteProfile({priceRange: updatedPriceRange}));
    }

    setDescription(completeProfileData?.description);
  }, [category]);

  const currentPriceRange = useSelector(
    (state: any) => state.user.completeProfileData?.priceRange,
  );

  const dispatch = useDispatch();
  const handleProfileSetup = () => {
    if (
      imageUrl &&
      description &&
      servicesDescription &&
      servicePrice &&
      nationalityValue
    ) {
      const profileData = {
        profilePicture: imageUrl,
        description: description,
        servicesDescription: JSON.stringify(servicesDescription),
        servicePrice: JSON.stringify(servicePrice),
        city: nationalityValue,
        potfolios: allPotfolio,
        serviceId: '',
      };
      createService(profileData)
        .unwrap()
        .then((data: any) => {
          if (data) {
            navigation.navigate('ProfileStep3', {serviceId: data.serviceId});
          }
        })
        .catch((error: any) => {
          console.log('err', error);
          Snackbar.show({
            text: JSON.stringify(error),
            duration: Snackbar.LENGTH_LONG,
            textColor: '#fff',
            backgroundColor: '#88087B',
          });
        });
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };
  console.log('here', categoryId);
  const _handleFuncUpload = async () => {
    setisLoading(true);
    if (completeProfileData) {
      const dup = completeProfileData;
      let duplicate = dup;
      duplicate?.priceRange?.map(
        (
          item: {
            maxPrice: any;
            priceMax: any;
            minPrice: any;
            priceMin: any;
            service: any;
          },
          index: any,
        ) => {
          item.maxPrice = item.priceMax;
          item.minPrice = item.priceMin;
          item.service = categoryId?.[index];
        },
      );
      duplicate?.serviceIntro.map((item, index) => {
        item.service = duplicate?.priceRange?.[index]?.service;
        delete item.id;
      });

      duplicate.serviceIntro = duplicate.serviceIntro.filter(
        item => item.service !== undefined,
      );
      duplicate.serviceIntro = duplicate.serviceIntro.filter(
        item => !isMongoObjectId(item.service),
      );
      const profileData = {
        profilePic: completeProfileData?.profilePic || imageUrl,
        description: description
          ? description
          : completeProfileData?.description
          ? completeProfileData?.description
          : '',
        priceRange: duplicate.priceRange,
        serviceIntro: duplicate.serviceIntro,
        // servicesDescription: JSON.stringify(servicesDescription),
        // servicePrice: JSON.stringify(servicePrice),
        // city: nationalityValue,
        // potfolios: allPotfolio,
        // serviceId: '',
        // portfolio: null,
      };
      console.log('All Item Here', profileData);
      console.log('res-data', profileData);
      const res = await completeProfile(profileData);
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('ProfileStep21');
        dispatch(addformStage(21));
      } else {
        console.log('====================================');
        console.log(
          res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
        );
        console.log('====================================');
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
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };
  //image upload
  const options: any = {mediaType: 'photo', selectionLimit: 1, quality: 1};

  const openLibraryfordp = () => {
    launchImageLibrary(options, async (response: unknown) => {
      try {
        if (response?.assets?.length > 0) {
          const {fileSize, uri} = response.assets[0];
          const fileSizeInMB = fileSize / (1024 * 1024); // Convert to megabytes
          // if (fileSizeInMB > 1) {
          //   ToastShort(
          //     'Image size exceeds 1MB. Please choose a smaller image.',
          //   );
          //   return;
          // }
          console.log('Selected image:', response.assets[0]);
          setImageUrl(uri);

          const data = await uploadImgorDoc(response.assets[0]);
          console.log('Uploaded image data:', data);

          dispatch(addcompleteProfile({profilePic: data}));

          const result = await completeProfile({profilePic: data});
          console.log('Profile update result:', result);
        } else {
          console.warn('No image selected');
          ToastShort('No image selected. Please try again.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        ToastShort(
          'An error occurred while processing the image. Please try again.',
        );
      } finally {
        const initGetUsers = async () => {
          const res: any = await getUser('');
          if (res?.status === 201 || res?.status === 200) {
            dispatch(addUserData(res?.data?.user));
          }
        };
        initGetUsers();
      }
    });
  };

  const opencamerafordp = async () => {
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
                console.log('processed pic', data);
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
                  console.log('processed pic', data);
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
              // setPhotoUri(resp?.assets[0].uri);
              const data = await uploadImgorDoc(resp?.assets[0]);
              console.log('processed pic', data);
              // const res = await initUploadProfilePics2(data);
              dispatch(addcompleteProfile({profilePic: data}));
            }
          });
        } else {
          console.log('Camera permission denied2');
        }
      }
    } catch (error) {}
    // launchCamera
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
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <Header
        style={{backgroundColor: colors.greyLight}}
        imageStyle={{tintColor: colors.black}}
        textStyle={{
          color: colors.black,
          fontFamily: commonStyle.fontFamily.semibold,
        }}
        title={'Complete your Registration'}
        image={images.back}
      />
      <ProfileStepWrapper active={'two'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Add Services"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <TextWrapper
            children="What services do you provide?"
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Profile"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <View>
            <TouchableOpacity
              onPress={() => {
                openLibraryfordp();
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
                  {!completeProfileData?.profilePic && imageUrl?.length < 1 ? (
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
                        priority: FastImage.priority.high,
                        // cache: FastImage.cacheControl.cacheOnly,
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
                onPress={async () => {
                  openLibraryfordp();
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
              <TouchableOpacity onPress={() => setImageUrl('')}>
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
              </TouchableOpacity>
            </View>
          </View>
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
              }}
              style={{backgroundColor: colors.greyLight1}}
              labelText={
                'Introduce yourself and enter your profile description.'
              }
              state={description}
              setState={text => {
                setDescription(text);
                dispatch(addcompleteProfile({description: description}));
              }}
              multiline={true}
              nbLines={5}
            />
          </View>
          <TextWrapper
            children="Service Intro"
            isRequired={true}
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 20,
              marginBottom: 13,
              color: colors.black,
            }}
          />
          {servicesDescription?.length
            ? servicesDescription?.map((item: any, index: any) => {
                return (
                  <ServiceIntroComp key={index} item={item} index={index} />
                );
              })
            : null}
          <TextWrapper
            children="Price Range"
            isRequired={true}
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 20,
              marginBottom: 13,
              color: colors.black,
            }}
          />
          {servicePrice?.length
            ? servicePrice?.map((item: any, index: any) => {
                console.log(servicePrice);
                return (
                  <ServicePriceComp
                    key={item.service || item.serviceName}
                    item={item}
                    index={index}
                  />
                );
              })
            : null}
          <View style={[tw`flex bg`, {width: WIDTH_WINDOW * 0.9}]}>
            <TextWrapper
              children="What City do you offer your Services?"
              isRequired={true}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: 13,
                color: colors.black,
              }}
            />
            <SelectList
              setSelected={(val: any) => setNationalityValue(val)}
              data={allCities}
              save="value"
              boxStyles={[
                tw` w-full items-center flex-row justify-between flex-1`,
                {
                  paddingRight: 5,
                  borderRadius: 8,
                  backgroundColor: colors.lightBlack,
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              inputStyles={[
                tw`items-center flex-row justify-center flex-1`,
                {
                  height: 30,
                  textAlignVertical: 'center',
                  fontSize: 14,
                  textTransform: 'uppercase',
                  color: colors.white,
                  borderRadius: 8,
                },
              ]}
              placeholder="Select a city"
            />
          </View>
        </View>
        <View
          style={{
            zIndex: nationalityOpen ? 0 : 2,
            marginTop: nationalityOpen ? 190 : 20,
          }}>
          {!isLoading ? (
            <View style={{marginHorizontal: 25, marginTop: 75}}>
              <Button
                onClick={() => {
                  navigation.navigate('ProfileStep21');
                  dispatch(addformStage(21));
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
        <View style={tw`h-60`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </SafeAreaView>
  );
};

export default PRofileStep2;
