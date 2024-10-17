import React, { useEffect, useMemo, useState } from 'react';
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
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import { SIZES, perHeight, perWidth } from '../../utils/position/sizes';
import colors from '../../constants/colors';
import ServiceCard from '../../components/cards/serviceCard';
import ClosetoYou from '../../components/cards/closeToYou';
import CategoryList2 from '../../components/CategoryList2';
import Modal from 'react-native-modal';
import { StackNavigation } from '../../constants/navigation';
import { useNavigation } from '@react-navigation/native';
import {
  addPopularServices,
  addSCategory,
  addUserData,
  addcloseProvider,
  addpairedProvider,
  addprovidersByCateegory,
  logout,
  setallServices,
  setwelcomeModal,
} from '../../store/reducer/mainSlice';
import {
  getAllServices,
  getCategory,
  getPairedProviders,
  getPopularService,
  getProviderByProximity,
  getProviderByService,
  getSupportUser,
  getUser,
} from '../../utils/api/func';
import FastImage from 'react-native-fast-image';
import socket from '../../utils/socket';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ToastLong } from '../../utils/utils';
import WelcomeModal from '../../components/SignupModal';
import axios from 'axios';
import { getUnreadMessages } from '../../utils/api/chat';
import NetInfo from '@react-native-community/netinfo';
import PairedProviders from '../../components/cards/pairedProviders';
import TextInputs from '../../components/TextInput';


const Home = () => {
  useEffect(() => {
    //Request location permission
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          // Permission granted, get user's location
          try {
            Geolocation.getCurrentPosition(
              (position: any) => {
                const { latitude, longitude } = position.coords;
                // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              },
              (error: any) => console.error(error),
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
            );
          } catch (error) {
            console.error(error);
          }
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
      // console.error('GEOLOCATION::', res?.data?.user?.geoLocation);
      const userData = res?.data?.user;
      const netInfo = await NetInfo.fetch();
      const isInternetConnected = netInfo.isConnected;
      if (
        !isInternetConnected ||
        !userData?.geoLocation ||
        !userData.geoLocation.coordinates ||
        (userData.geoLocation.coordinates[0] === 0 &&
          userData.geoLocation.coordinates[1] === 0) ||
        !userData.geoLocation.coordinates.length
      ) {
        // if (isNetwork) {
        navigation.navigate('AddAddress');
        ToastLong('Address is required');
        // } else {
        //   ToastLong('Internet Disconnected');
        // }
      } else {
        // Continue with your logic if geoLocation is valid
      }
    };
    const initGetServices = async () => {
      setisLoading(true);
      let d: any = [];
      const res: any = await getAllServices('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setallServices(res?.data?.data));
        res?.data?.data?.map((item: any) => {
          d.push({ label: item?.name, value: item._id ?? item.id });
        });
      }

      setisLoading(false);
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
    const initGetPairedProviders = async () => {
      setisLoading(true);
      const res: any = await getPairedProviders('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addpairedProvider(res?.data?.data));
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
    initGetPairedProviders();
    initGetProviderByProximity();
    getSupportUser('');
    getUnreadMessages();
    initGetServices();
  }, [dispatch]);
  //selectors
  const userData = useSelector((state: any) => state.user.userData);
  const _getCategory = useSelector((state: any) => state.user.category);
  const _popularServices = useSelector(
    (state: any) => state.user.popularServices,
  );
  const allservices = useSelector((state: any) => state.user.allservices);
  const supportUser = useSelector((store: any) => store.user.supportUser);
  const closeProvider = useSelector((state: any) => state.user.closeProvider);
  const pairedProviders = useSelector((state: any) => state.user.pairedProviders);
  const isNetwork = useSelector((state: any) => state.user.isNetwork);
  // console.log('daaaaattttttaaaa', 'here:', closeProvider);
  const welcomeModal = useSelector((state: any) => state.user.welcomeModal);
  const [ContactAgent, setContactAgent] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const handleDropdownClick = (catId: React.SetStateAction<null>) => {
    // console.log(catId);
    if (catId === openDropdownId) {
      setOpenDropdownId(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdownId(catId); // Open the clicked dropdown
    }
  };
  // Sentry.nativeCrash();
  const [searchInput, setsearchInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    const initGetUsers = async () => {
      const res: any = await getUser('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      if (res?.status === 401 || res?.status === 400) {
        if (
          res?.error?.message === "Invalid token or user doesn't exist" ||
          res?.error?.data?.message === "Invalid token or user doesn't exist"
        ) {
          dispatch(logout());
        }
      }
      // console.error('GEOLOCATION::', res?.data?.user?.geoLocation);
      const userData = res?.data?.user;
      const netInfo = await NetInfo.fetch();
      const isInternetConnected = netInfo.isConnected;
      if (
        !isInternetConnected ||
        !userData?.geoLocation ||
        !userData.geoLocation.coordinates ||
        (userData.geoLocation.coordinates[0] === 0 &&
          userData.geoLocation.coordinates[1] === 0) ||
        !userData.geoLocation.coordinates.length
      ) {
        navigation.navigate('AddAddress');
        ToastLong('Address is required');
      } else {
      }
    };
    const initGetServices = async () => {
      setisLoading(true);
      let d: any = [];
      const res: any = await getAllServices('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setallServices(res?.data?.data));
        res?.data?.data?.map((item: any) => {
          d.push({ label: item?.name, value: item._id ?? item.id });
        });
      }

      setisLoading(false);
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
    const initGetPairedProviders = async () => {
      setisLoading(true);
      const res: any = await getPairedProviders('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addpairedProvider(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetProviderByProximity = async () => {
      setisLoading(true);
      const res: any = await getProviderByProximity(userData?._id);
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
    initGetPairedProviders();
    initGetProviderByProximity();
    initGetServices();
    getSupportUser('');
    getUnreadMessages();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulating a delay, replace with your actual refresh logic
  };

  useEffect(() => {
    socket.connect();
    // console.log('-idid', socket.id);
    socket.emit('authentication', userData);
  }, []);

  const handlePostJobPress = () => {
    navigation.navigate('PostJob');
  };

  const handleSearch = useMemo(() => {
    var searchArray = [];
    if (
      Array.isArray(allservices) &&
      allservices.length
    ) {
      searchArray = allservices?.filter((service: { name: string }) => {
        const text = service?.name ? service?.name.toLowerCase() : ''.toLowerCase();
        const textSearch = searchInput.toLowerCase();
        return text.indexOf(textSearch) > -1;
      });
    }

    if (searchInput && searchArray.length) {
      return searchArray;
    } else {
      return [];
    }
  }, [searchInput, allservices]);

  // const handleSearch = (query: string) => {
  //   try {
  //     if (!query) {
  //       // If the query is empty, reset the search result
  //       setSearchServicesResult([]);
  //       return;
  //     }
  //     // Filter the data based on the search input
  //     const filteredData =
  //       allservices?.filter((service: { name: string }) =>
  //         service.name.toLowerCase().includes(query.toLowerCase()),
  //       ) || [];
  //     // const filtered =
  //     //   customerOrders.filter(
  //     //     order =>
  //     //       order?.serviceProvider?.firstName
  //     //         ?.toLowerCase()
  //     //         ?.includes(query.toLowerCase()) ||
  //     //       order?.serviceProvider?.lastName
  //     //         ?.toLowerCase()
  //     //         ?.includes(query.toLowerCase()),
  //     //   ) || [];

  //     // console.log(filtered, '         ..............................');
  //     // console.log('RESSSSS:', filtered);
  //     // setFilteredServices(filtered);
  //     setSearchServicesResult(filteredData);
  //   } catch (error) {
  //     console.error('An unexpected error occurred during search:', error);
  //     // Handle unexpected error, show an error message, or take appropriate action
  //   } finally {
  //     // Optional: You can update the loading state here if needed
  //     // setLoading(false);
  //   }
  // };
  const debounce = (func: any, delay: any) => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleSearch = debounce(handleSearch, 500);

  const userType = useSelector((state: any) => state.user.isLoggedIn);

  const initFetchProviders = async (id: any, itemDetail: any) => {
    setsearchInput('');
    console.log("itemDetail id", id);
    setisLoading(true);
    const res: any = await getProviderByService(id);
    console.log('service-dddddddd', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addprovidersByCateegory(res?.data?.data));
    }
    //if customer navigate to _service , if provide navigate to _VService
    if (userType.userType === 'CUSTOMER') {
      navigation.navigate('_Services', {service: itemDetail});
    } else {
      navigation.navigate('_VServices', {service: itemDetail});
    }
    setisLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEBEB' }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: '#EBEBEB',
          },
        ]}>
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
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: colors.parpal,
                }}
                // source={
                //   userData?.profilePic
                //     ? {
                //         uri: userData?.profilePic,
                //         headers: {Authorization: 'someAuthToken'},
                //         priority: FastImage.priority.high,
                //       }
                //     : images.profile
                // }
                source={{
                  uri: userData?.profilePic,
                  headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.high,
                  // cache: FastImage.cacheControl.cacheOnly,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Image
                source={images.profile}
                style={{ width: 50, height: 50, borderRadius: 25 }}
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

          <View style={tw`flex flex-row items-center`}>
            <TouchableOpacity
              onPress={handlePostJobPress}
              hitSlop={{ top: 50, bottom: 50, left: 10, right: 10 }}
              style={tw`bg-black px-3 py-3  rounded-lg mr-3`}>
              <Textcomp
                text={'Post a Job'}
                size={12}
                lineHeight={17}
                color={'#FFFFFF'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
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
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`flex flex-col mt-5 justify-center px-4 relative z-999`}>
          <TextInputs
            style={{ width: '100%' }}
            icon={<Image
              source={images.search}
              style={{
                height: 16,
                width: 16,
              }}
              resizeMode="contain"
            />}
            labelText={'What service do you need help with?'}
            state={searchInput}
            // setState={setsearchInput}
            setState={text => {
              setsearchInput(text);
              // handleSearch();
            }}
          />
          {handleSearch.length > 0 && <View
            style={[
              tw`flex flex-col py-4 mt-4 absolute left-5 -bottom-70`,
              {
                backgroundColor: '#D9D9D9',
                borderRadius: 12,
                height: perHeight(200),
                width: '100%',
                marginHorizontal: 'auto',
                paddingHorizontal: 2,
              },
            ]}>
            <FlatList
              data={handleSearch}
              showsHorizontalScrollIndicator={false}
              renderItem={(item: any, index: any) => {
                console.log(item.item);
                return (
                  <TouchableOpacity onPress={()=> initFetchProviders(item.item._id, item.item)} style={[tw`py-2`]}>
                    <Textcomp
                      text={`${item.item.name}`}
                      size={14}
                      lineHeight={17}
                      color={'#000413'}
                      fontFamily={'Inter-Medium'}
                    />
                  </TouchableOpacity>
                );
              }
              }
              style={{ paddingLeft: 20 }}
              keyExtractor={item => item.id}
            />
          </View>}
        </View>
        <View
          style={[tw``, { marginLeft: perWidth(18), marginTop: perHeight(12) }]}>
          <Textcomp
            // text={`Welcome ${
            //   userData?.firstName !== undefined ? userData?.firstName : ''
            // },`}
            text={`Welcome ${userData?.firstName !== undefined
              ? userData?.firstName?.trimEnd()
              : ''
              },`}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* Paired Providers */}
          {pairedProviders?.length > 0 && <>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                { marginLeft: perWidth(16), marginTop: perHeight(14) },
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Paired Providers'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PairedProviders');
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
            <Textcomp
              text={'We have selected these service providers for you. View their Profile and Negotiate with them.'}
              size={10}
              lineHeight={16}
              color={'#4A4949'}
              fontFamily={'Inter-Regular'}
              style={[tw`mx-4`]}
            />
            <View style={{ flex: 1 }}>
              <FlatList
                data={pairedProviders}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={(item: any, index: any) => {
                  if (item.index === pairedProviders?.length - 1) {
                    // console.log('paired providers to you', item?.item);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ServiceProviderProfile', {
                            item: item,
                            serviceName: item.item.name,
                            id: item.item.id,
                          });
                        }}>
                        <PairedProviders
                          navigation={navigation}
                          item={item?.item}
                          index={index}
                          showServices={false}
                        />
                        <View style={{ marginRight: 50 }} />
                      </TouchableOpacity>
                    );
                  } else {
                    // console.log('Close to you',item?.item);
                    return (
                      <PairedProviders
                        navigation={navigation}
                        item={item?.item}
                        index={index}
                        showServices={false}
                      />
                    );
                  }
                }}
                style={{ paddingLeft: 20 }}
                keyExtractor={item => item.id}
              />
            </View>
          </>
          }
          {/* Popular Section */}
          <View
            style={[
              tw`flex flex-row items-center justify-between`,
              { marginLeft: perWidth(18), marginTop: perHeight(22) },
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
              <View style={{ flex: 1 }}>
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
            <View style={[tw`mt-4`, { marginLeft: perWidth(27) }]}>
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
          <>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                { marginLeft: perWidth(24), marginTop: perHeight(52) },
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
            {closeProvider?.length > 0 && (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={closeProvider}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item: any, index: any) => {
                    if (item.index === closeProvider?.length - 1) {
                      // console.log('Close to you', item?.item);
                      return (
                        <>
                          <ClosetoYou
                            navigation={navigation}
                            item={item?.item}
                            index={index}
                          />
                          <View style={{ marginRight: 50 }} />
                        </>
                      );
                    } else {
                      // console.log('Close to you',item?.item);
                      return (
                        <ClosetoYou
                          navigation={navigation}
                          item={item?.item}
                          index={index}
                        />
                      );
                    }
                  }}
                  style={{ paddingLeft: 20 }}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
            {closeProvider?.length < 1 && (
              <View style={[tw`mt-4`, { marginLeft: perWidth(27) }]}>
                <Textcomp
                  text={'No Service Provider within your location'}
                  size={18}
                  lineHeight={18}
                  color={'#88087B'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            )}
          </>

          {/* Service Ctagories */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                { marginLeft: perWidth(24), marginTop: perHeight(52) },
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
                        isOpen={item?._id === openDropdownId}
                        onDropdownClick={(catId: any) =>
                          handleDropdownClick(catId)
                        }
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
        style={{ width: SIZES.width, marginHorizontal: 0 }}
        deviceWidth={SIZES.width}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setInfoModal(false)}
            style={tw`flex-1`}
          />
          {!ContactAgent && (
            <View
              style={[
                tw`h-[25%]  items-center mt-auto bg-[#D9D9D9]`,
                {
                  marginBottom: -20,
                },
              ]}>
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
