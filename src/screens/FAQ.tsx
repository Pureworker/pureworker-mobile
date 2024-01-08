import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../constants/images';
import commonStyle from '../constants/commonStyle';
import Header from '../components/Header';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {addfaq} from '../store/reducer/mainSlice';
import {getFAQ} from '../utils/api/func';
import {StackNavigation} from '../constants/navigation';

export default function FAQ() {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const faq = useSelector((state: any) => state.user.faq);
  useEffect(() => {
    const initFaq = async () => {
      setisLoading(true);
      const res: any = await getFAQ('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addfaq(res?.data?.data));
      }
      setisLoading(false);
    };
    initFaq();
  }, [dispatch]);
  const userType = useSelector((state: any) => state.user.isLoggedIn);
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

        {userType.userType === 'CUSTOMER' && (
          <>
            {faq?.customer?.map((item: any, index: any) => {
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
                      {item?.question}
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
                    {item?.answer}
                  </Text>
                </View>
              );
            })}
          </>
        )}
        {userType.userType !== 'CUSTOMER' && (
          <>
            {faq?.provider?.map((item: any, index: any) => {
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
                      {item?.question}
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
                    {item?.answer}
                  </Text>
                </View>
              );
            })}
          </>
        )}
        <View style={tw`h-20`} />
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
