import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../constants/navigation';
import Header from '../../../components/Header';
import images from '../../../constants/images';
import Button from '../../../components/Button';
import TextWrapper from '../../../components/TextWrapper';
import commonStyle from '../../../constants/commonStyle';
import colors from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCategory,
  addProfileData,
  addformStage,
  addprovider_id,
  removeCategory,
} from '../../../store/reducer/mainSlice';
// import {generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../../components/ProfileStepWrapper';
import TextInputs from '../../../components/TextInputs';
import tw from 'twrnc';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {
  completeProfile,
  getProviderNew,
  getSubCategory,
} from '../../../utils/api/func';
import {RouteContext} from '../../../utils/context/route_context';
import CustomLoading from '../../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';
import {ToastShort} from '../../../utils/utils';
import {SIZES} from '../../../utils/position/sizes';
import Textcomp from '../../../components/Textcomp';

const PRofileStep11 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [addService, setAddService] = useState('');
  const [isAddService, setIsAddService] = useState(false);
  const _getCategory = useSelector((state: any) => state.user.category);
  const getCategory = _getCategory;
  const category = useSelector((state: any) => state.user.pickedServices);
  const categoryId = useSelector((state: any) => state.user.pickedServicesId);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const userData = useSelector((state: any) => state.user.userData);
  const ProviderData = useSelector((state: any) => state.user.profileData);
  const dispatch = useDispatch();
  console.log(completeProfileData, category);
  //
  const [collapseState, setCollapseState] = useState(false);
  const [collapseState2, setCollapseState2] = useState(false);
  const [selectCategory, setselectCategory] = useState('');
  const [subCategory, setsubCategory] = useState([]);
  const [subLoading, setsubLoading] = useState(false);
  const [_getSubCategory, set_getSubCategory] = useState([]);
  const initSubGetCategory = async param => {
    setsubLoading(true);
    const res: any = await getSubCategory(param);
    console.log('prssss', res?.data?.data);
    if (res?.status === 201 || res?.status === 200) {
      // dispatch(addSubcategory(res?.data?.data?.services));
      set_getSubCategory(res?.data?.data?.[0]?.services);
    }
    setsubLoading(false);
  }; 
  const {currentState, setCurrentState} = useContext(RouteContext);
  console.log(currentState);
  const [isLoading, setisLoading] = useState(false);

  const handleAddRemove = async (arr: any[], action: string, item: any) => {
    try {
      // {services: arr, action: 'add'}
      setisLoading(true);
      const res = await completeProfile({services: arr, action: action});
      if (res?.status === 200 || res?.status === 201) {
        ToastShort('Service added');
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
    } finally {
      const initGetProviderNew = async () => {
        const res: any = await getProviderNew(userData?._id);
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addProfileData(res?.data?.profile));
        }
      };
      initGetProviderNew();
      setisLoading(false);

      if (action === 'remove') {
        dispatch(removeCategory(item));
      }
      if (action === 'add') {
        dispatch(addCategory(item));
      }
    }
  };
  const handleProfileSetup = async () => {
    console.log(categoryId);
    setisLoading(true);
    if (categoryId) {
      const res = await completeProfile({services: categoryId, action: 'add'});
      console.error('RESULT', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        dispatch(addprovider_id(res?.data?.profile?.id));
        // navigation.navigate('ProfileStep2');
        // setCurrentState('2');
        navigation.navigate('ProfileStep21');
        // setCurrentState('21');
        dispatch(addformStage(21));
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
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  const handleNext = async () => {
    if (category?.length < 1) {
      ToastShort('No changes Made!.');
      navigation.navigate('ProfileStep211');
      return;
    }
    console.log(categoryId);
    await handleProfileSetup();
  };
  useEffect(() => {
    const initGetProviderNew = async () => {
      const res: any = await getProviderNew(userData?._id);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
      }
    };
    initGetProviderNew();
  }, []);
  console.log('PROFILE:', ProviderData?.services);
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
        func={() => {
          navigation.navigate('Index');
        }}
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
              marginBottom: 5,
              color: colors.black,
            }}
          />
          <View style={[tw``, {marginBottom: 30}]}>
            <Textcomp
              text={'You can add multiple services'}
              size={12}
              lineHeight={17}
              color={'#000000'}
              fontFamily={'Inter-Regular'}
            />
          </View>

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
                                onPress={async () => {
                                  if (
                                    Array.isArray(category) &&
                                    category.length &&
                                    category.some(
                                      catItem => catItem.name === item.name,
                                    )
                                  ) {
                                    await handleAddRemove(
                                      [item._id ?? item.id],
                                      'remove',
                                      item,
                                    );
                                    // dispatch(removeCategory(item));
                                  } else {
                                    // dispatch(addCategory(item));
                                    await handleAddRemove(
                                      [item._id ?? item.id],
                                      'add',
                                      item,
                                    );
                                  }
                                  setCollapseState2(false);
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
                                      : ProviderData?.services.some(
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

        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
          {ProviderData?.services?.length > 0
            ? ProviderData?.services?.map((item: any, index: any) => {
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
                      onPress={async () => {
                        // dispatch(removeCategory(item));
                        await handleAddRemove(
                          [item._id ?? item.id],
                          'remove',
                          item,
                        );

                        //  dispatch(addCategory(item));
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

        <View style={[{marginLeft: 'auto', marginTop: 25, paddingRight: 20}]}>
          <Button
            onClick={() => {
              handleNext();
            }}
            style={[
              tw`mx-auto mt-3`,
              {width: SIZES.width * 0.3, backgroundColor: colors.lightBlack},
            ]}
            textStyle={{color: colors.primary}}
            text={'Next'}
          />
        </View>
        <View style={tw`h-40`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </SafeAreaView>
  );
};

export default PRofileStep11;
