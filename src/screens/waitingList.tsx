import {View, Text, Image, SafeAreaView, Platform} from 'react-native';
import React, {useState} from 'react';
import {SIZES, perHeight} from '../utils/position/sizes';
import images from '../constants/images';
import Button from '../components/Button';
import colors from '../constants/colors';
import WaitImage from '../assets/svg/wait';
import commonStyle from '../constants/commonStyle';
import TextInputs from '../components/TextInputs';

export default function WaitingList({navigation}: any) {
  const [name, setName] = useState('');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={{width: SIZES.width, height: SIZES.height}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={images.pureWorkerLogo}
            style={{
              height: 50,
              width: 200,
              marginTop: Platform.OS === 'ios' ? 20 : 25,
            }}
            resizeMode="contain"
          />
          <WaitImage style={{marginTop: perHeight(40)}} />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: perHeight(20),
          }}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
            Join Our waiting list
          </Text>

          <View style={{width: '90%'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#fff',
                marginTop: 20,
              }}>
              Your Email or Phone Number
            </Text>
            <TextInputs
              style={{marginTop: 15}}
              labelText={'Enter Name'}
              state={name}
              setState={setName}
            />
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            gap: 30,
            marginHorizontal: 20,
            marginTop: perHeight(100),
          }}>
          <Button
            text={'SUBSCRIBE'}
            onClick={() => navigation.navigate('CustomerSignup')}
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
              You will be notified as soon we launch 🎉
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
