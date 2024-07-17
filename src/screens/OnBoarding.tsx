import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';
import Button from '../components/Button';
import MyStatusBar from '../components/MyStatusBar';
import colors from '../constants/colors';
import {StackNavigation} from '../constants/navigation';
const {width, height} = Dimensions.get('screen');

const OnboardingView = ({item, index, navigation}: any) => {
  return (
    <ScrollView>
    <View key={index} style={{width: width, height: height}}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={images.pureWorkerLogo}
          style={{height: 50, width: 200, marginTop: 40}}
          resizeMode="contain"
        />
        <Image
          source={item.image}
          style={{height: 242, width: 275, marginTop: 65}}
          resizeMode="contain"
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 35}}>
        <Text style={{width: 265, color: 'white', fontSize: 18}}>
          {item.text}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 45,
        }}>
        <View
          style={{
            height: 2,
            width: 65,
            borderRadius: 2,
            backgroundColor: item.key === 'first' ? '#fff' : 'gray',
          }}
        />
        <View
          style={{
            height: 2,
            width: 65,
            marginLeft: 32,
            borderRadius: 2,
            backgroundColor: item.key === 'second' ? '#fff' : 'gray',
          }}
        />
        <View
          style={{
            height: 2,
            width: 65,
            marginLeft: 32,
            borderRadius: 2,
            backgroundColor: item.key === 'third' ? '#fff' : 'gray',
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 30,
          marginHorizontal: 20,
          marginTop: 45,
        }}>
        <Button
          text={'Login'}
          onClick={() => navigation.navigate(item.login)}
          textStyle={{color: '#000', fontSize: 20}}
          style={{
            flex: 1,
            borderRadius: 30,
            height: 45,
            backgroundColor: colors.primary,
          }}
        />
        <Button
          text={'Register'}
          onClick={() => navigation.navigate('Register')}
          textStyle={{color: '#000', fontSize: 20}}
          style={{
            flex: 1,
            borderRadius: 30,
            height: 45,
            backgroundColor: colors.white,
          }}
        />
      </View>
    </View>
    </ScrollView>
  );
};

export default function OnBoarding() {
  const navigation = useNavigation<StackNavigation>();
  const onboarding = [
    {
      image: images.heroPix,
      text: 'Connecting you to trusted and verified service providers',
      signup: 'Register',
      login: 'Login',
      key: 'first',
    },
    {
      image: images.heroPix1,
      text: 'Your one-stop solution for reliable service delivery',
      // signup: 'CustomerSignup',
      signup: 'Register',
      login: 'Login',
      key: 'second',
    },
    {
      image: images.heroPix2,
      text: 'Empowering service providers to grow, one job at a time',
      // signup: 'CustomerSignup',
      signup: 'Register',
      login: 'Login',
      key: 'third',
    },
  ];
  const [activeIndexNumber, setActiveIndexNumber] = useState(0);
  const [activeIndexNumberHorizontal, setActiveIndexNumberHorizontal] =
    useState(0);

  const excerciseScrollRef = useRef(null);
  const [heights, setHeights] = useState(height);

  return (
    <View style={styles.container}>
      <MyStatusBar
        translucent
        barStyle="light-content"
        backgroundColor="#000"
      />
      <ScrollView
        style={{flex: 4}}
        ref={excerciseScrollRef}
        scrollEventThrottle={16}
        horizontal
        decelerationRate={'fast'}
        onLayout={e => {
          let {x, y, width, height} = e.nativeEvent.layout;
          setHeights(height);
        }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        snapToAlignment={'start'}
        // viewabilityConfig={0}
        onMomentumScrollEnd={event => {
          const {contentOffset, layoutMeasurement} = event.nativeEvent;
          const index = Math.floor(contentOffset.x / layoutMeasurement.width);
          setActiveIndexNumberHorizontal(index);
        }}
        onScroll={e => {
          let slide = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width,
          );
          setActiveIndexNumber(slide);
        }}>
        {onboarding?.map((media, index) => (
          <OnboardingView
            index={index}
            active={activeIndexNumberHorizontal !== index}
            style={{width: width, height: heights}}
            item={media}
            navigation={navigation}
          />
        ))}
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
