import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';
import commonStyle from '../constants/commonStyle';
import Header from '../components/Header';
import tw from 'twrnc';

const {width, height} = Dimensions.get('screen');

export default function FAQ() {
  const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        image={images.back}
        title={'FAQ'}
        style={{backgroundColor: '#fff'}}
        imageStyle={{tintColor: '#000'}}
        textStyle={{color: '#000'}}
      />
      <ScrollView>
        <View style={{backgroundColor: '#000', height: 2}} />
        {data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                backgroundColor: '#2D303C',
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#FFCE1F',
                    fontWeight: '700',
                  }}>
                  What is Pureworker?
                </Text>
                <Image
                  source={images.polygon}
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 12,
                  fontFamily: commonStyle.fontFamily.medium,
                  color: '#fff',
                  fontWeight: '700',
                  marginTop: 18,
                }}>
                Pureworker is a platform that connects customers with
                freelancers and businesses for various services
              </Text>
            </View>
          );
        })}
        <View style={tw`h-20`}/>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
