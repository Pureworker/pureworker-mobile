import React from 'react';
import {Image, View} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import GlobalImages from '../assets/globalImage';

const toastConfig = {
  success: props => (
    <View
      style={{
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        paddingHorizontal: 50,
      }}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          justifyContent: 'space-between',
        }}>
        <Image
          source={GlobalImages.officialLogo}
          style={{
            width: 20,
            height: 20,
          }}
        />

        <BaseToast
          {...props}
          style={{
            borderWidth: 0,
            borderLeftWidth: 0,
            elevation: 0,
            width: '100%',
            // backgroundColor: 'transparent',
            // flexWrap: 'wrap',
          }}
          // style={{borderLeftColor: 'pink'}}
          // contentContainerStyle={{paddingHorizontal: 15}}
          text1Style={{
            fontSize: 15,
            fontWeight: '400',
          }}
          text1NumberOfLines={2}
          text2NumberOfLines={2}
        />
      </View>
    </View>
  ),

  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

export default toastConfig;
