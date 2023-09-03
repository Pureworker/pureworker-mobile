import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import tw from 'twrnc';
import {
  useCreateServiceMutation,
  useGetCategoryQuery,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {WIDTH_WINDOW, generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import DropDownPicker from 'react-native-dropdown-picker';
import PotfolioWrapper from '../../components/PotfolioWrapper';
import {
  allCities,
  allCountry,
  // launchCamera,
  // launchImageLibrary,
} from '../../constants/utils';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';
import Portfoliocomp from '../../components/Portfolio';
import {SIZES, perWidth} from '../../utils/position/sizes';
import {uploadAssetsDOCorIMG} from '../../utils/api/func';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {addcompleteProfile} from '../../store/reducer/mainSlice';
import FastImage from 'react-native-fast-image';
import ServiceIntroComp from '../../components/serviceIntro';
import ServicePriceComp from '../../components/servicePrice';
import Spinner from 'react-native-loading-spinner-overlay';

const PRofileStep2 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageObject, setImageObject] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [potfolioImageUrl, setPotfolioImageUrl] = useState<any>([]);
  const [potfolioEnable, setPotfolioEnable] = useState(false);
  const [allPotfolio, setAllPotfolio] = useState<any>([]);
  const [key, setKey] = useState<any>(1);
  const [editkey, setEditKey] = useState<any>(null);
  const [isLoading, setisLoading] = useState(false);

  const category = useSelector((state: any) => state.user.pickedServices);
  const [servicesDescription, setServicesDescription] = useState<any>([]); // State to store input values
  const [servicePrice, setServicePrice] = useState<any>([]); // State to store input values
  const [createService] = useCreateServiceMutation();
  const [potfolioImageLoading, setPotfolioImageLoading] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);

  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);
  let potfolioPicture = useRef('');
  let profilePicture = useRef('');
  // console.log('nationalityItems', nationalityItems);
  console.log('--ggggggg', nationalityValue);
  const [portfolioToServiceCount, setportfolioToServiceCount] = useState([]);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  console.error('yeap', completeProfileData);
  useEffect(() => {
    setNationalityItems([...allCountry]);
  }, []);
  const currentServiceIntro = useSelector(
    (state: any) => state.user.completeProfileData?.serviceIntro,
  );
  console.log(category);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        service: service?.name,
        description: '',
      }));
      const updatedServiceIntro = [
        ...(currentServiceIntro || []), // Use an empty array if currentServiceIntro is undefined
        ...(updatedInputValues || []).filter(
          updatedItem =>
            !(currentServiceIntro || []).some(
              currentItem => currentItem.service === updatedItem.service,
            ),
        ),
      ];
      // Update the Redux store with the updated array
      setServicesDescription([...updatedServiceIntro]);
      dispatch(addcompleteProfile({serviceIntro: updatedServiceIntro}));
    }
  }, [category]);

  useEffect(() => {


    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        serviceName: service?.name,
        service: service?.id,
        maxPrice: '',
        minPrice: '',
      }));

      // Retrieve the current state of priceRange from Redux
      // const currentPriceRange = getState().yourSliceName.priceRange;
      // Create a new array with updated and existing values
      const updatedPriceRange = [
        ...(currentPriceRange || []),
        ...updatedInputValues.filter(
          updatedItem =>
            // !currentPriceRange.some(
            !(currentPriceRange || []).some(
              currentItem => currentItem.service === updatedItem.service,
            ),
        ),
      ];

      // Update the Redux store with the updated array
      setServicePrice([...updatedPriceRange]);
      dispatch(addcompleteProfile({priceRange: updatedPriceRange}));
    }
    setDescription(completeProfileData?.description);
  }, [category]);
  const currentPriceRange = useSelector(
    (state: any) => state.user.completeProfileData?.priceRange,
  );

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {...updatedInputValues[index], value};
    setServicesDescription(updatedInputValues);
  };
  const handleDescriptionChange = (item: any) => {
    const newArray = servicesDescription.map((service: {service: any}) => {
      if (service.service === item?.service) {
        return {
          ...service,
          description: item?.description,
        };
      }
      setServicesDescription(newArray);
      return service;
    });
  };
  const handleServicePriceMinChange = (index: number, priceMin: string) => {
    const updatedInputValues: any = [...servicePrice];
    updatedInputValues[index] = {...updatedInputValues[index], priceMin};
    setServicePrice(updatedInputValues);
  };
  const handleServicePriceMaxChange = (index: number, priceMax: string) => {
    const updatedInputValues: any = [...servicePrice];
    updatedInputValues[index] = {...updatedInputValues[index], priceMax};
    setServicePrice(updatedInputValues);
  };
  const {data: getCategoryData, isError} = useGetCategoryQuery();
  const getCategory = getCategoryData ?? [];

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
            duration: Snackbar.LENGTH_SHORT,
            textColor: '#fff',
            backgroundColor: '#88087B',
          });
        });
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

  //image upload
  const options = {mediaType: 'photo', selectionLimit: 1};
  const openLibraryfordp = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        // console.log('resp', resp?.assets);
        console.log('resp', resp?.assets[0]);
        // setPhotoUri(resp?.assets[0].uri);
        setImageUrl(resp?.assets[0].uri);
        // initUploadProfilePics(resp?.assets[0]);
        const data = await uploadImgorDoc(resp?.assets[0]);
        console.warn('processed pic', data);
        dispatch(addcompleteProfile({profilePic: data}));
      }
    });
    // launchCamera
  };
  const opencamerafordp = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      cameraType: 'front',
    };
    console.log('called logo');
    try {
      if (Platform.OS === 'ios') {
        const openCamera = async () => {
          const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);

          if (cameraStatus === RESULTS.GRANTED) {
            // Camera permission is granted, open camera here
            console.log('Camera permission granted');
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
              console.log('Camera permission granted after request');
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
              setPhotoUri(resp?.assets[0].uri);
              const data = await uploadImgorDoc(resp?.assets[0]);
              console.log('processed pic', data);
              const res = await initUploadProfilePics2(data);
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
      return res?.data.url;
    }
    setisLoading(false);
  };

  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <ScrollView>
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
            <View
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
                  {/* {!imageUrl ? ( */}
                  {!completeProfileData?.profilePic ? (
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
                    // <Image
                    //   source={{uri: completeProfileData?.profilePic || imageUrl}}
                    //   style={{width: 145, height: 145, borderRadius: 145}}
                    // />
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
                </>
              ) : (
                <ActivityIndicator
                  style={{marginTop: 0}}
                  size={'large'}
                  color={colors.parpal}
                />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                right: 40,
                top: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  // try {
                  //   const response: any = await launchImageLibrary();
                  //   setProfileImageLoading(true);
                  //   if (response) {
                  //     const filename = response?.uri.substring(
                  //       response?.uri.lastIndexOf('/') + 1,
                  //     );
                  //     const uploadUri =
                  //       Platform.OS === 'ios'
                  //         ? response?.uri.replace('file://', '')
                  //         : response.uri;
                  //     const task = await storage()
                  //       .ref(filename)
                  //       .putFile(uploadUri);
                  //     if (task.metadata) {
                  //       profilePicture.current = task.metadata.fullPath;
                  //     }
                  //     let url = '';
                  //     if (profilePicture.current) {
                  //       url = await storage()
                  //         .ref(profilePicture.current)
                  //         .getDownloadURL();
                  //     }
                  //     setImageUrl(url);
                  //     profilePicture.current = '';
                  //     setProfileImageLoading(false);
                  //   } else {
                  //     setProfileImageLoading(false);
                  //   }
                  // } catch (error) {
                  //   console.log('error', error);
                  //   setProfileImageLoading(false);
                  // }
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
                  // <View
                  //   key={index}
                  //   style={{
                  //     flexDirection: 'row',
                  //     alignItems: 'center',
                  //     width: WIDTH_WINDOW - 40,
                  //     justifyContent: 'space-between',
                  //     marginBottom: 13,
                  //   }}>
                  //   <View
                  //     key={index}
                  //     style={{
                  //       paddingHorizontal: 10,
                  //       justifyContent: 'center',
                  //       backgroundColor: colors.lightBlack,
                  //       height: 50,
                  //       width: 120,
                  //       borderRadius: 5,
                  //     }}>
                  //     <TextWrapper
                  //       numberOfLines={1}
                  //       fontType={'semiBold'}
                  //       style={{
                  //         fontSize: 12,
                  //         color: '#fff',
                  //       }}>
                  //       {item?.service}
                  //     </TextWrapper>
                  //   </View>
                  //   <TextInput
                  //     style={{
                  //       width: '60%',
                  //       paddingHorizontal: 10,
                  //       backgroundColor: colors.lightBlack,
                  //       borderRadius: 5,
                  //       color: '#fff',
                  //       height: Platform.OS === 'ios' ? 50 : 50,
                  //     }}
                  //     placeholderTextColor={colors.grey}
                  //     placeholder="Enter service description"
                  //     key={index}
                  //     value={item.value} // Assign value from state
                  //     onChangeText={value => {
                  //       // handleInputChange(index, value)
                  //       // setServicesDescription(item);
                  //       handleDescriptionChange(item);
                  //       // dispatch(addcompleteProfile({serviceIntro: servicesDescription}));
                  //     }}
                  //   />
                  // </View>
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
                return (
                  // <View
                  //   key={index}
                  //   style={{
                  //     flexDirection: 'row',
                  //     alignItems: 'center',
                  //     width: WIDTH_WINDOW - 40,
                  //     justifyContent: 'space-between',
                  //     marginBottom: 13,
                  //   }}>
                  //   <View
                  //     key={index}
                  //     style={{
                  //       paddingHorizontal: 10,
                  //       justifyContent: 'center',
                  //       backgroundColor: colors.lightBlack,
                  //       height: 50,
                  //       width: 120,
                  //       borderRadius: 5,
                  //     }}>
                  //     <TextWrapper
                  //       numberOfLines={1}
                  //       fontType={'semiBold'}
                  //       style={{
                  //         fontSize: 12,
                  //         color: '#fff',
                  //       }}>
                  //       {item?.serviceName}
                  //     </TextWrapper>
                  //   </View>

                  //   <View style={[generalStyles.rowCenter]}>
                  //     <TextInput
                  //       style={{
                  //         width: 80,
                  //         paddingHorizontal: 10,
                  //         backgroundColor: colors.lightBlack,
                  //         borderRadius: 5,
                  //         color: '#fff',
                  //         height: Platform.OS === 'ios' ? 50 : 50,
                  //       }}
                  //       placeholderTextColor={colors.grey}
                  //       placeholder="N"
                  //       keyboardType="number-pad"
                  //       key={index}
                  //       value={item.value} // Assign value from state
                  //       onChangeText={value =>
                  //         handleServicePriceMinChange(index, value)
                  //       }
                  //     />
                  //     <TextWrapper
                  //       fontType={'semiBold'}
                  //       style={{
                  //         fontSize: 12,
                  //         color: colors.black,
                  //         marginHorizontal: 10,
                  //       }}>
                  //       to
                  //     </TextWrapper>
                  //     <TextInput
                  //       style={{
                  //         width: 80,
                  //         paddingHorizontal: 10,
                  //         backgroundColor: colors.lightBlack,
                  //         borderRadius: 5,
                  //         color: '#fff',
                  //         height: Platform.OS === 'ios' ? 50 : 50,
                  //       }}
                  //       placeholderTextColor={colors.grey}
                  //       placeholder="N"
                  //       keyboardType="number-pad"
                  //       key={index}
                  //       value={item.value} // Assign value from state
                  //       onChangeText={value =>
                  //         handleServicePriceMaxChange(index, value)
                  //       }
                  //     />
                  //   </View>
                  // </View>
                  <ServicePriceComp key={index} item={item} index={index} />
                );
              })
            : null}
          <View
            style={{
              minHeight: 500,
              marginBottom: -400,
              zIndex: 1,
            }}>
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
            <ScrollView horizontal>
              <DropDownPicker
                open={nationalityOpen}
                value={nationalityValue}
                items={allCities}
                setOpen={setNationalityOpen}
                setValue={setNationalityValue}
                setItems={setNationalityItems}
                showArrowIcon={false}
                zIndex={10}
                dropDownContainerStyle={{
                  borderWidth: 0,
                }}
                labelStyle={{
                  fontFamily: commonStyle.fontFamily.regular,
                  fontSize: 14,
                  color: colors.white,
                }}
                arrowIconStyle={
                  {
                    // backgroundColor: 'red'
                  }
                }
                placeholderStyle={{
                  fontFamily: commonStyle.fontFamily.regular,
                  fontSize: 14,
                  color: '#9E9E9E',
                }}
                style={{
                  backgroundColor: colors.lightBlack,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  width: SIZES.width * 0.9,
                }}
                listMode="FLATLIST"
                showTickIcon={false}
                textStyle={{
                  color: colors.white,
                }}
                listParentLabelStyle={{
                  color: '#000',
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.regular,
                }}
                listItemContainerStyle={{
                  backgroundColor: '#F1F1F1',
                  borderColor: 'red',
                  opacity: 1,
                  borderWidth: 0,
                }}
              />
            </ScrollView>
          </View>
          <View style={{zIndex: nationalityOpen ? 0 : 2}}>
            <TextWrapper
              children="Portfolio  (You can add a maximum of 3 per service)"
              isRequired={false}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: 3,
                color: colors.black,
              }}
            />
            <TextWrapper
              children="Click “Add a Portfolio” to showcase projects you’ve worked on"
              isRequired={false}
              fontType={'Regular'}
              style={{
                fontSize: 14,
                marginTop: 0,
                marginBottom: 13,
                color: colors.black,
              }}
            />
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
            <TouchableOpacity
              style={[
                tw`bg-[${colors.darkPurple}] py-3 rounded-lg ml-auto items-center justify-center`,
                {width: perWidth(175)},
              ]}
              onPress={() => {
                // if (allPotfolio.length < 3) {
                //   setPotfolioEnable(true);
                // }
                setportfolioToServiceCount([...portfolioToServiceCount, 1]);
              }}>
              <TextWrapper
                children={`Add ${
                  portfolioToServiceCount.length === 0 ? 'a' : 'another'
                } Portfolio`}
                isRequired={false}
                fontType={'semiBold'}
                style={{fontSize: 16, color: colors.white}}
              />
            </TouchableOpacity>

            <View>
              {portfolioToServiceCount?.map((item, index) => {
                return (
                  <Portfoliocomp key={index} servicePrice={servicePrice} />
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

            {/* {potfolioEnable || shortDescription || potfolioImageUrl.length ? (
              <View>
                <TextWrapper
                  children="Short Description"
                  isRequired={false}
                  fontType={'semiBold'}
                  style={{fontSize: 16, marginTop: 0, color: colors.black}}
                />
                <TextInput
                  style={{
                    paddingHorizontal: 10,
                    marginTop: 10,
                    height: 70,
                    backgroundColor: colors.greyLight1,
                    borderRadius: 5,
                    color: '#000',
                  }}
                  placeholderTextColor={colors.grey}
                  placeholder="Breiefly talk about the portfolio.....Max: 20 words"
                  value={shortDescription}
                  onChangeText={setShortDescription}
                />

                {!potfolioImageLoading ? (
                  <View>
                    {potfolioImageUrl.length < 3 && (
                      <>
                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              const response: any = await launchImageLibrary();
                              setPotfolioImageLoading(true);
                              if (response) {
                                const filename = response?.uri.substring(
                                  response?.uri.lastIndexOf('/') + 1,
                                );
                                const uploadUri =
                                  Platform.OS === 'ios'
                                    ? response?.uri.replace('file://', '')
                                    : response.uri;
                                const task = await storage()
                                  .ref(filename)
                                  .putFile(uploadUri);
                                if (task.metadata) {
                                  potfolioPicture.current =
                                    task.metadata.fullPath;
                                }
                                let url;
                                if (potfolioPicture.current) {
                                  url = await storage()
                                    .ref(potfolioPicture.current)
                                    .getDownloadURL();
                                }
                                setPotfolioImageUrl([...potfolioImageUrl, url]);
                                potfolioPicture.current = '';
                                setPotfolioImageLoading(false);
                              } else {
                                setPotfolioImageLoading(false);
                              }
                              setPotfolioImageUrl([...potfolioImageUrl, url]);
                              potfolioPicture.current = '';
                              setPotfolioImageLoading(false);
                            } catch {
                              setPotfolioImageLoading(false);
                            }
                          }}
                          style={[
                            generalStyles.contentCenter,
                            {
                              height: 25,
                              width: 120,
                              borderRadius: 5,
                              marginTop: 13,
                              backgroundColor: colors.lightBlack,
                            },
                          ]}>
                          <TextWrapper
                            children="Upload Images"
                            isRequired={false}
                            fontType={'semiBold'}
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: colors.white,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    )}

                    <View style={[generalStyles.rowCenter, {marginRight: 20}]}>
                      {potfolioImageUrl.map((item: any, index: number) => {
                        return (
                          <View
                            key={index}
                            style={[
                              [generalStyles.rowCenter, {marginRight: 20}],
                              {marginTop: 10},
                            ]}>
                            <TextWrapper
                              children={item?.slice(-8)}
                              isRequired={false}
                              fontType={'semiBold'}
                              style={{
                                textAlign: 'center',
                                fontSize: 12,
                                color: colors.black,
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                setPotfolioImageUrl(
                                  potfolioImageUrl.filter(
                                    (text: any) => text !== item,
                                  ),
                                );
                              }}>
                              <Image
                                source={images.cross}
                                resizeMode="contain"
                                style={{
                                  width: 10,
                                  height: 10,
                                  marginLeft: 20,
                                  tintColor: '#000',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                    <Button
                      onClick={() => {
                        if (!shortDescription) {
                          Snackbar.show({
                            text: 'Please enter potfolio description',
                            duration: Snackbar.LENGTH_SHORT,
                            textColor: '#fff',
                            backgroundColor: '#88087B',
                          });
                          return;
                        }
                        const data = {
                          key: key,
                          shortDescription: shortDescription,
                          potfolioImages: potfolioImageUrl,
                        };
                        setKey(key + 1);
                        if (editkey) {
                          const objIndex = allPotfolio.findIndex(
                            (obj: any) => obj.key == editkey,
                          );
                          allPotfolio[objIndex].potfolioImages =
                            potfolioImageUrl;
                          allPotfolio[objIndex].shortDescription =
                            shortDescription;
                          setAllPotfolio([...allPotfolio]);
                        } else {
                          setAllPotfolio([...allPotfolio, data]);
                        }
                        setEditKey(null);
                        setShortDescription('');
                        setPotfolioImageUrl([]);
                        setPotfolioEnable(false);
                      }}
                      style={{
                        width: 80,
                        marginTop: 10,
                        alignSelf: 'flex-end',
                        backgroundColor: colors.lightBlack,
                      }}
                      textStyle={{color: colors.primary}}
                      text={'Done'}
                    />
                  </View>
                ) : (
                  <ActivityIndicator
                    style={{marginTop: 50}}
                    size={'large'}
                    color={colors.parpal}
                  />
                )}
              </View>
            ) : null} */}

            {!isLoading ? (
              <View style={{marginHorizontal: 25, marginTop: 75}}>
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep3', {serviceId: data?.serviceId});
                    navigation.navigate('ProfileStep3', {serviceId: 'id_here'});
                    // dispatch(
                    //   addcompleteProfile({
                    //     description: description,
                    //     serviceIntro: [],
                    //   }),
                    // );
                    dispatch(addcompleteProfile({city: nationalityValue}));
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
        <View style={tw`h-30`} />
      </ScrollView>
      <Spinner visible={isLoading} />
    </View>
  );
};

export default PRofileStep2;
