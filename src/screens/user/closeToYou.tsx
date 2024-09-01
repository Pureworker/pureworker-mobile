import React, {useState, useMemo} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInput2';
import CloseToYouCard4 from '../../components/cards/closeToYou4';
import images from '../../constants/images';
import {
  useGetAllServiceProviderProfileQuery,
  useGetFavoriteProductQuery,
} from '../../store/slice/api';
import {StackNavigation} from '../../constants/navigation';

const CloseToYou = () => {
  const navigation = useNavigation<StackNavigation>();
  const [activeSection, setActiveSection] = useState('All');
  const [searchModal, setSearchModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const {data: serviceProviderProfileData = []} =
    useGetAllServiceProviderProfileQuery();
  const {data: serviceProviderFavoriteData = []} = useGetFavoriteProductQuery();

  const closeProvider = useSelector((state: any) => state.user.closeProvider);

  const filteredServiceProviderFavorites = useMemo(() => {
    if (
      !Array.isArray(serviceProviderFavoriteData) ||
      serviceProviderFavoriteData.length === 0
    ) {
      return [];
    }

    return serviceProviderFavoriteData.filter(txt => {
      const fullName = txt?.fullNameFirst
        ? `${txt.fullNameFirst} ${txt.fullNameSecond}`.toUpperCase()
        : '';
      const searchQuery = searchInput.toUpperCase();
      return fullName.includes(searchQuery);
    });
  }, [searchInput, serviceProviderFavoriteData]);

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? getStatusBarHeight(true)
              : StatusBar.currentHeight + getStatusBarHeight(true),
        }}>
        {!searchModal ? (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.back}
                style={styles.backIcon}
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
          </View>
        ) : (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={() => setSearchModal(false)}>
              <Image
                source={images.cross}
                style={styles.crossIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={styles.searchInput}
              labelText={'Search for close to you'}
              state={searchInput}
              setState={setSearchInput}
            />
            <TouchableOpacity style={styles.searchIconContainer}>
              <Image
                source={images.search}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          <View style={tw`mt-4 mb-3`}>
            {closeProvider.length < 1 ? (
              <View style={styles.emptyProviderContainer}>
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
                  <View style={[tw`items-center`, {flex: 1}]}>
                    <FlatList
                      data={closeProvider}
                      scrollEnabled={false}
                      renderItem={({item, index}) => (
                        <CloseToYouCard4
                          navigation={navigation}
                          item={item}
                          index={index}
                        />
                      )}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={() => <View style={tw`h-20`} />}
                    />
                  </View>
                )}
                {activeSection === 'Saved' && (
                  <View style={[tw`items-center`, {flex: 1}]}>
                    <FlatList
                      scrollEnabled={false}
                      data={filteredServiceProviderFavorites}
                      renderItem={({item, index}) => (
                        <CloseToYouCard4 item={item} index={index} />
                      )}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={() => <View style={tw`h-20`} />}
                    />
                  </View>
                )}
              </>
            )}
          </View>
          <View style={tw`h-20`} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  crossIcon: {
    height: 20,
    width: 20,
  },
  searchInput: {
    marginTop: 10,
    width: '70%',
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  emptyProviderContainer: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'column',
    borderRadius: 8,
    marginTop: 12,
    marginHorizontal: 12,
    height: perHeight(80),
    alignItems: 'center',
  },
};

export default CloseToYou;
