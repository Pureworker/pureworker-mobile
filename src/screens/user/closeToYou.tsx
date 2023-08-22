import React, { useEffect, useState, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash'
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { StackNavigation } from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { perHeight } from '../../utils/position/sizes';
import ServiceCard2 from '../../components/cards/serviceCard2';
import TextInputs from '../../components/TextInput2';
import CloseToYouCard2 from '../../components/cards/closeToYou2';
import {
  useGetAllServiceProviderProfileQuery,
  useGetFavoriteProductQuery,
} from '../../store/slice/api';

const CloseToYou = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState('All');
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');

  const {
    data: getServiceProviderProfileData,
    isLoading: isLoadingServiceProviderProfile,
  } = useGetAllServiceProviderProfileQuery();
  const getServiceProviderProfile = getServiceProviderProfileData ?? [];
  const { data: getServiceProviderFavoriteData, isLoading: isLoadingFavorite } =
    useGetFavoriteProductQuery();
  const getServiceProviderFavorite = getServiceProviderFavoriteData ?? [];

  const filteredData = !_.isEmpty(getServiceProviderProfile) ? getServiceProviderProfile.filter((item: { fullNameFirst: any; fullNameSecond: any; }) => {
    const fullName = `${item.fullNameFirst} ${item.fullNameSecond}`.toLowerCase();
    const searchQuery = searchInput.toLowerCase();
    return fullName.includes(searchQuery);
  }) : []
  // const filterServiceProviderProfile = useMemo(() => {
  //   var searchArray = [];
  //   if (
  //     Array.isArray(getServiceProviderProfile) &&
  //     getServiceProviderProfile.length
  //   ) {
  //     searchArray = getServiceProviderProfile.filter(txt => {

  //       const text = txt?.fullNameFirst
  //       ? txt?.fullNameFirst.concat(txt?.fullNameSecond).toUpperCase()
  //       : ''.toUpperCase();
  //       const textSearch = searchInput.toUpperCase();
  //       return text.indexOf(textSearch) > -1;
  //     });
  //   }

  //   if (searchArray.length) {
  //     return searchArray;
  //   } else {
  //     return [];
  //   }
  // }, [searchInput, getServiceProviderProfile]);

  const filterServiceProviderFavorite = useMemo(() => {
    var searchArray = [];
    if (
      Array.isArray(getServiceProviderFavorite) &&
      getServiceProviderFavorite.length
    ) {
      searchArray = getServiceProviderFavorite.filter(txt => {
        const text = txt?.fullNameFirst
          ? txt?.fullNameFirst.concat(txt?.fullNameSecond).toUpperCase()
          : ''.toUpperCase();
        const textSearch = searchInput.toUpperCase();
        return text.indexOf(textSearch) > -1;
      });
    }

    if (searchArray.length) {
      return searchArray;
    } else {
      return [];
    }
  }, [searchInput, getServiceProviderProfile]);

  return (
    <View style={[{ flex: 1, backgroundColor: '#EBEBEB' }]}>
      <>
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
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={{ height: 25, width: 25 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={tw`mx-auto`}>
              <Textcomp
                text={'Close to you'}
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
                style={{ height: 25, width: 25 }}
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
                source={images.cross}
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={{ marginTop: 10, width: '70%' }}
              labelText={'Search for close to you'}
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
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </>
      <ScrollView>
        <View style={tw`mt-3 mb-3`}>
          <View style={tw`flex flex-row`}>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('All');
              }}
              style={tw`w-1/2 border-b-2  items-center ${activeSection === 'All'
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
                setActiveSection('Saved');
              }}
              style={tw`w-1/2 border-b-2 items-center ${activeSection === 'Saved'
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

          {getServiceProviderProfile.length < 1 ? (
            <View
              style={[
                tw`bg-[#D9D9D9] flex flex-col rounded justify-items align-items mt-3 mx-2`,
                { height: perHeight(80) },
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
                <View style={[tw`items-center`, { flex: 1 }]}>
                  <ScrollView horizontal>
                    <FlatList
                      data={filteredData}
                      horizontal={false}
                      scrollEnabled={false}
                      renderItem={(item: any) => {
                        return (
                          <CloseToYouCard2
                            item={item.item}
                            index={item.index}
                          />
                        );
                      }}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={() => <View style={tw`h-20`} />}
                    />
                  </ScrollView>
                </View>
              )}
              {activeSection === 'Saved' && (
                <View style={[tw`items-center`, { flex: 1 }]}>
                  <ScrollView horizontal>
                    <FlatList
                      scrollEnabled={false}
                      data={filterServiceProviderFavorite}
                      horizontal={false}
                      renderItem={(item: any) => {
                        return (
                          <CloseToYouCard2
                            item={item.item}
                            index={item.index}
                          />
                        );
                      }}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={() => <View style={tw`h-20`} />}
                    />
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
    </View>
  );
};

export default CloseToYou;
