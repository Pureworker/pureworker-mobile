import React, {useState} from 'react';
import {View, ActivityIndicator, ScrollView, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
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
import {useCreateServiceMutation} from '../../store/slice/api';
import {validateEmail} from '../../constants/utils';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {addcompleteProfile, addformStage} from '../../store/reducer/mainSlice';
import {completeProfile} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import * as yup from 'yup';
import {useFormik} from 'formik';
type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};

const validationSchema = yup.object().shape({
  name1: yup.string().required('Full Name is required'),
  relation1: yup.string().required('Relationship is required'),
  email1: yup
  .string()
  .email('Enter a valid email')
  .required('Email is required')
  .test('unique-emails', 'Emails must be different', function (value) {
    const { email2 } = this.parent;
    return value !== email2;
  }),
phoneNumber1: yup
  .string()
  .required('Phone Number is required')
  .min(10, 'Invalid Phone number')
  .max(10, 'Invalid Phone number')
  .test('unique-phone-numbers', 'Phone Numbers must be different', function (value) {
    const { phoneNumber2 } = this.parent;
    return value !== phoneNumber2;
  }),
  // phoneNumber1: yup
  //   .string()
  //   .required('Phone Number is required')
  //   .min(10, 'Invalid Phone number')
  //   .max(10, 'Invalid Phone number'),
  // email1: yup
  //   .string()
  //   .email('Enter a valid email')
  //   .required('Email is required'),
  address1: yup.string().required('Address is required'),
  name2: yup.string().required('Full Name is required'),
  relation2: yup.string().required('Relationship is required'),
  phoneNumber2: yup
    .string()
    .required('Phone Number is required')
    .min(10, 'Invalid Phone number')
    .max(10, 'Invalid Phone number'),
  email2: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  address2: yup.string().required('Address is required'),
});

const ProfileStep3 = () => {
  const navigation = useNavigation<StackNavigation>();
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const [name1, setName1] = useState(
    completeProfileData?.contact?.[0]?.fullName || '',
  );
  const [name2, setName2] = useState(
    completeProfileData?.contact?.[1]?.fullName || '',
  );
  const [relation1, setRelation1] = useState(
    completeProfileData?.contact?.[0]?.relationship || '',
  );
  const [relation2, setRelation2] = useState(
    completeProfileData?.contact?.[1]?.relationship || '',
  );
  const [phoneNumber1, setPhoneNumber1] = useState(
    completeProfileData?.contact?.[0]?.phoneNumber || '',
  );
  const [phoneNumber2, setPhoneNumber2] = useState(
    completeProfileData?.contact?.[1]?.phoneNumber || '',
  );
  const [email1, setEmail1] = useState(
    completeProfileData?.contact?.[0]?.email || '',
  );
  const [email2, setEmail2] = useState(
    completeProfileData?.contact?.[1]?.email || '',
  );
  const [address1, setAddress1] = useState(
    completeProfileData?.contact?.[0]?.address || '',
  );
  const [address2, setAddress2] = useState(
    completeProfileData?.contact?.[1]?.address || '',
  );
  const route: Route = useRoute();
  const [isLoading, setisLoading] = useState(false);

  const [createService] = useCreateServiceMutation();

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name1: completeProfileData?.contact?.[0]?.fullName || '',
      relation1: completeProfileData?.contact?.[0]?.relationship || '',
      phoneNumber1: completeProfileData?.contact?.[0]?.phoneNumber || '',
      email1: completeProfileData?.contact?.[0]?.email || '',
      address1: completeProfileData?.contact?.[0]?.address || '',
      name2: completeProfileData?.contact?.[1]?.fullName || '',
      relation2: completeProfileData?.contact?.[1]?.relationship || '',
      phoneNumber2: completeProfileData?.contact?.[1]?.phoneNumber || '',
      email2: completeProfileData?.contact?.[1]?.email || '',
      address2: completeProfileData?.contact?.[1]?.address || '',
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
    console.log('Started');

    if (
      // route?.params?.serviceId &&
      values.name1 &&
      values.name2 &&
      values.relation1 &&
      values.relation2 &&
      values.phoneNumber1 &&
      values.phoneNumber2 &&
      values.email1 &&
      values.email2 &&
      values.address1 &&
      values.address2
    ) {
      if (!validateEmail(values.email1)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      if (!validateEmail(values.email2)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      // const contact = [
      //   {
      //     fullName: name1,
      //     relationship: relation1,
      //     phoneNumber: phoneNumber1,
      //     email: email1,
      //     address: address1,
      //   },
      //   {
      //     fullName: name2,
      //     relationship: relation2,
      //     phoneNumber: phoneNumber2,
      //     email: email2,
      //     address: address2,
      //   },
      // ];
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
      setisLoading(true);
      const res: any = await completeProfile({contact: contact});
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('ProfileStep4', {
          serviceId: route?.params?.serviceId,
        });
        dispatch(addformStage(4));
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
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
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
      <ProfileStepWrapper active={'four'} />
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
            // state={name1}
            // setState={text => {
            //   setName1(text);
            //   // console.log(text);
            // }}
            state={formik.values.name1}
            setState={formik.handleChange('name1')}
            error={formik.errors.name1}
          />
          {formik.touched.name1 && formik.errors.name1 && (
            <Text style={{color: 'red'}}>{formik.errors.name1}</Text>
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
            // setState={setRelation1}
            setState={formik.handleChange('relation1')}
            error={formik.errors.relation1}
          />
          {formik.touched.relation1 && formik.errors.relation1 && (
            <Text style={{color: 'red'}}>{formik.errors.relation1}</Text>
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
            // setState={setPhoneNumber1}
            setState={formik.handleChange('phoneNumber1')}
            error={formik.errors.phoneNumber1}
          />
          {formik.touched.name1 && formik.errors.name1 && (
            <Text style={{color: 'red'}}>{formik.errors.name1}</Text>
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
            // state={email1}
            state={formik.values.email1}
            // setState={setEmail1}
            setState={formik.handleChange('email1')}
            error={formik.errors.email1}
          />
          {formik.touched.name1 && formik.errors.name1 && (
            <Text style={{color: 'red'}}>{formik.errors.name1}</Text>
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
              styleInput={{color: colors.black, paddingHorizontal: 18}}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              state={formik.values.address1}
              // setState={setAddress1}
              setState={formik.handleChange('address1')}
              multiline={true}
              nbLines={5}
              error={formik.errors.address1}
            />
            {formik.touched.address1 && formik.errors.address1 && (
              <Text style={{color: 'red'}}>{formik.errors.address1}</Text>
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
            // state={name2}
            // setState={setName2}
            state={formik.values.name2}
            setState={formik.handleChange('name2')}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            // state={name2}
            // setState={setName2}
            state={formik.values.name2}
            setState={formik.handleChange('name2')}
          />
          {formik.touched.name2 && formik.errors.name2 && (
            <Text style={{color: 'red'}}>{formik.errors.name2}</Text>
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
            // state={relation2}
            state={formik.values.relation2}
            // setState={setRelation2}
            setState={formik.handleChange('relation2')}
            error={formik.errors.relation2}
          />
          {formik.touched.relation2 && formik.errors.relation2 && (
            <Text style={{color: 'red'}}>{formik.errors.relation2}</Text>
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
            // state={phoneNumber2}
            state={formik.values.phoneNumber2}
            maxLength={11}
            // setState={setPhoneNumber2}
            setState={formik.handleChange('phoneNumber2')}
            error={formik.errors.phoneNumber2}
          />
          {formik.touched.phoneNumber2 && formik.errors.phoneNumber2 && (
            <Text style={{color: 'red'}}>{formik.errors.phoneNumber2}</Text>
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
            // state={email2}
            state={formik.values.email2}
            // setState={setEmail2}
            setState={formik.handleChange('email2')}
            error={formik.errors.email2}
          />
          {formik.touched.email2 && formik.errors.email2 && (
            <Text style={{color: 'red'}}>{formik.errors.email2}</Text>
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
              styleInput={{color: colors.black, paddingHorizontal: 18}}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              // state={address2}
              state={formik.values.address2}
              // setState={setAddress2}
              setState={formik.handleChange('address2')}
              multiline={true}
              nbLines={5}
              error={formik.errors.address2}
            />
          </View>
          {formik.touched.address2 && formik.errors.address2 && (
            <Text style={{color: 'red'}}>{formik.errors.address2}</Text>
          )}

          <View
            style={[
              generalStyles.rowBetween,
              {marginTop: 40, marginBottom: 35},
            ]}>
            {!isLoading ? (
              <Button
                // onClick={() => {
                //   // navigation.navigate('ProfileStep4', {
                //   //   serviceId: route?.params?.serviceId,
                //   // });
                //   handleProfileSetup();
                // }}
                onClick={formik.handleSubmit}
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
          <View style={{height: 50}} />
        </View>
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default ProfileStep3;
