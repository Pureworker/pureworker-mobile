import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../utils/position/sizes';
import FastImage from 'react-native-fast-image';

const TransactionHistory = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  //filter  transaction datat to get months
  const months = ['May', 'Apr', 'Feb'];
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
              text={'Transaction  History'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`mx-auto`,
              {width: perWidth(335), paddingLeft: perWidth(10)},
            ]}>
            <View style={[tw``, {marginTop: perHeight(19)}]}>
              <Textcomp
                text={'Transactions'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          {months.map((item, index) => {
            return (
              <View style={[tw``, {paddingLeft: perWidth(10)}]}>
                <View
                  style={[
                    tw``,
                    {marginTop: perHeight(19), paddingLeft: perWidth(13)},
                  ]}>
                  <Textcomp
                    text={`${item} 2023`}
                    size={17}
                    lineHeight={17}
                    color={'#000413'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>

                <FlatList
                  scrollEnabled={false}
                  data={[0, 1, 2]}
                  renderItem={(item, index) => {
                    return (
                      <View
                        style={tw`flex flex-row justify-between items-center px-4 border-b border-[#00000033] ${
                          index === 0 ? 'pb-4' : 'py-4'
                        }`}>
                        <View style={[tw`flex flex-row items-center  `, {}]}>
                          <Image source={images.vender} style={{width: perWidth(25), aspectRatio: 1}} />
                          <View style={tw`flex flex-col ml-4`}>
                            <View style={[tw``, {marginTop: perHeight(0)}]}>
                              <Textcomp
                                text={'Peter Pedro'}
                                size={15}
                                lineHeight={17}
                                color={'#000413'}
                                fontFamily={'Inter-SemiBold'}
                              />
                            </View>
                            <View style={[tw``, {marginTop: perHeight(4)}]}>
                              <Textcomp
                                text={'4 may, 13:45'}
                                size={13}
                                lineHeight={15}
                                color={'#00041380'}
                                fontFamily={'Inter'}
                              />
                            </View>
                          </View>
                        </View>
                        <View style={tw`flex flex-col`}>
                          <View style={[tw``, {marginTop: perHeight(0)}]}>
                            <Textcomp
                              text={'$2000'}
                              size={15}
                              lineHeight={17}
                              color={'#000413'}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </View>
                          <View style={[tw``, {marginTop: perHeight(4)}]}>
                            <Textcomp
                              text={'Payment'}
                              size={13}
                              lineHeight={15}
                              color={'#00041380'}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  //   keyExtractor={item => item.id}
                  contentContainerStyle={{marginTop: 10}}
                />
              </View>
            );
          })}
        </View>
        <View style={tw`h-30`} />
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;
