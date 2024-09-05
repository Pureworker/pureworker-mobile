import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';
import CustomButton from '../../../components/Button';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import images from '../../../constants/images';

const ProductDisplay = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {job}:any = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={colors.black}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.titleTwo}>Jobs Posted</Text>
        <Text style={styles.titleThree}>
          Delete the job post once you hire a service provider
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={images.product} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.productDescription}>{job.description}</Text>
          <View style={styles.row}>
            <Text style={styles.storeAddress}>Address</Text>
            <Text style={styles.text}>123 Main Street, Lagos</Text>
          </View>


          
          <View style={styles.row}>
            <Text style={styles.storeAddress}>Delivery Date</Text>
            <Text style={styles.text}>{job?.date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.storeAddress}>Price</Text>
            <Text style={styles.text}>₦{job.price}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            text={'Edit'}
            onClick={() => {}}
            borderColor={colors.black}
            textStyle={{
              color: colors.primary,
              fontSize: 17,
              fontFamily: commonStyle.fontFamily.semibold,
            }}
            style={styles.buttonOne}
          />

          <CustomButton
            text={'Delete'}
            onClick={() => {}}
            borderColor={colors.primary}
            textStyle={{
              color: colors.black,
              fontSize: 17,
              fontFamily: commonStyle.fontFamily.semibold,
            }}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleTwo: {
    fontSize: 17.5,
    lineHeight: 22,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    width: '95%',
    textAlign: 'center',
  },
  titleThree: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    width: '95%',
    textAlign: 'center',
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
  },
  productDescription: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'justify',
  },
  row: {
    marginTop: 19,
    flexDirection: 'row',
    marginBottom: 10,
  },
  storeAddress: {
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.black,
    fontSize: 16,
    width: '30%',
  },
  text: {
    fontFamily: commonStyle.fontFamily.medium,
    color: colors.black,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.white,
  },
  button: {
    width: '45%',
    backgroundColor: colors.primary,
  },
  buttonOne: {
    width: '45%',
    backgroundColor: colors.darkPurple,
  },
});

export default ProductDisplay;
