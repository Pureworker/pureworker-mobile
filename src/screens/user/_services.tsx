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
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight} from '../../utils/position/sizes';
import ServiceCard2 from '../../components/cards/serviceCard2';
import TextInputs from '../../components/TextInput2';

const _Services = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const passedService = route.params.service.name;
  console.log(passedService);

  const dummyData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [activeSection, setactiveSection] = useState('All');
  const [searchModal, setsearchModal] = useState(false);
  const [searchInput, setsearchInput] = useState('');
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
                text={`${passedService}`}
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
        <View style={tw`mt-3 mb-3`}>
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

          {dummyData.length < 1 ? (
            <View
              style={[
                tw`bg-[#D9D9D9] flex flex-col rounded justify-items align-items mt-3 mx-2`,
                {height: perHeight(80)},
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
                        data={dummyData}
                        scrollEnabled={false}
                        horizontal={false}
                        renderItem={(item: any, index) => {
                          return (
                            <ServiceCard2
                              key={index}
                              navigation={navigation}
                              item={item.item}
                              index={item.index}
                            />
                          );
                        }}
                        keyExtractor={item => item?.id}
                        ListFooterComponent={() => <View style={tw`h-20`} />}
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
                      data={dummyData.slice(0, 3)}
                      horizontal={false}
                      scrollEnabled={false}
                      renderItem={(item: any, index) => {
                        return (
                          <TouchableOpacity>
                            <ServiceCard2
                              key={index}
                              navigation={navigation}
                              item={item.item}
                              index={item.index}
                            />
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={item => item?.id}
                      ListFooterComponent={() => <View style={tw`h-20`} />}
                      contentContainerStyle={{paddingBottom: 20}}
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

export default _Services;
