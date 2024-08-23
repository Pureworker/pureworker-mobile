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
import {perHeight, perWidth} from '../../utils/position/sizes';
import {color} from 'react-native-reanimated';
import colors from '../../constants/colors';
import {getUserOrders} from '../../utils/api/func';
import {addcustomerOrders} from '../../store/reducer/mainSlice';

const PaymentConfirmed = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  useEffect(() => {
    const initGetOrders = async () => {
      // setisLoading(true);
      const res: any = await getUserOrders('');
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addcustomerOrders(res?.data?.data));
      }
      // setloading(false);
      // setisLoading(false);
    };
    initGetOrders();
  }, []);

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView style={tw`flex-1 h-full `} contentContainerStyle={{flex: 1}}>
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
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={images.cross}
              style={{height: 25, width: 25, tintColor: 'black'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={''}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={tw`flex-1  h-full`}>
          <View style={[tw`mx-auto`, {marginTop: perHeight(200)}]}>
            <Textcomp
              text={'Payment confirmed'}
              size={24}
              lineHeight={29}
              color={'#000413'}
              fontFamily={'Inter-Bold'}
            />
          </View>

          <View style={[tw``, {marginTop: perHeight(225)}]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
              }}
              style={[
                tw`bg-[${colors.darkPurple}] items-center rounded-lg justify-center mx-auto py-3`,
                {width: perWidth(260)},
              ]}>
              <Textcomp
                text={'Back to Homepage'}
                size={14}
                lineHeight={15}
                color={colors.primary}
                fontFamily={'Inter-Bold'}
              />
            </TouchableOpacity>
          </View>
          <View style={tw`w-full h-0.5 mt-auto bg-black  mb-[7.5%]`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentConfirmed;
