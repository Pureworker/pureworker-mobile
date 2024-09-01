import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TextInputs from '../../components/TextInput2';

const _Services = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const passedService = route.params.service;
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
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

        {!searchModal ? (
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
                text={passedService}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setsearchModal(true);
              }}>
              <Image
                source={images.search}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              tw`items-center justify-center`,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              },
            ]}>
            <TouchableOpacity onPress={() => setsearchModal(false)}>
              <Image
                source={images.X}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={{marginTop: 10, width: '70%'}}
              labelText={'Search for service provider'}
              state={searchInput}
              setState={setsearchInput}
            />
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.search}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={tw`mt-3 mb-3`} />
        <View style={tw`h-20`} />
      </ScrollView>
    </View>
  );
};

export default _Services;
