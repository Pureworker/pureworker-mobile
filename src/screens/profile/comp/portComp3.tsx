import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../constants/navigation';
import TextWrapper from '../../../components/TextWrapper';
import commonStyle from '../../../constants/commonStyle';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {WIDTH_WINDOW, generalStyles} from '../../../constants/generalStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  addcompleteProfile,
  addformStage,
  addportfolio,
} from '../../../store/reducer/mainSlice';
import {ToastLong, ToastShort} from '../../../utils/utils';
import Textcomp from '../../../components/Textcomp';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import images from '../../../constants/images';
import SubPortComp from './subComp';
import {Formik, FieldArray, Field, useFormikContext} from 'formik';
import * as yup from 'yup';
import {addPortfolio} from '../../../utils/api/func';
import PlusIcon from '../../../assets/svg/PlusIcon';
import AddCircle from '../../../assets/svg/AddCircle';

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
  // const category = useSelector((state: any) => state.user.pickedServices);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const handleProfileSetup = async passedData => {
    console.log(passedData);

    const minPrice = Number(passedData?.servicePriceMin);
    const maxPrice = Number(passedData?.servicePriceMax);

    if (minPrice < 500) {
      ToastShort('Min Price cannot be less than 500 naira.');
      return;
    }
    if (maxPrice < minPrice) {
      ToastShort('Max Price must be greater than Min Price.');
      return;
    }
    if (!passedData?.serviceDescription || passedData?.serviceDescription?.length < 1) {
      ToastShort('Service Description cannot be empty.');
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
  const sampleData = {
    service: service?.id,
    description: description,
    maxPrice: 2000,
    minPrice: 1000,
    portfolio: [
      {
        description: 'I know my craft very well.',
        images: [
          'https://res.cloudinary.com/dr0pef3mn/image/upload/v1693319953/pure/1693319950720-pure%20worker%20logo.png.png',
        ],
      },
      {
        description: 'I know my craft very well. I am good at it.',
        images: [
          'https://res.cloudinary.com/dr0pef3mn/image/upload/v1693319953/pure/1693319950720-pure%20worker%20logo.png.png',
        ],
      },
    ],
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
  const handleServiceChange = (item: any) => {
    // Update the selected service state
    // setSelectedService(item.value);
    console.log('settttt', item);
  };
  const handleRemovePortfolio = () => {
    // Remove the selected portfolio item from the state
    const updatedPortfolioData = [...portfolioData];
    updatedPortfolioData.splice(lindex, 1);
    handlePortfolioItemChange(lindex, updatedPortfolioData[lindex]);
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
            {/* <ScrollView horizontal style={{width: '100%'}}>
              <>
                <View
                  style={{
                    zIndex: 1,
                    height: 60,
                  }}>
                  <View style={tw``}>
                    <DropDownPicker
                      open={false}
                      value={service}
                      items={serviceList}
                      disabled={false}
                      // items={tempdata}
                      setOpen={setdropdownOpen}
                      setValue={setservice_}
                      setItems={setserviceList}
                      showArrowIcon={false}
                      zIndex={10}
                      maxHeight={200}
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
                      placeholder={service?.name}
                      placeholderStyle={{
                        fontFamily: commonStyle.fontFamily.regular,
                        fontSize: 14,
                        color: '#FFFFFF',
                      }}
                      style={{
                        backgroundColor: colors.lightBlack,
                        borderColor: colors.primary,
                        borderWidth: 2,
                        width: WIDTH_WINDOW * 0.85,
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
                  </View>
                </View>
              </>
            </ScrollView> */}
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
                    Price Range 
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

            {/* {portfolioCount?.map((item, index) => {
              return (
                <SubPortComp
                  // key={index}
                  // lindex={index}
                  // dlist={serviceList}
                  // portfolioData={[]}
                  // handlePortfolioItemChange={(i: any, data: any) =>
                  //   handlePortfolioItemChange(index, data)
                  // }
                  key={index}
                  lindex={index}
                  portfolioData={portfolioData}
                  handlePortfolioItemChange={handlePortfolioItemChange}
                />
              );
            })} */}

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

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Image,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigation} from '../../../constants/navigation';
// import TextWrapper from '../../../components/TextWrapper';
// import commonStyle from '../../../constants/commonStyle';
// import tw from 'twrnc';
// import colors from '../../../constants/colors';
// import {useDispatch, useSelector} from 'react-redux';
// import {WIDTH_WINDOW, generalStyles} from '../../../constants/generalStyles';
// import DropDownPicker from 'react-native-dropdown-picker';
// import Snackbar from 'react-native-snackbar';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {addcompleteProfile} from '../../../store/reducer/mainSlice';
// import {ToastShort} from '../../../utils/utils';
// import Textcomp from '../../../components/Textcomp';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import images from '../../../constants/images';
// import SubPortComp from './subComp';
// import {Formik, FieldArray, Field, useFormikContext} from 'formik';
// import * as yup from 'yup';

// const validationSchema = yup.object().shape({
//   serviceDescription: yup.string().required('Service description is required'),
//   servicePriceMin: yup.number().required('Service Price min is required '),
//   servicePriceMax: yup.number().required('Service Price max is required '),
//   portfolios: yup.array(),
//   // Add other validation as needed
//   // ...
// });
// const initialValues = {
//   serviceDescription: '',
//   servicePriceMin: '',
//   servicePriceMax: '',
//   portfolios: [
//     {
//       description: '',
//       images: [],
//     },
//   ],
// };

// const PortComp = ({dlist, lindex, portfolioData, close, service}: any) => {
//   const navigation = useNavigation<StackNavigation>();
//   const dispatch = useDispatch();

//   const handleProfileSetup = () => {
//     // Handle profile setup logic using formik values
//   };

//   const handleAddButtonClick = arrayHelpers => {
//     arrayHelpers.push({
//       description: '',
//       images: [],
//     });
//   };

//   return (
// <Formik
//   initialValues={initialValues}
//   validationSchema={validationSchema}
//   onSubmit={handleProfileSetup}>
//   {({values, handleChange, handleBlur, handleSubmit, setFieldValue}) => (
//         <KeyboardAwareScrollView
//           contentContainerStyle={{}}
//           style={{}}
//           extraScrollHeight={Platform.OS === 'ios' ? 30 : 0}
//           enableOnAndroid={true}>
//           {/* Your existing components here */}
//           <View>
//             <DropDownPicker
//               open={false}
//               value={service?.name}
//               items={[]}
//               disabled={true}
//               // items={tempdata}
//               showArrowIcon={false}
//               zIndex={10}
//               maxHeight={200}
//               dropDownContainerStyle={{
//                 borderWidth: 0,
//               }}
//               labelStyle={{
//                 fontFamily: commonStyle.fontFamily.regular,
//                 fontSize: 14,
//                 color: colors.white,
//               }}
//               arrowIconStyle={
//                 {
//                   // backgroundColor: 'red'
//                 }
//               }
//               placeholder="Select the service the portfolio is for?"
//               placeholderStyle={{
//                 fontFamily: commonStyle.fontFamily.regular,
//                 fontSize: 14,
//                 color: '#9E9E9E',
//               }}
//               style={{
//                 backgroundColor: colors.lightBlack,
//                 borderColor: colors.primary,
//                 borderWidth: 2,
//                 width: WIDTH_WINDOW * 0.85,
//               }}
//               listMode="FLATLIST"
//               showTickIcon={false}
//               textStyle={{
//                 color: colors.white,
//               }}
//               listParentLabelStyle={{
//                 color: '#000',
//                 fontSize: 16,
//                 fontFamily: commonStyle.fontFamily.regular,
//               }}
//               listItemContainerStyle={{
//                 backgroundColor: '#F1F1F1',
//                 borderColor: 'red',
//                 opacity: 1,
//                 borderWidth: 0,
//               }}
//               // onChangeItem={item => setFieldValue('service', item.value)}
//             />
//           </View>
//           <View>
//             <TextInput
//               // ... other TextInput props
//               value={values.serviceDescription}
//               onChangeText={handleChange('serviceDescription')}
//               onBlur={handleBlur('serviceDescription')}
//             />
//           </View>
//           <View>
//             <View style={[generalStyles.rowCenter]}>
//               <TextInput
//                 // ... other TextInput props
//                 value={values.servicePriceMin}
//                 onChangeText={handleChange('servicePriceMin')}
//                 onBlur={handleBlur('servicePriceMin')}
//               />
//               <TextWrapper
//                 fontType={'semiBold'}
//                 style={{
//                   fontSize: 12,
//                   color: colors.black,
//                   marginHorizontal: 10,
//                 }}>
//                 to
//               </TextWrapper>
//               <TextInput
//                 // ... other TextInput props
//                 value={values.servicePriceMax}
//                 onChangeText={handleChange('servicePriceMax')}
//                 onBlur={handleBlur('servicePriceMax')}
//               />
//             </View>
//           </View>

// <FieldArray name="portfolios">
//   {({push, remove}) => (
//     <ScrollView horizontal style={{width: '100%'}}>
//       {values.portfolios.map((_, index) => (
//         <SubPortComp
//           key={index}
//           lindex={index}
//           portfolioData={portfolioData}
//           handlePortfolioItemChange={(i, data) => {
//             setFieldValue(`portfolios[${index}]`, data);
//           }}
//         />
//       ))}
//       <TouchableOpacity
//         onPress={() => {
//           push({
//             description: '',
//             images: [],
//           });
//         }}
//         style={[
//           tw`flex flex-row ml-auto px-4 items-center  py-4 rounded-lg  mt-4`,
//         ]}>
//         <Image
//           source={images.cross}
//           style={{
//             width: 25,
//             height: 25,
//             marginRight: 10,
//             tintColor: colors.darkPurple,
//           }}
//         />
//         <Textcomp
//           text={'Add Portfolio'}
//           size={16}
//           lineHeight={16}
//           color={colors.darkPurple}
//           fontFamily={'Inter-Bold'}
//         />
//       </TouchableOpacity>
//     </ScrollView>
//   )}
// </FieldArray>

//           <TouchableOpacity
//             onPress={() => handleSubmit()}
//             style={[
//               tw` w-3/4 items-center mb-30 py-4 mx-auto rounded-lg bg-[${colors.darkPurple}] mt-4`,
//             ]}>
//             <Textcomp
//               text={'Add'}
//               size={16}
//               lineHeight={16}
//               color={'#FFFFFF'}
//               fontFamily={'Inter-Bold'}
//             />
//           </TouchableOpacity>
//         </KeyboardAwareScrollView>
//   )}
// </Formik>
//   );
// };

// export default PortComp;
