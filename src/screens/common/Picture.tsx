import React, {useState} from 'react';
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
import {useSelector} from 'react-redux';
import {
  getUser,
  updateUserData,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import { toastAlertSuccess } from '../../utils/alert';

const PhotoUploadScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector((state: any) => state.user.userData);
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
    // navigation.navigate('IdVerification', {url: ''});
  };

  const launchCameraFunction = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options, async (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        ToastShort('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        ToastShort(`'ImagePicker Error: ', ${response.errorMessage}`);
      } else {
        const imageObject = response.assets[0];

        if (response?.assets?.length > 0) {
          console.log('resp', response?.assets[0]);
          // setPhotoUri(response?.assets[0].uri);

          await uploadImgorDoc(response?.assets[0]);
        }

        // navigation.navigate('IdVerification', {imageObject});
      }
    });
  };
  const [loading, setloading] = useState(false);
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setloading(true);
    const res: any = await uploadAssetsDOCorIMG(param);
    setloading(false);
    if (res?.status === 201 || res?.status === 200) {
      console.log('image:', res);
      await initUpdate({verificationImage: res?.data.url});
      // navigation.navigate('IdVerification', {url: res?.data.url ?? ''});
    } else {
      Snackbar.show({
        text:
          res?.error?.message ??
          res?.error?.data?.message ??
          'Oops!, an error occurred',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };
  const initUpdate = async (param: any) => {
    setloading(true);
    const res: any = await updateUserData(param);
    if ([200, 201].includes(res?.status)) {
      toastAlertSuccess('Picture Upload Successful.');
      navigation.navigate('IdVerification', {url: res?.data.url ?? ''});
      await initGetUsers();
    } else {
    }
    setloading(false);
  };
  console.log('====================================');
  console.log(userData?.identity);
  console.log('====================================');
  const initGetUsers = async () => {
    const res: any = await getUser('');
    if (res?.status === 201 || res?.status === 200) {
      console.log('====================================');
      console.log(res?.data?.user?.identity);
      console.log('====================================');
    }
  };
  initGetUsers();

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
      <Spinner visible={loading} customIndicator={<CustomLoading />} />
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
