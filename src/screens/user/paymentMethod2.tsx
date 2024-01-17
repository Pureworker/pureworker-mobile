import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import colors from '../../constants/colors';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import {FlutterwaveButton, PayWithFlutterwave} from 'flutterwave-react-native';
import Snackbar from 'react-native-snackbar';
//paystack
import {Paystack, paystackProps} from 'react-native-paystack-webview';
import PaystackWebView from '../../components/web';
import {getUser} from '../../utils/api/func';
import {addUserData} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {ToastLong} from '../../utils/utils';
const PaymentMethod2 = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [amount, setamount] = useState(route?.params?.amount || 0);
  const [isLoading, setisLoading] = useState(false);
  console.log(route.params);
  const initGetUsers = async () => {
    setisLoading(true);
    const res: any = await getUser('');
    console.log('dddddddd', res);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
    setisLoading(false);
  };

  interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
  }
  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = async data => {
    console.log(data);
    await initGetUsers();
    ToastLong('Funding Successful!');
    navigation.navigate('Home');
  };
  const generateTransactionRef = (length: number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };
  const userData = useSelector((state: any) => state.user.userData);
  console.log(userData);
  //paystack
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  const [webviewVisible, setWebviewVisible] = useState(false);
  const paystackPaymentLink = 'YOUR_PAYSTACK_PAYMENT_LINK_HERE'; // Replace with your actual Paystack payment link
  const handleOpenWebview = async () => {
    setWebviewVisible(true);
  };
  const handleCloseWebview = () => {
    // if (!_storeuserData?._id) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'userID does not exist 🚀.',
    //   });
    //   return;
    // }
    setWebviewVisible(false);
  };
  return (
    <View style={[{flex: 1, backgroundColor: colors.darkPurple}]}>
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
              style={{height: 25, width: 25, tintColor: 'white'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'Choose Payment Method'}
              size={17}
              lineHeight={17}
              color={'#FFFFFF'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={[tw`flex-1`, {}]}>
          {/* <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`flex flex-row bg-white items-center mx-auto mt-4`,
              {
                width: perWidth(335),
                height: perHeight(44),
                borderRadius: 5,
                paddingLeft: perWidth(35),
              },
            ]}>
            <Image
              source={images.add2}
              style={{height: 40, width: 40}}
              resizeMode="contain"
            />
            <View style={tw`ml-10`}>
              <Textcomp
                text={'Add New Card'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`flex flex-row bg-white items-center mx-auto mt-4`,
              {
                width: perWidth(335),
                height: perHeight(44),
                borderRadius: 5,
                paddingLeft: perWidth(35),
              },
            ]}>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'USSD'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`flex flex-row bg-white items-center mx-auto mt-4`,
              {
                width: perWidth(335),
                height: perHeight(44),
                borderRadius: 5,
                paddingLeft: perWidth(35),
              },
            ]}>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Bank Transfer'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </TouchableOpacity> */}
          <View
            style={[tw`w-[90%] mx-auto `, {marginTop: SIZES.height * 0.12}]}>
            <View style={tw``}>
              <Textcomp
                text={'Enter Amount'}
                size={14}
                lineHeight={15}
                color={'#FFFFFF80'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View
              style={tw`flex flex-row bg-white items-center px-4 bg-white mt-4 rounded-lg w-9/10`}>
              <View style={tw``}>
                <Textcomp
                  text={'₦'}
                  size={17}
                  lineHeight={15}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TextInput
                style={[
                  tw` flex-1 ml-1 font-bold text-black px-4 py-4 `,
                  {fontSize: 16},
                ]}
                keyboardType="numeric"
                value={`${amount}`}
                onChangeText={text => {
                  setamount(text);
                  if (Number(text) < 100) {
                    Snackbar.show({
                      text: 'Minimum amount is  ₦100',
                      duration: Snackbar.LENGTH_SHORT,
                      textColor: '#fff',
                      backgroundColor: '#88087B',
                    });
                  }
                }}
              />
            </View>
          </View>
          {amount >= 100 && (
            <View style={[tw`mx-auto mt-10`, {width: perWidth(335)}]}>
              <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                options={{
                  tx_ref: generateTransactionRef(10),
                  // tx_ref: Math.floor(Date.now() / 1000),
                  authorization: 'FLWPUBK-663cbe9358e0215f374f1d1b613ed1b9-X',
                  //test FLWPUBK_TEST-3974735cc249821fd3631b0fade1a87d-X
                    // 'FLWPUBK_TEST-cf38ec06f5d38e1724ad6b4fe75c0195-X',
                    // live  FLWPUBK-663cbe9358e0215f374f1d1b613ed1b9-X
                  customer: {
                    email: userData?.email,
                  },
                  amount: amount,
                  currency: 'NGN',
                  payment_options: 'card',
                  meta: {
                    userId: userData?.id, // Replace with the actual field in userData
                    email: userData?.email,
                  },
                }}
              />
            </View>
          )}
          {amount >= 100 && (
            <View>
              <TouchableOpacity
                style={[
                  tw`mx-auto mt-10 bg-white items-center justify-center`,
                  {
                    width: perWidth(335),
                    height: perHeight(40),
                    borderRadius: 7,
                  },
                ]}
                onPress={() => {
                  handleOpenWebview();
                  // paystackWebViewRef.current.startTransaction()
                }}>
                <Text style={{fontSize: 17, fontWeight: '600'}}>
                  Pay with Paystack
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <Paystack
        paystackKey="your-public-key-here"
        billingEmail="paystackwebview@something.com"
        amount={`${amount}.00`}
        onCancel={e => {
          // handle response here
        }}
        onSuccess={res => {
          // handle response here
        }}
        ref={paystackWebViewRef}
      />
      <PaystackWebView
        visible={webviewVisible}
        onClose={handleCloseWebview}
        onSuccess={(data: any) => {
          Alert.alert('Payment Successfull');
          console.log('paymentback', data);
          setisLoading(true);
          setTimeout(() => {
            const initGetUsers = async () => {
              const res: any = await getUser('');
              console.log('dddddddd', res);
              if (res?.status === 201 || res?.status === 200) {
                dispatch(addUserData(res?.data?.user));
              }
              // setloading(false);
            };
            initGetUsers();
            setisLoading(false);
            navigation.goBack();
          }, 10000);
        }}
        paymentLink={''}
        billingEmail={userData?.email}
        amount={`${amount}00.00`}
        paystackKey="pk_test_2e04c346edd25e14d0d073957628ee55afdc78d1"
        firstName={userData?.firstName || ''}
        lastName={userData?.lastName || ''}
        phone={userData?.phoneNumber || ''}
        billingName={userData?.fullName || ''}
        userID={userData?._id}
      />
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default PaymentMethod2;
