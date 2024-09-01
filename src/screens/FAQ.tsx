import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import images from '../constants/images';
import Header from '../components/Header';
import { addfaq } from '../store/reducer/mainSlice';
import { getFAQ } from '../utils/api/func';
import FAQcomp from '../components/FAQcomp';

export default function FAQ() {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const faq = useSelector((state: any) => state.user.faq);
  const userType = useSelector((state: any) => state.user.isLoggedIn);

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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        image={images.back}
        title={'FAQs'}
        style={styles.header}
        imageStyle={styles.headerImage}
        textStyle={styles.headerText}
      />
      <ScrollView>
        <View style={styles.separator} />
        {userType.userType === 'CUSTOMER'
          ? faq?.customer?.map((item: any, index: any) => (
              <FAQcomp key={index} index={index} item={item} />
            ))
          : faq?.provider?.map((item: any, index: any) => (
              <FAQcomp key={index} index={index} item={item} />
            ))}
        <View style={tw`h-20`} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
  },
  headerImage: {
    tintColor: '#000',
  },
  headerText: {
    color: '#000',
  },
  separator: {
    backgroundColor: '#000',
    height: 2,
  },
});
