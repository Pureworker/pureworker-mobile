import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getBanks, withdraw} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../../components/Button';
import TextInputs from '../../components/TextInput2';
import TextWrapper from '../../components/TextWrapper';
import colors from '../../constants/colors';
import CustomLoading from '../../components/customLoading';
import {SelectList} from 'react-native-dropdown-select-list';
import {ToastLong, ToastShort} from '../../utils/utils';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {addbanks} from '../../store/reducer/mainSlice';
import Toast from 'react-native-toast-message';

const Withdraw = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const banks = useSelector((state: any) => state.user.banks);
  const categorizedData = useSelector(
    (state: any) => state.user.categorizedTransdata,
  );
  const [bankList, setbankList] = useState([]);
  useEffect(() => {
    const initGetUsers = async () => {
      setisLoading(true);
      const res: any = await getBanks('');
      if (res?.data?.data) {
        let list: any = [];
        res?.data?.data?.map(item => {
          let obj = {
            label: item?.name,
            value: item?.name,
          };
          list.push(obj);
        });
        setbankList(list);
      }
      setisLoading(false);
    };
    initGetUsers();
  }, []);
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [accountNumber, setaccountNumber] = useState('');
  const [accountName, setaccountName] = useState('');
  const [bank, setbank] = useState('');
  const [selectedBank, setselectedBank] = useState(null);

  const [amount, setamount] = useState(0);
  const [loading, setloading] = useState(false);

  const handleWithdraw = async () => {
    setloading(true);
    const param = {
      account_number: accountNumber,
      account_bank: selectedBank?.code,
      amount: amount,
      narration: 'Withdrawal',
    };
    try {
      setisLoading(true);
      const res = await withdraw(param);
      console.log('WITHDRAW:', res);
      if ([200, 201].includes(res?.status)) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Withdraw successfully 🚀. ',
        // });
        ToastShort('Withdraw successfully 🚀.');
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: `${
        //     res?.error?.message
        //       ? res?.error?.message
        //       : 'Oops! An error occurred!'
        //   } 🚀. `,
        // });
        ToastShort(
          `${
            res?.error?.message
              ? res?.error?.message
              : 'Oops! An error occurred!'
          } 🚀. `,
        );
      }
    } catch (error) {
      console.error('Error with Withdraw Request:', error);
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred 🚀.',
      });
    } finally {
      setloading(false);
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
          {/* <View
            style={[
              tw`mx-auto`,
              {width: perWidth(335), paddingLeft: perWidth(10)},
            ]}>
            <View style={[tw``, {marginTop: perHeight(19)}]}>
              <Textcomp
                text={'Enter Details below '}
                size={12}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View> */}
          <ScrollView scrollEnabled={false}>
            <View style={{marginHorizontal: 20, marginTop: 50}}>
              <TextWrapper
                children="Bank"
                isRequired={true}
                fontType={'semiBold'}
                style={{fontSize: 13, marginTop: 20, color: colors.black}}
              />
              <View style={[tw`mb-4`, {}]}>
                <SelectList
                  setSelected={(val: any) => {
                    console.log(val);
                    setbank(val);
                    const fil = banks?.filter(item => item.label === val);
                    setselectedBank(fil);
                    console.log(fil);
                  }}
                  data={bankList}
                  save="value"
                  boxStyles={[
                    tw` w-full items-center flex-row justify-between flex-1`,
                    {
                      paddingRight: 5,
                      borderRadius: 8,
                      marginTop: 20,
                      // backgroundColor: colors.lightBlack,
                      borderColor: colors.black,
                      borderWidth: 2,
                      // backgroundColor: 'red',
                      // minHeight: 40,
                      height: 50,
                    },
                  ]}
                  inputStyles={[
                    tw`items-center flex-row justify-center flex-1`,
                    {
                      // height: 40,
                      textAlignVertical: 'center',
                      fontSize: 14,
                      textTransform: 'uppercase',
                      color: colors.black,
                      borderRadius: 8,
                    },
                  ]}
                  placeholder="Select a Bank"
                />
              </View>
              <>
                <TextWrapper
                  children="Account Number"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 20, color: colors.black}}
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
                  state={accountNumber}
                  setState={setaccountNumber}
                  disable={true}
                />
              </>
              <>
                <TextWrapper
                  children="Account Name"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 20, color: colors.black}}
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
                  state={accountName}
                  setState={setaccountName}
                  disable={false}
                />
              </>
              <>
                <TextWrapper
                  children="Amount"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 20, color: colors.black}}
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
                  state={amount}
                  setState={setamount}
                  disable={true}
                />
              </>
              {!isLoading ? (
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep5', {
                    //   serviceId: route?.params?.serviceId,
                    // });
                    handleWithdraw();
                    // ToastShort('Withdrawal is coming!.');
                  }}
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
          </ScrollView>
        </View>
        <View style={tw`h-30`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default Withdraw;
