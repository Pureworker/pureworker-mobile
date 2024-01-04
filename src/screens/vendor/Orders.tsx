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
import {perHeight} from '../../utils/position/sizes';
import TextInputs from '../../components/TextInput2';
import CloseToYouCard2 from '../../components/cards/closeToYou2';
import Orderscomponent2 from '../../components/Orderscomponent2';
import { addproviderOrders } from '../../store/reducer/mainSlice';
import { getProviderOrders, getUserOrders } from '../../utils/api/func';

const Orders = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [activeSection, setactiveSection] = useState('Active');
  const [isLoading, setisLoading] = useState(false);
  const providerOrders = useSelector((state: any) => state.user.providerOrders);
  const userData = useSelector((state: any) => state.user.userData);

  const orders = [0, 1, 2, 3];

  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getProviderOrders(userData?._id);
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addproviderOrders(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetOrders();
  }, [dispatch]);

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
          <TouchableOpacity onPress={() => setsearchModal(false)}>
            <Image
              source={images.cross}
              style={{height: 20, width: 20, tintColor: 'black'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInputs
            style={{marginTop: 10, width: '70%'}}
            labelText={'Search for customer'}
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
        {providerOrders.length < 1 ? (
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
              onPress={() => {navigation.navigate('Services');}}
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
                <ScrollView horizontal>
                  <FlatList
                    data={providerOrders}
                    horizontal={false}
                    scrollEnabled={false}
                    renderItem={(item: any, index: any) => {
                      return (
                        <Orderscomponent2
                          key={index}
                          navigation={navigation}
                          item={item.item}
                          index={item.index}
                          status ={item?.item?.status}
                          // status={index % 3 === 0 ? 'Pending' : 'Inprogress'}
                        />
                      );
                    }}
                    keyExtractor={item => item?.id}
                    ListFooterComponent={<View style={tw`h-20`} />}
                  />
                </ScrollView>
              </View>
            )}
            {activeSection === 'Closed' && (
              <View style={[tw`items-center`, {flex: 1}]}>
                <ScrollView horizontal>
                  <FlatList
                    scrollEnabled={false}
                    data={providerOrders?.filter((item)=> item?.status === 'COMPLETED')}
                    horizontal={false}
                    renderItem={(item: any, index: any) => {
                      return (
                        <Orderscomponent2
                          key={index}
                          navigation={navigation}
                          item={item.item}
                          index={item.index}
                          status={index % 3 === 0 ? 'Pending' : 'Completed'}
                        />
                      );
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
    </View>
  );
};

export default Orders;
