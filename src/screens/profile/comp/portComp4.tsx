import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../constants/navigation';
import TextWrapper from '../../../components/TextWrapper';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {generalStyles} from '../../../constants/generalStyles';
import Snackbar from 'react-native-snackbar';
import {ToastLong, ToastShort} from '../../../utils/utils';
import Textcomp from '../../../components/Textcomp';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SubPortComp from './subComp';
import {Formik, FieldArray} from 'formik';
import * as yup from 'yup';
import {addPortfolio, getSubCategory} from '../../../utils/api/func';
import AddCircle from '../../../assets/svg/AddCircle';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import images from '../../../constants/images';

const validationSchema = yup.object().shape({
  serviceDescription: yup.string().required('Service description is required'),
  servicePriceMin: yup.number().required('Service Price min is required '),
  servicePriceMax: yup.number().required('Service Price max is required '),
  portfolios: yup.array(),
});

export default function PortComp({
  dlist,
  lindex,
  portfolioData,
  close,
  service,
}: any) {
  const [service_, setservice_] = useState(null);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const navigation = useNavigation<StackNavigation>();
  const [idNumber, setIdNumber] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const handleProfileSetup = async passedData => {
    console.log(passedData);

    if (Number(passedData?.servicePriceMin) < 500) {
      ToastShort('Min Price cannot be less than 500 naira.');
    }
    if (
      Number(passedData?.servicePriceMax) < Number(passedData?.servicePriceMin)
    ) {
      ToastShort('MaxPrice must be greater than MinPrice');
      return;
    }
    const prepData = {
      service: service?._id,
      description: passedData?.serviceDescription,
      maxPrice: passedData?.servicePriceMax,
      minPrice: passedData?.servicePriceMin,
      portfolio: passedData?.portfolios,
    };
    console.log('eff---', prepData, prepData?.portfolio);
    const res = await addPortfolio(prepData);
    console.error('RESULT', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      // navigation.navigate('ProfileStep3');
      // setCurrentState('3');
      // dispatch(addformStage(3));
      ToastLong('Added successfully!.');
      close();
    } else {
      ToastLong(
        `${
          res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured'
        }`,
      );
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
  };
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const initialValues = {
    serviceDescription: '',
    servicePriceMin: '',
    servicePriceMax: '',
    portfolios: [],
  };
  const [serviceList, setserviceList] = useState(dlist);

  const [_portfolioData, setPortfolioData] = useState<
    Array<{description: string; pictures: Array<string>}>
  >([]);

  const handlePortfolioItemChange = (
    index: number,
    data: {description: string; pictures: Array<string>},
  ) => {
    const newData = [..._portfolioData];
    newData[index] = data;
    setPortfolioData(newData);
  };
  useEffect(() => {
    setserviceList(dlist);
  }, [dlist]);
  const [pictures, setpictures] = useState([]);
  const options = {mediaType: 'photo', selectionLimit: 3};
  const UpdateValue = (field: string | number, data: any) => {
    const olddate = newData;
    if (olddate.service === '' || olddate.service?.length < 1) {
      if (service_ !== null && service_ !== '') {
        olddate.service = service_;
      } else {
        ToastShort('Please pick service');
        return;
      }
    }
    olddate[field] = data;
    handlePortfolioItemChange(lindex, olddate);
    console.log('olddate-now', olddate);
  };
  const [isValid, setIsValid] = useState<Array<boolean>>([true]);
  const [portfolioCount, setportfolioCount]: any[] = useState([]);

  const handleAddButtonClick = () => {
    // Check if all SubPortComp are valid before adding a new one
    const allValid = isValid.every(valid => valid);
    if (allValid) {
      // Add a new SubPortComp only if all existing ones are valid
      setPortfolioData([...portfolioData, {description: '', pictures: []}]);
      setIsValid([...isValid, true]);
    } else {
      // Show an error message or handle it as per your requirement
      console.error('Some SubPortComp are incomplete');
    }
  };
  const [collapseState, setCollapseState] = useState(false);
  const [collapseState2, setCollapseState2] = useState(false);
  const [selectCategory, setselectCategory] = useState('');
  const [subCategory, setsubCategory] = useState([]);
  const [subLoading, setsubLoading] = useState(false);

  const _getCategory = useSelector((state: any) => state.user.category);
  const getCategory = _getCategory;

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
    // setisLoading(false);
  };

  const [serviceObj, setserviceObj] = useState({});

  return (
    <View style={[tw` `, {marginTop: 30}]}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // onSubmit={handleProfileSetup}
        onSubmit={values => handleProfileSetup(values)}>
        {({values, handleChange, handleBlur, handleSubmit, setFieldValue}) => (
          <KeyboardAwareScrollView
            contentContainerStyle={{}}
            style={{}}
            extraScrollHeight={Platform.OS === 'ios' ? 30 : 0} // Adjust as needed
            enableOnAndroid={true}>
            <>
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
                          {serviceObj ? serviceObj?.name : 'Select Services'}
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
                        <ActivityIndicator
                          size={'large'}
                          color={colors.primary}
                        />
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
                              {_getSubCategory?.map(
                                (item: any, index: number) => {
                                  var offerStyle;
                                  if (index > 0) {
                                    offerStyle = {marginBottom: 25};
                                  }
                                  return (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() => {
                                        setserviceObj(item);
                                        setCollapseState2(false);
                                        console.log(serviceObj, item);
                                      }}
                                      style={{marginTop: 8}}>
                                      <TextWrapper
                                        fontType={'semiBold'}
                                        style={{
                                          // color: category.some(
                                          //   (catItem: {name: any}) =>
                                          //     catItem.name === item.name,
                                          // )
                                          //   ? colors.primary
                                          //   : colors.white,
                                          color: colors.white,
                                          marginLeft: 11,
                                          marginRight: 8,
                                          marginBottom: 8,
                                        }}>
                                        {item?.name}
                                      </TextWrapper>
                                    </TouchableOpacity>
                                  );
                                },
                              )}
                            </View>
                          )}
                        </>
                      )}
                    </CollapseBody>
                  </Collapse>
                )}
              </View>
            </>

            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'center',
                backgroundColor: colors.lightBlack,
                height: 50,
                width: '60%',
                borderRadius: 5,
                borderWidth: 2,
                borderColor: colors.primary,
              }}>
              <TextWrapper
                fontType={'semiBold'}
                style={{
                  fontSize: 12,
                  color: colors.grey,
                }}>
                {`Service: ${serviceObj?.name}`}
              </TextWrapper>
            </View>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: 13,
                  marginTop: 20,
                }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    backgroundColor: colors.lightBlack,
                    height: 50,
                    width: 120,
                    borderRadius: 5,
                  }}>
                  <TextWrapper
                    // numberOfLines={1}
                    fontType={'semiBold'}
                    style={{
                      fontSize: 12,
                      color: '#fff',
                    }}>
                    {/* {service?.name} */}
                    Description
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
                    fontSize: 12,
                  }}
                  placeholderTextColor={colors.grey}
                  placeholder="Describe your proficiency in the service"
                  value={values.serviceDescription}
                  onChangeText={handleChange('serviceDescription')}
                  // setFieldValue('service', item.value)
                />
              </View>
            </>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: 13,
                }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    backgroundColor: colors.lightBlack,
                    height: 50,
                    width: 110,
                    borderRadius: 5,
                  }}>
                  <TextWrapper
                    // numberOfLines={1}
                    fontType={'semiBold'}
                    style={{
                      fontSize: 12,
                      color: '#fff',
                    }}>
                    {/* {service?.name} */}
                    Price Range / Hour
                  </TextWrapper>
                </View>
                <View style={[generalStyles.rowCenter]}>
                  <TextInput
                    style={{
                      width: 90,
                      paddingHorizontal: 10,
                      backgroundColor: colors.lightBlack,
                      borderRadius: 5,
                      color: '#fff',
                      height: Platform.OS === 'ios' ? 50 : 50,
                    }}
                    placeholderTextColor={colors.white}
                    placeholder="₦"
                    keyboardType="number-pad"
                    value={values.servicePriceMin}
                    onChangeText={handleChange('servicePriceMin')}
                  />
                  <TextWrapper
                    fontType={'semiBold'}
                    style={{
                      fontSize: 12,
                      color: colors.black,
                      marginHorizontal: 7.5,
                    }}>
                    to
                  </TextWrapper>
                  <TextInput
                    style={{
                      width: 90,
                      paddingHorizontal: 10,
                      backgroundColor: colors.lightBlack,
                      borderRadius: 5,
                      color: '#fff',
                      height: Platform.OS === 'ios' ? 50 : 50,
                    }}
                    placeholderTextColor={colors.white}
                    placeholder="₦"
                    keyboardType="number-pad"
                    value={values.servicePriceMax}
                    onChangeText={handleChange('servicePriceMax')}
                  />
                </View>
              </View>
            </>
            <View style={[tw`border-b`, {borderWidth: 2}]} />

            <View style={[tw`mt-4`, {}]}>
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'Add Portfolio (Optional)'}
                  size={18}
                  lineHeight={20}
                  color={colors.black}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={[tw`mt-2`, {}]}>
                <Textcomp
                  text={
                    'You can add portfolios (max of 3) to showcase previous work.'
                  }
                  size={12}
                  lineHeight={16}
                  color={colors.black}
                  fontFamily={'Inter-Regular'}
                />
              </View>
            </View>
            <FieldArray name="portfolios">
              {({push, remove}) => (
                <ScrollView
                  style={{width: '100%', paddingHorizontal: 4}}
                  showsVerticalScrollIndicator={false}>
                  {values.portfolios.map((_, index) => (
                    <SubPortComp
                      key={index}
                      remove={remove}
                      lindex={index}
                      portfolioData={portfolioData}
                      handlePortfolioItemChange={(i, data) => {
                        setFieldValue(`portfolios[${index}]`, data);
                      }}
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => {
                      if (values.portfolios?.length >= 3) {
                        ToastShort('Maximum portfolio');
                      } else {
                        push({
                          description: '',
                          images: [],
                        });
                      }
                    }}
                    style={[
                      tw`flex flex-row ml-auto px-4 items-center  py-4 rounded-lg  mt-4`,
                    ]}>
                    <AddCircle style={{marginRight: 4}} />
                    <Textcomp
                      text={'Add Portfolio'}
                      size={16}
                      lineHeight={16}
                      color={colors.parpal}
                      fontFamily={'Inter-Bold'}
                    />
                  </TouchableOpacity>
                </ScrollView>
              )}
            </FieldArray>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
              style={[
                tw` w-6/10 items-center mb-30 py-4 mx-auto rounded-lg bg-[${colors.darkPurple}] mt-4`,
              ]}>
              <Textcomp
                text={'Add'}
                size={16}
                lineHeight={16}
                color={'#FFFFFF'}
                fontFamily={'Inter-Bold'}
              />
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </View>
  );
}
