import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import colors from '../../constants/colors';
import commonStyle from '../../constants/commonStyle';
import CustomButton from '../../components/Button';
import CameraIcon from '../../assets/svg/CameraIcon';
import Textcomp from '../../components/Textcomp';
import images from '../../constants/images';
import tw from 'twrnc';
import {ToastShort} from '../../utils/utils';

const PhotoUploadScreen = () => {
  const navigation = useNavigation();
  const handleContinue = async () => {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (permission === RESULTS.GRANTED) {
      launchCameraFunction();
    } else {
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult === RESULTS.GRANTED) {
        launchCameraFunction();
      } else {
        console.log('Camera permission denied');
        ToastShort('Camera permission denied');
      }
    }
  };

  const launchCameraFunction = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        ToastShort('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        ToastShort(`'ImagePicker Error: ', ${response.errorMessage}`);
      } else {
        const imageObject = response.assets[0];
        navigation.navigate('IdVerification', {imageObject});
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          paddingBottom: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={images.back}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-auto`}>
          <Textcomp
            text={'ID Check'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.cameraIconContainer}>
          <CameraIcon />
        </TouchableOpacity>
        <Textcomp
          text={
            'Please take a clear picture of yourself. This will help our customers recognize you for on-site jobs.'
          }
          color={colors.black}
          size={16}
          style={{textAlign: 'center'}}
        />
        <Textcomp
          text={
            'Your picture will only be shared with customers if the job is on-site.'
          }
          color={colors.black}
          size={16}
          style={{textAlign: 'center', marginTop: 10}}
          fontFamily="Inter-Bold"
        />
      </View>
      <CustomButton
        text={'Continue'}
        onClick={handleContinue}
        textStyle={styles.buttonText}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.greyLight1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraIconContainer: {
    backgroundColor: colors.greyLight1,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  noteText: {
    fontSize: 14,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: colors.parpal,
    padding: 15,
    borderRadius: 5,
    width: '87.5%',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: commonStyle.fontFamily.semibold,
    textAlign: 'center',
  },
});

export default PhotoUploadScreen;
