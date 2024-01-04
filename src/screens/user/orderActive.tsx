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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../utils/position/sizes';
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
import colors from '../../constants/colors';

const OrderActive = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [activeSection, setactiveSection] = useState('Active');

  const orders = [0, 1, 2, 3];
  const passedData = route.params.data;
  // console.log(route.params.data);

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

  const userData = useSelector((state: any) => state.user.userData);

  console.log('data:', userData);

  useEffect(() => {
    // setorderDelivered(true);
  }, []);

  const item = route.params.data;

  const links = [
    {
      title: 'Order Placed',
      func: () => setorderPlacing(true),
    },
    {
      title: 'Order In Progress',
      func: () => setorderInProgress(true),
    },
    {
      title: 'Order Delivered',
      func: () => setorderDelivered(true),
    },
    {
      title: 'Order Completed',
      func: () => setorderCompleted(true),
    },
    {
      title: 'Order Dispute',
      func: () => setorderDispute(true),
    },
    {
      title: 'Rate your experince',
      func: () => setrateYourExperience(true),
    },
    {
      title: 'Private Feedback',
      func: function () {
        setprivateFeedback(!privateFeedback);
        console.log('hey', privateFeedback);
      },
    },
    {
      title: 'Service Provider Review',
      func: () => setserviceProviderModal(true),
    },
    {
      title: 'Scheduled Delivery Date',
      func: () => setscheduledDeliveryDate(true),
    },
  ];

  const providerLinks = [
    {
      title: 'Private Feedback',
      func: function () {
        setprivateFeedback(!privateFeedback);
        console.log('hey', privateFeedback);
      },
    },
    {
      title: 'Rate your experince',
      func: () => setrateYourExperience(true),
    },
    {
      title: 'Service Provider Review',
      func: () => setserviceProviderModal(true),
    },
    {
      title: 'Order Completed',
      func: () => setorderCompleted(true),
    },
    {
      title: 'Order Dispute',
      func: () => setorderDispute(true),
    },
    {
      title: 'Order Delivered',
      func: () => setorderDelivered(true),
    },
    {
      title: 'Order In Progress',
      func: () => setorderInProgress(true),
    },
    {
      title: 'Scheduled Delivery Date',
      func: () => setscheduledDeliveryDate(true),
    },
    {
      title: 'Order Placed',
      func: () => setorderPlacing(true),
    },
  ];

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
          {/* <TouchableOpacity
            onPress={() => {
              setsearchModal(true);
            }}>
            <Image
              source={images.search}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
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
          <TouchableOpacity onPress={() => setsearchModal(false)}>
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
            setState={setsearchInput}
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
      <ScrollView>
        <View style={tw`flex flex-row mt-4 opacity-20`}>
          <View
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
          </View>
          <View
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
          </View>
        </View>
        {orders.length < 1 ? (
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
                {/* <ScrollView horizontal>
                  <FlatList
                    data={orders}
                    horizontal={false}
                    scrollEnabled={false}
                    renderItem={(item: any, index: any) => {
                      return (
                        <Orderscomponent
                          key={index}
                          navigation={navigation}
                          item={item.item}
                          index={item.index}
                          status={index % 3 === 0 ? 'Pending' : 'Inprogress'}
                        />
                      );
                    }}
                    keyExtractor={item => item?.id}
                    ListFooterComponent={<View style={tw`h-20`} />}
                  />
                </ScrollView> */}
                <Orderscomponent
                  navigation={navigation}
                  // item={item.item}
                  // index={item.index}
                  editable={true}
                  item={passedData}
                  index={item?.index}
                  status={passedData?.status}
                />
                <View
                  style={[
                    tw`bg-[#2D303C] rounded p-4 mt-1`,
                    {width: perWidth(355)},
                  ]}>
                  {links?.map((item, index) => {
                    if (item?.title === 'Service Provider Review') {
                      if (userData?.accountType === 'customer') {
                      } else {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    } else if (item.title === 'Order Completed') {
                      if (passedData?.status === 'COMPLETED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Order In Progress') {
                      if (passedData?.status === 'INPROGRESS') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Order Delivered') {
                      if (passedData?.status === 'COMPLETED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Order Dispute') {
                      if (passedData?.status === 'DISPUTE' || passedData?.status === 'CANCELLED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Rate your experince') {
                      if (passedData?.status === 'COMPLETED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Private Feedback') {
                      if (passedData?.status === 'COMPLETED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                    else if (item.title === 'Scheduled Delivery Date') {
                      if (passedData?.status === 'PENDING' || passedData?.status === 'ACCEPTED') {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              style={[tw`flex flex-row items-center `, {}]}
                              onPress={() => {
                                item.func();
                              }}>
                              <View
                                style={[
                                  tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                  {width: 10, height: 10},
                                ]}
                              />
                              <Textcomp
                                text={item?.title}
                                size={14.5}
                                lineHeight={16.5}
                                color={'#FFFFFF'}
                                fontFamily={'Inter-Bold'}
                                style={{textAlign: 'center'}}
                              />
                            </TouchableOpacity>
                            {index < links.length - 1 && (
                              <View
                                style={[
                                  tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                  {height: 14},
                                ]}
                              />
                            )}
                          </>
                        );
                      }
                    }
                     else {
                      return (
                        <>
                          <TouchableOpacity
                            key={index}
                            style={[tw`flex flex-row items-center `, {}]}
                            onPress={() => {
                              item.func();
                            }}>
                            <View
                              style={[
                                tw`rounded-full mr-4 border border-[${colors.primary}]`,
                                {width: 10, height: 10},
                              ]}
                            />
                            <Textcomp
                              text={item?.title}
                              size={14.5}
                              lineHeight={16.5}
                              color={'#FFFFFF'}
                              fontFamily={'Inter-Bold'}
                              style={{textAlign: 'center'}}
                            />
                          </TouchableOpacity>
                          {index < links.length - 1 && (
                            <View
                              style={[
                                tw`border-l-2  ml-1 border-[${colors.primary}] w-full`,
                                {height: 14},
                              ]}
                            />
                          )}
                        </>
                      );
                    }
                  })}
                </View>
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
        item={item}
      />
      <PrivateFeedback
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setprivateFeedback(text);
        }}
        visible={privateFeedback}
        item={item}
      />
      <RateyourExperience
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setrateYourExperience(text);
        }}
        visible={rateYourExperience}
        item={item}
      />
      <OrderCompleted
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderCompleted(text);
        }}
        visible={orderCompleted}
        item={item}
      />
      <OrderDispute
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDispute(text);
        }}
        visible={orderDispute}
        item={item}
      />
      <OrderDelivered
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderDelivered(text);
        }}
        visible={orderDelivered}
        item={item}
      />
      <OrderInProgress
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderInProgress(text);
        }}
        visible={orderInProgress}
        item={item}
      />
      <OrderPlaced
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setorderPlacing(text);
        }}
        visible={orderPlacing}
        item={item}
      />
      <ScheduledDeliveryDate
        navigation={navigation}
        func={(text: boolean | ((prevState: boolean) => boolean)) => {
          setscheduledDeliveryDate(text);
        }}
        visible={scheduledDeliveryDate}
        item={item}
      />
    </View>
  );
};

export default OrderActive;
