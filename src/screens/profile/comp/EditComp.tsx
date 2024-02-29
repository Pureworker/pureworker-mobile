import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
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
import {addPortfolio} from '../../../utils/api/func';
import AddCircle from '../../../assets/svg/AddCircle';
import SubPortComp2 from './subComp2';

const validationSchema = yup.object().shape({
  serviceDescription: yup.string().required('Service description is required'),
  servicePriceMin: yup.number().required('Service Price min is required '),
  servicePriceMax: yup.number().required('Service Price max is required '),
  portfolios: yup.array(),
});

export default function EditComp({
  dlist,
  lindex,
  portfolioData,
  close,
  service,
}: any) {
  const foundPortfolio = portfolioData?.filter(
    item => item?.service === service?._id,
  );
  console.log('hhhh:', foundPortfolio, service);
  const [service_, setservice_] = useState(null);
  const navigation = useNavigation<StackNavigation>();
  // const category = useSelector((state: any) => state.user.pickedServices);
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
      id: foundPortfolio?.[0]?._id,
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
      ToastLong('Edited successfully!.');
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
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const initialValues = {
    serviceDescription:
      foundPortfolio?.length > 0 ? foundPortfolio?.[0]?.description : '',
    servicePriceMin: ` ${Number(foundPortfolio?.[0]?.minPrice)} ` || '',
    servicePriceMax:
      foundPortfolio?.length > 0
        ? `${Number(foundPortfolio?.[0]?.maxPrice)}`
        : '',
    portfolios: foundPortfolio?.[0]?.portfolio || [],
  };

  console.log('kkk:', initialValues);
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
  useEffect(() => {}, []);

  //   useEffect(() => {
  //     if (initialValues?.portfolios.length > 0) {
  //       setValues({...values, portfolios: initialValues?.portfolios});
  //     }
  //   }, []);

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
                {`Service: ${service?.name}`}
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
                  }}
                  placeholderTextColor={colors.grey}
                  placeholder="Enter service description"
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
                    width: 125,
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
                    Price Range/hour
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
            {/* <FieldArray name="portfolios">
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
            </FieldArray> */}
            <FieldArray name="portfolios">
              {({push, remove}) => (
                <ScrollView
                  style={{width: '100%', paddingHorizontal: 4}}
                  showsVerticalScrollIndicator={false}>
                  {values.portfolios.map((portfolio, index) => (
                    <SubPortComp2
                      key={index}
                      remove={() => {
                        remove(index);
                        handlePortfolioItemChange(index, {
                          description: '',
                          images: [],
                        });
                      }}
                      lindex={index}
                      portfolioData={portfolio}
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
                        push({description: '', images: []});
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
                text={'Save'}
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
