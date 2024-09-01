import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#EBEBEB'}}>
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
              text="Privacy Policy"
              size={17}
              lineHeight={17}
              color="#000413"
              fontFamily="Inter-SemiBold"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
