import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {
  fetchAccountDetails,
  getBanks,
  getUser,
  withdraw,
} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../../components/Button';
import TextInputs from '../../components/TextInput2';
import TextWrapper from '../../components/TextWrapper';
import colors from '../../constants/colors';
import CustomLoading from '../../components/customLoading';
import {ToastShort} from '../../utils/utils';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dropdown} from 'react-native-element-dropdown';
import {SIZES} from '../../utils/position/sizes';
import Textcomp from '../../components/Textcomp';
import TransPin from '../../components/modals/transPin';
// Validation schema using Yup
const validationSchema = Yup.object().shape({
  bank: Yup.string().required('Please select a bank.'),
  accountNumber: Yup.string()
    .required('Please enter account number.')
    .min(10)
    .max(10),
  // accountName: Yup.string().required('Account name is required.'),
  amount: Yup.number()
    .required('Please enter the amount.')
    .min(500, 'min Amount is NGN 500.'),
  bank_name: Yup.string().required('Bank name is required.'),
});
const Withdraw = () => {
  const navigation = useNavigation<StackNavigation>();
  const banks = useSelector((state: any) => state.user.banks);
  const [bankList, setBankList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [selectedBank, setselectedBank] = useState(null);

  useEffect(() => {
    const initGetBanks = async () => {
      setisLoading(true);
      try {
        const res: any = await getBanks('');
        if (res?.data?.data) {
          const list = res?.data?.data.map((item: {name: any; code: any}) => ({
            label: item?.name,
            value: item?.code,
          }));
          setBankList(list);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        ToastShort('Error fetching banks.');
      } finally {
        setisLoading(false);
      }
    };
    initGetBanks();
  }, []);
  const initGetUsers = async () => {
    setisLoading(true);
    const res: any = await getUser('');
    setisLoading(false);
  };
  const [accountNumber, setaccountNumber] = useState('');
  const [accountName, setaccountName]: any = useState('');

  const handleWithdraw = async (values: {
    bank: any;
    accountNumber: any;
    accountName?: string;
    amount: any;
    bank_name: string;
  }) => {
    // ToastShort('Withdrawal is under maintenance!');
    // return;

    setisLoading(true);
    const param = {
      account_number: values.accountNumber,
      account_bank: values.bank,
      amount: values.amount,
      narration: 'Withdrawal',
      transactionPin: transactionPin,
    };
    const d = {
      bank_code: values.bank,
      bank_name: values.bank_name,
      account_name: accountName?.account_name,
      account_number: values.accountNumber,
      amount: values.amount,
      narration: 'Withdrawal',
      transactionPin: transactionPin,
    };
    console.log(d);
    try {
      const res: any = await withdraw(d);
      console.log('WITHDRAW:', res);
      if ([200, 201].includes(res?.status)) {
        Alert.alert('Your withdrawal request is being processed!!! 🚀.');
        ToastShort(
          res?.data?.data ||
            'Your withdrawal request is being processed!!! 🚀.',
        );
        navigation.navigate('Home');
      } else {
        settransactionPin('');
        ToastShort(
          res?.error?.message
            ? res?.error?.message
            : 'Oops! An error occurred! 🚀.',
        );
      }
    } catch (error) {
      settransactionPin('');
      console.error('Error with Withdraw Request:', error);
      ToastShort('An unexpected error occurred!.');
    } finally {
      await initGetUsers();
      setisLoading(false);
    }
  };
  const [processing, setprocessing] = useState(false);
  const queryName = async num => {
    const _data = {
      account_number: num,
      account_bank: selectedBank?.[0]?.code,
    };
    setprocessing(true);
    try {
      const res: any = await fetchAccountDetails(_data);
      console.log('res--', res)?.data;
      if (res?.data?.data) {
      }
      if (res.status === 400 || res.status === 401) {
        ToastShort('No match found');
        return;
      }
      setaccountName(res?.data?.data);
    } catch (error) {
      console.error('Error querying bank:', error);
      ToastShort('No match found');
    } finally {
      setisLoading(false);
      setprocessing(false);
    }
  };

  const [showTransPin, setshowTransPin] = useState(false);
  const [transactionPin, settransactionPin] = useState('');

  return (
    <>
      <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
        <ScrollView style={tw`flex-1 h-full `}>
          <View
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? 10
                  : StatusBar.currentHeight &&
                    StatusBar.currentHeight + getStatusBarHeight(true),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Request Withdrawal'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View style={tw`flex-1`}>
            <ScrollView scrollEnabled={false}>
              <Formik
                initialValues={{
                  bank: '',
                  accountNumber: '',
                  accountName: '',
                  amount: 0,
                  bank_name: '',
                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                  console.log('values');
                  handleWithdraw(values);
                }}>
                {({handleSubmit, errors, touched}) => (
                  <View style={{marginHorizontal: 20, marginTop: 50}}>
                    <Field name="bank">
                      {({form}) => (
                        <View style={[tw`mb-4`, {}]}>
                          <TextWrapper
                            children="Bank"
                            isRequired={true}
                            fontType={'semiBold'}
                            style={{
                              fontSize: 13,
                              marginTop: 20,
                              color: colors.black,
                            }}
                          />
                          <Dropdown
                            style={[
                              tw`text-black`,
                              {
                                zIndex: 10,
                                width: SIZES.width * 0.875,
                                backgroundColor: '#F7F5F5',
                                borderColor: 'black',
                                borderWidth: 1,
                                height: 50,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                marginTop: 15,
                                color: '#000000',
                              },
                            ]}
                            // placeholderStyle={{
                            //   color: '#00000080',
                            //   fontWeight: 400,
                            // }}
                            placeholderStyle={{
                              color: '#757575',
                              fontWeight: '300',
                            }}
                            inputSearchStyle={{
                              color: '#757575',
                            }}
                            selectedTextStyle={{
                              color: '#000',
                            }}
                            data={bankList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Bank'}
                            searchPlaceholder="Search..."
                            itemTextStyle={{
                              color: 'black',
                            }}
                            value={selectedBank?.value}
                            onChange={item => {
                              const d = `${item.value}`;
                              const fil = banks?.filter(
                                item => item.code === d,
                              );
                              setselectedBank(fil);
                              form.setFieldValue('bank', fil?.[0]?.code);
                              form.setFieldValue(
                                'bank_name',
                                fil?.name ?? item?.label,
                              );
                              // setselectedBank(fil);
                            }}
                          />
                          {errors.bank && touched.bank && (
                            <Text style={{color: 'red', marginTop: 5}}>
                              {errors.bank}
                            </Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name="accountNumber">
                      {({field, form}: any) => (
                        <>
                          <TextWrapper
                            children="Account Number"
                            isRequired={true}
                            fontType={'semiBold'}
                            style={{
                              fontSize: 13,
                              marginTop: 20,
                              color: colors.black,
                            }}
                          />
                          <TextInputs
                            style={{
                              marginTop: 10,
                              backgroundColor: colors.greyLight1,
                              borderRadius: 2,
                              padding: 5,
                              width: '100%',
                            }}
                            labelText={'Enter account number'}
                            state={field.value}
                            // setState={(value) => debouncedQueryName(value)}
                            setState={async value => {
                              if (!selectedBank) {
                                ToastShort('Select a bank');
                                return;
                              }
                              form.setFieldValue('accountNumber', value);
                              setaccountNumber(value);
                              if (value?.length > 9) {
                                await queryName(value);
                              } else {
                                setaccountName('');
                              }
                            }}
                            disable={true}
                            maxLength={11}
                            keyBoardType="numeric"
                            placeHolderColor={'#00000080'}
                          />
                          {field.touched?.accountNumber &&
                            field.errors.accountNumber && (
                              <Text style={{color: 'red'}}>
                                {field.errors.accountNumber}
                              </Text>
                            )}

                          {processing && (
                            <View style={tw`mr-auto mt-4`}>
                              <ActivityIndicator
                                size={'small'}
                                color={'green'}
                              />
                            </View>
                          )}
                          {errors.accountNumber && touched.accountNumber && (
                            <Text style={{color: 'red', marginTop: 5}}>
                              {errors.accountNumber}
                            </Text>
                          )}
                        </>
                      )}
                    </Field>
                    <Field name="accountName">
                      {({field, form}: any) => (
                        <>
                          <TextWrapper
                            children="Account Name"
                            isRequired={true}
                            fontType={'semiBold'}
                            style={{
                              fontSize: 13,
                              marginTop: 20,
                              color: colors.black,
                            }}
                          />
                          <TextInputs
                            style={{
                              marginTop: 10,
                              backgroundColor: colors.greyLight1,
                              borderRadius: 2,
                              padding: 5,
                              width: '100%',
                            }}
                            labelText={'Name here'}
                            state={`${
                              accountName?.account_name === undefined ||
                              accountName?.account_name === null
                                ? ''
                                : accountName?.account_name
                            }`}
                            setState={form.setFieldValue}
                            disable={false}
                            placeHolderColor={'#00000080'}
                          />
                        </>
                      )}
                    </Field>
                    <Field name="amount">
                      {({field, form}: any) => (
                        <>
                          <TextWrapper
                            children="Amount"
                            isRequired={true}
                            fontType={'semiBold'}
                            style={{
                              fontSize: 13,
                              marginTop: 20,
                              color: colors.black,
                            }}
                          />
                          <TextInputs
                            style={{
                              marginTop: 10,
                              backgroundColor: colors.greyLight1,
                              borderRadius: 2,
                              padding: 5,
                              width: '100%',
                            }}
                            labelText={'Enter Amount'}
                            state={field.value}
                            // setState={form.setFieldValue}
                            setState={value => {
                              form.setFieldValue('amount', value);
                            }}
                            disable={true}
                            keyBoardType="numeric"
                            placeHolderColor={'#00000080'}
                          />
                          {errors.amount && touched.amount && (
                            <Text style={{color: 'red', marginTop: 5}}>
                              {errors.amount}
                            </Text>
                          )}
                        </>
                      )}
                    </Field>

                    {!isLoading ? (
                      <Button
                        onClick={() => {
                          // console.log(errors);
                          // handleSubmit();

                          if (transactionPin?.length < 1) {
                            setshowTransPin(true);
                          } else {
                            handleSubmit();
                          }
                        }}
                        style={{
                          marginHorizontal: 40,
                          marginTop: 120,
                          backgroundColor: colors.lightBlack,
                        }}
                        textStyle={{color: colors.primary}}
                        text={'Proceed'}
                      />
                    ) : (
                      <ActivityIndicator
                        style={{marginTop: 150}}
                        size={'large'}
                        color={colors.parpal}
                      />
                    )}
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
          <View style={tw`h-30`} />
        </ScrollView>
        <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
      </SafeAreaView>
      {showTransPin && (
        <TransPin
          onSubmit={code => {
            settransactionPin(code);
            setshowTransPin(false);
          }}
          onClose={() => {
            setshowTransPin(false);
          }}
          navigation={navigation}
        />
      )}
    </>
  );
};

export default Withdraw;
