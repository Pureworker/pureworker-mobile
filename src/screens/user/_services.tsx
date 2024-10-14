// import React, {useEffect, useState, useCallback, useMemo} from 'react';
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   Platform,
//   StatusBar,
//   FlatList,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import {StackNavigation} from '../../constants/navigation';
// import images from '../../constants/images';
// import tw from 'twrnc';
// import Textcomp from '../../components/Textcomp';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import {perHeight} from '../../utils/position/sizes';
// import ServiceCard2 from '../../components/cards/serviceCard2';
// import TextInputs from '../../components/TextInput2';
// import {
//   getBookMarkedProviders,
//   getProviderByService,
// } from '../../utils/api/func';
// import {
//   addprovidersByCateegory,
//   setbookMarkedProviders,
// } from '../../store/reducer/mainSlice';
// import Spinner from 'react-native-loading-spinner-overlay';
// import CustomLoading from '../../components/customLoading';
// const _Services = ({route}: any) => {
//   const navigation = useNavigation<StackNavigation>();
//   const dispatch = useDispatch();
//   const passedService = route.params?.service?.name;
//   const id = route.params?.service?._id;

//   const _providersByCateegory = useSelector(
//     (state: any) => state.user.providersByCateegory,
//   );
//   const bookMarkedProviders = useSelector(
//     (state: any) => state.user.bookMarkedProviders,
//   );
//   const userData = useSelector((state: any) => state.user.userData);

//   const [activeSection, setactiveSection] = useState('All');
//   const [searchModal, setsearchModal] = useState(false);
//   const [searchInput, setsearchInput] = useState('');
//   const [savedProviders, setsavedProviders] = useState([]);
//   const [isLoading, setisLoading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const query = userData?.bookmarks?.filter(item => item?.service === id);
//     setsavedProviders(query);
//   }, [id, userData?.bookmarks]);

//   const [searchResults, setSearchResults] = useState(_providersByCateegory);

//   useEffect(() => {
//     setSearchResults(_providersByCateegory);
//   }, [_providersByCateegory]);

//   const fetchProviders = useCallback(async () => {
//     setisLoading(true);
//     const res = await getProviderByService(id);
//     if (res?.status === 200 || res?.status === 201) {
//       dispatch(addprovidersByCateegory(res?.data?.data));
//       setSearchResults(res?.data?.data);
//     }
//     setisLoading(false);
//   }, [dispatch, id]);

//   const fetchBookmarkedProviders = useCallback(async () => {
//     setisLoading(true);
//     const res = await getBookMarkedProviders(id);
//     if (res?.status === 200 || res?.status === 201) {
//       dispatch(setbookMarkedProviders(res?.data?.data));
//     }
//     setisLoading(false);
//   }, [dispatch, id]);

//   useEffect(() => {
//     fetchProviders();
//     fetchBookmarkedProviders();
//   }, [fetchProviders, fetchBookmarkedProviders]);

//   const debounce = (func, delay) => {
//     let timeoutId: string | number | NodeJS.Timeout | undefined;
//     return (...args) => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       timeoutId = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };

//   const handleSearch = useCallback(
//     (query: string) => {
//       setLoading(true);
//       const filteredData =
//         _providersByCateegory?.filter((provider: {fullName: string}) =>
//           provider.fullName.toLowerCase().includes(query.toLowerCase()),
//         ) || [];
//       setSearchResults(filteredData);
//       setLoading(false);
//     },
//     [_providersByCateegory],
//   );

//   const debouncedHandleSearch = useMemo(
//     () => debounce(handleSearch, 500),
//     [handleSearch],
//   );

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
//       <ScrollView>
//         <View
//           style={{
//             marginTop:
//               Platform.OS === 'ios'
//                 ? 10
//                 : StatusBar?.currentHeight + getStatusBarHeight(true) + 20,
//           }}
//         />
//         {!searchModal ? (
//           <View
//             style={[
//               tw`items-center`,
//               {
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 marginHorizontal: 20,
//               },
//             ]}>
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.goBack();
//                 dispatch(addprovidersByCateegory([]));
//               }}>
//               <Image
//                 source={images.back}
//                 style={{height: 25, width: 25}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <View style={tw`mx-auto w-3/4  items-center`}>
//               <Textcomp
//                 text={`${passedService}`}
//                 size={16}
//                 lineHeight={17}
//                 color={'#000413'}
//                 fontFamily={'Inter-SemiBold'}
//                 style={{textAlign: 'center'}}
//               />
//             </View>
//             <TouchableOpacity onPress={() => setsearchModal(true)}>
//               <Image
//                 source={images.search}
//                 style={{height: 25, width: 25}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View
//             style={[
//               tw`items-center justify-center`,
//               {
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 marginHorizontal: 20,
//               },
//             ]}>
//             <TouchableOpacity onPress={() => setsearchModal(false)}>
//               <Image
//                 source={images.X}
//                 style={{height: 20, width: 20}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TextInputs
//               style={{marginTop: 0, width: '70%'}}
//               labelText={'Search for service provider'}
//               state={searchInput}
//               setState={text => {
//                 setsearchInput(text);
//                 debouncedHandleSearch(text);
//               }}
//             />
//             <TouchableOpacity
//               style={{
//                 width: 20,
//                 height: 20,
//                 borderRadius: 40,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Image
//                 source={images.search}
//                 style={{height: 20, width: 20}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//         <View style={tw`mt-4 mb-3`}>
//           {_providersByCateegory.length > 0 && (
//             <View style={tw`flex flex-row`}>
//               <TouchableOpacity
//                 onPress={() => setactiveSection('All')}
//                 style={tw`w-1/2 border-b-2 items-center ${
//                   activeSection === 'All'
//                     ? 'border-[#88087B]'
//                     : 'border-[#000000]'
//                 }`}>
//                 <Textcomp
//                   text={'All'}
//                   size={14}
//                   lineHeight={16}
//                   color={activeSection === 'All' ? '#88087B' : '#000413'}
//                   fontFamily={'Inter-SemiBold'}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setactiveSection('Saved')}
//                 style={tw`w-1/2 border-b-2 items-center ${
//                   activeSection === 'Saved'
//                     ? 'border-[#88087B]'
//                     : 'border-[#000000]'
//                 }`}>
//                 <Textcomp
//                   text={'Saved'}
//                   size={14}
//                   lineHeight={16}
//                   color={activeSection === 'Saved' ? '#88087B' : '#000413'}
//                   fontFamily={'Inter-SemiBold'}
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//           {!isLoading && (
//             <>
//               {_providersByCateegory.length < 1 && searchResults.length < 1 ? (
//                 <View
//                   style={[
//                     tw`bg-[#D9D9D9] flex flex-col rounded mt-3 mx-2`,
//                     {height: perHeight(80), alignItems: 'center'},
//                   ]}>
//                   <View style={tw`my-auto pl-8`}>
//                     <Textcomp
//                       text={'No service provider available'}
//                       size={17}
//                       lineHeight={17}
//                       color={'black'}
//                       fontFamily={'Inter-SemiBold'}
//                     />
//                   </View>
//                 </View>
//               ) : (
//                 <>
//                   {activeSection === 'All' && (
//                     <FlatList
//                       data={
//                         searchResults.length > 0
//                           ? searchResults
//                           : _providersByCateegory
//                       }
//                       keyExtractor={item => item?._id}
//                       renderItem={({item, index}) => {
//                         const isSaved = savedProviders.some(
//                           d => d?.serviceProvider === item?._id,
//                         );
//                         return (
//                           <ServiceCard2
//                             key={index}
//                             navigation={navigation}
//                             item={item}
//                             index={index}
//                             id={id}
//                             serviceName={passedService}
//                             save={isSaved}
//                           />
//                         );
//                       }}
//                       contentContainerStyle={{paddingBottom: 20}}
//                       ListFooterComponent={() => <View style={tw`h-20`} />}
//                     />
//                   )}
//                   {activeSection === 'Saved' &&
//                     (bookMarkedProviders.length < 1 ? (
//                       <View style={tw`my-4`}>
//                         <Textcomp
//                           text={'No saved provider available'}
//                           size={17}
//                           lineHeight={17}
//                           color={'black'}
//                           fontFamily={'Inter-SemiBold'}
//                           style={{textAlign: 'center'}}
//                         />
//                       </View>
//                     ) : (
//                       <FlatList
//                         data={bookMarkedProviders}
//                         keyExtractor={item => item?._id}
//                         renderItem={({item, index}) => {
//                           const isSaved = savedProviders.some(
//                             d => d?.serviceProvider === item?._id,
//                           );
//                           return (
//                             <ServiceCard2
//                               key={index}
//                               navigation={navigation}
//                               item={item}
//                               index={index}
//                               id={id}
//                               serviceName={passedService}
//                               save={isSaved}
//                             />
//                           );
//                         }}
//                         contentContainerStyle={{paddingBottom: 20}}
//                         ListFooterComponent={() => <View style={tw`h-20`} />}
//                       />
//                     ))}
//                 </>
//               )}
//             </>
//           )}
//         </View>
//         <Spinner
//           visible={isLoading}
//           cancelable={false}
//           size={'small'}
//           animation={'fade'}
//           customIndicator={<CustomLoading />}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// export default React.memo(_Services);

import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  SafeAreaView,
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
import {perHeight} from '../../utils/position/sizes';
import ServiceCard2 from '../../components/cards/serviceCard2';
import TextInputs from '../../components/TextInput2';
import {
  getBookMarkedProviders,
  getProviderByService,
} from '../../utils/api/func';
import {
  addprovidersByCateegory,
  setbookMarkedProviders,
} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {RootState} from '@reduxjs/toolkit/dist/query/core/apiState';
import colors from '../../constants/colors';

const _Services = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const passedService = route.params?.service?.name;
  const id = route.params?.service?._id;

  const _providersByCateegory = useSelector(
    state => state.user.providersByCateegory,
  );
  const bookMarkedProviders = useSelector(
    state => state.user.bookMarkedProviders,
  );
  const userData = useSelector((state: any) => state.user.userData);
  const [searchResults, setSearchResults] = useState(_providersByCateegory);

  const [activeSection, setactiveSection] = useState('All');
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [savedProviders, setsavedProviders] = useState([]);
  const [providersByCategory, setProvidersByCategory] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [searchLoading, setsearchLoading] = useState(false);

  useEffect(() => {
    const query = userData?.bookmarks?.filter(item => item?.service === id);
    setsavedProviders(query);
  }, [id, userData?.bookmarks]);

  const fetchProviders = useCallback(async () => {
    setisLoading(true);
    const res = await getProviderByService(id);
    if (res?.status === 200 || res?.status === 201) {
      dispatch(addprovidersByCateegory(res?.data?.data));
      setProvidersByCategory(res?.data?.data);
    }
    setisLoading(false);
  }, [dispatch, id]);

  const fetchBookmarkedProviders = useCallback(async () => {
    setisLoading(true);
    const res = await getBookMarkedProviders(id);
    if (res?.status === 200 || res?.status === 201) {
      dispatch(setbookMarkedProviders(res?.data?.data));
    }
    setisLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProviders();
    fetchBookmarkedProviders();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    query => {
      setsearchLoading(true);
      const filteredData =
        _providersByCateegory?.filter(provider =>
          provider.fullName.toLowerCase().includes(query.toLowerCase()),
        ) || [];
      setSearchResults(filteredData);
      setsearchLoading(false);
    },
    [_providersByCateegory],
  );

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? 10
              : StatusBar?.currentHeight + getStatusBarHeight(true) + 20,
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
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              dispatch(addprovidersByCateegory([]));
            }}>
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
          <TouchableOpacity onPress={() => setsearchModal(true)}>
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
          <TouchableOpacity
            onPress={() => {
              setsearchModal(false);
              setsearchInput('');
              setSearchResults(_providersByCateegory);
            }}>
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

      {!isLoading && _providersByCateegory.length > 0 && (
        <View style={tw`flex flex-row mt-4`}>
          <TouchableOpacity
            onPress={() => setactiveSection('All')}
            style={tw`w-1/2 border-b-2 items-center ${
              activeSection === 'All' ? 'border-[#88087B]' : 'border-[#000000]'
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
            onPress={() => setactiveSection('Saved')}
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
      <ScrollView>
        <View style={tw` mb-3`}>
          {!isLoading && (
            <>
              {_providersByCateegory.length < 1 && searchResults.length < 1 ? (
                <View
                  style={[
                    tw`bg-[#D9D9D9] flex flex-col rounded mt-3 mx-2`,
                    {height: perHeight(80), alignItems: 'center'},
                  ]}>
                  <View style={tw`my-auto pl-8`}>
                    <Textcomp
                      text={'No service provider available'}
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
                      {searchLoading && (
                        <View style={tw`mt-2`}>
                          <ActivityIndicator
                            size={'small'}
                            color={colors.parpal}
                          />
                        </View>
                      )}
                      <FlatList
                        data={
                          searchResults.length >= 0
                            ? searchResults
                            : providersByCategory
                        }
                        keyExtractor={item => item?._id}
                        renderItem={({item, index}) => {
                          const isSaved = savedProviders.some(
                            d => d?.serviceProvider === item?._id,
                          );
                          return (
                            <ServiceCard2
                              key={index}
                              navigation={navigation}
                              item={item}
                              index={index}
                              id={id}
                              serviceName={passedService}
                              save={isSaved}
                            />
                          );
                        }}
                        initialNumToRender={10} // Adjust this number based on your needs
                        maxToRenderPerBatch={10} // Controls how many items are rendered at once
                        updateCellsBatchingPeriod={50} // Adjust this time to optimize performance
                        removeClippedSubviews={true} // Unmount components when outside of viewport
                        contentContainerStyle={{paddingBottom: 20}}
                        ListFooterComponent={() => <View style={tw`h-20`} />}
                      />
                    </>
                  )}
                  {activeSection === 'Saved' &&
                    (bookMarkedProviders.length < 1 ? (
                      <View style={tw`my-4`}>
                        <Textcomp
                          text={'No saved provider available'}
                          size={17}
                          lineHeight={17}
                          color={'black'}
                          fontFamily={'Inter-SemiBold'}
                          style={{textAlign: 'center'}}
                        />
                      </View>
                    ) : (
                      <FlatList
                        data={bookMarkedProviders}
                        keyExtractor={item => item?._id}
                        renderItem={({item, index}) => {
                          const isSaved = savedProviders.some(
                            d => d?.serviceProvider === item?._id,
                          );
                          return (
                            <ServiceCard2
                              key={index}
                              navigation={navigation}
                              item={item}
                              index={index}
                              id={id}
                              serviceName={passedService}
                              save={isSaved}
                            />
                          );
                        }}
                        initialNumToRender={10} // Adjust this number based on your needs
                        maxToRenderPerBatch={10} // Controls how many items are rendered at once
                        updateCellsBatchingPeriod={50} // Adjust this time to optimize performance
                        removeClippedSubviews={true} // Unmount components when outside of viewport
                        contentContainerStyle={{paddingBottom: 20}}
                        ListFooterComponent={() => <View style={tw`h-20`} />}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </View>
        <Spinner
          visible={isLoading}
          cancelable={false}
          size={'small'}
          animation={'fade'}
          customIndicator={<CustomLoading />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(_Services);
