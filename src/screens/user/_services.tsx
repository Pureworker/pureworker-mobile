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
import {perHeight} from '../../utils/position/sizes';
import ServiceCard2 from '../../components/cards/serviceCard2';
import TextInputs from '../../components/TextInput2';
import {
  getProviderByCategory,
  getProviderByService,
  getUser,
} from '../../utils/api/func';
import {addprovidersByCateegory} from '../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';

const _Services = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const passedService = route.params?.service?.name;
  const id = route.params?.service?._id;
  console.log('--kk-passed', route.params.service?.id);

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

  console.log('BOOKMARK', userData?.bookmarks);

  useEffect(() => {
    const initGetUsers = async () => {
      setisLoading(true);
      const res: any = await getProviderByService(id);
      console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addprovidersByCateegory(res?.data?.data));
      }

      //run check here; 


      // setloading(false);
      setisLoading(false);
    };
    initGetUsers();
  }, [dispatch, id]);

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
        <View style={tw`mt-4 mb-3`}>
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

          <>
            {!isLoading && (
              <>
                {_providersByCateegory.length < 1 ? (
                  <View
                    style={[
                      tw`bg-[#D9D9D9] flex flex-col rounded  mt-3 mx-2`,
                      {height: perHeight(80),  alignItems: 'center'},
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
                          <ScrollView scrollEnabled={false} horizontal>
                            <FlatList
                              style={{flex: 1}}
                              data={_providersByCateegory}
                              scrollEnabled={false}
                              horizontal={false}
                              renderItem={(item: any, index: any) => {
                                return (
                                  <ServiceCard2
                                    key={index}
                                    navigation={navigation}
                                    item={item.item}
                                    index={item.index}
                                    id={id}
                                    serviceName={passedService}
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
                                  />
                                </TouchableOpacity>
                              );
                            }}
                            keyExtractor={item => item?.id}
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
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default _Services;
