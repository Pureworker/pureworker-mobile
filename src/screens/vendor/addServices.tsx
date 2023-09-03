import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
  ScrollView,
  TouchableOpacity,
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
import {allCities, allCountry, launchImageLibrary} from '../../constants/utils';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';
import Portfoliocomp from '../../components/Portfolio';
import {SIZES, perWidth} from '../../utils/position/sizes';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import axios from 'axios';
import {addCategory, addcompleteProfile, removeCategory} from '../../store/reducer/mainSlice';
import ServiceIntroComp from '../../components/serviceIntro';
import ServicePriceComp from '../../components/servicePrice';
import Spinner from 'react-native-loading-spinner-overlay';
import { getSubCategory } from '../../utils/api/func';

const AddServices = () => {
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

  const category = useSelector((state: any) => state.user.pickedServices);
  const currentServiceIntro = useSelector(
    (state: any) => state.user.completeProfileData?.serviceIntro,
  );
  const currentPriceRange = useSelector(
    (state: any) => state.user.completeProfileData?.priceRange,
  );
  const [servicesDescription, setServicesDescription] = useState<any>([]); // State to store input values
  const [servicePrice, setServicePrice] = useState<any>([]); // State to store input values
  const [createService, {isLoading}] = useCreateServiceMutation();
  const [potfolioImageLoading, setPotfolioImageLoading] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);

  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);
  let potfolioPicture = useRef('');
  let profilePicture = useRef('');
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  // console.log('nationalityItems', nationalityItems);

  const [portfolioToServiceCount, setportfolioToServiceCount] = useState([]);

  useEffect(() => {
    setNationalityItems([...allCities]);
  }, []);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        serviceName: service,
        value: '',
      }));
      setServicesDescription([...updatedInputValues]);
    }
  }, [category]);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        serviceName: service,
        priceMin: '',
        priceMax: '',
      }));
      setServicePrice([...updatedInputValues]);
    }
  }, [category]);

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {...updatedInputValues[index], value};
    setServicesDescription(updatedInputValues);
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
  const _getCategory = useSelector((state: any) => state.user.category);
  const getCategory = _getCategory;

  console.log(getCategory);

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
  //
  const dispatch = useDispatch();
  //
  const [collapseState, setCollapseState] = useState(false);
  const [collapseState2, setCollapseState2] = useState(false);

  const [selectCategory, setselectCategory] = useState('');
  const [subCategory, setsubCategory] = useState([]);

  // const [getSubCategories] = useGetSubCategoriesQuery();

  const HandleGetSubCategory = async param => {
    console.log('started');
    try {
      const response = await axios({
        method: 'get',
        url: `https://pureworkers.com/api/users/category/${param}`,
      });
      // console.log(response?.data);
      setsubCategory(response?.data);
    } catch (error) {
      console.log('err', error);
      Snackbar.show({
        text: error?.data?.message,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

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

  const [_getSubCategory, set_getSubCategory] = useState([]);
  const initSubGetCategory = async param => {
    // setisLoading(true);
    // console.log(param);
    const res: any = await getSubCategory(param);
    if (res?.status === 201 || res?.status === 200) {
      // dispatch(addSubcategory(res?.data?.data?.services));
      set_getSubCategory(res?.data?.data?.services);
    }
    // setisLoading(false);
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
          title={'Add Services'}
          image={images.back}
        />
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Profile"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />

          <TextWrapper
            children="What services do you provide?"
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 13,
              marginBottom: 45,
              color: colors.black,
            }}
          />

          <Collapse
            isExpanded={collapseState}
            onToggle={() => {
              setCollapseState(!collapseState);
            }}
            style={{
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <CollapseHeader
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.lightBlack,
                marginVertical: 10,
                borderRadius: 5,
                height: 35,
                width: '95%',
                borderColor: colors.primary,
                borderWidth: 2,
                paddingHorizontal: 15,
                // marginHorizontal: 20
              }}>
              <View style={{}}>
                <TextWrapper
                  fontType={'semiBold'}
                  style={{
                    fontSize: 14,
                    color: '#fff',
                  }}>
                  {selectCategory === '' || selectCategory?.length < 1
                    ? 'Select Category'
                    : selectCategory}
                </TextWrapper>
              </View>
              {collapseState ? (
                <Image
                  source={images.polygonDown}
                  resizeMode={'contain'}
                  style={{width: 15, height: 15}}
                />
              ) : (
                <Image
                  source={images.polygonForward}
                  resizeMode={'contain'}
                  style={{width: 15, height: 15}}
                />
              )}
              <TextWrapper
                fontType={'semiBold'}
                style={{
                  fontSize: 35,
                  color: '#D20713',
                  position: 'absolute',
                  right: -25,
                }}>
                {'*'}
              </TextWrapper>
            </CollapseHeader>
            <CollapseBody>
              {getCategory && getCategory.length > 0 && (
                <View
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: colors.lightBlack,
                    borderWidth: 2,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '95%',
                  }}>
                  {getCategory?.map((item: any, index: number) => {
                    var offerStyle;
                    if (index > 0) {
                      offerStyle = {marginBottom: 25};
                    }
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={async () => {
                          setselectCategory(item?.name);
                          // HandleGetSubCategory(item?.id);
                          await initSubGetCategory(item?.id);
                          setCollapseState(false);
                        }}
                        style={{marginTop: 8}}>
                        <TextWrapper
                          fontType={'semiBold'}
                          style={{
                            color:
                              selectCategory === item?.name
                                ? colors.primary
                                : colors.white,
                            marginLeft: 11,
                            marginRight: 8,
                            marginBottom: 8,
                          }}>
                          {item?.name}
                        </TextWrapper>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </CollapseBody>
          </Collapse>

          <View style={{marginBottom: 40}}>
            {selectCategory?.length > 0 && selectCategory !== '' && (
              <Collapse
                onToggle={() => {
                  setCollapseState2(!collapseState2);
                }}
                isExpanded={collapseState2}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <CollapseHeader
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors.lightBlack,
                    marginVertical: 10,
                    borderRadius: 5,
                    height: 35,
                    width: '95%',
                    borderColor: colors.primary,
                    borderWidth: 2,
                    paddingHorizontal: 15,
                  }}>
                  <View style={{}}>
                    <TextWrapper
                      fontType={'semiBold'}
                      style={{
                        fontSize: 14,
                        color: '#fff',
                      }}>
                      Select Services
                    </TextWrapper>
                  </View>
                  {collapseState ? (
                    <Image
                      source={images.polygonDown}
                      resizeMode={'contain'}
                      style={{width: 15, height: 15}}
                    />
                  ) : (
                    <Image
                      source={images.polygonForward}
                      resizeMode={'contain'}
                      style={{width: 15, height: 15}}
                    />
                  )}
                  <TextWrapper
                    fontType={'semiBold'}
                    style={{
                      fontSize: 35,
                      color: '#D20713',
                      position: 'absolute',
                      right: -25,
                    }}>
                    {'*'}
                  </TextWrapper>
                </CollapseHeader>
                <CollapseBody>
                  {_getSubCategory && _getSubCategory.length > 0 && (
                    <View
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.lightBlack,
                        borderWidth: 2,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '95%',
                      }}>
                      {_getSubCategory?.map((item: any, index: number) => {
                        var offerStyle;
                        if (index > 0) {
                          offerStyle = {marginBottom: 25};
                        }
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              if (
                                Array.isArray(category) &&
                                category.length &&
                                category.some(
                                  catItem => catItem.name === item.name,
                                )
                              ) {
                                dispatch(removeCategory(item));
                              } else {
                                dispatch(addCategory(item));
                              }
                              setCollapseState2(false);
                              // console.log(category);
                            }}
                            style={{marginTop: 8}}>
                            <TextWrapper
                              fontType={'semiBold'}
                              style={{
                                color: category.some(
                                  (catItem: {name: any}) =>
                                    catItem.name === item.name,
                                )
                                  ? colors.primary
                                  : colors.white,
                                marginLeft: 11,
                                marginRight: 8,
                                marginBottom: 8,
                              }}>
                              {item?.name}
                            </TextWrapper>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </CollapseBody>
              </Collapse>
            )}
          </View>

          <TextWrapper
            children="Service Intro"
            isRequired={true}
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 0,
              marginBottom: 13,
              color: colors.black,
            }}
          />

          {/* {servicesDescription?.length
            ? servicesDescription?.slice(-1).map((item: any, index: any) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: WIDTH_WINDOW - 40,
                      justifyContent: 'space-between',
                      marginBottom: 13,
                    }}>
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: colors.lightBlack,
                        height: 50,
                        width: 120,
                        borderRadius: 5,
                      }}>
                      <TextWrapper
                        numberOfLines={1}
                        fontType={'semiBold'}
                        style={{
                          fontSize: 12,
                          color: '#fff',
                        }}>
                        {item?.serviceName}
                      </TextWrapper>
                    </View>
                    <TextInput
                      style={{
                        width: '60%',
                        paddingHorizontal: 10,
                        backgroundColor: colors.lightBlack,
                        borderRadius: 5,
                        color: '#fff',
                        height: Platform.OS === 'ios' ? 50 : 50,
                      }}
                      placeholderTextColor={colors.grey}
                      placeholder="Enter service description"
                      key={index}
                      value={item.value} // Assign value from state
                      onChangeText={value => handleInputChange(index, value)}
                    />
                  </View>
                );
              })
            : null} */}
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

          {/* {servicePrice?.length
            ? servicePrice.slice(-1)?.map((item: any, index: any) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: WIDTH_WINDOW - 40,
                      justifyContent: 'space-between',
                      marginBottom: 13,
                    }}>
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: colors.lightBlack,
                        height: 50,
                        width: 120,
                        borderRadius: 5,
                      }}>
                      <TextWrapper
                        numberOfLines={1}
                        fontType={'semiBold'}
                        style={{
                          fontSize: 12,
                          color: '#fff',
                        }}>
                        {item?.serviceName}
                      </TextWrapper>
                    </View>

                    <View style={[generalStyles.rowCenter]}>
                      <TextInput
                        style={{
                          width: 80,
                          paddingHorizontal: 10,
                          backgroundColor: colors.lightBlack,
                          borderRadius: 5,
                          color: '#fff',
                          height: Platform.OS === 'ios' ? 50 : 50,
                        }}
                        placeholderTextColor={colors.grey}
                        placeholder="N"
                        keyboardType="number-pad"
                        key={index}
                        value={item.value} // Assign value from state
                        onChangeText={value =>
                          handleServicePriceMinChange(index, value)
                        }
                      />
                      <TextWrapper
                        fontType={'semiBold'}
                        style={{
                          fontSize: 12,
                          color: colors.black,
                          marginHorizontal: 10,
                        }}>
                        to
                      </TextWrapper>
                      <TextInput
                        style={{
                          width: 80,
                          paddingHorizontal: 10,
                          backgroundColor: colors.lightBlack,
                          borderRadius: 5,
                          color: '#fff',
                          height: Platform.OS === 'ios' ? 50 : 50,
                        }}
                        placeholderTextColor={colors.grey}
                        placeholder="N"
                        keyboardType="number-pad"
                        key={index}
                        value={item.value} // Assign value from state
                        onChangeText={value =>
                          handleServicePriceMaxChange(index, value)
                        }
                      />
                    </View>
                  </View>
                );
              })
            : null} */}
          {servicePrice?.length
            ? servicePrice?.map((item: any, index: any) => {
                return (
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
                items={nationalityItems}
                setOpen={setNationalityOpen}
                setValue={setNationalityValue}
                setItems={setNationalityItems}
                showArrowIcon={false}
                zIndex={10}
                placeholder="City"
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
                  width: SIZES.width * 0.875,
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
                return <Portfoliocomp servicePrice={servicePrice} />;
              })}
            </View>

            {allPotfolio.length == 3 && (
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
                    // navigation.navigate('ProfileStep3', {serviceId: data?.serviceId});
                    navigation.navigate('ProfileStep3', {serviceId: 'id_here'});
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginHorizontal: 40,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Edit'}
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
    </View>
  );
};

export default AddServices;
