import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight} from '../../utils/position/sizes';
import ServiceCard2 from '../../components/cards/serviceCard2';
import TextInputs from '../../components/TextInput2';
import {
  getProviderByCategory,
  getProviderByService,
  getSearchProvider,
  getSearchQuery,
  getUser,
} from '../../utils/api/func';
import {addprovidersByCateegory} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import colors from '../../constants/colors';

const _Services = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const passedService = route.params?.service?.name;
  const id = route.params?.service?._id;
  console.log('--kk-passed', route.params.service?._id);

  const _providersByCateegory = useSelector(
    (state: any) => state.user.providersByCateegory,
  );
  const userData = useSelector((state: any) => state.user.userData);
  const dummyData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [activeSection, setactiveSection] = useState('All');
  const [searchModal, setsearchModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [savedProviders, setsavedProviders] = useState([]);
  function metersToKilometers(meters) {
    const kilometers = meters / 1000; // Convert meters to kilometers
    const roundedKilometers = Math.round(kilometers); // Round to the nearest whole number
    return `${roundedKilometers} km`;
  }
  // console.log('BOOKMARK', userData?.bookmarks);
  useEffect(() => {
    const query = userData?.bookmarks?.filter(
      (item: {service: any}) => item?.service === id,
    );
    setsavedProviders(query);
  }, [id, userData?.bookmarks]);

  useEffect(() => {
    const initGetUsers = async () => {
      setisLoading(true);
      const res: any = await getProviderByService(id);
      console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addprovidersByCateegory(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetUsers();
  }, [dispatch, id]);
  const [searchResults, setSearchResults] = useState(_providersByCateegory);
  const [loading, setLoading] = useState(false);
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  // const handleSearch = async query => {
  //   try {
  //     // Optional: You can add loading state here if needed
  //     setLoading(true);

  //     // Use the useGetAllServicesQuery hook to fetch data based on the search input
  //     const {data, error} = await getSearchProvider(query || searchInput);
  //     console.log('resulk:', data);
  //     if (error) {
  //       console.error('Error fetching search results:', error);
  //       // Handle error, show an error message, or take appropriate action
  //     } else {
  //       // Update the search results state with the fetched data

  //       setSearchResults(data?.providers ?? []);
  //     }
  //   } catch (error) {
  //     console.error('An unexpected error occurred during search:', error);
  //     // Handle unexpected error, show an error message, or take appropriate action
  //   } finally {
  //     // Optional: You can update the loading state here if needed
  //     setLoading(false);
  //   }
  // };
  const handleSearch = query => {
    try {
      setLoading(true);
      // Filter the data based on the search input
      const filteredData =
        _providersByCateegory?.filter((provider: {fullName: string}) =>
          provider.fullName.toLowerCase().includes(query.toLowerCase()),
        ) || [];

      console.log('RESSSSS:', filteredData);
      setSearchResults(filteredData);
    } catch (error) {
      console.error('An unexpected error occurred during search:', error);
      // Handle unexpected error, show an error message, or take appropriate action
    } finally {
      // Optional: You can update the loading state here if needed
      setLoading(false);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 500);

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

        {!searchModal ? (
          <View
            style={[
              tw`items-center`,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto w-3/4  items-center`}>
              <Textcomp
                text={`${passedService}`}
                size={16}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
                style={{textAlign: 'center'}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setsearchModal(true);
              }}>
              <Image
                source={images.search}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
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
            <TouchableOpacity onPress={() => setsearchModal(false)}>
              <Image
                source={images.X}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={{marginTop: 0, width: '70%'}}
              labelText={'Search for service provider'}
              state={searchInput}
              setState={text => {
                setsearchInput(text);
                debouncedHandleSearch(text);
              }}
            />
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.search}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={tw`mt-4 mb-3`}>
          {_providersByCateegory.length > 0 && (
            <View style={tw`flex flex-row`}>
              <TouchableOpacity
                onPress={() => {
                  setactiveSection('All');
                }}
                style={tw`w-1/2 border-b-2  items-center ${
                  activeSection === 'All'
                    ? 'border-[#88087B]'
                    : 'border-[#000000]'
                }`}>
                <Textcomp
                  text={'All'}
                  size={14}
                  lineHeight={16}
                  color={activeSection === 'All' ? '#88087B' : '#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setactiveSection('Saved');
                }}
                style={tw`w-1/2 border-b-2 items-center ${
                  activeSection === 'Saved'
                    ? 'border-[#88087B]'
                    : 'border-[#000000]'
                }`}>
                <Textcomp
                  text={'Saved'}
                  size={14}
                  lineHeight={16}
                  color={activeSection === 'Saved' ? '#88087B' : '#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          )}
          {searchResults?.length < 1 && (
            <View
              style={[
                tw`bg-[#D9D9D9] flex flex-col rounded  mt-3 mx-2`,
                {height: perHeight(80), alignItems: 'center'},
              ]}>
              <View style={tw`my-auto pl-8`}>
                <Textcomp
                  text={'Service Provider Not Found...'}
                  size={17}
                  lineHeight={17}
                  color={'black'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          )}
          <>
            {!isLoading && (
              <>
                {_providersByCateegory.length < 1 ? (
                  <View
                    style={[
                      tw`bg-[#D9D9D9] flex flex-col rounded  mt-3 mx-2`,
                      {height: perHeight(80), alignItems: 'center'},
                    ]}>
                    <View style={tw`my-auto pl-8`}>
                      <Textcomp
                        text={'Service Provider Not Found...'}
                        size={17}
                        lineHeight={17}
                        color={'black'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    {activeSection === 'All' && (
                      <>
                        <View style={[tw`items-center`, {flex: 1}]}>
                          {searchResults.length < 1 && (
                            <ScrollView scrollEnabled={false} horizontal>
                              <FlatList
                                style={{flex: 1}}
                                // data={_providersByCateegory}
                                data={searchResults}
                                scrollEnabled={false}
                                horizontal={false}
                                renderItem={(item: any, index: any) => {
                                  console.log(':id', item?.item?._id);
                                  const ch = savedProviders?.filter(
                                    (d: {service: any}) =>
                                      d?.serviceProvider === item?.item?._id,
                                  );
                                  return (
                                    <ServiceCard2
                                      key={index}
                                      navigation={navigation}
                                      item={item.item}
                                      index={item.index}
                                      id={id}
                                      serviceName={passedService}
                                      save={ch?.length > 0 ? true : false}
                                    />
                                  );
                                }}
                                keyExtractor={item => item?.id}
                                ListFooterComponent={() => (
                                  <View style={tw`h-20`} />
                                )}
                                contentContainerStyle={{paddingBottom: 20}}
                              />
                            </ScrollView>
                          )}
                          {searchResults.length > 0 && (
                            <ScrollView scrollEnabled={false} horizontal>
                              <FlatList
                                style={{flex: 1}}
                                // data={_providersByCateegory}
                                data={
                                  searchResults.length > 0
                                    ? searchResults
                                    : _providersByCateegory
                                }
                                scrollEnabled={false}
                                horizontal={false}
                                renderItem={(item: any, index: any) => {
                                  console.log(':id', item?.item?._id);
                                  const ch = savedProviders?.filter(
                                    (d: {service: any}) =>
                                      d?.serviceProvider === item?.item?._id,
                                  );
                                  return (
                                    <ServiceCard2
                                      key={index}
                                      navigation={navigation}
                                      item={item.item}
                                      index={item.index}
                                      id={id}
                                      serviceName={passedService}
                                      save={ch?.length > 0 ? true : false}
                                      savedProviders={savedProviders}
                                    />
                                  );
                                }}
                                keyExtractor={item => item?.id}
                                ListFooterComponent={() => (
                                  <View style={tw`h-20`} />
                                )}
                                contentContainerStyle={{paddingBottom: 20}}
                              />
                            </ScrollView>
                          )}
                        </View>
                      </>
                    )}
                    {activeSection === 'Saved' && (
                      <View style={[tw`items-center`, {flex: 1}]}>
                        <ScrollView scrollEnabled={false} horizontal>
                          <FlatList
                            data={savedProviders}
                            horizontal={false}
                            scrollEnabled={false}
                            renderItem={(item: any, index: any) => {
                              return (
                                <TouchableOpacity>
                                  <ServiceCard2
                                    key={index}
                                    navigation={navigation}
                                    item={item.item}
                                    index={item.index}
                                    id={id}
                                    serviceName={passedService}
                                    save={true}
                                  />
                                </TouchableOpacity>
                              );
                            }}
                            keyExtractor={item => item?._id}
                            ListFooterComponent={() => (
                              <View style={tw`h-20`} />
                            )}
                            contentContainerStyle={{paddingBottom: 20}}
                          />
                        </ScrollView>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </>
          {/* )} */}
          {/* {searchResults.length > 0 && searchInput && ( */}
          {false && (
            <>
              <>
                <View style={tw`mt-4 mx-[5%]`}>
                  <Textcomp
                    text={'Search Results'}
                    size={18}
                    lineHeight={25}
                    color={'#000413'}
                    fontFamily={'Inter'}
                  />
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{width: SIZES.width}}>
                  <FlatList
                    data={searchResults}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={tw`border-[${colors.darkPurple}] border-b justify-between items-center flex flex-row w-9/10 mx-auto mt-4 py-2 pb-4 px-3`}
                        onPress={() => {
                          // initFecthProviders(item?.id, item);
                        }}>
                        <View style={tw`flex flex-row`}>
                          <Image
                            source={
                              item?.profilePic
                                ? {uri: item?.profilePic}
                                : images.profile
                            }
                            style={[tw`bg-red-400`, {width: 32}]}
                          />
                          <Text
                            style={tw`text-[${colors.darkPurple}] ml-3 font-600`}>
                            {item?.fullName || item?.businessName}
                          </Text>
                        </View>
                        <View style={tw`flex flex-row items-center`}>
                          <Image
                            resizeMode="contain"
                            source={images.location}
                            style={[tw``, {width: 20}]}
                          />
                          <Text
                            style={tw`text-[${colors.darkPurple}] ml-3 font-600`}>
                            {item?.distance}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </ScrollView>
              </>
            </>
          )}
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default _Services;
