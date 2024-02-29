import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  LogBox,
  NativeEventEmitter,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  LivenessResponse,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  MatchFacesSimilarityThresholdSplit,
  RNFaceApi,
} from '@regulaforensics/react-native-face-api';
// import FaceSDK from '@regulaforensics/react-native-face-api';
// import FaceSDK from '@regulaforensics/react-native-face-core';
import tw from 'twrnc';
import {perHeight, perWidth} from '../utils/position/sizes';
import colors from '../constants/colors';
import images from '../constants/images';
import {completeProfile, getUser, updateUserData} from '../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {ToastLong} from '../utils/utils';
import {addUserData} from '../store/reducer/mainSlice';
import {useDispatch} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';

LogBox.ignoreLogs(['new NativeEventEmitter']);
const eventManager = new NativeEventEmitter(RNFaceApi);
var image1 = new MatchFacesImage();
var image2 = new MatchFacesImage();

export default function FaceDetection({navigation, route}: any) {
  const [img1, setImg1] = useState(require('../assets/images/us_flag.png'));
  const [img2, setImg2] = useState(require('../assets/images/welcome.png'));
  const [similarity, setSimilarity] = useState('nil');
  const [liveness, setLiveness] = useState('nil');

  const {page} = route.params;
  useEffect(() => {
    eventManager.addListener('videoEncoderCompletionEvent', json => {
      const response = JSON.parse(json);
      const transactionId = response.transactionId;
      const success = response.success;
      console.log('video_encoder_completion:');
      console.log('    success: ' + success);
      console.log('    transactionId: ' + transactionId);
    });

    FaceSDK.init(
      json => {
        const response = JSON.parse(json);
        if (!response.success) {
          console.log('Init failed: ');
          console.log(json);
        }
      },
      e => {},
    );

    return () => {
      eventManager.removeAllListeners('videoEncoderCompletionEvent');
    };
  }, []);

  const pickImage = first => {
    Alert.alert(
      'Select option',
      '',
      [
        {
          text: 'Use gallery',
          onPress: () =>
            launchImageLibrary({includeBase64: true}, response => {
              if (response.assets == undefined) {
                return;
              }
              setImage(
                first,
                response.assets[0].base64,
                Enum.ImageType.PRINTED,
              );
            }),
        },
        {
          text: 'Use camera',
          onPress: () =>
            FaceSDK.presentFaceCaptureActivity(
              result => {
                setImage(
                  first,
                  FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap,
                  Enum.ImageType.LIVE,
                );
              },
              e => {},
            ),
        },
      ],
      {cancelable: true},
    );
  };

  const setImage = (first, base64, type) => {
    if (base64 == null) {
      return;
    }
    setSimilarity('nil');
    if (first) {
      image1.bitmap = base64;
      image1.imageType = type;
      setImg1({uri: 'data:image/png;base64,' + base64});
      setLiveness('nil');
    } else {
      image2.bitmap = base64;
      image2.imageType = type;
      setImg2({uri: 'data:image/png;base64,' + base64});
    }
  };

  const clearResults = () => {
    setImg1(require('../assets/images/us_flag.png'));
    setImg2(require('../assets/images/welcome.png'));
    setSimilarity('nil');
    setLiveness('nil');
    image1 = new MatchFacesImage();
    image2 = new MatchFacesImage();
  };

  const matchFaces = () => {
    if (
      image1 == null ||
      image1.bitmap == null ||
      image1.bitmap == '' ||
      image2 == null ||
      image2.bitmap == null ||
      image2.bitmap == ''
    ) {
      return;
    }
    setSimilarity('Processing...');
    const request = new MatchFacesRequest();
    request.images = [image1, image2];
    FaceSDK.matchFaces(
      JSON.stringify(request),
      response => {
        response = MatchFacesResponse.fromJson(JSON.parse(response));
        FaceSDK.matchFacesSimilarityThresholdSplit(
          JSON.stringify(response.results),
          0.75,
          str => {
            const split = MatchFacesSimilarityThresholdSplit.fromJson(
              JSON.parse(str),
            );
            setSimilarity(
              split.matchedFaces.length > 0
                ? (split.matchedFaces[0].similarity * 100).toFixed(2) + '%'
                : 'error',
            );
          },
          e => {
            setSimilarity(e);
          },
        );
      },
      e => {
        setSimilarity(e);
      },
    );
  };

  const dispatch = useDispatch();
  const initGetUsers = async () => {
    const res: any = await getUser('');
    // console.log('dddddddd', res);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
  };

  const startLiveness = () => {
    FaceSDK.startLiveness(
      async result => {
        result = LivenessResponse.fromJson(JSON.parse(result));

        setImage(true, result.bitmap, Enum.ImageType.LIVE);
        if (result.bitmap != null) {
          setLiveness(
            result.liveness === Enum.LivenessStatus.PASSED
              ? 'passed'
              : 'unknown',
          );
          if (result.liveness === Enum.LivenessStatus.PASSED) {
            await updateLive();
            await initGetUsers();
            if (page === 'Profile') {
              FaceSDK.stopLivenessProcessing(
                () => {},
                () => {},
              );
              navigation.navigate('Congratulations');
              navigation.navigate('Congratulations');
            } else {
              FaceSDK.stopLivenessProcessing(
                () => {},
                () => {},
              );
              navigation.navigate('Home');
            }
          }
        }
      },
      e => {},
    );
  };

  const [loader, setloader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setloader(false);
      startLiveness();
    }, 10000);
  }, []);
      // const res: any = await updateUserData({
      //   liveTest: true,
      // });
  const updateLive = async () => {
    try {
      const res: any = await completeProfile({
        liveTest: true,
      });
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        ToastLong('Live Test Passed');
      }
    } catch (error) {
      Snackbar.show({
        text: error?.message || 'Oops!, an error occured',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    } finally {
      initGetUsers();
    }
  };

  return (
    <View style={[tw`flex-1 bg-[#121212]`, {}]}>
      <View style={[tw`flex-1`, {}]}>
        <SafeAreaView style={tw`h-full w-full`}>
          <View
            style={[
              tw`px-2 py-1 flex flex-row items-center justify-between w-full `,
              {
                paddingTop:
                  Platform.OS === 'ios'
                    ? getStatusBarHeight(true)
                    : getStatusBarHeight(true) + 20,
              },
            ]}>
            {/* <Backicon /> */}
            <TouchableOpacity
              onPress={() => {
                // navigation.goBack()
                navigation.navigate('Congratulations');
              }}>
              <Text
                style={[
                  tw`text-center text-[${colors.white}]`,
                  {
                    fontSize: 14,
                    lineHeight: 18,
                    marginLeft: perWidth(3),
                    fontFamily: 'Inter-Bold',
                  },
                ]}>
                Skip
              </Text>
              {/* <Image
                style={{width: 25, height: 25, tintColor: 'white'}}
                source={images.back}
              /> */}
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Text
                style={[
                  tw`text-center text-[${colors.white}]`,
                  {
                    fontSize: 20,
                    lineHeight: 24,
                    marginLeft: perWidth(15),
                    fontFamily: 'Inter-Bold',
                  },
                ]}>
                Virtual Interview
              </Text>
            </View>
          </View>

          <View style={tw`mx-auto mt-[10%]`}>
            <Text
              style={[
                tw`text-center text-[${colors.white}]`,
                {
                  fontSize: 16,
                  lineHeight: 19,
                  marginLeft: perWidth(15),
                  fontFamily: 'Inter-Bold',
                },
              ]}>
              Follow The Instructions Below
            </Text>
          </View>

          {loader && (
            <View style={tw`my-auto`}>
              <ActivityIndicator size={'large'} color={'white'} />
            </View>
          )}

          {/* <View style={{f}}>
            <Text style={{marginLeft: -20}}>Similarity: {similarity}</Text>
            <Text style={{marginLeft: 20}}>Liveness: {liveness}</Text>
          </View> */}
        </SafeAreaView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 12,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  resultsScreenBackButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
  },
});
