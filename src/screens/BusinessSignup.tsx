import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';
import tw from 'twrnc';
import commonStyle from '../constants/commonStyle';
import Button from '../components/Button';
import MyStatusBar from '../components/MyStatusBar';
import colors from '../constants/colors';
import TextInputs from '../components/TextInputs';
import Snackbar from 'react-native-snackbar';
import {allCountry, allState, validateEmail} from '../constants/utils';
import {BUSINESS, CUSTOMER, FREELANCER} from '../constants/userType';
import {StackNavigation} from '../constants/navigation';
import {generalStyles} from '../constants/generalStyles';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Signup} from '../utils/api/auth';
import {ToastLong, isValidPhoneNumber} from '../utils/utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SIZES, perHeight} from '../utils/position/sizes';
import {Dropdown} from 'react-native-element-dropdown';
import * as Yup from 'yup';
import Textcomp from '../components/Textcomp';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {DateTime} from 'luxon';
import {isLeapYear, validateDate} from '../utils/auth';
export default function BusinessSignup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cacNo, setCacNo] = useState('');
  // const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('FREELANCER');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [date, setDate] = useState(new Date());

  const [birthDate, setBirthDate] = useState({
    day: undefined,
    month: undefined,
    year: undefined,
  });

  const [birthDateError, setBirthDateError] = useState({
    day: null,
    month: null,
    year: null,
  });

  const handleBirthDate = (key: string, value: number) => {
    const newDate = new Date();

    if (typeof value !== 'number' || (!(value === 0) && !(value > 0))) {
      return ToastLong(
        'Invalid value, kindly input a valid number for day, month and year',
      );
    }

    if (key === 'day' && value.toString().length === 2) {
      if (
        value > 31 ||
        (birthDate.month === 1 && value > 29 && !isLeapYear(birthDate.year)) ||
        ((birthDate.month === 3 ||
          birthDate.month === 5 ||
          birthDate.month === 8 ||
          birthDate.month === 10) &&
          value > 30)
      ) {
        return ToastLong('Invalid day given');
      }

      if (birthDate.month === undefined || birthDate.year === undefined) {
        return ToastLong('Fill in the year and month first');
      }
    }

    if (key === 'month' && value.toString().length === 2) {
      if (value > 12) {
        return ToastLong('Invalid month given');
      }

      if (birthDate.year === undefined) {
        return ToastLong('Fill in the year first');
      }
    }

    // const concatYearValue = `${birthDate.year}`.concat(value.toString());

    // console.log(concatYearValue, '   concat', value);

    if (key === 'year' && value.toString().length === 4) {
      if (value > newDate.getFullYear() || value < 1600) {
        return ToastLong('Invalid year given');
      }
    }

    const newBirthDateObj = {
      ...birthDate,
      [key]: value,
    };

    setBirthDate(newBirthDateObj);
  };

  const setDateTime = (dateTime: any) => {
    setDate(dateTime);
  };
  const [locationItems, setLocationItems] = useState([
    {label: 'Online (your business renders services online)', value: 'Online'},
    {
      label:
        'Offline (your business renders services at the customer’s location)',
      value: 'Offline',
    },
    {label: 'Hybrid', value: 'Hybrid'},
  ]);
  const [genderOpen, setGenderOpen] = useState(false);

  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Choose not to answer', value: 'Choose not to answer'},
  ]);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  // const [nationalityValue, setNationalityValue] = useState(null);
  // const [nationalityItems, setNationalityItems] = useState<any>([]);
  // const [signup, { isLoading }] = useSignupMutation();
  const [toolTipLeftVisible, setToolTipLeftVisible] = useState(false);
  const [toolTipRightVisible, setToolTipRightVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [stateValue, setStateValue] = useState('');

  const navigation = useNavigation<StackNavigation>();
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().when('accountType', {
      is: 'business',
      then: Yup.string(),
      otherwise: Yup.string().required('First Name is required'),
    }),
    lastName: Yup.string().when('accountType', {
      is: 'business',
      then: Yup.string(),
      otherwise: Yup.string().required('Last Name is required'),
    }),
    phoneNumber: Yup.string().length(11).required('Phone Number is required'),
    dob: Yup.date().when('accountType', {
      is: 'freelancer',
      then: Yup.date().required('Date of Birth is required').nullable(),
      otherwise: Yup.date(),
    }),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    // gender: Yup.string().when('accountType', {
    //   is: 'business',
    //   then: Yup.string(),
    //   otherwise: Yup.string()
    //     .oneOf(['female', 'male', 'other'], 'Invalid gender')
    //     .required('Gender is required'),
    // }),
    // nationality: Yup.string().required('Nationality is required'),
    // address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    accountType: Yup.string()
      .required('Account Type is required')
      .oneOf(['freelancer', 'business', 'support', 'customer']),
    referralCode: Yup.string().optional(),
    businessName: Yup.string().when('accountType', {
      is: 'business',
      then: Yup.string().required('Business Name is required'),
      otherwise: Yup.string().notRequired(),
    }),
    cacNo: Yup.string().when('accountType', {
      is: 'business',
      then: Yup.string().required('CAC Number is required'),
      otherwise: Yup.string().notRequired(),
    }),
    location: Yup.string().oneOf(['online', 'offline', 'hybrid']).optional(),
  });

  const handleSignup = async () => {
    let dateErrorMessage = '';
    // Validate input data
    // await validationSchema.validate(
    //   {
    //     firstName,
    //     lastName,
    //     phoneNumber: phoneName,
    //     dob: date,
    //     email,
    //     gender: genderValue,
    //     nationality: nationalityValue,
    //     address,
    //     state: stateValue,
    //     accountType: userType,
    //     referralCode,
    //     businessName: name,
    //     cacNo,
    //     location: locationValue,
    //   },
    //   {abortEarly: false}, // Collect all validation errors, not just the first one
    // );

    Object.keys(birthDate).map(key => {
      const res = validateDate(
        key,
        birthDate[key as keyof typeof birthDate],
        birthDate,
      );

      if (!res.isSuccess) {
        dateErrorMessage = res.message;
      }
    });

    if (userType === FREELANCER && dateErrorMessage.length > 0) {
      Snackbar.show({
        text: dateErrorMessage,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }

    const combined = Object.values(birthDate).reverse().join('-');
    const finalBirthDate = new Date(combined);

    if (!email) {
      Snackbar.show({
        text: 'Please enter your email address',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }
    if (userType === FREELANCER && !firstName) {
      Snackbar.show({
        text: 'Please enter your firstName',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }
    if (userType !== FREELANCER && !cacNo) {
      Snackbar.show({
        text: 'Please enter your cac No',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }
    if (userType !== FREELANCER && !name) {
      Snackbar.show({
        text: 'Please enter your Business Name',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }
    if (userType === FREELANCER && !lastName) {
      Snackbar.show({
        text: 'Please enter your lastName',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      return;
    }

    if (email && phoneName) {
      if (!validateEmail(email)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      } else if (!isValidPhoneNumber(phoneName)) {
        Snackbar.show({
          text: 'Please enter a valid phone number',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setisLoading(false);
        return;
      } else {
        setisLoading(true);
        const loginData: any = {
          email: email.toLowerCase().trim(),
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneName,
          // address: address,
          businessName: name,
          cacNo: cacNo,
          location: locationValue?.toLowerCase(),
          dob: finalBirthDate,
          // userType: userType.toLowerCase(),
          // nationality: nationalityValue,
          // gender: genderValue?.toLowerCase().trim(),
          accountType: userType?.toLowerCase(),
          state: stateValue,
        };
        const fl_data: any = {
          email: email.toLowerCase().trim(),
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneName,
          dob: finalBirthDate,
          // gender: genderValue?.toLowerCase().trim(),
          // nationality: nationalityValue,
          // address: address,
          // userType: userType.toLowerCase(),
          accountType: userType?.toLowerCase(),
          state: stateValue,
        };
        const b_data = {
          businessName: name,
          cacNo: cacNo,
          location: locationValue?.toLowerCase(),
          // address: address,
          phoneNumber: phoneName,
          email: email.toLowerCase().trim(),
          accountType: userType?.toLowerCase(),
          // gender: genderValue?.toLowerCase().trim(),
          state: stateValue,
          // nationality: nationalityValue,
        };

        if (referralCode && referralCode?.length > 2) {
          loginData.referralCode = referralCode;
          fl_data.referralCode = referralCode;
        }

        const res: any = await Signup(
          userType === CUSTOMER
            ? fl_data
            : userType === FREELANCER
            ? fl_data
            : b_data,
        );

        if (
          res?.status === 200 ||
          res?.status === 201 ||
          res?.data?.success === true
        ) {
          navigation.navigate('TokenVerification', {
            email: email,
            type: 'signup',
          });
        } else {
          console.log('ERR', res?.error?.error?.data);
          setisLoading(false);
          Snackbar.show({
            text:
              res?.error?.message === 'Validation error' ||
              res?.error?.message === 'Invalid Input Data. '
                ? res?.error?.error?.data?.[0]
                : res?.error?.message
                ? res?.error?.message
                : res?.error?.data?.message
                ? res?.error?.data?.message
                : 'Oops!, an error occured',
          });
        }
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
  };

  useEffect(() => {
    // setNationalityItems([...allCountry]);
  }, []);
  const [referralCode, setReferralCode] = useState('');

  //
  const [schdeuleIsoDate, setschdeuleIsoDate] = useState('');
  const [displayDate, setdisplayDate] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date: any) => {
    // console.log(date);
    const f = `${date}`;
    const jsDate = new Date(f);
    console.log('pppickked:', jsDate);
    setDateTime(jsDate);
    const luxonDateTime = DateTime.fromJSDate(jsDate);
    const isoString = luxonDateTime.toISO();
    console.log(isoString);
    setschdeuleIsoDate(isoString);
    setdisplayDate(f);
    hideDatePicker();
  };
  function formatToCustomString(date: string | number | Date) {
    const jsDate = new Date(date);
    const luxonDateTime = DateTime.fromJSDate(jsDate);

    console.log('picked:', jsDate);

    return luxonDateTime.toLocaleString({
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        backgroundColor: '#000',
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={images.cross}
          style={{
            height: 20,
            width: 20,
            marginLeft: 25,
            marginBottom: 10,
            marginTop: StatusBar.currentHeight && StatusBar.currentHeight + 45,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        contentContainerStyle={{}}
        style={{flex: 1, backgroundColor: '#000'}}
        extraScrollHeight={Platform.OS === 'ios' ? 30 : 0} // Adjust as needed
        enableOnAndroid={true}>
        <MyStatusBar
          translucent
          barStyle="light-content"
          backgroundColor="#000"
        />

        <View style={{flex: 1}}>
          <View style={{marginHorizontal: 50}}>
            <Text
              style={{
                fontSize: 32,
                fontFamily: commonStyle.fontFamily.bold,
                color: '#fff',
                marginTop: 10,
                marginLeft: 25,
              }}>
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#fff',
                marginTop: 5,
                marginLeft: 25,
              }}>
              Create a free account as a Freelancer or Business
            </Text>
          </View>
          <View
            style={[
              generalStyles.rowBetween,
              {marginHorizontal: 25, marginTop: 45},
            ]}>
            <Tooltip
              isVisible={toolTipLeftVisible}
              content={
                <View style={{}}>
                  <Text style={{color: '#000'}}>
                    Individuals offering services
                  </Text>
                </View>
              }
              contentStyle={{
                marginLeft: -8,
                marginTop: 1,
                width: 200,
                height: 'auto',
              }}
              arrowSize={{
                height: 30,
                width: 30,
              }}
              placement="top"
              topAdjustment={-33}
              horizontalAdjustment={0}
              tooltipStyle={{
                position: 'absolute',
                left: 30,
              }}
              onClose={() => setToolTipLeftVisible(false)}
              useInteractionManager={true} // need this prop to wait for react navigation
              // below is for the status bar of react navigation bar
              // topAdjustment={Platform.OS === 'android' ? StatusBar.currentHeight : 0}
            >
              <TouchableOpacity onPress={() => setToolTipLeftVisible(true)}>
                <Image source={images.info} style={{width: 15, height: 15}} />
              </TouchableOpacity>
            </Tooltip>

            <Tooltip
              isVisible={toolTipRightVisible}
              content={
                <View style={{}}>
                  <Text style={{color: '#000'}}>
                    Companies or organization providing services
                  </Text>
                </View>
              }
              contentStyle={{
                marginLeft: 8,
                marginTop: 1,
                width: 200,
                height: 'auto',
              }}
              arrowSize={{
                height: 30,
                width: 30,
              }}
              placement="top"
              topAdjustment={-33}
              horizontalAdjustment={0}
              tooltipStyle={{
                position: 'absolute',
                right: 30,
              }}
              onClose={() => setToolTipRightVisible(false)}
              useInteractionManager={true} // need this prop to wait for react navigation
              // below is for the status bar of react navigation bar
              // topAdjustment={Platform.OS === 'android' ? StatusBar.currentHeight : 0}
            >
              <TouchableOpacity onPress={() => setToolTipRightVisible(true)}>
                <Image source={images.info} style={{width: 15, height: 15}} />
              </TouchableOpacity>
            </Tooltip>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 30,
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            <Button
              text={'Freelancer'}
              onClick={() => {
                setUserType(FREELANCER);
              }}
              textStyle={{
                color: userType === FREELANCER ? colors.white : '#000',
                fontSize: 20,
              }}
              style={{
                flex: 1,
                borderRadius: 8,
                height: 45,
                backgroundColor:
                  userType === FREELANCER ? colors.parpal : colors.white,
              }}
            />
            <Button
              text={'Business'}
              onClick={() => {
                setUserType(BUSINESS);
              }}
              textStyle={{
                color: userType === BUSINESS ? colors.white : '#000',
                fontSize: 17,
                fontFamily: commonStyle.fontFamily.bold,
              }}
              style={{
                flex: 1,
                borderRadius: 8,
                height: 45,
                backgroundColor:
                  userType === BUSINESS ? colors.parpal : colors.white,
              }}
            />
          </View>

          {userType == BUSINESS ? (
            <View style={{marginHorizontal: 25}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 60,
                }}>
                Business Name
              </Text>
              <TextInputs
                style={{marginTop: 17}}
                labelText={'Enter Name'}
                state={name}
                setState={setName}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 15,
                }}>
                CAC Reg. No
              </Text>
              <TextInputs
                style={{marginTop: 17}}
                labelText={'Enter cac no'}
                state={cacNo}
                setState={setCacNo}
                keyBoardType={'numeric'}
              />
              {/* <View
                style={{
                  zIndex: 1,
                  // marginTop: 15,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  Location
                </Text>
                <DropDownPicker
                  open={locationOpen}
                  value={locationValue}
                  items={locationItems}
                  setOpen={setLocationOpen}
                  setValue={setLocationValue}
                  setItems={setLocationItems}
                  showArrowIcon={true}
                  ArrowDownIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={!locationOpen && images.polygonForward}
                    />
                  )}
                  ArrowUpIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={locationOpen && images.polygonDown}
                    />
                  )}
                  zIndex={10}
                  dropDownContainerStyle={{
                    borderWidth: 0,
                  }}
                  labelStyle={{
                    fontFamily: commonStyle.fontFamily.regular,
                    fontSize: 14,
                    color: '#000',
                  }}
                  // arrowIconStyle={{

                  // }}
                  placeholderStyle={{
                    fontFamily: commonStyle.fontFamily.regular,
                    fontSize: 14,
                    color: '#9E9E9E',
                  }}
                  style={{
                    backgroundColor: '#F7F5F5',
                    borderColor: '#9E9E9E14',
                  }}
                  listMode="FLATLIST"
                  showTickIcon={false}
                  textStyle={{
                    color: '#9E9E9E',
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
              </View> */}
              <View
                style={{
                  zIndex: genderOpen ? 0 : 2,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  Location
                </Text>
                <Dropdown
                  style={[
                    tw``,
                    {
                      zIndex: 10,
                      width: SIZES.width * 0.875,
                      backgroundColor: '#F7F5F5',
                      borderColor: '#9E9E9E14',
                      height: 50,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      color: '#757575',
                    },
                  ]}
                  // placeholderStyle={{
                  //   color: '#757575',
                  // }}
                  data={locationItems}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select service location'}
                  searchPlaceholder="Search..."
                  value={locationValue}
                  itemTextStyle={{
                    color: 'black',
                  }}
                  selectedTextStyle={{
                    color: '#000',
                  }}
                  inputSearchStyle={{
                    color: '#757575',
                  }}
                  placeholderStyle={{
                    color: '#757575',
                  }}
                  onChange={item => {
                    console.log(item.value);
                    setLocationValue(item.value);
                  }}
                />
              </View>
              <View
                style={{
                  zIndex: genderOpen ? 0 : 2,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  State
                </Text>
                <Dropdown
                  style={[
                    tw``,
                    {
                      zIndex: 10,
                      width: SIZES.width * 0.875,
                      backgroundColor: '#F7F5F5',
                      borderColor: '#9E9E9E14',
                      height: 50,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      color: '#757575',
                    },
                  ]}
                  data={allState}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select state'}
                  searchPlaceholder="Search..."
                  value={stateValue}
                  itemTextStyle={{
                    color: 'black',
                  }}
                  inputSearchStyle={{
                    color: '#757575',
                  }}
                  selectedTextStyle={{
                    color: '#000',
                  }}
                  placeholderStyle={{
                    color: '#757575',
                  }}
                  onChange={item => {
                    console.log(item.value);
                    setStateValue(item.value);
                  }}
                />
              </View>

              <View style={{zIndex: locationOpen ? 0 : 2}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Phone Number
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Phone'}
                  state={phoneName}
                  setState={setPhoneName}
                  maxLength={11}
                  keyBoardType={'number-pad'}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Business Email
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Email'}
                  state={email}
                  setState={setEmail}
                  keyBoardType={'email-address'}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Referral(optional)
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Referral Code'}
                  state={referralCode}
                  setState={setReferralCode}
                />
              </View>
            </View>
          ) : (
            <View style={{marginHorizontal: 25}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 60,
                }}>
                First Name
              </Text>
              <TextInputs
                style={{marginTop: 17}}
                labelText={'Enter First Name'}
                state={firstName}
                setState={setFirstName}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 15,
                }}>
                Last Name
              </Text>
              <TextInputs
                style={{marginTop: 17}}
                labelText={'Enter Last Name'}
                state={lastName}
                setState={setLastName}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 15,
                }}>
                Phone Number
              </Text>

              <TextInputs
                style={{marginTop: 17}}
                labelText={'Enter Phone'}
                state={phoneName}
                setState={setPhoneName}
                maxLength={11}
                keyBoardType={'number-pad'}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 15,
                }}>
                Date of Birth
              </Text>
              {/* <TouchableOpacity
                style={{
                  marginTop: 15,
                  marginBottom: 10,
                  backgroundColor: '#F7F5F5',
                  borderRadius: 5,
                  height: 50,
                  width: '100%',
                }}>
                <DateTimesPicker updateDate={setDateTime} />
              </TouchableOpacity> */}
              {/* <View
                style={{
                  zIndex: 1,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  Gender
                </Text>
                <DropDownPicker
                  open={genderOpen}
                  value={genderValue}
                  items={genderItems}
                  setOpen={setGenderOpen}
                  setValue={setGenderValue}
                  setItems={setGenderItems}
                  showArrowIcon={true}
                  ArrowDownIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={!genderOpen && images.polygonForward}
                    />
                  )}
                  ArrowUpIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={genderOpen && images.polygonDown}
                    />
                  )}
                  zIndex={10}
                  dropDownContainerStyle={{
                    borderWidth: 0,
                  }}
                  labelStyle={{
                    fontFamily: commonStyle.fontFamily.regular,
                    fontSize: 14,
                    color: '#000',
                  }}
                  // arrowIconStyle={{

                  // }}
                  placeholderStyle={{
                    fontFamily: commonStyle.fontFamily.regular,
                    fontSize: 14,
                    color: '#9E9E9E',
                  }}
                  style={{
                    backgroundColor: '#F7F5F5',
                    borderColor: '#9E9E9E14',
                  }}
                  listMode="FLATLIST"
                  showTickIcon={false}
                  textStyle={{
                    color: '#9E9E9E',
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
              </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  gap: 20,
                  marginTop: 10,
                }}>
                <TextInput
                  value={
                    birthDate.year !== undefined ? `${birthDate.year}` : ''
                  }
                  placeholder="YYYY"
                  placeholderTextColor={'black'}
                  maxLength={4}
                  style={{
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    height: 45,
                    width: 60,
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  inputMode="decimal"
                  onChangeText={e => handleBirthDate('year', Number(e))}
                />
                <TextInput
                  value={
                    birthDate.month !== undefined ? `${birthDate.month}` : ''
                  }
                  placeholder="MM"
                  placeholderTextColor={'black'}
                  style={{
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    height: 45,
                    width: 50,
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  inputMode="decimal"
                  onChangeText={e => handleBirthDate('month', Number(e))}
                />
                <TextInput
                  value={birthDate.day !== undefined ? `${birthDate.day}` : ''}
                  placeholder="DD"
                  placeholderTextColor={'black'}
                  style={{
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    height: 45,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  inputMode="decimal"
                  onChangeText={e => handleBirthDate('day', Number(e))}
                />
              </View>
              {/* <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              /> */}

              {/* <TouchableOpacity
                onPress={() => {
                  setDatePickerVisibility(!isDatePickerVisible);
                }}
                style={[
                  tw`w-full px-4 justify-center rounded-lg mt-3`,
                  {backgroundColor: colors.greyLight1, height: perHeight(40)},
                ]}>
                <Textcomp
                  text={`${
                    displayDate ? formatToCustomString(displayDate) : ''
                  }`}
                  size={14}
                  lineHeight={14}
                  color={'#000413'}
                  fontFamily={'Inter-Regular'}
                  style={{fontWeight: 300}}
                />
              </TouchableOpacity> */}
              <View
                style={{
                  zIndex: genderOpen ? 0 : 2,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  State of Residence
                </Text>
                <Dropdown
                  style={[
                    tw``,
                    {
                      zIndex: 10,
                      width: SIZES.width * 0.875,
                      backgroundColor: '#F7F5F5',
                      borderColor: '#9E9E9E14',
                      height: 50,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                    },
                  ]}
                  data={allState}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select state'}
                  searchPlaceholder="Search..."
                  value={stateValue}
                  itemTextStyle={{
                    color: 'black',
                  }}
                  inputSearchStyle={{
                    color: '#757575',
                  }}
                  selectedTextStyle={{
                    color: '#000',
                  }}
                  placeholderStyle={{
                    color: '#757575',
                  }}
                  onChange={item => {
                    console.log(item.value);
                    setStateValue(item.value);
                  }}
                />
              </View>
              {/* <View
                style={{
                  // zIndex: 1,
                  zIndex: genderOpen ? 0 : 2,
                  // marginTop: 15,
                  minHeight: 500,
                  marginBottom: -400,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                    marginBottom: 15,
                  }}>
                  Nationality
                </Text>
                <Dropdown
                  style={[
                    tw``,
                    {
                      zIndex: 10,
                      width: SIZES.width * 0.875,
                      backgroundColor: '#F7F5F5',
                      borderColor: '#9E9E9E14',
                      height: 50,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                    },
                  ]}
                  data={nationalityItems}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select item'}
                  searchPlaceholder="Search..."
                  value={nationalityValue}
                  itemTextStyle={{
                    color: 'black',
                  }}
                  onChange={item => {
                    console.log(item.value);
                    setNationalityValue(item.value);
                  }}
                />
              </View> */}

              <View style={{zIndex: nationalityOpen ? 0 : 2}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Email Address
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Email'}
                  state={email}
                  setState={setEmail}
                  keyBoardType={'email-address'}
                />
                {/* <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Address
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Address'}
                  state={address}
                  setState={setAddress}
                /> */}
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 15,
                  }}>
                  Referral(optional)
                </Text>
                <TextInputs
                  style={{marginTop: 17}}
                  labelText={'Enter Referral Code'}
                  state={referralCode}
                  setState={setReferralCode}
                />
              </View>
            </View>
          )}

          {!isLoading ? (
            <View style={{marginHorizontal: 25, marginTop: 75}}>
              <Button
                onClick={() => {
                  handleSignup();
                }}
                text={'Create Account'}
              />
            </View>
          ) : (
            <ActivityIndicator
              style={{marginTop: 95}}
              size={'large'}
              color={colors.parpal}
            />
          )}
        </View>
        <Text
          style={{
            fontSize: 13,
            marginTop: 16,
            marginBottom: 30,
            textAlign: 'center',
            color: '#fff',
            fontFamily: commonStyle.fontFamily.regular,
          }}>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{
              fontSize: 13,
              textDecorationLine: 'underline',
              color: colors.primary,
              fontFamily: commonStyle.fontFamily.regular,
            }}>
            Login
          </Text>
        </Text>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
    </View>
  );
}
