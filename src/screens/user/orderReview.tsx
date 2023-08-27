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

const OrderReview = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();

  const dispatch = useDispatch();
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'Order Review'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={tw`flex-1  h-full`}>
          <View style={tw`border-b pb-3 border-[#0004132E] mx-[2%] `}>
            <View
              style={[
                tw`flex flex-row justify-between `,
                {paddingLeft: perWidth(32), marginTop: perHeight(25)},
              ]}>
              <View>
                <View style={tw``}>
                  <Textcomp
                    text={'Order Details'}
                    size={17}
                    lineHeight={17}
                    color={'#000413'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={tw`mt-3`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Job Description'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                  <View style={tw``}>
                    <Textcomp
                      text={'Creating 1 new basic logo'}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
                <View style={tw`mt-1.5`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Scheduled Delivery Date:'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                  <View style={tw``}>
                    <Textcomp
                      text={' 02/05/2023   13:23'}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
                <View style={tw`mt-1.5`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Location:'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                  <View style={tw``}>
                    <Textcomp
                      text={'Online'}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
                <View style={tw`mt-1.5`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Address:'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                  <View style={tw``}>
                    <Textcomp
                      text={'Redin St, Wehg Avenue, Lagos'}
                      size={12}
                      lineHeight={14}
                      color={'#000413'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
              </View>

              <View style={tw`items-center pr-3`}>
                <Image
                  resizeMode="contain"
                  style={[tw``, {width: 15, height: 15}]}
                  source={images.arrow_up}
                />

                <View style={tw`mt-1.5`}>
                  <Textcomp
                    text={'$2000'}
                    size={14}
                    lineHeight={15}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={tw`border-b pb-6 border-[#0004132E] mx-[2%] `}>
            <View
              style={[
                tw`flex flex-row justify-between `,
                {paddingLeft: perWidth(32), marginTop: perHeight(25)},
              ]}>
              <View>
                <View style={tw``}>
                  <Textcomp
                    text={'Order Summary'}
                    size={17}
                    lineHeight={17}
                    color={'#000413'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={tw`mt-3`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Subtotal'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </View>
                <View style={tw`mt-2`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'VAT'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </View>
                <View style={tw`mt-2`}>
                  <View style={tw``}>
                    <Textcomp
                      text={'Promo code'}
                      size={14}
                      lineHeight={15}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </View>
                </View>
              </View>
              <View style={tw`items-end pr-3`}>
                <Image
                  resizeMode="contain"
                  style={[tw`mr-3`, {width: 15, height: 15}]}
                  source={images.arrow_up}
                />

                <View style={tw`mt-2`}>
                  <Textcomp
                    text={'$2000'}
                    size={14}
                    lineHeight={15}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
                <View style={tw`mt-2`}>
                  <Textcomp
                    text={'N 0'}
                    size={14}
                    lineHeight={15}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
                <TouchableOpacity onPress={() => {}} style={tw`mt-2`}>
                  <Textcomp
                    text={'Enter a Code'}
                    size={13}
                    lineHeight={15}
                    color={'#88087B'}
                    fontFamily={'Inter-Regular'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={tw`mt-4 flex flex-row justify-between pl-[10%] pr-[5%]`}>
            <View style={tw``}>
              <Textcomp
                text={'Total'}
                size={14}
                lineHeight={15}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={'N 2000'}
                size={14}
                lineHeight={15}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
          </View>

          <View style={tw`mt-auto mb-[8%]`}>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('PaymentConfirmed');
                navigation.navigate('PaymentMethod2', {amount: 4000});
              }}
              style={[
                tw`bg-[${colors.darkPurple}] items-center rounded-lg justify-center mx-auto py-3`,
                {width: perWidth(260)},
              ]}>
              <Textcomp
                text={'Pay Now'}
                size={14}
                lineHeight={15}
                color={colors.primary}
                fontFamily={'Inter-Bold'}
              />
            </TouchableOpacity>
            <View style={tw`mx-auto mt-2`}>
              <Textcomp
                text={'Your payment information is secure'}
                size={12}
                lineHeight={14.5}
                color={'#00041380'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>
          <View style={tw`w-full h-0.5  bg-black  mb-[7.5%]`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderReview;
