import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInput2';
import CloseToYouCard2 from '../../components/cards/closeToYou2';
import Orderscomponent from '../../components/Orderscomponent';
import ServiceproviderReview from '../../components/modals/serviceproviderReview';
import PrivateFeedback from '../../components/modals/privateFeedback';
import RateyourExperience from '../../components/modals/rateyourexperience';
import OrderCompleted from '../../components/modals/OrderCompleted';
import OrderDispute from '../../components/modals/orderDispute';
import OrderDelivered from '../../components/modals/orderDelivered';
import OrderInProgress from '../../components/modals/OrderinProgress';
import OrderPlaced from '../../components/modals/orderPlaced';
import ScheduledDeliveryDate from '../../components/modals/scheduledDeliveryDate';
import {addcustomerOrders} from '../../store/reducer/mainSlice';
import {getProviderByService, getUserOrders} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';

const Orders = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [activeSection, setactiveSection] = useState('Active');
  const [isLoading, setisLoading] = useState(false);
  const customerOrders = useSelector((state: any) => state.user.customerOrders);
  //modals
  const [serviceProviderModal, setserviceProviderModal] = useState(false);
  const [privateFeedback, setprivateFeedback] = useState(false);
  const [rateYourExperience, setrateYourExperience] = useState(false);
  const [orderCompleted, setorderCompleted] = useState(false);
  const [orderDispute, setorderDispute] = useState(false);
  const [orderDelivered, setorderDelivered] = useState(false);
  const [orderInProgress, setorderInProgress] = useState(false);
  const [orderPlacing, setorderPlacing] = useState(false);
  const [scheduledDeliveryDate, setscheduledDeliveryDate] = useState(false);

  useEffect(() => {
    // setorderDelivered(true);
  }, []);

  const [filteredOrders, setFilteredOrders] = useState(customerOrders);

  useEffect(() => {
    setFilteredOrders(customerOrders);
  }, [customerOrders, dispatch]);

  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getUserOrders(searchInput);
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addcustomerOrders(res?.data?.data));
        // Filter orders based on search input
        // const filtered = res?.data?.data.filter(order =>
        //   order?.service?.toLowerCase().includes(searchInput.toLowerCase()),
        // );
      }
      setisLoading(false);
    };
    initGetOrders();
  }, []);
  const handleSearch = (query: string) => {
    try {
      // Filter the data based on the search input
      // const filteredData =
      //   _providersByCateegory?.filter((provider: {fullName: string}) =>
      //     provider.fullName.toLowerCase().includes(query.toLowerCase()),
      //   ) || [];

      const filtered =
        customerOrders.filter(
          order =>
            order?.serviceProvider?.firstName
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            order?.serviceProvider?.lastName
              .toLowerCase()
              .includes(query.toLowerCase()),
        ) || [];

      console.log('RESSSSS:', filtered);
      setFilteredOrders(filtered);
      // setSearchResults(filtered);
    } catch (error) {
      console.error('An unexpected error occurred during search:', error);
      // Handle unexpected error, show an error message, or take appropriate action
    } finally {
      // Optional: You can update the loading state here if needed
      // setLoading(false);
    }
  };
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
  const debouncedHandleSearch = debounce(handleSearch, 500);

  // useEffect(() => {
  //   const initGetOrders = async () => {
  //     setisLoading(true);
  //     const res: any = await getUserOrders('');
  //     console.log('oooooooo', res?.data);
  //     if (res?.status === 201 || res?.status === 200) {
  //       dispatch(addcustomerOrders(res?.data?.data));
  //     }
  //     // setloading(false);
  //     setisLoading(false);
  //   };
  //   initGetOrders();
  // }, []);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getUserOrders(searchInput);
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addcustomerOrders(res?.data?.data));
        // Filter orders based on search input
        // const filtered = res?.data?.data.filter(order =>
        //   order?.service?.toLowerCase().includes(searchInput.toLowerCase()),
        // );
      }
      setisLoading(false);
    };
    try {
      initGetOrders();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingBottom: 5,
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
              text={'Orders'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
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
              paddingBottom: 5,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setFilteredOrders(customerOrders);
              setsearchModal(false);
            }}>
            <Image
              source={images.cross}
              style={{height: 20, width: 20, tintColor: 'black'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInputs
            style={{marginTop: 10, width: '70%'}}
            labelText={'Search for orders'}
            state={searchInput}
            // setState={setsearchInput}
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={tw`flex flex-row mt-4`}>
          <TouchableOpacity
            onPress={() => {
              setactiveSection('Active');
            }}
            style={tw`w-1/2 border-b-2  items-center ${
              activeSection === 'Active'
                ? 'border-[#88087B]'
                : 'border-[#000000]'
            }`}>
            <Textcomp
              text={'Active'}
              size={14}
              lineHeight={16}
              color={activeSection === 'Active' ? '#88087B' : '#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setactiveSection('Closed');
            }}
            style={tw`w-1/2 border-b-2 items-center ${
              activeSection === 'Closed'
                ? 'border-[#88087B]'
                : 'border-[#000000]'
            }`}>
            <Textcomp
              text={'Closed'}
              size={14}
              lineHeight={16}
              color={activeSection === 'Closed' ? '#88087B' : '#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
        {customerOrders.length < 1 ? (
          <View style={[tw`flex-1 items-center`, {}]}>
            <View style={[tw``, {marginTop: perHeight(90)}]}>
              <Image
                source={images.profile}
                style={{height: 120, width: 120}}
                resizeMode="contain"
              />
            </View>
            <View style={tw`mx-auto mt-3`}>
              <Textcomp
                text={'No Orders Yet'}
                size={14.5}
                lineHeight={16.5}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
              <Textcomp
                text={'Every successful something starts with nothing'}
                size={14.5}
                lineHeight={16.5}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
                style={{textAlign: 'center'}}
              />
            </View>
            <View style={tw`mx-auto mt-3`}>
              <Textcomp
                text={'Your next big idea starts here'}
                size={14.5}
                lineHeight={16.5}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
                style={{textAlign: 'center'}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Services');
              }}
              style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
              <Textcomp
                text={'Explore services'}
                size={14.5}
                lineHeight={16.5}
                color={'#88087B'}
                fontFamily={'Inter-Bold'}
                style={{textAlign: 'center'}}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {activeSection === 'Active' && (
              <View style={[tw`items-center`, {flex: 1}]}>
                {filteredOrders?.length < 1 && (
                  <View
                    style={[
                      tw`bg-[#D9D9D9] w-full flex flex-col rounded  mt-3 mx-2`,
                      {height: perHeight(80), alignItems: 'center'},
                    ]}>
                    <View style={tw`my-auto pl-8`}>
                      <Textcomp
                        text={'Orders Not Found...'}
                        size={17}
                        lineHeight={17}
                        color={'black'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>
                  </View>
                )}
                {filteredOrders?.length > 1 && (
                  <ScrollView horizontal>
                    <FlatList
                      data={filteredOrders}
                      horizontal={false}
                      scrollEnabled={false}
                      renderItem={(item: any, index: any) => {
                        if (
                          item?.item?.status === 'CANCELLED' ||
                          item?.item?.status === 'COMPLETED' ||
                          item?.item?.status === 'DECLINED'
                        ) {
                          return null;
                        } else {
                          return (
                            <Orderscomponent
                              key={index}
                              navigation={navigation}
                              item={item.item}
                              index={item.index}
                              status={item.item?.status}
                              // index % 3 === 0 ? 'Pending' : 'Inprogress'
                            />
                          );
                        }
                      }}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={<View style={tw`h-20`} />}
                    />
                  </ScrollView>
                )}
                {false && (
                  <ScrollView horizontal>
                    <FlatList
                      data={customerOrders}
                      horizontal={false}
                      scrollEnabled={false}
                      renderItem={(item: any, index: any) => {
                        if (
                          item?.item?.status === 'CANCELLED' ||
                          item?.item?.status === 'COMPLETED' ||
                          item?.item?.status === 'DECLINED'
                        ) {
                          return null;
                        } else {
                          return (
                            <Orderscomponent
                              key={index}
                              navigation={navigation}
                              item={item.item}
                              index={item.index}
                              status={item.item?.status}
                              // index % 3 === 0 ? 'Pending' : 'Inprogress'
                            />
                          );
                        }
                      }}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={<View style={tw`h-20`} />}
                    />
                  </ScrollView>
                )}
              </View>
            )}
            {activeSection === 'Closed' && (
              <View style={[tw`items-center`, {flex: 1}]}>
                <ScrollView horizontal>
                  <FlatList
                    scrollEnabled={false}
                    data={customerOrders}
                    horizontal={false}
                    renderItem={(item: any, index: any) => {
                      console.log('texter---', item?.item);
                      if (
                        item?.item?.status === 'CANCELLED' ||
                        item?.item?.status === 'COMPLETED' ||
                        item?.item?.status === 'DECLINED'
                      ) {
                        return (
                          <Orderscomponent
                            key={index}
                            navigation={navigation}
                            item={item.item}
                            index={item.index}
                            status={item.item?.status}
                            // status={index % 3 === 0 ? 'Pending' : 'Completed'}
                          />
                        );
                      } else {
                        return null;
                      }
                    }}
                    keyExtractor={item => item?.id}
                    ListFooterComponent={<View style={tw`h-20`} />}
                  />
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ServiceproviderReview
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setserviceProviderModal(text);
        }}
        visible={serviceProviderModal}
      />
      <PrivateFeedback
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setprivateFeedback(text);
        }}
        visible={privateFeedback}
      />
      <RateyourExperience
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setrateYourExperience(text);
        }}
        visible={rateYourExperience}
      />
      <OrderCompleted
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderCompleted(text);
        }}
        visible={orderCompleted}
      />
      <OrderDispute
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDispute(text);
        }}
        visible={orderDispute}
      />
      <OrderDelivered
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDelivered(text);
        }}
        visible={orderDelivered}
      />
      <OrderInProgress
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderInProgress(text);
        }}
        visible={orderInProgress}
      />
      <OrderPlaced
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderPlacing(text);
        }}
        visible={orderPlacing}
      />
      <ScheduledDeliveryDate
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setscheduledDeliveryDate(text);
        }}
        visible={scheduledDeliveryDate}
      />
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default Orders;
