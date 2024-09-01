import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import colors from '../../constants/colors';
import {generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import Snackbar from 'react-native-snackbar';
import {validateEmail} from '../../constants/utils';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProfileData,
  addcompleteProfile,
  addformStage,
} from '../../store/reducer/mainSlice';
import {completeProfile, getProviderNew} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {ToastShort} from '../../utils/utils';
import {toastAlertError} from '../../utils/alert';

const validationSchema = yup.object().shape({
  name1: yup.string().required('Full Name is required'),
  relation1: yup.string().required('Relationship is required'),
  email1: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required')
    .test('unique-emails', 'Emails must be different', function (value) {
      const {email2} = this.parent;
      return value !== email2;
    }),
  phoneNumber1: yup
    .string()
    .required('Phone Number is required')
    .min(11, 'Invalid Phone number')
    .max(11, 'Invalid Phone number')
    .test(
      'unique-phone-numbers',
      'Phone Numbers must be different',
      function (value) {
        const {phoneNumber2} = this.parent;
        return value !== phoneNumber2;
      },
    ),
  address1: yup.string().required('Address is required'),
  name2: yup.string().required('Full Name is required'),
  relation2: yup.string().required('Relationship is required'),
  phoneNumber2: yup
    .string()
    .required('Phone Number is required')
    .min(11, 'Invalid Phone number')
    .max(11, 'Invalid Phone number'),
  email2: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  address2: yup.string().required('Address is required'),
});

const ProfileStep3 = () => {
  const navigation = useNavigation<StackNavigation>();
  const ProviderData = useSelector((state: any) => state.user.profileData);
  const userData = useSelector((state: any) => state.user.userData);
  useEffect(() => {
    const initGetProviderNew = async () => {
      const res: any = await getProviderNew(userData?._id);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
      }
    };
    initGetProviderNew();
  }, []);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );

  const [isLoading, setisLoading] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name1:
        ProviderData?.contact?.[0]?.fullName ||
        completeProfileData?.contact?.[0]?.fullName ||
        '',
      relation1:
        ProviderData?.contact?.[0]?.relationship ||
        completeProfileData?.contact?.[0]?.relationship ||
        '',
      phoneNumber1:
        ProviderData?.contact?.[0]?.phoneNumber ||
        completeProfileData?.contact?.[0]?.phoneNumber ||
        '',
      email1:
        ProviderData?.contact?.[0]?.email ||
        completeProfileData?.contact?.[0]?.email ||
        '',
      address1:
        ProviderData?.contact?.[0]?.address ||
        completeProfileData?.contact?.[0]?.address ||
        '',
      name2:
        ProviderData?.contact?.[1]?.fullName ||
        completeProfileData?.contact?.[1]?.fullName ||
        '',
      relation2:
        ProviderData?.contact?.[1]?.relationship ||
        completeProfileData?.contact?.[1]?.relationship ||
        '',
      phoneNumber2:
        ProviderData?.contact?.[1]?.phoneNumber ||
        completeProfileData?.contact?.[1]?.phoneNumber ||
        '',
      email2:
        ProviderData?.contact?.[1]?.email ||
        completeProfileData?.contact?.[1]?.email ||
        '',
      address2:
        ProviderData?.contact?.[1]?.address ||
        completeProfileData?.contact?.[1]?.address ||
        '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      console.log('hello');

      handleProfileSetup(values);
    },
  });

  const handleProfileSetup = async (values: {
    name1: any;
    relation1: any;
    phoneNumber1: any;
    email1: any;
    address1: any;
    name2: any;
    relation2: any;
    phoneNumber2: any;
    email2: any;
    address2: any;
  }) => {
    try {
      setisLoading(true);
      if (!validateEmail(values.email1)) {
        Snackbar.show({
          text: 'Please enter a valid email for Contact 1',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      if (!validateEmail(values.email2)) {
        Snackbar.show({
          text: 'Please enter a valid email for Contact 2',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      if (values.email1 === values.email2) {
        toastAlertError('Cannot have the same Email for both contacts');
        return;
      }
      if (values.phoneNumber1 === values.phoneNumber2) {
        toastAlertError('Cannot have the same PhoneNumber for both contacts');
        return;
      }
      if (values.name1 === values.name2) {
        toastAlertError('Cannot have the same Name for both contacts');
        return;
      }
      if (values.phoneNumber1?.length !== 11) {
        toastAlertError('Phone Number 1 must be 11 digits');
        return;
      }
      if (values.phoneNumber2?.length !== 11) {
        toastAlertError('Phone Number 2 must be 11 digits');
        return;
      }
      const contact = [
        {
          fullName: values.name1,
          relationship: values.relation1,
          phoneNumber: values.phoneNumber1,
          email: values.email1,
          address: values.address1,
        },
        {
          fullName: values.name2,
          relationship: values.relation2,
          phoneNumber: values.phoneNumber2,
          email: values.email2,
          address: values.address2,
        },
      ];
      dispatch(
        addcompleteProfile({
          contact: contact,
        }),
      );
      const res = await completeProfile({contact: contact, action: 'add'});
      if (res?.status === 200 || res?.status === 201) {
        Snackbar.show({
          text: 'Contacts Submitted Successfully! Proceeding to Virtual Interview',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        setTimeout(() => {
          if (userData?.liveTest === false) {
            navigation.navigate('FaceDetection', {page: 'Profile'});
          } else {
            navigation.navigate('Congratulations');
          }
          setisLoading(false);
        }, 250);
        dispatch(addformStage(6));
      } else {
        toastAlertError('Error');

        // ToastShort(
        //   `${error.message ?? res?.error?.data?.message}` ??
        //     'An unexpected error occurred',
        // );
        console.log('here:', res?.error?.message);
        // Handle any error response from the backend
        throw new Error(
          res?.error?.message ||
            res?.error?.data?.message ||
            'Oops! An error occurred.',
        );
      }
    } catch (error: any) {
      toastAlertError(`${error?.message}` ?? 'An unexpected error occurred');
      setisLoading(false);
    } finally {
      setisLoading(false);
      setisLoading(false);
    }
  };

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
          navigation.navigate('ProfileStep21');
        }}
      />
      <ProfileStepWrapper active={'three'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="References"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <TextWrapper
            children="Who can we contact in emergency situation?"
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Contact 1"
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Full Name"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={formik.values.name1}
            setState={formik.handleChange('name1')}
            error={formik.errors.name1}
          />
          {formik.touched.name1 && formik.errors.name1 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.name1}
            </Text>
          )}
          <TextWrapper
            children="Relationship to you"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={formik.values.relation1}
            setState={formik.handleChange('relation1')}
            error={formik.errors.relation1}
          />
          {formik.touched.relation1 && formik.errors.relation1 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.relation1}
            </Text>
          )}
          <TextWrapper
            children="Phone Number"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="number-pad"
            labelText={''}
            state={formik.values.phoneNumber1}
            maxLength={11}
            setState={formik.handleChange('phoneNumber1')}
            error={formik.errors.phoneNumber1}
          />
          {formik.touched.phoneNumber1 && formik.errors.phoneNumber1 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.phoneNumber1}
            </Text>
          )}
          <TextWrapper
            children="Email Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            keyBoardType={'email-address'}
            state={formik.values.email1}
            setState={formik.handleChange('email1')}
            error={formik.errors.email1}
          />
          {formik.touched.email1 && formik.errors.email1 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.email1}
            </Text>
          )}

          <TextWrapper
            children="Address"
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
                height: 120,
              }}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              state={formik.values.address1}
              setState={formik.handleChange('address1')}
              multiline={true}
              nbLines={5}
              error={formik.errors.address1}
            />
            {formik.touched.address1 && formik.errors.address1 && (
              <Text style={{color: 'red', fontSize: 10}}>
                {formik.errors.address1}
              </Text>
            )}
          </View>
          <TextWrapper
            children="Contact 2"
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Full Name"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{
              marginTop: 10,
              backgroundColor: colors.greyLight1,
              display: 'none',
            }}
            labelText={''}
            state={formik.values.name2}
            setState={formik.handleChange('name2')}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={formik.values.name2}
            setState={formik.handleChange('name2')}
          />
          {formik.touched.name2 && formik.errors.name2 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.name2}
            </Text>
          )}

          <TextWrapper
            children="Relationship to you"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={formik.values.relation2}
            setState={formik.handleChange('relation2')}
            error={formik.errors.relation2}
          />
          {formik.touched.relation2 && formik.errors.relation2 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.relation2}
            </Text>
          )}
          <TextWrapper
            children="Phone Number"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="number-pad"
            labelText={''}
            state={formik.values.phoneNumber2}
            maxLength={11}
            setState={formik.handleChange('phoneNumber2')}
            error={formik.errors.phoneNumber2}
          />
          {formik.touched.phoneNumber2 && formik.errors.phoneNumber2 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.phoneNumber2}
            </Text>
          )}
          <TextWrapper
            children="Email Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="email-address"
            labelText={''}
            state={formik.values.email2}
            setState={formik.handleChange('email2')}
            error={formik.errors.email2}
          />
          {formik.touched.email2 && formik.errors.email2 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.email2}
            </Text>
          )}

          <TextWrapper
            children="Address"
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
                height: 120,
              }}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              state={formik.values.address2}
              setState={formik.handleChange('address2')}
              multiline={true}
              nbLines={5}
              error={formik.errors.address2}
            />
          </View>
          {formik.touched.address2 && formik.errors.address2 && (
            <Text style={{color: 'red', fontSize: 10}}>
              {formik.errors.address2}
            </Text>
          )}

          <View
            style={[
              generalStyles.rowBetween,
              {marginTop: 40, marginBottom: 35},
            ]}>
            {!isLoading ? (
              <Button
                onClick={() => {
                  formik.handleSubmit();
                }}
                style={[
                  tw`ml-auto`,
                  {width: 90, backgroundColor: colors.lightBlack},
                ]}
                textStyle={{color: colors.primary}}
                text={'Next'}
              />
            ) : (
              <ActivityIndicator
                style={{marginRight: 30}}
                size={'large'}
                color={colors.parpal}
              />
            )}
          </View>
          <View>
            {Object.entries(formik.errors).map(([key, value]) => (
              <Text key={key} style={{color: 'red'}}>
                * {value}
              </Text>
            ))}
          </View>
          <View style={{height: 120}} />
        </View>
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </SafeAreaView>
  );
};
export default ProfileStep3;
