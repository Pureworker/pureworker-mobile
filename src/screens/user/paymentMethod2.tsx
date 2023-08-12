import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import colors from '../../constants/colors';
import {perHeight, perWidth} from '../../utils/position/sizes';
import {FlutterwaveButton, PayWithFlutterwave} from 'flutterwave-react-native';

const PaymentMethod2 = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  //flutter wave Integration

  interface RedirectParams {
    status: 'successful' | 'cancelled';
    transaction_id?: string;
    tx_ref: string;
  }

  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (data: RedirectParams) => {
    console.log(data);
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
          </TouchableOpacity>
          {/* <PayWithFlutterwave

  onRedirect={handleOnRedirect}
  options={{...}}
  customButton={(props) => (
    <TouchableOpacity
      style={styles.paymentButton}
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={styles.paymentButtonText}>Pay $500</Text>
    </TouchableOpacity>
  )}
/> */}

          <View style={[tw`mx-auto mt-4`,{width: perWidth(335)}]}>
            <PayWithFlutterwave
              onRedirect={handleOnRedirect}
              options={{
                tx_ref: generateTransactionRef(10),
                // tx_ref: Math.floor(Date.now() / 1000),
                authorization:
                  'FLWPUBK_TEST-cf38ec06f5d38e1724ad6b4fe75c0195-X',
                customer: {
                  email: 'bamtaiwo9@gmail.com',
                },
                amount: 500,
                currency: 'NGN',
                payment_options: 'card',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethod2;
