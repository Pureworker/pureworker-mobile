/* eslint-disable react/no-unstable-nested-components */
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import {StackNavigation} from '../../constants/navigation';
// import images from '../../constants/images';
// import tw from 'twrnc';
// import Textcomp from '../../components/Textcomp';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import CategoryList2 from '../../components/CategoryList2';
// import {
//   useGetCategoryQuery,
//   useGetUserDetailQuery,
// } from '../../store/slice/api';
// import colors from '../../constants/colors';
// import TextInputs from '../../components/TextInputs';
// import {getProviderByService, getSearchQuery} from '../../utils/api/func';
// import {addprovidersByCateegory} from '../../store/reducer/mainSlice';
// import CustomLoading from '../../components/customLoading';
// import Spinner from 'react-native-loading-spinner-overlay';

// const TabServices = () => {
//   const navigation = useNavigation<StackNavigation>();
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchModal, setSearchModal] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
//   const getUser = getUserData ?? [];
//   const {data: getCategoryData, isLoading, isError} = useGetCategoryQuery();
//   const getCategory = getCategoryData ?? [];
//   const _getCategory = useSelector((state: any) => state.user.category);
//   const [_isLoading, setisLoading] = useState(false);
//   // const {data: allServicesData, isLoading: isLoadingAllServices} =
//   //   useGetAllServicesQuery({
//   //     name: searchInput,
//   //   });

//   const handleDropdownClick = (catId: React.SetStateAction<null>) => {
//     // Existing code...
//   };

//   const handleSearch = async query => {
//     try {
//       // Optional: You can add loading state here if needed
//       setLoading(true);

//       // Use the useGetAllServicesQuery hook to fetch data based on the search input
//       const {data, error} = await getSearchQuery(query || searchInput);
//       if (error) {
//         console.error('Error fetching search results:', error);
//         // Handle error, show an error message, or take appropriate action
//       } else {
//         // Update the search results state with the fetched data
//         setSearchResults(data?.data ?? []);
//       }
//     } catch (error) {
//       console.error('An unexpected error occurred during search:', error);
//       // Handle unexpected error, show an error message, or take appropriate action
//     } finally {
//       // Optional: You can update the loading state here if needed
//       setLoading(false);
//     }
//   };
//   // Debounce function to delay search requests
//   const debounce = (func: any, delay: any) => {
//     let timeoutId: any;
//     return function (...args) {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       timeoutId = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };
//   const debouncedHandleSearch = debounce(handleSearch, 300);
//   const userType = useSelector((state: any) => state.user.isLoggedIn);
//   const initFecthProviders = async (id: any, itemDetail) => {
//     setisLoading(true);
//     const res: any = await getProviderByService(id);
//     console.log('service-dddddddd', res?.data);
//     if (res?.status === 201 || res?.status === 200) {
//       dispatch(addprovidersByCateegory(res?.data?.data));
//     }

//     //if customer navigate to _service , if provide navigate to _VService
//     if (userType.userType === 'CUSTOMER') {
//       navigation.navigate('_Services', {service: itemDetail});
//     } else {
//       navigation.navigate('_VServices', {service: itemDetail});
//     }
//     setisLoading(false);
//   };
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   return (
//     <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View
//           style={{
//             marginTop:
//               Platform.OS === 'ios'
//                 ? getStatusBarHeight(true)
//                 : getStatusBarHeight(true) + 20,
//           }}
//         />
//         {/* <View
//           style={{
//             marginTop:
//               Platform.OS === 'ios'
//                 ? getStatusBarHeight(true)
//                 : StatusBar.currentHeight &&
//                   StatusBar.currentHeight + getStatusBarHeight(true),
//           }}
//         /> */}

//         {!searchModal ? (
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
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Image
//                 source={images.back}
//                 style={{height: 25, width: 25}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <View style={tw`mx-auto`}>
//               <Textcomp
//                 text={'Services'}
//                 size={17}
//                 lineHeight={17}
//                 color={'#000413'}
//                 fontFamily={'Inter-SemiBold'}
//               />
//             </View>
//             <TouchableOpacity
//               style={{
//                 width: 20,
//                 height: 20,
//                 borderRadius: 40,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               onPress={() => {
//                 setSearchModal(true);
//               }}>
//               <Image
//                 source={images.search}
//                 style={{height: 20, width: 20}}
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
//             <TouchableOpacity
//               onPress={() => {
//                 setSearchModal(false);
//                 setSearchResults([]);
//                 setSearchInput('');
//               }}>
//               <Image
//                 source={images.cross}
//                 style={{height: 25, width: 20, tintColor: 'black'}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TextInputs
//               style={[
//                 tw`rounded-full`,
//                 {marginTop: 0, width: '75%', paddingHorizontal: 10},
//               ]}
//               labelText={'Search for service'}
//               state={searchInput}
//               setState={text => {
//                 setSearchInput(text);
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
//               }}
//               onPress={handleSearch}>
//               <Image
//                 source={images.search}
//                 style={{height: 20, width: 20}}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//         <View style={tw``}>
//           {searchResults.length > 0 || searchInput ? null : (
//             <View style={tw`mr-auto px-[5%] mt-4`}>
//               <Textcomp
//                 text={'Service Categories'}
//                 size={22}
//                 lineHeight={25}
//                 color={'#000413'}
//                 fontFamily={'Inter'}
//               />
//             </View>
//           )}
//           {/* Display search results */}
//           {loading ? (
//             <View style={tw`mt-[20%]`}>
//               <ActivityIndicator size={'large'} color={colors.parpal} />
//             </View>
//           ) : (
//             <>
//               {searchResults.length > 0 && searchInput && (
//                 <>
//                   <View style={tw`mt-4 mx-[5%]`}>
//                     <Textcomp
//                       text={'Search Results'}
//                       size={18}
//                       lineHeight={25}
//                       color={'#000413'}
//                       fontFamily={'Inter'}
//                     />
//                   </View>
//                   <FlatList
//                     data={searchResults}
//                     keyExtractor={item => item.id?.toString()}
//                     renderItem={({item}) => (
//                       // Render each search result item
//                       <TouchableOpacity
//                         style={tw`bg-[${colors.darkPurple}] w-9/10 mx-auto mt-4 py-2 px-3`}
//                         onPress={() => {
//                           initFecthProviders(item?.id, item);
//                           // Handle item click, if needed
//                         }}>
//                         <Text style={tw`text-white font-600`}>
//                           {item?.name}
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   />
//                 </>
//               )}
//             </>
//           )}

//           {(searchInput.length < 1 || !searchResults) && (
//             <View style={tw`w-full mt-4`}>
//               <ScrollView
//                 scrollEnabled={false}
//                 style={tw`w-full `}
//                 contentContainerStyle={tw`w-[92%] mx-auto`}
//                 horizontal>
//                 <ScrollView scrollEnabled={false}>
//                   {_getCategory?.map((item, index) => {
//                     return (
//                       <CategoryList2
//                         key={index}
//                         categoryName={item?.name}
//                         catId={item?.id || item?._id}
//                         isOpen={item?.id === openDropdownId}
//                         onDropdownClick={handleDropdownClick}
//                       />
//                     );
//                   })}
//                 </ScrollView>
//               </ScrollView>
//             </View>
//           )}
//         </View>
//         <View style={tw`h-20`} />
//       </ScrollView>
//       <Spinner visible={isLoading} customIndicator={<CustomLoading />} />

// {searchResults && (
//   <Spinner visible={_isLoading} customIndicator={<CustomLoading />} />
// )}
//     </SafeAreaView>
//   );
// };

// export default TabServices;

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CategoryList2 from '../../components/CategoryList2';

import colors from '../../constants/colors';
import TextInputs from '../../components/TextInputs';
import {getProviderByService, getSearchQuery} from '../../utils/api/func';
import {addprovidersByCateegory} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import {ToastShort} from '../../utils/utils';

const TabServices = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const _getCategory = useSelector((state: any) => state.user.category);
  const [_isLoading, setisLoading] = useState(false);
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Debounce function to delay search requests
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Handle search with API call timing
  const handleSearch = async query => {
    setLoading(true);
    const startTime = Date.now(); // Start the timer
    try {
      const {data, error} = await getSearchQuery(query || searchInput);
      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        setSearchResults(data?.data ?? []);
      }
    } catch (error) {
      console.error('An unexpected error occurred during search:', error);
    } finally {
      const endTime = Date.now(); // End the timer
      console.log(`API call took ${endTime - startTime} ms`); // Log the time taken
      ToastShort(`Duration: ${endTime - startTime}ms`);
      setLoading(false);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  const initFecthProviders = async (id, itemDetail) => {
    setisLoading(true);
    const res = await getProviderByService(id);
    console.log('service-dddddddd', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addprovidersByCateegory(res?.data?.data));
    }
    if (userType.userType === 'CUSTOMER') {
      navigation.navigate('_Services', {service: itemDetail});
    } else {
      navigation.navigate('_VServices', {service: itemDetail});
    }
    setisLoading(false);
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : getStatusBarHeight(true) + 20,
          }}
        />
        {/* Header */}
        {!searchModal ? (
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Services'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setSearchModal(true)}>
              <Image
                source={images.search}
                style={{height: 20, width: 20}}
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
                setSearchModal(false);
                setSearchResults([]);
                setSearchInput('');
              }}>
              <Image
                source={images.cross}
                style={{height: 25, width: 20, tintColor: 'black'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={[
                tw`rounded-full`,
                {marginTop: 0, width: '75%', paddingHorizontal: 10},
              ]}
              labelText={'Search for service'}
              state={searchInput}
              setState={text => {
                setSearchInput(text);
                debouncedHandleSearch(text); // Use debounced search
              }}
            />
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleSearch(searchInput)}>
              <Image
                source={images.search}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={tw``}>
          {searchResults.length > 0 || searchInput ? null : (
            <View style={tw`mr-auto px-[5%] mt-4`}>
              <Textcomp
                text={'Service Categories'}
                size={22}
                lineHeight={25}
                color={'#000413'}
                fontFamily={'Inter'}
              />
            </View>
          )}
          {/* Display search results */}
          {loading ? (
            <View style={tw`mt-[20%]`}>
              <ActivityIndicator size={'large'} color={colors.parpal} />
            </View>
          ) : (
            <>
              {searchResults.length > 0 && searchInput && (
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
                  <FlatList
                    data={searchResults}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={({item}) => (
                      // Render each search result item
                      <TouchableOpacity
                        style={tw`bg-[${colors.darkPurple}] w-9/10 mx-auto mt-4 py-2 px-3`}
                        onPress={() => {
                          initFecthProviders(item?.id, item);
                          // Handle item click, if needed
                        }}>
                        <Text style={tw`text-white font-600`}>
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    initialNumToRender={10} // Adjust this number based on your needs
                    maxToRenderPerBatch={10} // Controls how many items are rendered at once
                    updateCellsBatchingPeriod={50} // Adjust this time to optimize performance
                    removeClippedSubviews={true} // Unmount components when outside of viewport
                    contentContainerStyle={{paddingBottom: 20}}
                    ListFooterComponent={() => <View style={tw`h-20`} />}
                  />
                </>
              )}
            </>
          )}

          {(searchInput.length < 1 || !searchResults) && (
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
                        catId={item?.id || item?._id}
                        isOpen={item?.id === openDropdownId}
                        onDropdownClick={setOpenDropdownId}
                      />
                    );
                  })}
                </ScrollView>
              </ScrollView>
            </View>
          )}
        </View>
        <Spinner visible={_isLoading} textContent="Loading..." />

        {/* {searchResults && (
        <Spinner visible={_isLoading} customIndicator={<CustomLoading />} />
      )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TabServices;
