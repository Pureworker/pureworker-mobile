import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CategoryList2 from '../../components/CategoryList2';
import {
  useGetCategoryQuery,
  useGetUserDetailQuery,
} from '../../store/slice/api';

const TabServices2 = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const {data: getCategoryData, isLoading, isError} = useGetCategoryQuery();
  const getCategory = getCategoryData ?? [];
  const _getCategory = useSelector((state: any) => state.user.category);

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDropdownClick = (catId: React.SetStateAction<null>) => {
    if (catId === openDropdownId) {
      setOpenDropdownId(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdownId(catId); // Open the clicked dropdown
    }
  };

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
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
        </View>
      </>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw``}>
          <View style={tw`mr-auto px-[5%] mt-4`}>
            <Textcomp
              text={'Service Categories'}
              size={22}
              lineHeight={25}
              color={'#000413'}
              fontFamily={'Inter'}
            />
          </View>
          {/* <View style={tw``}>
            <ScrollView
              scrollEnabled={false}
              style={tw`w-full `}
              contentContainerStyle={tw`w-[92%] mx-auto`}
              horizontal>
              <FlatList
                style={{flex: 1}}
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
                renderItem={({item, index}) => (
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
          </View> */}

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
                      catId={item?.id}
                      isOpen={item?.id === openDropdownId}
                      onDropdownClick={handleDropdownClick}
                    />
                  );
                })}
              </ScrollView>
            </ScrollView>
          </View>
        </View>
        <View style={tw`h-20`} />
      </ScrollView>
    </View>
  );
};

export default TabServices2;
