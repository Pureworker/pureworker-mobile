import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import commonStyle from '../constants/commonStyle';
import MyStatusBar from '../components/MyStatusBar';
import {StackNavigation} from '../constants/navigation';
export default function Signup() {
  const navigation = useNavigation<StackNavigation>();

  return (
    <View style={styles.container}>
      <MyStatusBar
        translucent
        barStyle="light-content"
        backgroundColor="#000"
      />

      <View style={{marginHorizontal: 25}}>
        <Text
          style={{
            fontSize: 25,
            marginBottom: 50,
            color: '#fff',
            fontFamily: commonStyle.fontFamily.semibold,
          }}>
          Select User Register
        </Text>
      </View>
      <Button
        onClick={() => {
          navigation.navigate('BusinessSignup');
        }}
        text={'Business / Freelancer'}
        style={{width: '80%'}}
      />
      <Button
        onClick={() => {
          navigation.navigate('CustomerSignup');
        }}
        text={'Customer / Service Provider'}
        style={{width: '80%', marginTop: 20}}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
