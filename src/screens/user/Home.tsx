import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import images from '../../constants/images';
import TextInputs from '../../components/TextInput2';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';

import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';

import colors from '../../constants/colors';
import ServiceCard from '../../components/cards/serviceCard';
import ClosetoYou from '../../components/cards/closeToYou';
import CategoryList2 from '../../components/CategoryList2';
import commonStyle from '../../constants/commonStyle';
import {
  useGetAllServiceProviderPotfolioQuery,
  useGetAllServiceProviderProfileQuery,
  useGetCategoryQuery,
  useGetUserDetailQuery,
} from '../../store/slice/api';

import Modal from 'react-native-modal';
import {StackNavigation} from '../../constants/navigation';
import {useNavigation} from '@react-navigation/native';
import {useGetUserDataQuery} from '../../store/slice/api2';
import {addCategory, addPopularServices, addSCategory, addUserData, } from '../../store/reducer/mainSlice';
import {getCategory, getPopularService, getUser} from '../../utils/api/func';

const Home = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    data: getServiceProviderProfileData,
    isLoading: isLoadingServiceProviderProfile,
  } = useGetAllServiceProviderProfileQuery();
  const getServiceProviderProfile = getServiceProviderProfileData ?? [];
  const {
    data: getServiceProviderPotfolioData,
    isLoading: isLoadingServiceProviderPotfolio,
  } = useGetAllServiceProviderPotfolioQuery();
  const getServiceProviderPotfolio = getServiceProviderPotfolioData ?? [];
  // console.log("🚀 ~ file: Home.tsx:52 ~ Home ~ getServiceProviderPotfolio:", getServiceProviderPotfolio)
  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  // const { data: getUserData, isLoading: isLoadingUser } = useGetUserDataQuery();
  // const getUser = getUserData ?? [];
  // const {data: getCategoryData, isLoading, isError} = useGetCategoryQuery();
  // const getCategory = getCategoryData ?? [];

  const [InfoModal, setInfoModal] = useState(false);
  const filteredData = !_.isEmpty(getServiceProviderPotfolioData)
    ? getServiceProviderPotfolioData.filter((item: {description: string}) =>
        item.description.toLowerCase().includes(search.toLowerCase()),
      )
    : [];
  const [isLoading, setisLoading] = useState(false);


  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      // setloading(false);
    };
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getCategory('');
      // console.log('aaaaaaaaa', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addSCategory(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetPopularServices = async () => {
      setisLoading(true);
      const res: any = await getPopularService('');
      // console.log('ppppppppp', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addPopularServices(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetUsers();
    initGetCategory();
    initGetPopularServices();
  }, []);

  //selectors
  const userData = useSelector((state: any) => state.user.userData);
  const _getCategory = useSelector((state: any) => state.user.category);
  const _popularServices = useSelector((state: any) => state.user.popularServices);
  // console.log(userData);

  console.log('dddddddd', userData);

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

  console.log(getServiceProviderProfile[0]);
  const [ContactAgent, setContactAgent] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDropdownClick = (catId: React.SetStateAction<null>) => {
    if (catId === openDropdownId) {
      setOpenDropdownId(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdownId(catId); // Open the clicked dropdown
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: '#EBEBEB',
            paddingTop: Platform.OS === 'ios' ? 10 : 20,
          },
        ]}>
        <ScrollView>
          <View
            style={[
              tw`items-center justify-center`,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={images.profile}
                style={{height: 40, width: 40}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
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
            />
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
              text={`Welcome ${userData?.firstName},`}
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

          {/* <View
            style={[
              tw`ml-4 mt-4 border-[#FFC727]`,
              {
                height: perWidth(130),
                width: perWidth(150),
                borderWidth: 3,
                borderRadius: 20,
              },
            ]}>
            <Image
              resizeMode="cover"
              style={{
                width: perWidth(145),
                height: '65%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              source={images.welcome}
            />
            <View
              style={[
                tw`bg-[${colors.darkPurple}] flex-1`,
                {borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
              ]}>
              <View style={[tw``, {marginLeft: 10, marginTop: perHeight(6)}]}>
                <Textcomp
                  text={'Plumbing'}
                  size={12}
                  lineHeight={14}
                  color={colors.white}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View> */}

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

          {/*Close to You Section */}
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

          {/* <View style={{flex: 1}}>
            <FlatList
              data={getServiceProviderProfile}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={(item: any) => {
                return (
                  <ClosetoYou
                    navigation={navigation}
                    item={item.item}
                    index={item.index}
                  />
                );
              }}
              keyExtractor={item => item.id}
            />
          </View> */}

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
                    // console.log(item);
                    return (
                      <CategoryList2
                        key={index}
                        categoryName={item?.name}
                        catId={item?.id}
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
                  text={'FAQ'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setContactAgent(true);
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
    </SafeAreaView>
  );
};

export default Home;
