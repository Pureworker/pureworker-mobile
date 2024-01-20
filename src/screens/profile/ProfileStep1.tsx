import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import CategoryList from '../../components/CategoryList';
import {
  useGetCategoryQuery,
  useGetSubCategoriesQuery,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCategory,
  addcompleteProfile,
  addformStage,
  addprovider_id,
  removeCategory,
} from '../../store/reducer/mainSlice';
import {generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import tw from 'twrnc';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {completeProfile, getSubCategory} from '../../utils/api/func';
import {RouteContext} from '../../utils/context/route_context';
import CustomLoading from '../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';

const PRofileStep1 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [addService, setAddService] = useState('');
  const [isAddService, setIsAddService] = useState(false);

  // const {data: getCategoryData, isLoading, isError} = useGetCategoryQuery();
  // const getCategory = getCategoryData ?? [];

  const _getCategory = useSelector((state: any) => state.user.category);
  const getCategory = _getCategory;
  const category = useSelector((state: any) => state.user.pickedServices);
  const categoryId = useSelector((state: any) => state.user.pickedServicesId);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const dispatch = useDispatch();
  console.log(completeProfileData, category);
  //
  const [collapseState, setCollapseState] = useState(false);
  const [collapseState2, setCollapseState2] = useState(false);
  const [selectCategory, setselectCategory] = useState('');
  const [subCategory, setsubCategory] = useState([]);
  const [subLoading, setsubLoading] = useState(false);
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

  const [_getSubCategory, set_getSubCategory] = useState([]);
  const initSubGetCategory = async param => {
    // setisLoading(true);
    // console.log(param);
    setsubLoading(true);
    const res: any = await getSubCategory(param);
    console.log('prssss', res?.data?.data);
    if (res?.status === 201 || res?.status === 200) {
      // dispatch(addSubcategory(res?.data?.data?.services));
      set_getSubCategory(res?.data?.data?.[0]?.services);
    }
    setsubLoading(false);
    // setisLoading(false);
  };

  const {currentState, setCurrentState} = useContext(RouteContext);

  console.log(currentState);

  const [isLoading, setisLoading] = useState(false);
  const handleProfileSetup = async () => {
    setisLoading(true);
    if (categoryId) {
      const res = await completeProfile({services: categoryId});
      console.error('RESULT', res?.data);

      if (res?.status === 200 || res?.status === 201) {
        dispatch(addprovider_id(res?.data?.profile?.id));
        // navigation.navigate('ProfileStep2');
        // setCurrentState('2');
        navigation.navigate('ProfileStep21');
        setCurrentState('21');
        dispatch(addformStage(21));
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
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };

  const handleNext = async () => {
    console.log(categoryId);
    await handleProfileSetup();
    // const data = completeProfileData;
    // data.services = category;
    // console.log(data, category, categoryId);
    // dispatch(addcompleteProfile({services: categoryId}));
    // navigation.navigate('ProfileStep2');
  };

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
      />
      <ProfileStepWrapper active={'one'} />
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
              // if (!dataLoaded) {
              //   setDataLoaded(true);
              // }
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
                  {selectCategory ? selectCategory : 'Select Category'}
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
                          setCollapseState(false);
                          // HandleGetSubCategory(item?.id);
                          await initSubGetCategory(item?._id || item?.id);
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
                isExpanded={collapseState2}
                onToggle={() => {
                  // if (!dataLoaded) {
                  //   setDataLoaded(true);
                  // }
                  setCollapseState2(!collapseState2);
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
                      Select Services
                    </TextWrapper>
                  </View>
                  {collapseState2 ? (
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
                  {subLoading ? (
                    <ActivityIndicator size={'large'} color={colors.primary} />
                  ) : (
                    <>
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
                    </>
                  )}
                </CollapseBody>
              </Collapse>
            )}
          </View>
          {isAddService ? (
            <>
              <TextInputs
                styleInput={{color: colors.white}}
                style={{
                  marginTop: 0,
                  backgroundColor: colors.lightBlack,
                  borderWidth: 2,
                  borderColor: colors.primary,
                }}
                labelText={'Type name of service'}
                state={addService}
                setState={setAddService}
                keyBoardType={'email-address'}
              />
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 30,
                  alignItems: 'flex-end',
                }}>
                <Button
                  onClick={() => {
                    if (addService) {
                      dispatch(addCategory(addService));
                      setAddService('');
                    }
                  }}
                  style={{width: 130, backgroundColor: colors.lightBlack}}
                  textStyle={{color: colors.primary}}
                  text={'Done'}
                />
              </View>
            </>
          ) : null}
        </View>

        <View
          style={[
            generalStyles.rowBetween,
            {marginHorizontal: 20, marginBottom: 35},
          ]}>
          <Button
            onClick={() => {
              handleNext();
            }}
            style={[
              tw`ml-auto`,
              {width: 90, backgroundColor: colors.lightBlack},
            ]}
            textStyle={{color: colors.primary}}
            text={'Next'}
          />
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {category?.length > 0
            ? category?.map((item: any, index: any) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 13,
                      marginHorizontal: 20,
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
                        {item?.name}
                      </TextWrapper>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(removeCategory(item));
                      }}>
                      <Image
                        source={images.cross}
                        style={{
                          width: 15,
                          height: 15,
                          marginLeft: 20,
                          tintColor: '#000',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default PRofileStep1;
