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
import {completeProfile, getUser} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import {addUserData} from '../../store/reducer/mainSlice';
import {toastAlertSuccess} from '../../utils/alert';

const IdVerification = ({navigation, route}: any) => {
  const passedData = route.params;
  const userData = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch();

  const initialValues = {
    idType: '',
    idNumber: '',
    businessName: '',
    cacNumber: '',
    accountType: userData?.accountType?.toUpperCase(),
  };

  const validationSchema = Yup.object().shape({
    idType: Yup.string().required('Please choose a Means of ID'),
    idNumber: Yup.string()
      .typeError('ID Number must be a valid number') // Ensure it's a valid number
      .required('ID Number is required') // Make it required
      .nullable(false) // Prevent null or undefined values
      .min(1, 'ID Number must be greater than zero') // Ensure it's a positive number
      .required('ID Number is required'),
  });

  const validationSchemaSP = Yup.object().shape({
    businessName: Yup.string().required('Business Name is required'),
    cacNumber: Yup.string()
      .required('CAC Number is required')
      .matches(
        /^[a-zA-Z0-9]{6,8}$/,
        'CAC Number must be 6 to 8 alphanumeric characters',
      ),
  });

  const initGetUsers = async () => {
    const res: any = await getUser('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
  };

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
      toastAlertSuccess('ID Uploaded.');
      ToastShort('ID Uploaded.');
      await initGetUsers();
      navigation.navigate('IdProcessing', {status: 'Processing'});
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

      {userData?.accountType?.toUpperCase() === 'BUSINESS' && (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaSP}
            validateOnChange={true} // Ensure validation runs on value change
            validateOnBlur={true} // Ensure validation runs on blur
            validateOnMount={true} // Ensure validation runs on mount to handle initial values
            onSubmit={_handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              isValid,
            }) => (
              <View style={styles.contentContainer}>
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
                    style={{width: '100%'}}
                  />
                </>
                <CustomButton
                  text={'Submit'}
                  onClick={handleSubmit}
                  textStyle={styles.buttonText}
                  style={styles.button}
                  disable={isSubmitting || !isValid}
                />
              </View>
            )}
          </Formik>
        </>
      )}
      {userData?.accountType?.toUpperCase() === 'FREELANCER' && (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={true} // Ensure validation runs on value change
            validateOnBlur={true} // Ensure validation runs on blur
            validateOnMount={true} // Ensure validation runs on mount to handle initial values
            onSubmit={_handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              isValid,
            }) => (
              <View style={styles.contentContainer}>
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
                      onBlur={handleBlur('idType')}
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
                      value={values.idType} // Bind value to RNPickerSelect
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
                    keyboardType="number-pad"
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
                <CustomButton
                  text={'Submit'}
                  onClick={handleSubmit}
                  textStyle={styles.buttonText}
                  style={styles.button}
                  disable={isSubmitting || !isValid}
                />
              </View>
            )}
          </Formik>
        </>
      )}
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 5,
    color: colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.grey,
    borderRadius: 5,
    color: colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

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
    marginBottom: 5,
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
    fontSize: 12,
    marginBottom: 20,
  },
});

export default IdVerification;
