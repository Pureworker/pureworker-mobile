import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import {SIZES} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInputs';
import TextWrapper from '../../components/TextWrapper';
import {generalStyles} from '../../constants/generalStyles';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from 'redux-persist/es/storage';
import {
  addProfileData,
  addUserData,
  addcompleteProfile,
} from '../../store/reducer/mainSlice';
import {
  completeProfile,
  getProfile,
  getUser,
  uploadAssetsDOCorIMG,
} from '../../utils/api/func';
import FastImage from 'react-native-fast-image';
import CustomLoading from '../../components/customLoading';
import Spinner from 'react-native-loading-spinner-overlay';
import Snackbar from 'react-native-snackbar';

const Account = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false);
  const profileData = useSelector((state: any) => state.user.profileData);
  //

  //
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(profileData?.profilePic || '');
  let profilePicture = useRef('');
  const [description, setDescription] = useState(profileData?.description);

  const category = useSelector((state: any) => state.user.pickedServices);
  const userData = useSelector((state: any) => state.user.userData);

  useEffect(() => {
    const initGetProfile = async () => {
      const res: any = await getProfile(userData?._id);
      console.log('dddddddd-----', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
      }
    };
    initGetProfile();
  }, [dispatch]);

  //image upload
  const options = {mediaType: 'photo', selectionLimit: 1};
  const openLibraryfordp = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets[0]);
        // setPhotoUri(resp?.assets[0].uri);
        setImageUrl(resp?.assets[0].uri);
        const data = await uploadImgorDoc(resp?.assets[0]);
        console.warn('processed pic', data);
        // dispatch(addcompleteProfile({profilePic: data}));
        await upload(data);
      }
    });
    // launchCamera
  };

  const upload = async (param: string) => {
    const res: any = await completeProfile({profilePic: param});
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setisLoading(true);
    const res: any = await uploadAssetsDOCorIMG(param);
    if (res?.status === 201 || res?.status === 200) {
      console.log('ApartmentType', res?.data);
      setisLoading(false);
      return res?.data?.doc?.url;
    }
    setisLoading(false);
  };

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
                  StatusBar.currentHeight + getStatusBarHeight(true),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'Account'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`px-[5%]`}>
          <TextWrapper
            children=""
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />

          <View>
            <View
              style={[
                generalStyles.contentCenter,
                {
                  width: 145,
                  height: 145,
                  borderRadius: 145,
                  alignSelf: 'center',
                  backgroundColor: colors.greyLight1,
                },
              ]}>
              {!profileImageLoading ? (
                <>
                  {!profileData?.profilePic && imageUrl?.length < 1 ? (
                    <TextWrapper
                      children="Upload Profile Photo"
                      fontType={'semiBold'}
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: colors.black,
                      }}
                    />
                  ) : (
                    <FastImage
                      style={[
                        tw``,
                        {
                          width: 145,
                          height: 145,
                          borderRadius: 145,
                        },
                      ]}
                      source={{
                        uri: profileData?.profilePic || imageUrl,
                        headers: {Authorization: 'someAuthToken'},
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                </>
              ) : (
                <ActivityIndicator
                  style={{marginTop: 0}}
                  size={'large'}
                  color={colors.parpal}
                />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                right: 40,
                top: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  // try {
                  //   const response: any = await launchImageLibrary();
                  //   setProfileImageLoading(true);
                  //   if (response) {
                  //     const filename = response?.uri.substring(
                  //       response?.uri.lastIndexOf('/') + 1,
                  //     );
                  //     const uploadUri =
                  //       Platform.OS === 'ios'
                  //         ? response?.uri.replace('file://', '')
                  //         : response.uri;
                  //     const task = await storage()
                  //       .ref(filename)
                  //       .putFile(uploadUri);
                  //     if (task.metadata) {
                  //       profilePicture.current = task.metadata.fullPath;
                  //     }
                  //     let url = '';
                  //     if (profilePicture.current) {
                  //       url = await storage()
                  //         .ref(profilePicture.current)
                  //         .getDownloadURL();
                  //     }
                  //     setImageUrl(url);
                  //     profilePicture.current = '';
                  //     setProfileImageLoading(false);
                  //   } else {
                  //     setProfileImageLoading(false);
                  //   }
                  // } catch (error) {
                  //   console.log('error', error);
                  //   setProfileImageLoading(false);
                  // }
                  openLibraryfordp();
                }}>
                <Image
                  source={images.edit}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 20,
                    tintColor: '#000',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setImageUrl('')}>
                <Image
                  source={images.bin}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 20,
                    tintColor: '#000',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TextWrapper
            children="Description"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 20, color: colors.black}}
          />
          <View
            style={{
              height: 130,
              borderRadius: 8,
              backgroundColor: colors.greyLight1,
              marginTop: 13,
            }}>
            <TextInputs
              styleInput={{
                color: colors.black,
                paddingHorizontal: 18,
                fontSize: 12,
              }}
              style={{backgroundColor: colors.greyLight1}}
              labelText={
                'Introduce yourself and enter your profile description.'
              }
              state={description}
              setState={setDescription}
              multiline={true}
              nbLines={5}
            />
          </View>

          <View style={tw`  mt-[5%]`}>
            <TextWrapper
              children="Services"
              fontType={'semiBold'}
              style={{fontSize: 20, marginTop: 30, color: colors.black}}
            />
            {category?.length
              ? category?.map((item: any, index: any) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: index === 0 ? 15 : 0,
                        marginBottom: 15,
                        marginHorizontal: 0,
                        width: SIZES.width * 0.8,
                      }}>
                      <View
                        key={index}
                        style={{
                          paddingHorizontal: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.lightBlack,
                          height: 30,
                          width: 'auto',
                          borderRadius: 5,
                        }}>
                        <TextWrapper
                          fontType={'semiBold'}
                          style={{
                            fontSize: 12,
                            color: '#fff',
                          }}>
                          {/* {item} */}
                          {item?.name}
                        </TextWrapper>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          // dispatch(removeCategory(item));
                          navigation.navigate('EditService', {
                            index: index,
                            name: item?.name,
                          });
                        }}>
                        <Image
                          source={images.edit}
                          resizeMode="contain"
                          style={{
                            width: 20,
                            height: 20,
                            marginLeft: 20,
                            tintColor: '#000',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })
              : null}
            <Button
              onClick={() => {
                navigation.navigate('AddServices');
                // handleProfileSetup();
              }}
              style={{
                width: SIZES.width * 0.9,
                backgroundColor: colors.lightBlack,
                marginTop: 20,
              }}
              textStyle={{color: colors.primary}}
              text={'Add Services'}
            />
          </View>
        </View>
        <View style={tw`h-30`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default Account;
