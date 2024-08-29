import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useDispatch } from 'react-redux';
import { emptyCategory, logout } from '../store/reducer/mainSlice';
import Button from '../components/Button';
import images from '../constants/images';
import TextInputs from '../components/TextInputs';
import { StackNavigation } from '../constants/navigation';

const Home = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');

  
  return (
    <View style={[{ flex: 1, backgroundColor: '#fff' }, ]}>
      <ScrollView>
        <Header title={'Home'} image={images.back} func={()=>{navigation.navigate('ProfileStep1')}} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileStep1')}>
            <Image source={images.profile} style={{ height: 40, width: 40, }} resizeMode='contain' />
          </TouchableOpacity>
          <TextInputs style={{ marginTop: 10, width: '70%' }} labelText={'Enter Email'} state={search} setState={setSearch} />
          <TouchableOpacity style={{ backgroundColor: '#000', width: 40, height: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.question} style={{ height: 20, width: 20, }} resizeMode='contain' />
          </TouchableOpacity>
        </View>
        <Text>Home screen</Text>
        <Button text={'Log Out'}
          style={{ marginBottom: 20 }}
          onClick={() => dispatch(logout())} />

        <Button onClick={() => {
          navigation.navigate('TermAndCondition')
        }}
          style={{ marginBottom: 20 }}
          text={`Term And Condition`} />
        <Button onClick={() => {
          navigation.navigate('FAQ')
          // navigation.navigate('ProfileStep2', { serviceId: 1 })

        }}

          text={`FAQ`} />
      </ScrollView>
    </View>
  );
};


export default Home;
