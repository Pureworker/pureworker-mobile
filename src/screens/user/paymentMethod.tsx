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

const PaymentMethod = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
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
          <View
            style={[
              tw`bg-white flex flex-row mx-auto px-4 items-center`,
              {
                height: perHeight(110),
                width: perWidth(335),
                borderRadius: 5,
                marginTop: perHeight(20),
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.mastercard}
                style={{height: 75, width: 57}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto items-ceenter`}>
              <View style={tw`mx-auto`}>
                <Textcomp
                  text={'Credit Card'}
                  size={13}
                  lineHeight={15}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`flex mt-2 flex-row items-center`}>
                <Textcomp
                  text={'***** ***** *****'}
                  size={17}
                  lineHeight={17}
                  color={'#D20713'}
                  fontFamily={'Inter-SemiBold'}
                />
                <Textcomp
                  text={'123'}
                  size={17}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.arrow_right}
                style={{height: 28, width: 18}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={()=>{}} style={[tw`flex flex-row bg-white items-center mx-auto mt-4`, {width: perWidth(335), height: perHeight(44), borderRadius: 5, paddingLeft: perWidth(35)}]}>
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
          <TouchableOpacity onPress={()=>{}} style={[tw`flex flex-row bg-white items-center mx-auto mt-4`, {width: perWidth(335), height: perHeight(44), borderRadius: 5, paddingLeft: perWidth(35)}]}>
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
          <TouchableOpacity onPress={()=>{}} style={[tw`flex flex-row bg-white items-center mx-auto mt-4`, {width: perWidth(335), height: perHeight(44), borderRadius: 5, paddingLeft: perWidth(35)}]}>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethod;
