import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import colors from '../../constants/colors';
import commonStyle from '../../constants/commonStyle';
import CustomButton from '../../components/Button';
import Textcomp from '../../components/Textcomp';
import tw from 'twrnc';
import images from '../../constants/images';
import {ToastShort} from '../../utils/utils';
import {completeProfile} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';

const IdVerification = ({navigation, route}: any) => {
  const passedData = route.params;
  const userData = useSelector((state: any) => state.user.userData);
  const initialValues = {
    idType: '',
    idNumber: '',
    businessName: '',
    cacNumber: '',
  };
  const validationSchema = Yup.object().shape({
    idType: Yup.string().when('accountType', {
      is: 'FREELANCER',
      then: Yup.string().required('Please choose a Means of ID'),
    }),
    idNumber: Yup.string().when('accountType', {
      is: 'FREELANCER',
      then: Yup.string().required('ID Number is required'),
    }),
    businessName: Yup.string().when('accountType', {
      is: 'BUSINESS',
      then: Yup.string().required('Business Name is required'),
    }),
    cacNumber: Yup.string().when('accountType', {
      is: 'BUSINESS',
      then: Yup.string().required('CAC Number is required'),
    }),
  });

  const _handleSubmit = async (values: any, {setSubmitting}: any) => {
    setSubmitting(true);
    const {idType, idNumber, cacNumber, businessName} = values;
    let identity;
    if (userData?.accountType?.toUpperCase() === 'FREELANCER') {
      identity = {
        type: idType === 'Bank Verification Number' ? 'bvn' : 'nin',
        number: idNumber,
      };
    } else {
      identity = {
        type: 'cac',
        number: cacNumber,
      };
    }
    const res: any = await completeProfile({
      identity: identity,
    });
    if (res?.status === 200 || res?.status === 201) {
      navigation.navigate('Home');
    } else {
      const errorMessage =
        res?.error?.message ||
        res?.error?.data?.message ||
        'Oops!, an error occurred';
      ToastShort(errorMessage);
      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setSubmitting(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          paddingBottom: 10,
          marginTop: 25,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={images.back}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-auto`}>
          <Textcomp
            text={'Provide Identification Details'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={_handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.contentContainer}>
            {userData?.accountType?.toUpperCase() === 'FREELANCER' && (
              <>
                <Textcomp
                  text={' Provide Identification Details'}
                  color={colors.black}
                  size={15}
                  fontFamily="Inter-Medium"
                  style={{paddingBottom: 16}}
                />
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={handleChange('idType')}
                    // onBlur={handleBlur('idType')}
                    items={[
                      {
                        label: 'National Identification Number(NIN)',
                        value: 'nin',
                      },
                      {label: 'Bank Verification Number(BVN)', value: 'bvn'},
                    ]}
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'Select an ID type...',
                      value: null,
                    }}
                  />
                  {touched.idType && errors.idType && (
                    <Text style={styles.errorText}>{errors.idType}</Text>
                  )}
                </View>

                <Textcomp
                  text={' Enter the ID number.'}
                  color={colors.black}
                  size={15}
                  fontFamily="Inter-Medium"
                  style={{paddingBottom: 16}}
                />

                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('idNumber')}
                  onBlur={handleBlur('idNumber')}
                  value={values.idNumber}
                  placeholder="Enter your ID number"
                  placeholderTextColor={colors.grey}
                />
                {touched.idNumber && errors.idNumber && (
                  <Text style={styles.errorText}>{errors.idNumber}</Text>
                )}

                <Textcomp
                  text={
                    ' Note: The details of your BVN or NIN must match the information you registered with.'
                  }
                  color={colors.black}
                  size={14}
                  fontFamily="Inter-Bold"
                  style={{width: '100%'}}
                />
              </>
            )}

            {userData?.accountType?.toUpperCase() === 'BUSINESS' && (
              <>
                <Textcomp
                  text={' Provide Identification Details'}
                  color={colors.black}
                  size={15}
                  fontFamily="Inter-Medium"
                  style={{paddingBottom: 16}}
                />
                <Textcomp
                  text={'Business Name'}
                  color={colors.black}
                  size={15}
                  fontFamily="Inter-Medium"
                  style={{paddingBottom: 16}}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('businessName')}
                  onBlur={handleBlur('businessName')}
                  value={values.businessName}
                  placeholder="Enter Business Name"
                  placeholderTextColor={colors.grey}
                />
                {touched.businessName && errors.businessName && (
                  <Text style={styles.errorText}>{errors.businessName}</Text>
                )}
                <Textcomp
                  text={'CAC'}
                  color={colors.black}
                  size={15}
                  fontFamily="Inter-Medium"
                  style={{paddingBottom: 16}}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('cacNumber')}
                  onBlur={handleBlur('cacNumber')}
                  value={values.cacNumber}
                  placeholder="Enter CAC Number"
                  placeholderTextColor={colors.grey}
                />
                {touched.cacNumber && errors.cacNumber && (
                  <Text style={styles.errorText}>{errors.cacNumber}</Text>
                )}
                <Textcomp
                  text={
                    'Note: The details of your BVN or NIN must match the information you registered with.'
                  }
                  color={colors.black}
                  size={14}
                  fontFamily="Inter-Bold"
                  lineHeight={20}
                  style={{width: '100%'}}
                />
              </>
            )}

            <CustomButton
              text={'Submit'}
              onClick={handleSubmit}
              textStyle={styles.buttonText}
              style={styles.button}
              disable={isSubmitting}
              // isLoading={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.greyLight1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  headerText: {
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 30,
  },
  labelText: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: colors.greyLight,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: colors.greyLight,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.black,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.parpal,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 30,
    marginTop: 'auto',
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: commonStyle.fontFamily.semibold,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: colors.grey,
    backgroundColor: colors.greyLight,
    borderRadius: 4,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.grey,
    backgroundColor: colors.greyLight,
    borderRadius: 8,
    paddingRight: 30,
  },
});

export default IdVerification;
