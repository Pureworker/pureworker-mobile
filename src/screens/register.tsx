import {View, Text, Image, SafeAreaView} from 'react-native';
import React from 'react';
import {SIZES, perHeight} from '../utils/position/sizes';
import images from '../constants/images';
import Button from '../components/Button';
import colors from '../constants/colors';

export default function Register({navigation}: any) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={{width: SIZES.width, height: SIZES.height}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={images.pureWorkerLogo}
            style={{height: 50, width: 200, marginTop: 40}}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: perHeight(100),
          }}>
          <Text style={{color: 'white', fontSize: 18}}>Register</Text>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              width: '80%',
              textAlign: 'center',
              marginTop: 20,
            }}>
            Create a free account as a Service Provider or Customer.
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            gap: 30,
            marginHorizontal: 20,
            marginTop: perHeight(100),
          }}>
          <Button
            text={'Service Provider'}
            onClick={() => navigation.navigate('BusinessSignup')}
            textStyle={{color: '#fff', fontSize: 20}}
            style={{
              width: SIZES.width * 0.85,
              borderRadius: 10,
              height: 45,
              backgroundColor: colors.parpal,
            }}
          />
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                width: '80%',
                textAlign: 'center',
                marginTop: 0,
              }}>
              OR
            </Text>
          </View>
          <Button
            text={'Customer'}
            onClick={() => {
              // navigation.navigate('waitingList')
              navigation.navigate('CustomerSignup');
            }}
            textStyle={{color: '#000', fontSize: 20}}
            style={{
              width: SIZES.width * 0.85,
              borderRadius: 10,
              height: 45,
              backgroundColor: colors.white,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
