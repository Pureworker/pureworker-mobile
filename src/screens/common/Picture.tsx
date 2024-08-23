import React, {useState, useCallback, useEffect} from 'react';
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
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import tw from 'twrnc';
import colors from '../../constants/colors';
import commonStyle from '../../constants/commonStyle';
import images from '../../constants/images';
import CustomButton from '../../components/Button';
import CameraIcon from '../../assets/svg/CameraIcon';
import Textcomp from '../../components/Textcomp';
import CustomLoading from '../../components/customLoading';
import {ToastShort} from '../../utils/utils';
import {
  getUser,
  updateUserData,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import {toastAlertSuccess} from '../../utils/alert';

const PhotoUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    initGetUsers();
  }, []);

  const initGetUsers = useCallback(async () => {
    const res: any = await getUser('');
    if (res?.status === 201 || res?.status === 200) {
      console.log('User identity:', res?.data?.user?.identity);
    }
  }, []);
  const handleContinue = useCallback(async () => {
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
  }, []);
  const launchCameraFunction = useCallback(() => {
    const options: any = {
      mediaType: 'photo',
      saveToPhotos: true,
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        ToastShort('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
        ToastShort(`ImagePicker Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        await uploadImgorDoc(response.assets[0]);
      }
    });
  }, []);
  const uploadImgorDoc = useCallback(
    async (param: {
      uri: string;
      name: string | null;
      copyError: string | undefined;
      fileCopyUri: string | null;
      type: string | null;
      size: number | null;
    }) => {
      setLoading(true);
      try {
        const res: any = await uploadAssetsDOCorIMG(param);
        if (res?.status === 201 || res?.status === 200) {
          await initUpdate({verificationImage: res?.data.url});
        } else {
          Snackbar.show({
            text:
              res?.error?.message ??
              res?.error?.data?.message ??
              'Oops! An error occurred',
            duration: Snackbar.LENGTH_LONG,
            textColor: '#fff',
            backgroundColor: '#88087B',
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Snackbar.show({
          text: 'An error occurred while uploading the image',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  const initUpdate = useCallback(
    async (param: any) => {
      setLoading(true);
      try {
        const res = await updateUserData(param);
        if ([200, 201].includes(res?.status)) {
          toastAlertSuccess('Picture Upload Successful.');
          navigation.navigate('IdVerification', {url: res?.data.url ?? ''});
          await initGetUsers();
        }
      } catch (error) {
        console.error('Error updating user data:', error);
        Snackbar.show({
          text: 'An error occurred while updating user data',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      } finally {
        setLoading(false);
      }
    },
    [navigation, initGetUsers],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={images.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-auto`}>
          <Textcomp
            text="ID Check"
            size={17}
            lineHeight={17}
            color="#000413"
            fontFamily="Inter-SemiBold"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.cameraIconContainer}>
          <CameraIcon />
        </TouchableOpacity>
        <Textcomp
          text="Please take a clear picture of yourself. This will help our customers recognize you for on-site jobs."
          color={colors.black}
          size={16}
          style={styles.instructionsText}
        />
        <Textcomp
          text="Your picture will only be shared with customers if the job is on-site."
          color={colors.black}
          size={16}
          style={styles.noteText}
          fontFamily="Inter-Bold"
        />
      </View>
      <CustomButton
        text="Continue"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  backIcon: {
    height: 25,
    width: 25,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  noteText: {
    textAlign: 'center',
    marginTop: 10,
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
