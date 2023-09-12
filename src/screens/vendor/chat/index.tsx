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
import {StackNavigation} from '../../../constants/navigation';
import images from '../../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import { perHeight, perWidth } from '../../../utils/position/sizes';
import colors from '../../../constants/colors';

const Index = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
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
          <View style={tw``}>
            <Textcomp
              text={'Edit'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          </TouchableOpacity>
          <View style={tw`mx-auto mt-3`}>
            <Textcomp
              text={'Inbox'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default Index;
