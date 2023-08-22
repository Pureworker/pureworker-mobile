import React, { useEffect, useMemo, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import images from '../../constants/images';
import TextInputs from '../../components/TextInput2';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';

import { SIZES, perHeight, perWidth } from '../../utils/position/sizes';

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
import { StackNavigation } from '../../constants/navigation';
import { useNavigation } from '@react-navigation/native';
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
  const { data: getUserData, isLoading: isLoadingUser } = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const { data: getCategoryData, isLoading, isError } = useGetCategoryQuery();
  const getCategory = getCategoryData ?? [];

  const [InfoModal, setInfoModal] = useState(false);

  const filterBySearchProduct = useMemo(() => {
    var searchArray = [];
    if (
      Array.isArray(getServiceProviderProfile) &&
      getServiceProviderProfile.length
    ) {
      searchArray = getServiceProviderProfile.filter(item => {

        const data = item?.price ? JSON.parse(item?.price) : ''
        if (Array.isArray(data) && data.length) {
          const array = data.filter((service) => {
            const text = service?.serviceName
            ? service?.serviceName.toUpperCase()
            : ''.toUpperCase();
            const textSearch = search.toUpperCase();
            return text.indexOf(textSearch) > -1;
          })
          if (array.length) {
            return item
          }
        }
      });
    }

    if (searchArray.length) {
      return searchArray;
    } else {
      return [];
    }
  }, [search, getServiceProviderProfile]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEBEB' }}>
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
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={{ marginTop: 0, width: '70%' }}
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
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              tw``,
              { marginLeft: perWidth(18), marginTop: perHeight(28) },
            ]}>
            <Textcomp
              text={`Welcome ${getUser.firstName},`}
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

          <View style={{ flex: 1 }}>
            <FlatList
              data={getServiceProviderPotfolio}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={(item: any) => {
                return (
                  <ServiceCard
                    navigation={navigation}
                    item={item.item}
                    index={item.index}
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

          <View style={{ flex: 1 }}>
            <FlatList
              data={filterBySearchProduct}
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
          </View>

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
                <FlatList
                  style={{ flex: 1 }}
                  data={getCategory}
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
                  renderItem={({ item, index }) => (
                    <CategoryList2 categoryName={item.name} catId={item?.id} />
                  )}
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
                />
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
        }}
        style={{ width: SIZES.width, marginHorizontal: 0 }}
        deviceWidth={SIZES.width}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setInfoModal(false)}
            style={tw`flex-1`}
          />
          <View style={tw`h-[20%]  items-center mt-auto bg-[#D9D9D9]`}>
            {/* <View
              style={[
                tw`items-center justify-center`,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                },
              ]}>
              <TouchableOpacity onPress={() => setInfoModal(false)}>
                <Image
                  source={images.search}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              onPress={() => {
                setInfoModal(false);
              }}
              style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
            />
            <TouchableOpacity
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
