import React from 'react';
import {
  Text,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import commonStyle from '../constants/commonStyle';

type HeaderProps = {
  title: String;
  image: any;
  style?: any;
  statusBarStyle?: any;
  textStyle?: any;
  imageStyle?: any;
  func?: any
};

const Header = ({
  title,
  image,
  style,
  statusBarStyle,
  imageStyle,
  textStyle,
  func,
}: HeaderProps) => {
  var navigation = useNavigation();

  console.log(StatusBar.currentHeight, getStatusBarHeight(true));

  return (
    <View
      style={[
        {
          marginTop:
            Platform.OS === 'ios'
              ? getStatusBarHeight(true)
              : StatusBar.currentHeight &&
                StatusBar.currentHeight + getStatusBarHeight(true),
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#000',
          alignItems: 'center',
          height: 70,
        },
        style,
      ]}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'#000'}
      />

      <TouchableOpacity
        style={{position: 'absolute', left: 20}}
        onPress={() => {
          if (func) {
            func()
          }else{
            navigation.goBack()
          }
        }}>
        <Image
          source={image}
          resizeMode={'contain'}
          style={[
            {
              width: 30,
              height: 30,
              tintColor: '#fff',
              alignSelf: 'center',
            },
            imageStyle,
          ]}
        />
      </TouchableOpacity>
      <View>
        <Text
          style={[
            {
              color: '#fff',
              fontFamily: commonStyle.fontFamily.medium,
              fontSize: 18,
            },
            textStyle,
          ]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Header;
