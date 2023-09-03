import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import images from '../constants/images';

import commonStyle from '../constants/commonStyle';
import Button from '../components/Button';
import MyStatusBar from '../components/MyStatusBar';
import colors from '../constants/colors';
import TextInputs from '../components/TextInputs';
import DropDownPicker from 'react-native-dropdown-picker';
import Snackbar from 'react-native-snackbar';
import {useSignupMutation} from '../store/slice/api';
import {allCountry, validateEmail} from '../constants/utils';
import {BUSINESS, FREELANCER} from '../constants/userType';
import DateTimesPicker from '../components/DatePicker';
import {StackNavigation} from '../constants/navigation';
import {generalStyles} from '../constants/generalStyles';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Signup} from '../utils/api/auth';

const {width, height} = Dimensions.get('window');
export default function BusinessSignup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cacNo, setCacNo] = useState('');
  const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('BUSINESS');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [date, setDate] = useState(new Date());
  const setDateTime = (dateTime: any) => {
    setDate(dateTime);
  };
  const [locationItems, setLocationItems] = useState([
    {label: 'Online', value: 'Online'},
    {label: 'Offline', value: 'Offline'},
    {label: 'Both', value: 'Both'},
  ]);
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Choose not to answer', value: 'Choose not to answer'},
  ]);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);
  // const [signup, { isLoading }] = useSignupMutation();
  const [toolTipLeftVisible, setToolTipLeftVisible] = useState(false);
  const [toolTipRightVisible, setToolTipRightVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const navigation = useNavigation<StackNavigation>();

  const handleSignup = async () => {
    if (!email) {
      Snackbar.show({
        text: 'Please enter your email address',
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
      } else {
        setisLoading(true);
        const loginData = {
          email: email.toLowerCase().trim(),
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneName,
          address: address,
          businessName: name,
          cacNo: cacNo,
          location: locationValue?.toLowerCase(),
          dob: date,
          // userType: userType.toLowerCase(),
          nationality: nationalityValue,
          gender: genderValue?.toLowerCase().trim(),
          accountType: userType?.toLowerCase(),
        };

        const fl_data = {
          email: email.toLowerCase().trim(),
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneName,
          dob: date,
          gender: genderValue?.toLowerCase().trim(),
          nationality: nationalityValue,
          address: address,
          // userType: userType.toLowerCase(),
          accountType: userType?.toLowerCase(),
        };

        const res = await Signup(userType === FREELANCER ? fl_data : loginData);

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
        // signup(loginData).unwrap()
        //   .then((data: any) => {
        //     if (data) {
        //       navigation.navigate('TokenVerification', { email: email })
        //     }
        //   })
        //   .catch((error: any) => {
        //     console.log('err', error);
        //     Snackbar.show({
        //       text: error.data.message, duration: Snackbar.LENGTH_SHORT, textColor: '#fff', backgroundColor: '#88087B',
        //     });
        //   });
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
    setNationalityItems([...allCountry]);
  }, []);

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
            marginTop: StatusBar.currentHeight && StatusBar.currentHeight + 40,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{}}
        style={{flex: 1, backgroundColor: '#000'}}>
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
              />
              <View
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
              </View>

              <View style={{zIndex: locationOpen ? 0 : 2}}>
                <Text
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
                keyBoardType={'number-pad'}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  marginTop: 15,
                }}>
                Date of Birth
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  marginBottom: 10,
                  backgroundColor: '#F7F5F5',
                  borderRadius: 5,
                  height: 50,
                  width: '100%',
                }}>
                <DateTimesPicker updateDate={setDateTime} />
              </TouchableOpacity>
              <View
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
              </View>
              <View
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
                <DropDownPicker
                  open={nationalityOpen}
                  value={nationalityValue}
                  items={nationalityItems}
                  setOpen={setNationalityOpen}
                  setValue={setNationalityValue}
                  setItems={setNationalityItems}
                  showArrowIcon={true}
                  ArrowDownIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={!nationalityOpen && images.polygonForward}
                    />
                  )}
                  ArrowUpIconComponent={({style}) => (
                    <Image
                      resizeMode="contain"
                      style={{width: 15, height: 15, tintColor: '#010B2D'}}
                      source={nationalityOpen && images.polygonDown}
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
                  listMode="MODAL"
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
              </View>

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
                <Text
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
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({});
