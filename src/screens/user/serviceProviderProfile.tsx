import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import FastImage from 'react-native-fast-image';
import colors from '../../constants/colors';
import Modal from 'react-native-modal';
import Review from '../../components/Review';
import {
  useGetSingleProviderAllServiceQuery,
  useGetSingleProviderServiceQuery,
} from '../../store/slice/api';
import {
  bookMarkServiceProvide,
  deletebookMarkServiceProvide,
  getBookMarkedProviders,
  getProviderAllReview,
  getProviderDataAll,
  getUser,
} from '../../utils/api/func';
import {
  addUserData,
  addprovidersReviews,
  setbookMarkedProviders,
  setserviceProviderData,
} from '../../store/reducer/mainSlice';
import {
  ToastShort,
  formatDateHistory,
  formatDateHistory2,
  formatDateHistory3,
  removeUnnecessaryNewLines,
  timeAgo,
} from '../../utils/utils';
import socket from '../../utils/socket';

const ServiceProviderProfile = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('About');
  const [imageModal, setimageModal] = useState(false);
  const [selectedImage, setselectedImage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);

  const [saved, setsaved] = useState(false);
  const route: any = useRoute();
  console.log('ps-data:', route.params);
  const closeToData = route.params?.portfolio;
  const profileData = route.params?.item;
  const serviceName = route.params?.serviceName;
  const id = route.params?.id;

  console.log('service:', id);

  const portfolio = {};
  // profileData?.portfolio?.filter(
  //   _item => _item?.service === id,
  // );
  const price = {};
  // profileData?.priceRange.filter(_item => _item?.service === id);
  const providersReviews = useSelector(
    (state: any) => state.user.providersReviews,
  );
  const serviceProviderData = useSelector(
    (state: any) => state.user.serviceProviderData,
  );
  console.log('passedDATA-------', profileData);

  const {data: getSingleProviderServiceData, isLoading: isLoadingUser} =
    useGetSingleProviderServiceQuery(route.params?.id);
  const getSingleProviderService = getSingleProviderServiceData ?? [];

  const {data: getSingleProviderAllServiceData} =
    useGetSingleProviderAllServiceQuery(route.params?.id);
  const getSingleProviderAllService = getSingleProviderAllServiceData ?? [];
  const serviceDetail = getSingleProviderService?.serviceDetail
    ? JSON.parse(getSingleProviderService?.serviceDetail)
    : [];

  const firstPotfolio = getSingleProviderService?.ServicePotfolio?.length
    ? JSON.parse(getSingleProviderService?.ServicePotfolio[0]?.potfolioImages)
    : [];
  const secondPotfolio =
    getSingleProviderService?.ServicePotfolio?.length > 1
      ? JSON.parse(getSingleProviderService?.ServicePotfolio[1]?.potfolioImages)
      : [];
  useEffect(() => {
    const initProvider = async () => {
      setisLoading(true);
      const providerId = profileData?.portfolio?.provider ?? profileData?._id;
      const serviceId =
        profileData?.portfolio?.service || profileData?.services?.[0]?._id;

      if (!providerId || !serviceId) {
        ToastShort('Invalid Provider Id');
        setisLoading(false);
        return;
      }
      const res: any = await getProviderDataAll({
        providerID: providerId,
        serviceID: serviceId,
      });
      // const res: any = await getProviderDataAll({
      //   providerID: profileData?.portfolio?.provider || profileData?._id,
      //   serviceID:
      //     profileData?.portfolio?.service || profileData?.services?.[0]?._id,
      // });
      console.log('PROOOOOVVVIIIDERRR', res?.data?.['0']);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setserviceProviderData(res?.data?.['0']));
      }
      setisLoading(false);
      // setloading(false);
    };
    initProvider();
  }, []);
  function getDaysAgo(dateString) {
    const currentDate = new Date();
    const givenDate = new Date(dateString);
    const timeDifference = currentDate - givenDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo;
  }
  const initBookmarked = async () => {
    const res: any = await getBookMarkedProviders(id);
    console.log('bbbbbmmm', res?.data?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setbookMarkedProviders(res?.data?.data));
      // dispatch(addprovidersByCateegory(res?.data?.data));
    }
  };
  useEffect(() => {
    const _initBookmarked = async () => {
      const res: any = await getBookMarkedProviders(id);
      console.log('bbbbbmmm', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setbookMarkedProviders(res?.data?.data));
        // dispatch(addprovidersByCateegory(res?.data?.data));
      }
    };
    _initBookmarked();
  }, []);

  const handleBookmark = async () => {
    try {
      const data = {
        service: id,
        serviceProvider: profileData?._id || serviceProviderData?._id,
      };
      const res: any = await bookMarkServiceProvide(data);
      if (res?.status === 200 || res?.status === 201) {
        ToastShort('Service Provider bookmarked!.');
        setsaved(!saved);
      } else {
        ToastShort(
          `${
            res?.error?.message
              ? res?.error?.message
              : res?.error?.data?.message
              ? res?.error?.data?.message
              : 'Oops!, an error occured'
          }`,
        );
      }
    } catch (error) {
    } finally {
      const initGetUsers = async () => {
        const res: any = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
          const query = res?.data?.user?.bookmarks?.filter(
            (item: {service: any}) => item?.service === id,
          );
          setsavedProviders(query);
        }
      };
      initBookmarked();
      initGetUsers();
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      const ch = savedProviders?.filter(
        (d: {service: any}) => d?.serviceProvider === profileData?._id,
      );
      const __id = ch?.[0]?._id;
      const res: any = await deletebookMarkServiceProvide(__id);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastShort('Unboomarked!.');
        setsaved(!saved);
      } else {
        console.log(res?.status);

        ToastShort(
          `${
            res?.error?.message
              ? res?.error?.message
              : res?.error?.data?.message
              ? res?.error?.data?.message
              : 'Oops!, an error occured'
          }`,
        );
      }
    } catch (error) {
    } finally {
      const initGetUsers = async () => {
        const res: any = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
          const query = res?.data?.user?.bookmarks?.filter(
            (item: {service: any}) => item?.service === id,
          );
          setsavedProviders(query);
        }
      };
      initBookmarked();
      initGetUsers();
    }
  };

  const [savedProviders, setsavedProviders] = useState([]);
  useEffect(() => {
    const query = userData?.bookmarks?.filter(
      (item: {service: any}) => item?.service === id,
    );
    setsavedProviders(query);
  }, [id, userData?.bookmarks]);

  const ch = savedProviders?.filter(
    (d: {service: any}) => d?.serviceProvider === profileData?._id,
  );

  useEffect(() => {
    const ch = savedProviders?.filter(
      (d: {service: any}) => d?.serviceProvider === profileData?._id,
    );
  }, [profileData?._id, savedProviders]);

  // console.log('Reviews:', serviceProviderData);

  const [showModal, setShowModal] = useState(false);

  const [display, setDisplay] = useState('');

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
                  StatusBar.currentHeight + getStatusBarHeight(true),
          }}
        />
        {/* <View
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
              text={'Privacy Policy'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View> */}
        <FastImage
          style={[tw``, {width: SIZES.width, height: 200}]}
          source={{
            uri:
              profileData?.profilePic ??
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            // 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}>
          <View
            style={[
              tw`flex flex-row justify-between`,
              {paddingHorizontal: perWidth(15), marginTop: perHeight(10)},
            ]}>
            <TouchableOpacity
              style={tw`bg-white p-1 rounded-full`}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={images.back}
                resizeMode="contain"
                style={{width: 25, height: 25, tintColor: 'black'}}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Image
                source={images.save}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: 'black' }}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={tw`bg-white p-1.5 rounded-full items-center justify-center`}
              onPress={() => {
                if (
                  // userData?._id === serviceProviderData?._id ||
                  userData?._id === profileData?._id
                ) {
                  ToastShort(
                    'Service providers cannot Boommark with themselves!.',
                  );
                } else {
                  if (ch?.length > 0) {
                    handleRemoveBookmark();
                  } else {
                    handleBookmark();
                  }
                }
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: ch?.length > 0 ? '#C0392B' : 'black',
                }}
                source={ch?.length > 0 ? images.saved : images.save}
              />
            </TouchableOpacity>
          </View>
          <View style={tw`mt-auto pb-4 ml-auto mr-4`}>
            <TouchableOpacity
              onPress={() => {
                socket.connect();

                if (
                  // userData?._id === serviceProviderData?._id ||
                  userData?._id === profileData?._id
                ) {
                  ToastShort('Service providers cannot chat with themselves!.');
                } else {
                  navigation.navigate('Inbox', {
                    id: profileData?._id || profileData?._id,
                    name: profileData?.businessName
                      ? profileData?.businessName
                      : `${profileData.firstName} ${profileData?.lastName}`,
                  });
                }
              }}
              style={tw`bg-white p-1.5 rounded-lg items-center justify-center`}>
              <Image
                source={images.chat}
                resizeMode="contain"
                style={{width: 20, height: 20, tintColor: 'black'}}
              />
              <Textcomp
                text={'Chat'}
                size={12}
                lineHeight={14.5}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        </FastImage>

        <View style={tw``}>
          <View style={tw`mx-auto pt-2`}>
            <Textcomp
              text={
                profileData?.businessName
                  ? `${profileData?.businessName}`
                  : `${profileData?.firstName} ${profileData?.lastName}`
              }
              size={20}
              lineHeight={24}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View style={tw`mx-auto `}>
            <Textcomp
              text={`${serviceName}`}
              size={12}
              lineHeight={14.5}
              color={'#88087B'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View
            style={[tw`flex flex-row mt-4 mx-auto`, {width: perWidth(353)}]}>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('About');
              }}
              style={tw`w-1/3 border-b-2  items-center ${
                activeSection === 'About'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
              }`}>
              <Textcomp
                text={'About'}
                size={14}
                lineHeight={16}
                color={activeSection === 'About' && '#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('Jobs');
              }}
              style={tw`w-1/3 border-b-2  items-center ${
                activeSection === 'Jobs'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
              }`}>
              <Textcomp
                text={'Jobs'}
                size={14}
                lineHeight={16}
                color={activeSection === 'Jobs' ? '#000413' : 'black'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('Reviews');
              }}
              style={tw`w-1/3 border-b-2  items-center ${
                activeSection === 'Reviews'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
              }`}>
              <Textcomp
                text={'Reviews'}
                size={14}
                lineHeight={16}
                color={activeSection === 'Reviews' ? '#000413' : 'black'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
          {activeSection === 'About' && (
            <ScrollView
              contentContainerStyle={[
                tw`mx-2  bg-[${colors.darkPurple}]`,
                {
                  flex: 0,
                  borderRadius: 5,
                  marginTop: perHeight(12),
                  minHeight: SIZES.height * 1.4,
                },
              ]}>
              <View
                style={[
                  tw`border-b border-[#FFFFFF80]  pt-4 mx-2`,
                  {paddingBottom: perHeight(11)},
                ]}>
                <View style={tw` pt-2`}>
                  <Textcomp
                    text={'User Information'}
                    size={16}
                    lineHeight={17}
                    color={'#FFFFFF'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              </View>
              <View style={tw`border-b border-[#FFFFFF80]  pb-4 mx-2`}>
                <View style={tw`pt-2 `}>
                  <Textcomp
                    text={'User Description'}
                    size={12}
                    lineHeight={15}
                    color={'#FFFFFF80'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={tw` pt-2 `}>
                  <Textcomp
                    text={removeUnnecessaryNewLines(
                      serviceProviderData?.description,
                    )}
                    // text={
                    //   'heguide heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew  wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiewheguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiew heguide weughio wgiwe wdiugwe wuegfyuew wygiuew weuiewh wygfiewu'
                    // }
                    size={13}
                    lineHeight={14}
                    color={'#FFFFFF'}
                    fontFamily={'Inter-SemiBold'}
                    numberOfLines={6}
                  />
                  {serviceProviderData?.description?.split(' ')?.length >
                    20 && (
                    <TouchableOpacity
                      style={tw`ml-auto `}
                      onPress={() => {
                        setDisplay(serviceProviderData?.description);
                        setShowModal(true);
                      }}>
                      <Textcomp
                        text={'...see more'}
                        size={12}
                        lineHeight={15}
                        color={'green'}
                        fontFamily={'Inter-Bold'}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {(closeToData?.description ||
                  profileData?.portfolio?.description) && (
                  <View style={tw` pt-3 border-t mt-2 border-[#FFFFFF80]`}>
                    <View style={tw`mb-2 `}>
                      <Textcomp
                        text={'Service Description'}
                        size={12}
                        lineHeight={15}
                        color={'#FFFFFF80'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>
                    <Textcomp
                      text={removeUnnecessaryNewLines(
                        closeToData?.description ??
                          profileData?.portfolio?.description ??
                          '',
                      )}
                      size={13}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-SemiBold'}
                      numberOfLines={6}
                    />
                    {(
                      profileData?.portfolio?.description ||
                      serviceProviderData?.description
                    )?.split(' ')?.length > 20 && (
                      <TouchableOpacity
                        style={tw`ml-auto`}
                        onPress={() => {
                          setShowModal(true);
                          setDisplay(
                            closeToData?.description ??
                              profileData?.portfolio?.description,
                          );
                        }}>
                        <Textcomp
                          text={'...see more'}
                          size={12}
                          lineHeight={15}
                          color={'green'}
                          fontFamily={'Inter-Bold'}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
              <View
                style={[
                  tw`border-b border-[#FFFFFF80]  flex flex-row items-center pt-4 mx-2`,
                  {paddingVertical: perHeight(11)},
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.location}
                    resizeMode="contain"
                    style={{width: 25, height: 25}}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'From'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      text={`${
                        serviceProviderData?.address ||
                        serviceProviderData?.state
                      }`}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFFFFF80]  flex flex-row items-center pt-4 mx-2`,
                  {paddingVertical: perHeight(11)},
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    // source={images.dollar}
                    source={images.Naira2}
                    resizeMode="contain"
                    style={{width: 25, height: 25, tintColor: 'white'}}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Price range / Hour'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      text={`₦${
                        profileData?.portfolio?.minPrice ||
                        serviceProviderData?.portfolio?.minPrice
                      } - ₦${
                        profileData?.portfolio?.maxPrice ||
                        serviceProviderData?.portfolio?.maxPrice
                      }`}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              {/* <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  {paddingVertical: perHeight(11)},
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.send}
                    resizeMode="contain"
                    style={{width: 25, height: 25}}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Recent Delivery'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      text={'- -'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View> */}
              <View
                style={[
                  tw`border-b border-[#FFFFFF80] flex flex-row items-center pt-4 mx-2`,
                  {paddingVertical: perHeight(11)},
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.eye}
                    resizeMode="contain"
                    style={{width: 25, height: 25, tintColor: 'white'}}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Last active'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, {marginTop: perHeight(5)}]}>
                    <Textcomp
                      // text={'Abuja, Nigeria'}
                      text={
                        serviceProviderData?.lastOnline
                          ? timeAgo(serviceProviderData?.lastOnline)
                          : profileData?.user?.lastOnline
                      }
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFFFFF80]  flex flex-row items-center pt-4 mx-2`,
                  {paddingVertical: perHeight(11)},
                ]}>
                <View style={[tw` `, {marginLeft: perWidth(30)}]}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Other Services'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>

                  <View style={tw`w-full`}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{paddingBottom:10}}>
                    <FlatList
                      scrollEnabled={false}
                      data={serviceProviderData?.services}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            key={index}
                            style={[
                              tw`bg-white rounded-lg w-auto p-3 mr-2 py-1 items-center`,
                              {marginTop: perHeight(5)},
                            ]}>
                            <Textcomp
                              text={item?.name}
                              size={9}
                              lineHeight={12}
                              color={'#000000'}
                              fontFamily={'Inter-Bold'}
                            />
                          </View>
                        );
                      }}
                      //   keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={{}}
                    />
                    </ScrollView>
                  </View>
                </View>
              </View>

              {profileData?.portfolio?.portfolio?.length < 1 ||
              serviceProviderData?.portfolio?.portfolio?.length < 1 ? (
                <View style={tw`mt-[25%] mx-auto`}>
                  <Textcomp
                    text={'No portfolio Available!.'}
                    size={18}
                    lineHeight={18}
                    color={'#FFFFFF80'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              ) : (
                <>
                  <View
                    style={[
                      tw`border-b border-[#FFFFFF80] w-9/10 mx-auto  items-center pt-4 `,
                      {paddingVertical: perHeight(11)},
                    ]}>
                    <View style={tw`mr-auto `}>
                      <Textcomp
                        text={'PortFolio'}
                        size={14}
                        lineHeight={15}
                        color={'#FFFFFF80'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>

                    {(
                      closeToData.portfolio ||
                      serviceProviderData?.portfolio?.portfolio
                    )?.map((item, index) => {
                      // console.log('PORRRRRRRRRTTTTT:', item, item?.images);
                      return (
                        <View style={tw`w-full mt-3`} key={index}>
                          <View style={tw` `}>
                            <Textcomp
                              text={`${item?.description}`}
                              size={12}
                              lineHeight={15}
                              color={'#FFFFFF'}
                              fontFamily={'Inter-Bold'}
                            />
                          </View>
                          <FlatList
                            scrollEnabled={false}
                            data={item?.images}
                            renderItem={item => {
                              return (
                                <FastImage
                                  key={index}
                                  onTouchStart={() => {
                                    setimageModal(true);
                                    setselectedImage(item.item);
                                  }}
                                  style={[
                                    tw`mr-2`,
                                    {
                                      width: perWidth(95),
                                      aspectRatio: 1,
                                      borderRadius: 10,
                                    },
                                  ]}
                                  source={{
                                    uri: item.item,
                                    headers: {Authorization: 'someAuthToken'},
                                    priority: FastImage.priority.high,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              );
                            }}
                            //   keyExtractor={item => item.id}
                            numColumns={3}
                            contentContainerStyle={{marginTop: 10}}
                          />
                        </View>
                      );
                    })}
                  </View>
                  <View style={tw`h-20`} />
                </>
              )}

              {firstPotfolio?.length || secondPotfolio?.length ? (
                <View
                  style={[
                    tw`border-b border-[#FFFFFF80]  flex flex-row items-center pt-4 mx-2`,
                    {paddingVertical: perHeight(11)},
                  ]}>
                  <View style={[tw` `, {marginLeft: perWidth(25)}]}>
                    <View style={tw` `}>
                      <Textcomp
                        text={'PortFolio'}
                        size={14}
                        lineHeight={15}
                        color={'#FFFFFF80'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>

                    {firstPotfolio?.length ? (
                      <View style={tw`w-full mt-3`}>
                        <View style={tw` `}>
                          <Textcomp
                            text={'Project1'}
                            size={12}
                            lineHeight={15}
                            color={'#FFFFFF'}
                            fontFamily={'Inter-Bold'}
                          />
                        </View>
                        <FlatList
                          scrollEnabled={false}
                          data={firstPotfolio}
                          renderItem={({item, index}) => {
                            return (
                              <FastImage
                                onTouchStart={() => setimageModal(true)}
                                style={[
                                  tw`mr-2`,
                                  {
                                    width: perWidth(95),
                                    aspectRatio: 1,
                                    borderRadius: 10,
                                  },
                                ]}
                                source={{
                                  uri: item,
                                  headers: {Authorization: 'someAuthToken'},
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            );
                          }}
                          //   keyExtractor={item => item.id}
                          numColumns={3}
                          contentContainerStyle={{marginTop: 10}}
                        />
                      </View>
                    ) : null}
                    {secondPotfolio?.length ? (
                      <View style={tw`w-full mt-3`}>
                        <View style={tw` `}>
                          <Textcomp
                            text={'Project2'}
                            size={12}
                            lineHeight={15}
                            color={'#FFFFFF'}
                            fontFamily={'Inter-Bold'}
                          />
                        </View>
                        <FlatList
                          scrollEnabled={false}
                          data={secondPotfolio}
                          renderItem={({item, index}) => {
                            return (
                              <FastImage
                                onTouchStart={() => setimageModal(true)}
                                style={[
                                  tw`mr-2`,
                                  {
                                    width: perWidth(95),
                                    aspectRatio: 1,
                                    borderRadius: 10,
                                  },
                                ]}
                                source={{
                                  uri: item,
                                  headers: {Authorization: 'someAuthToken'},
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            );
                          }}
                          //   keyExtractor={item => item.id}
                          numColumns={3}
                          contentContainerStyle={{marginTop: 10}}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              <View style={tw`h-150`} />
            </ScrollView>
          )}
          {activeSection === 'Jobs' && (
            <>
              {serviceProviderData?.jobs?.length < 1 ? (
                <View style={tw`mt-[40%] mx-auto`}>
                  <Textcomp
                    text={'No Previous Jobs Yet.'}
                    size={18}
                    lineHeight={18}
                    color={'#000000'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  scrollEnabled={false}
                  contentContainerStyle={[
                    tw`mx-2 h-auto`,
                    {flexGrow: 1, borderRadius: 5, marginTop: perHeight(1)},
                  ]}>
                  <FlatList
                    scrollEnabled={true}
                    data={serviceProviderData?.jobs || []}
                    renderItem={(item, index) => {
                      console.log('JOOBSS', serviceProviderData?.jobs.length);
                      return (
                        <>
                          <View
                            style={[
                              tw` ${
                                index === 0 ? 'mt-0' : 'mt-4'
                              }  mx-auto bg-[${colors.darkPurple}]`,
                              {
                                height: perWidth(130),
                                width: SIZES.width * 0.95,
                                borderWidth: 0,
                                borderRadius: 5,
                                // marginLeft: index === 0 ? 10 : 3,
                                paddingHorizontal: perWidth(16),
                                paddingVertical: perWidth(14),
                              },
                            ]}>
                            <View style={tw`flex flex-row `}>
                              <View
                                style={[
                                  tw``,
                                  {width: perWidth(50), height: perWidth(50)},
                                ]}>
                                <FastImage
                                  style={[
                                    tw`mr-2`,
                                    {
                                      width: perWidth(50),
                                      height: perWidth(50),
                                      borderRadius: perWidth(50) / 2,
                                    },
                                  ]}
                                  source={{
                                    uri:
                                      item?.item?.user?.profilePic ??
                                      'https://res.cloudinary.com/dr0pef3mn/image/upload/v1691626246/Assets/1691626245707-Frame%2071.png.png',
                                    headers: {Authorization: 'someAuthToken'},
                                    priority: FastImage.priority.high,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                                <View
                                  style={[
                                    tw`absolute bottom-0 border-2 right-1 rounded-full`,
                                    {
                                      width: 8,
                                      height: 8,
                                      backgroundColor: colors.green,
                                    },
                                  ]}
                                />
                              </View>
                              <View
                                style={[
                                  tw`flex-1`,
                                  {marginLeft: perWidth(12)},
                                ]}>
                                <View
                                  style={[
                                    tw`flex flex-row justify-between`,
                                    {},
                                  ]}>
                                  <View style={[tw``, {}]}>
                                    <Textcomp
                                      text={`₦ ${item?.item?.amount}`}
                                      size={14}
                                      lineHeight={16}
                                      color={colors.white}
                                      fontFamily={'Inter-Bold'}
                                    />
                                  </View>
                                </View>
                                <View
                                  style={[
                                    tw``,
                                    {
                                      width: perWidth(252),
                                      marginTop: perHeight(4),
                                    },
                                  ]}>
                                  <Textcomp
                                    text={`${
                                      item?.item?.description !== undefined
                                        ? item?.item?.description
                                        : ''
                                    }`}
                                    size={12}
                                    lineHeight={14}
                                    color={colors.white}
                                    fontFamily={'Inter-SemiBold'}
                                    numberOfLines={2}
                                  />
                                </View>
                              </View>
                            </View>
                            {/* <View>
                        <View
                          style={[
                            tw``,
                            { width: perWidth(105), marginTop: perWidth(4) },
                          ]}>
                          <Textcomp
                            text={'Steven W.s'}
                            size={12}
                            lineHeight={14}
                            color={colors.white}
                            fontFamily={'Inter-SemiBold'}
                          />
                        </View>
                      </View> */}
                            <View
                              style={tw`mt-auto flex flex-row items-center justify-between`}>
                              <View
                                style={[
                                  tw``,
                                  {
                                    width: perWidth(105),
                                    marginTop: perWidth(4),
                                  },
                                ]}>
                                <Textcomp
                                  text={`${formatDateHistory3(
                                    item?.item?.createdAt,
                                  )}`}
                                  size={12}
                                  lineHeight={14}
                                  color={colors.white}
                                  fontFamily={'Inter-SemiBold'}
                                />
                              </View>

                              <View style={[tw``, {}]}>
                                <Textcomp
                                  text={'COMPLETED'}
                                  size={12}
                                  lineHeight={14}
                                  color={colors.primary}
                                  fontFamily={'Inter-Bold'}
                                />
                              </View>
                            </View>
                          </View>
                          {item?.index ===
                            serviceProviderData?.jobs.length - 1 && (
                            <View style={tw`h-60 w-full`} />
                          )}
                        </>
                      );
                    }}
                    //   keyExtractor={item => item.id}
                    numColumns={1}
                    contentContainerStyle={{marginTop: 10}}
                    ListFooterComponent={<View style={tw`h-150`} />}
                  />
                  <View style={tw`h-150`} />
                </ScrollView>
              )}
            </>
          )}
          {activeSection === 'Reviews' && (
            <ScrollView
              contentContainerStyle={[
                tw`mx-2 `,
                {flex: 0, borderRadius: 5, marginTop: perHeight(1)},
              ]}>
              <View
                style={[
                  tw`border-b border-[#000000] pb-2 mt-4  p-4 mx-1 mx-auto`,
                  {
                    paddingBottom: perHeight(11),
                    width: perWidth(357),
                    height: perHeight(130),
                    backgroundColor: colors.darkPurple,
                    borderRadius: 5,
                  },
                ]}>
                <View style={tw`flex flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Overall rating'}
                      size={16}
                      lineHeight={17}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review
                      value={
                        serviceProviderData?.rating ||
                        serviceProviderData?.averageRating ||
                        0
                      }
                      editable={false}
                    />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Seller Communication'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review
                      value={serviceProviderData?.communicationRating || 0}
                      editable={false}
                    />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Would recommend'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review
                      value={serviceProviderData?.recommendRating || 0}
                      editable={false}
                    />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Service as described'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review
                      value={serviceProviderData?.serviceAsDescribedRating || 0}
                      editable={false}
                    />
                  </View>
                </View>
              </View>
              <FlatList
                scrollEnabled={false}
                data={serviceProviderData?.reviews || []}
                renderItem={(item, index) => {
                  console.log('Review-item', item);

                  return (
                    <>
                      <View
                        style={[
                          tw` ${index === 0 ? 'mt-0' : 'mt-4'}  mx-auto bg-[${
                            colors.darkPurple
                          }]`,
                          {
                            height: perWidth(157),
                            width: SIZES.width * 0.95,
                            borderWidth: 0,
                            borderRadius: 5,
                            // marginLeft: index === 0 ? 10 : 3,
                            paddingHorizontal: perWidth(16),
                            paddingVertical: perWidth(14),
                          },
                        ]}>
                        <View style={tw`flex flex-row `}>
                          <View
                            style={[
                              tw``,
                              {width: perWidth(50), height: perWidth(50)},
                            ]}>
                            <FastImage
                              style={[
                                tw`mr-2`,
                                {
                                  width: perWidth(50),
                                  height: perWidth(50),
                                  borderRadius: perWidth(50) / 2,
                                },
                              ]}
                              source={{
                                // 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1691626246/Assets/1691626245707-Frame%2071.png.png'
                                uri:
                                  item?.item?.user?.profilePic ??
                                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                                headers: {Authorization: 'someAuthToken'},
                                priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                              style={[
                                tw`absolute bottom-0 border-2 right-1 rounded-full`,
                                {
                                  width: 8,
                                  height: 8,
                                  backgroundColor: colors.green,
                                },
                              ]}
                            />
                          </View>
                          <View
                            style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
                            <View
                              style={[tw`flex flex-row justify-between`, {}]}>
                              <View style={[tw``, {}]}>
                                <Textcomp
                                  text={`${item?.item?.user?.firstName} ${item?.item?.user?.lastName}`}
                                  size={14}
                                  lineHeight={16}
                                  color={colors.white}
                                  fontFamily={'Inter-Bold'}
                                />
                              </View>
                              <View style={tw` pt-2`}>
                                <Review
                                  value={item.item?.averageRating}
                                  editable={false}
                                />
                              </View>
                            </View>
                            <View
                              style={[
                                tw``,
                                {width: perWidth(252), marginTop: perHeight(4)},
                              ]}>
                              <Textcomp
                                text={`${item?.item?.user?.state} `}
                                size={12}
                                lineHeight={14}
                                color={'#FFFFFF80'}
                                fontFamily={'Inter-SemiBold'}
                                numberOfLines={2}
                              />
                              <View style={[tw`ml-auto`, {}]}>
                                <Textcomp
                                  text={`${getDaysAgo(
                                    item?.item?.createdAt,
                                  )} days ago`}
                                  size={12}
                                  lineHeight={16}
                                  color={'#FFFFFF80'}
                                  fontFamily={'Inter-Bold'}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                        <View>
                          <View
                            style={[
                              tw` ml-auto mr-2`,
                              {width: perWidth(252), marginTop: perWidth(5)},
                            ]}>
                            <Textcomp
                              text={item?.item?.comment}
                              size={12}
                              lineHeight={14}
                              color={colors.white}
                              fontFamily={'Inter-SemiBold'}
                            />
                          </View>
                        </View>
                      </View>
                    </>
                  );
                }}
                numColumns={1}
                contentContainerStyle={{marginTop: 10}}
                ListFooterComponent={<View style={tw`h-60`} />}
              />
              <View style={tw`h-150`} />
            </ScrollView>
          )}
        </View>
      </View>
      <>
        {userData?.accountType === 'freelancer' ||
        userData?.accountType === 'business' ? null : (
          <TouchableOpacity
            onPress={() => {
              if (
                // userData?._id === serviceProviderData?._id ||
                userData?._id === profileData?._id
              ) {
                console.log(
                  userData?._id,
                  profileData?._id,
                  serviceProviderData?._id,
                );

                ToastShort('Service Providers cannot hire thermselves!.');
              } else {
                navigation.navigate('OrderDetails', {
                  data: profileData,
                  service: id,
                });
              }
            }}
            style={[
              tw`bg-[#FFF] absolute bottom-[11%] right-[5%] rounded-full items-center justify-center`,
              {width: perWidth(52), aspectRatio: 1},
            ]}>
            <Textcomp
              text={'HIRE'}
              size={14}
              lineHeight={16.5}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        )}
      </>
      <Modal
        isVisible={imageModal}
        onBackButtonPress={() => setimageModal(false)}
        onBackdropPress={() => setimageModal(false)}
        swipeThreshold={200}
        // swipeDirection={['down']}
        style={{
          width: SIZES.width,
          padding: 0,
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onSwipeComplete={() => setimageModal(false)}>
        <View
          style={[
            tw` mt-auto mb-[25%] items-center  rounded-lg `,
            {width: perWidth(310), height: perHeight(315), borderRadius: 15},
          ]}>
          <FastImage
            style={[
              tw``,
              {
                width: perWidth(300),
                height: perHeight(315),
                borderRadius: 15,
              },
            ]}
            source={{
              uri: selectedImage,
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </Modal>

      <Modal
        isVisible={showModal}
        onModalHide={() => {
          setShowModal(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setShowModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={tw`flex-1`}
          />
          <View style={[tw`mx-auto w-4/5`, styles.modalContent]}>
            <Textcomp
              text={`${
                display
                // profileData?.portfolio?.description ||
                // serviceProviderData?.description
              }`}
              size={14}
              lineHeight={18}
              color={colors.black}
              fontFamily={'Inter-Regular'}
            />
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}>
              <Text style={{color: colors.primary, fontSize: 16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default ServiceProviderProfile;
