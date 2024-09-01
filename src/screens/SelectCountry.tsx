import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';
import commonStyle from '../constants/commonStyle';
import Button from '../components/Button';
import MyStatusBar from '../components/MyStatusBar';
import colors from '../constants/colors';
import {StackNavigation} from '../constants/navigation';
import {useDispatch} from 'react-redux';
import tw from 'twrnc';
import USA2 from '../assets/svg/USA2';
import {HEIGHT_SCREEN} from '../constants/generalStyles';
import {SIZES} from '../utils/position/sizes';
import {Dropdown} from 'react-native-element-dropdown';
import French from '../assets/svg/French';
import USA3 from '../assets/svg/USA3';
import {addCountry, addlanguage} from '../store/reducer/mainSlice';
import {Formik} from 'formik';
import * as Yup from 'yup';

const SelectCountry = () => {
  const [seconds, setSeconds] = useState(30);
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleSubmit = (values: any) => {
    dispatch(addlanguage(values.language));
    dispatch(addCountry(values.country));
    navigation.navigate('Login');
  };

  const validationSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    language: Yup.string().required('Language is required'),
  });

  const [isFocus, setIsFocus] = useState(false);

  return (
    <Formik
      initialValues={{country: '', language: 'English'}}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? 30 : 0,
            backgroundColor: '#000',
          }}>
          <View
            style={[
              tw`flex flex-row justify-between  pr-4`,
              {
                marginTop:
                  Platform.OS === 'ios'
                    ? 20
                    : StatusBar.currentHeight && StatusBar.currentHeight + 40,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.cross}
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 25,
                  marginBottom: 10,
                  marginTop:
                    Platform.OS === 'ios'
                      ? 20
                      : StatusBar.currentHeight && StatusBar.currentHeight + 40,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={tw`flex-1`}>
            <ScrollView style={tw`flex-1 `}>
              <MyStatusBar
                translucent
                barStyle="light-content"
                backgroundColor="#000"
              />
              <View
                style={{
                  flex: 1,
                  height: HEIGHT_SCREEN * 0.8,
                }}>
                <View>
                  <View style={tw`mx-auto items-center`}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: commonStyle.fontFamily.bold,
                        color: '#fff',
                        marginTop: 25,
                        marginLeft: 25,
                      }}>
                      Select Country
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: commonStyle.fontFamily.medium,
                        color: '#fff',
                        marginTop: 5,
                        marginLeft: 25,
                      }}>
                      Pick the country of your choice
                    </Text>
                  </View>
                  <View
                    style={{
                      marginHorizontal: 25,
                      marginTop: 70,
                      zIndex: 2,
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
                      Select country
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
                      placeholderStyle={{
                        color: '#757575',
                      }}
                      selectedTextStyle={{
                        color: '#000',
                      }}
                      data={[
                        {label: 'Nigeria', value: 'Nigeria'},
                        {label: 'Cameroon', value: 'Cameroon'},
                      ]}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!values.country ? 'Select Country' : '...'}
                      searchPlaceholder="Search..."
                      inputSearchStyle={{
                        color: '#757575',
                      }}
                      value={values.country}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      itemTextStyle={{
                        color: 'black',
                      }}
                      onChange={item => {
                        setFieldValue('country', item.value);
                      }}
                    />
                    {errors.country && touched.country && (
                      <Text style={{color: 'red'}}>{errors.country}</Text>
                    )}
                  </View>
                </View>

                <View style={tw`mt-4 mx-8`}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: commonStyle.fontFamily.medium,
                      color: '#fff',
                      marginTop: 15,
                      marginBottom: 15,
                    }}>
                    Select Language
                  </Text>
                  <View style={tw`flex flex-row `}>
                    <TouchableOpacity
                      style={tw`items-center mt-2 `}
                      onPress={() => setFieldValue('language', 'English')}>
                      <View
                        style={tw`border ${
                          values.language === 'English'
                            ? 'border-[#FFC727]'
                            : ''
                        }`}>
                        <USA3 />
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: commonStyle.fontFamily.medium,
                          color: '#fff',
                          marginTop: 15,
                          marginBottom: 15,
                        }}>
                        English
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`items-center ml-10 mt-2`}
                      onPress={() => setFieldValue('language', 'French')}>
                      <View
                        style={tw`border ${
                          values.language === 'French' ? 'border-[#FFC727]' : ''
                        }`}>
                        <French />
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: commonStyle.fontFamily.medium,
                          color: '#fff',
                          marginTop: 15,
                          marginBottom: 15,
                        }}>
                        French
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.language && touched.language && (
                    <Text style={{color: 'red'}}>{errors.language}</Text>
                  )}
                </View>
                {!isLoading ? (
                  <View style={{marginHorizontal: 25, marginTop: 75}}>
                    <Button onClick={handleSubmit} text={'Submit'} />
                  </View>
                ) : (
                  <ActivityIndicator
                    style={{marginTop: 95}}
                    size={'large'}
                    color={colors.parpal}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SelectCountry;
