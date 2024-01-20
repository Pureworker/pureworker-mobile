import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
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

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  bank: Yup.string().required('Please select a bank.'),
  accountNumber: Yup.string().required('Please enter account number.'),
  accountName: Yup.string().required('Account name is required.'),
  amount: Yup.number()
    .required('Please enter the amount.')
    .min(1, 'Amount must be greater than 0.'),
});

const Withdraw = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
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
          const list = res?.data?.data.map(item => ({
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

  const handleWithdraw = async values => {
    setisLoading(true);
    const param = {
      account_number: values.accountNumber,
      account_bank: values.bank,
      amount: values.amount,
      narration: 'Withdrawal',
    };
    try {
      const res = await withdraw(param);
      console.log('WITHDRAW:', res);
      if ([200, 201].includes(res?.status)) {
        ToastShort(
          res?.data?.data ||
            'Your withdrawal request is being processed!!! 🚀.',
        );
        navigation.navigate('Home');
      } else {
        ToastShort(
          res?.error?.message
            ? res?.error?.message
            : 'Oops! An error occurred! 🚀.',
        );
      }
    } catch (error) {
      console.error('Error with Withdraw Request:', error);
      ToastShort('An unexpected error occurred!.');
    } finally {
      await initGetUsers();
      setisLoading(false);
    }
  };

  const queryName = async num => {
    const data = {
      // account_number: num,
      // account_bank: selectedBank?.[0]?.code,
      "account_number": "0690000032",
      "account_bank": "044"
    };
    try {
      const res: any = await fetchAccountDetails(data);
      console.log(res?.data);
    } catch (error) {
      console.error('Error querying bank:', error);
      ToastShort('No match found');
    } finally {
      setisLoading(false);
    }
  };

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
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
              text={'Withdraw'}
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
              }}
              validationSchema={validationSchema}
              onSubmit={values => handleWithdraw(values)}>
              {({handleSubmit}) => (
                <View style={{marginHorizontal: 20, marginTop: 50}}>
                  <Field name="bank">
                    {({field, form}) => (
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
                            tw``,
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
                            },
                          ]}
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
                          onChange={item => {
                            const d = `${item.value}`;
                            const fil = banks?.filter(item => item.code === d);
                            setselectedBank(fil);
                            form.setFieldValue('bank', fil?.[0]?.code);
                            //                     console.log(fil);
                            //                     setselectedBank(fil);
                          }}
                        />
                      </View>
                    )}
                  </Field>
                  <Field name="accountNumber">
                    {({field, form}) => (
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
                          setState={async value => {
                            if (!selectedBank) {
                              ToastShort('Select a bank');
                              return;
                            }
                            form.setFieldValue('accountNumber', value);
                            await queryName(value);
                          }}
                          disable={true}
                          maxLength={11}
                          keyBoardType="numeric"
                        />
                        {field.touched?.accountNumber &&
                          field.errors.accountNumber && (
                            <Text style={{color: 'red'}}>
                              {field.errors.accountNumber}
                            </Text>
                          )}
                      </>
                    )}
                  </Field>
                  <Field name="accountName">
                    {({field, form}) => (
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
                          state={field.value}
                          setState={form.setFieldValue}
                          disable={false}
                        />
                      </>
                    )}
                  </Field>
                  <Field name="amount">
                    {({field, form}) => (
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
                        />
                      </>
                    )}
                  </Field>
                  {!isLoading ? (
                    <Button
                      onClick={handleSubmit}
                      style={{
                        marginHorizontal: 40,
                        marginTop: 140,
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
    </View>
  );
};

export default Withdraw;
