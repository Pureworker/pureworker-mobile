import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import ServiceCard from '../../components/cards/serviceCard';
import ClosetoYou from '../../components/cards/closeToYou';
import CategoryList2 from '../../components/CategoryList2';
import Modal from 'react-native-modal';
import {StackNavigation} from '../../constants/navigation';
import {useNavigation} from '@react-navigation/native';
import {
  addPopularServices,
  addSCategory,
  addUserData,
  addcloseProvider,
  setwelcomeModal,
} from '../../store/reducer/mainSlice';
import {
  getCategory,
  getPopularService,
  getProviderByProximity,
  getSupportUser,
  getUser,
} from '../../utils/api/func';
import FastImage from 'react-native-fast-image';
import socket from '../../utils/socket';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {ToastLong} from '../../utils/utils';
import WelcomeModal from '../../components/SignupModal';
import axios from 'axios';

const Home = () => {
  useEffect(() => {
    //Request location permission
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          // Permission granted, get user's location
          Geolocation.getCurrentPosition(
            (position: any) => {
              const {latitude, longitude} = position.coords;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            (error: any) => console.error(error),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [InfoModal, setInfoModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      // console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      console.error('GEOLOCATION::', res?.data?.user?.geoLocation);
      const userData = res?.data?.user;
      if (
        !userData?.geoLocation ||
        !userData.geoLocation.coordinates ||
        (userData.geoLocation.coordinates[0] === 0 &&
          userData.geoLocation.coordinates[1] === 0) ||
        !userData.geoLocation.coordinates.length
      ) {
        // navigation.navigate('AddAddress');
        navigation.navigate('OrderDetails');
        ToastLong('Address is required');
      } else {
        // Continue with your logic if geoLocation is valid
      }
    };
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getCategory('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addSCategory(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetPopularServices = async () => {
      setisLoading(true);
      const res: any = await getPopularService('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addPopularServices(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetProviderByProximity = async () => {
      setisLoading(true);
      const res: any = await getProviderByProximity(userData?._id);
      // console.warn('proximity', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        if (res?.data?.data) {
          dispatch(addcloseProvider(res?.data?.data));
        }
        if (res?.data === undefined) {
          dispatch(addcloseProvider([]));
        }
        if (res?.data?.data && res?.data?.data?.length === 0) {
          dispatch(addcloseProvider([]));
        }
      }
      setisLoading(false);
    };
    initGetUsers();
    initGetCategory();
    initGetPopularServices();
    initGetProviderByProximity();
    getSupportUser('');
    // axios
    // .post('https://api.pureworker.com/api/location', {long: 0, lat: 1})
    // .then(response => {
    //   console.log('Location sent successfully:', response.data);
    // })
    // .catch(error => {
    //   console.error('Error sending location:', error);
    // });
  }, [dispatch]);
  //selectors
  const userData = useSelector((state: any) => state.user.userData);
  const _getCategory = useSelector((state: any) => state.user.category);
  const _popularServices = useSelector(
    (state: any) => state.user.popularServices,
  );
  const supportUser = useSelector((store: any) => store.user.supportUser);
  const closeProvider = useSelector((state: any) => state.user.closeProvider);
  // console.log('daaaaattttttaaaa', 'here:', closeProvider);
  const welcomeModal = useSelector((state: any) => state.user.welcomeModal);
  // const filterBySearchProduct = useMemo(() => {
  //   var searchArray = [];
  //   console.log("🚀 ~ file: Home.tsx:64 ~ filterBySearchProduct ~ getServiceProviderProfile:", getServiceProviderProfile)
  //   if (
  //     Array.isArray(getServiceProviderProfile) &&
  //     getServiceProviderProfile.length
  //   ) {
  //     searchArray = getServiceProviderProfile.filter(txt => {
  //       const data = txt?.price ? JSON.parse(txt?.price) : ''
  //       const serviceName = data[0].serviceName;
  //       const text = serviceName
  //         ? serviceName.toUpperCase()
  //         : ''.toUpperCase();
  //       const textSearch = search.toUpperCase();
  //       return text.indexOf(textSearch) > -1;
  //     });
  //   }
  //   if (searchArray.length) {
  //     return searchArray;
  //   } else {
  //     return [];
  //   }
  // }, [search, getServiceProviderProfile]);
  const [ContactAgent, setContactAgent] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const handleDropdownClick = (catId: React.SetStateAction<null>) => {
    if (catId === openDropdownId) {
      setOpenDropdownId(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdownId(catId); // Open the clicked dropdown
    }
  };
  // Sentry.nativeCrash();
  const [welcomeshow, setwelcomeshow] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Call your refresh function here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulating a delay, replace with your actual refresh logic
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: '#EBEBEB',
          },
        ]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View
            style={[
              tw`items-center justify-center`,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                paddingTop: Platform.OS === 'ios' ? 10 : 27.5,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              {userData?.profilePic ? (
                <FastImage
                  style={{width: 50, height: 50, borderRadius: 25}}
                  // source={
                  //   userData?.profilePic
                  //     ? {
                  //         uri: userData?.profilePic,
                  //         headers: {Authorization: 'someAuthToken'},
                  //         priority: FastImage.priority.normal,
                  //       }
                  //     : images.profile
                  // }
                  source={{
                    uri: userData?.profilePic,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  source={images.profile}
                  style={{width: 50, height: 50, borderRadius: 25}}
                />
              )}
            </TouchableOpacity>
            {/* <TextInputs
              style={{marginTop: 0, width: '70%'}}
              labelText={'Search'}
              state={search}
              setState={setSearch}
              icon={
                <Image
                  resizeMode="contain"
                  source={images.search}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              }
            /> */}
            <TouchableOpacity
              onPress={() => {
                setInfoModal(true);
              }}
              style={{
                backgroundColor: '#000',
                width: 40,
                height: 40,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.question}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              tw``,
              {marginLeft: perWidth(18), marginTop: perHeight(28)},
            ]}>
            <Textcomp
              // text={`Welcome ${
              //   userData?.firstName !== undefined ? userData?.firstName : ''
              // },`}
              text={`Welcome ${
                userData?.firstName !== undefined
                  ? userData?.firstName?.trimEnd()
                  : ''
              },`}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          {/* Popular Section */}
          <View
            style={[
              tw`flex flex-row items-center justify-between`,
              {marginLeft: perWidth(18), marginTop: perHeight(22)},
            ]}>
            <View style={[tw``]}>
              <Textcomp
                text={'Popular services'}
                size={25}
                lineHeight={28}
                color={'#000413'}
                fontFamily={'Inter-Medium'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ListServices');
              }}
              style={[tw`mr-4`]}>
              <Textcomp
                text={'See All'}
                size={14}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-Medium'}
              />
            </TouchableOpacity>
          </View>
          {_popularServices?.length > 0 && (
            <>
              <View style={{flex: 1}}>
                <FlatList
                  data={_popularServices.slice(0, 10)}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item: any) => {
                    return (
                      <ServiceCard
                        navigation={navigation}
                        item={item.item}
                        index={item.index}
                        key={item?.index}
                      />
                    );
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            </>
          )}
          {_popularServices?.length < 1 && (
            <View style={[tw`mt-4`, {marginLeft: perWidth(27)}]}>
              <Textcomp
                text={'No popular service yet'}
                size={18}
                lineHeight={18}
                color={'#88087B'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          )}
          {/*Close to You Section */}
          {closeProvider?.length > 0 && (
            <>
              <View
                style={[
                  tw`flex flex-row items-center justify-between`,
                  {marginLeft: perWidth(24), marginTop: perHeight(52)},
                ]}>
                <View style={[tw``]}>
                  <Textcomp
                    text={'Close to you'}
                    size={25}
                    lineHeight={28}
                    color={'#000413'}
                    fontFamily={'Inter-Medium'}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CloseToYou');
                  }}
                  style={[tw`mr-4`]}>
                  <Textcomp
                    text={'See All'}
                    size={14}
                    lineHeight={16}
                    color={'#000413'}
                    fontFamily={'Inter-Medium'}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <FlatList
                  data={closeProvider}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item: any, index: any) => {
                    if (item.index === closeProvider?.length - 1) {
                      return (
                        <>
                          <ClosetoYou
                            navigation={navigation}
                            item={item?.item}
                            index={index}
                          />
                          <View
                            style={{marginRight: 50}}
                          />
                        </>
                      );
                    } else {
                      return (
                        <ClosetoYou
                          navigation={navigation}
                          item={item?.item}
                          index={index}
                        />
                      );
                    }
                  }}
                  style={{paddingLeft: 20}}
                  keyExtractor={item => item.id}
                />
              </View>
            </>
          )}
          {/* Service Ctagories */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                {marginLeft: perWidth(24), marginTop: perHeight(52)},
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Service Categories'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
            </View>

            <View style={tw`w-full mt-4`}>
              <ScrollView
                scrollEnabled={false}
                style={tw`w-full `}
                contentContainerStyle={tw`w-[92%] mx-auto`}
                horizontal>
                <ScrollView scrollEnabled={false}>
                  {_getCategory?.map((item, index) => {
                    return (
                      <CategoryList2
                        key={index}
                        categoryName={item?.name}
                        catId={item?._id || item?.id}
                        isOpen={item?.id === openDropdownId}
                        onDropdownClick={handleDropdownClick}
                      />
                    );
                  })}
                </ScrollView>
                {/* <FlatList
                  style={{flex: 1}}
                  data={_getCategory}
                  scrollEnabled={false}
                  ListFooterComponent={() => {
                    return (
                      <View
                        style={{
                          flex: 1,
                          marginTop: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {isLoading && (
                          <ActivityIndicator
                            size={'large'}
                            color={colors.parpal}
                          />
                        )}
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    console.log(item);
                    return (
                      <CategoryList2
                        categoryName={item.name}
                        catId={item?.id}
                      />
                    );
                  }}
                  ListEmptyComponent={() => (
                    <Text
                      style={[
                        {
                          color: '#000',
                          alignSelf: 'center',
                          marginTop: 100,
                          fontFamily: commonStyle.fontFamily.regular,
                        },
                      ]}>
                      {!loading ? 'No service found' : ''}
                    </Text>
                  )}
                /> */}
              </ScrollView>
            </View>
          </View>
          <View style={tw`h-20`} />
        </ScrollView>
      </View>
      <Modal
        isVisible={InfoModal}
        onModalHide={() => {
          setInfoModal(false);
          setContactAgent(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setInfoModal(false)}
            style={tw`flex-1`}
          />
          {!ContactAgent && (
            <View style={tw`h-[20%]  items-center mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  setContactAgent(false);
                }}
                style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
              />
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  navigation.navigate('FAQ');
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 18,
                }}>
                <Textcomp
                  text={'FAQs'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setContactAgent(true);
                  socket.connect();
                  setInfoModal(false);
                  navigation.navigate('Inbox', {
                    id: supportUser?._id || supportUser?.id,
                    name: 'Support',
                  });
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 10,
                }}>
                <Textcomp
                  text={'Connect to an Agent'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          )}

          {ContactAgent && (
            <View
              style={tw`h-[10%] justify-center items-center mt-auto bg-[#D9D9D9]`}>
              <View>
                <Textcomp
                  text={'An Agent will contact you as soon as possible'}
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>

      {welcomeModal && (
        <WelcomeModal
          close={() => {
            dispatch(setwelcomeModal(false));
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
