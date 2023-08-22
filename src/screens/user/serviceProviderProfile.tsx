import React, { useEffect, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StackNavigation } from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SIZES, perHeight, perWidth } from '../../utils/position/sizes';
import FastImage from 'react-native-fast-image';
import colors from '../../constants/colors';
import Modal from 'react-native-modal';
import Review from '../../components/Review';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useGetSingleProviderAllServiceQuery, useGetSingleProviderServiceQuery } from '../../store/slice/api';

const ServiceProviderProfile = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('About');
  const [imageModal, setimageModal] = useState(false);

  const [saved, setsaved] = useState(false);
  const route: any = useRoute()
  const { data: getSingleProviderServiceData, isLoading: isLoadingUser } = useGetSingleProviderServiceQuery(route.params?.id);
  const getSingleProviderService = getSingleProviderServiceData ?? [];

  const { data: getSingleProviderAllServiceData } = useGetSingleProviderAllServiceQuery(route.params?.id)
  const getSingleProviderAllService = getSingleProviderAllServiceData ?? [];
  const price = getSingleProviderService?.price ? JSON.parse(getSingleProviderService?.price) : [] 
  const serviceDetail = getSingleProviderService?.serviceDetail ? JSON.parse(getSingleProviderService?.serviceDetail) : []
 
  const firstPotfolio = getSingleProviderService?.ServicePotfolio?.length ? JSON.parse(getSingleProviderService?.ServicePotfolio[0]?.potfolioImages) : []
  const secondPotfolio = getSingleProviderService?.ServicePotfolio?.length > 1 ? JSON.parse(getSingleProviderService?.ServicePotfolio[1]?.potfolioImages) : []
  // const thirdPotfolio = getSingleProviderService?.ServicePotfolio?.length > 2 ? JSON.parse(getSingleProviderService?.ServicePotfolio[2]?.potfolioImages) : []

  
  
  return (
    <View style={[{ flex: 1, backgroundColor: '#EBEBEB' }]}>
      <View>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
                StatusBar.currentHeight + getStatusBarHeight(true),
          }}
        />
        {/* <View
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
              text={'Privacy Policy'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View> */}
        <FastImage
          style={[tw``, { width: SIZES.width, height: 200 }]}
          source={{
            uri: getSingleProviderService?.profilePicture,
            headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}>
          <View
            style={[
              tw`flex flex-row justify-between`,
              { paddingHorizontal: perWidth(15), marginTop: perHeight(10) },
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={images.back}
                resizeMode="contain"
                style={{ width: 25, height: 25, tintColor: 'black' }}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Image
                source={images.save}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: 'black' }}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                setsaved(!saved);
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: perWidth(20),
                  height: perWidth(20),
                  tintColor: saved ? '#C0392B' : 'black',
                }}
                source={saved ? images.saved : images.save}
              />
            </TouchableOpacity>
          </View>
          <View style={tw`mt-auto pb-4 ml-auto mr-4`}>
            <TouchableOpacity style={tw`items-center`}>
              <Image
                source={images.chat}
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
              <Textcomp
                text={'Chat'}
                size={12}
                lineHeight={14.5}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
        </FastImage>

        <View style={tw``}>
          <View style={tw`mx-auto pt-2`}>
            <Textcomp
              text={getSingleProviderService?.User?.firstName}
              size={20}
              lineHeight={24}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View style={tw`mx-auto `}>
            <Textcomp
              text={'Pumber'}
              size={12}
              lineHeight={14.5}
              color={'#88087B'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          <View
            style={[tw`flex flex-row mt-4 mx-auto`, { width: perWidth(353) }]}>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('About');
              }}
              style={tw`w-1/3 border-b-2  items-center ${activeSection === 'About'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
                }`}>
              <Textcomp
                text={'About'}
                size={14}
                lineHeight={16}
                color={activeSection === 'About' && '#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('Jobs');
              }}
              style={tw`w-1/3 border-b-2  items-center ${activeSection === 'Jobs'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
                }`}>
              <Textcomp
                text={'Jobs'}
                size={14}
                lineHeight={16}
                color={activeSection === 'Jobs' && '#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveSection('Reviews');
              }}
              style={tw`w-1/3 border-b-2  items-center ${activeSection === 'Reviews'
                  ? 'border-[#29D31A]'
                  : 'border-[#000000]'
                }`}>
              <Textcomp
                text={'Reviews'}
                size={14}
                lineHeight={16}
                color={activeSection === 'Reviews' && '#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
          {activeSection === 'About' && (
            <ScrollView
              contentContainerStyle={[
                tw`mx-2 h-[140%] bg-[${colors.darkPurple}]`,
                { flex: 0, borderRadius: 5, marginTop: perHeight(12) },
              ]}>
              <View
                style={[
                  tw`border-b border-[#FFF] pt-4 mx-2`,
                  { paddingBottom: perHeight(11) },
                ]}>
                <View style={tw` pt-2`}>
                  <Textcomp
                    text={'User Information'}
                    size={16}
                    lineHeight={17}
                    color={'#FFFFFF'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              </View>
              <View style={tw`border-b border-[#FFF] pb-4 mx-2`}>
                <View style={tw` pt-2`}>
                  <Textcomp
                    text={getSingleProviderService?.description}
                    size={12}
                    lineHeight={14}
                    color={'#FFFFFF'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.location}
                    resizeMode="contain"
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'From'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, { marginTop: perHeight(5) }]}>
                    <Textcomp
                      text={getSingleProviderService?.city}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.dollar}
                    resizeMode="contain"
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Price range'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, { marginTop: perHeight(5) }]}>
                    <Textcomp
                      text={price[0]?.priceMax}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.send}
                    resizeMode="contain"
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Recent Delivery'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, { marginTop: perHeight(5) }]}>
                    <Textcomp
                      text={'Abuja, Nigeria'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={tw`ml-1`}>
                  <Image
                    source={images.eye}
                    resizeMode="contain"
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <View style={tw`ml-3 `}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Last active'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={[tw` `, { marginTop: perHeight(5) }]}>
                    <Textcomp
                      text={'Abuja, Nigeria'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={[tw` `, { marginLeft: perWidth(30) }]}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'Other Services'}
                      size={12}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>

                  <View style={tw`w-full`}>
                    <FlatList
                      scrollEnabled={false}
                      data={serviceDetail}
                      renderItem={({item, index}) => {
                        
                        return (
                          <View
                            key={index}
                            style={[
                              tw`bg-white rounded-lg w-auto p-3 mr-2 py-1 items-center`,
                              { marginTop: perHeight(5) },
                            ]}>
                            <Textcomp
                              text={item?.serviceName}
                              size={9}
                              lineHeight={12}
                              color={'#000000'}
                              fontFamily={'Inter-Bold'}
                            />
                          </View>
                        );
                      }}
                      //   keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={{}}
                    />
                  </View>
                </View>
              </View>
              {firstPotfolio?.length || secondPotfolio?.length ? <View
                style={[
                  tw`border-b border-[#FFF] flex flex-row items-center pt-4 mx-2`,
                  { paddingVertical: perHeight(11) },
                ]}>
                <View style={[tw` `, { marginLeft: perWidth(25) }]}>
                  <View style={tw` `}>
                    <Textcomp
                      text={'PortFolio'}
                      size={14}
                      lineHeight={15}
                      color={'#FFFFFF80'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>

                  {firstPotfolio?.length ? <View style={tw`w-full mt-3`}>
                    <View style={tw` `}>
                      <Textcomp
                        text={'Project1'}
                        size={12}
                        lineHeight={15}
                        color={'#FFFFFF'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>
                    <FlatList
                      scrollEnabled={false}
                      data={firstPotfolio}
                      renderItem={({item, index}) => {
                        return (
                          <FastImage
                            onTouchStart={() => setimageModal(true)}
                            style={[
                              tw`mr-2`,
                              {
                                width: perWidth(95),
                                aspectRatio: 1,
                                borderRadius: 10,
                              },
                            ]}
                            source={{
                              uri: item,
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        );
                      }}
                      //   keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={{ marginTop: 10 }}
                    />
                  </View> : null}
                  {secondPotfolio?.length ? <View style={tw`w-full mt-3`}>
                    <View style={tw` `}>
                      <Textcomp
                        text={'Project2'}
                        size={12}
                        lineHeight={15}
                        color={'#FFFFFF'}
                        fontFamily={'Inter-Bold'}
                      />
                    </View>
                    <FlatList
                      scrollEnabled={false}
                      data={secondPotfolio}
                      renderItem={({item, index}) => {
                        return (
                          <FastImage
                            onTouchStart={() => setimageModal(true)}
                            style={[
                              tw`mr-2`,
                              {
                                width: perWidth(95),
                                aspectRatio: 1,
                                borderRadius: 10,
                              },
                            ]}
                            source={{
                              uri: item,
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        );
                      }}
                      //   keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={{ marginTop: 10 }}
                    />
                  </View> : null}
                </View>
              </View> : null}

              <View style={tw`h-150`} />
            </ScrollView>
          )}
          {activeSection === 'Jobs' && (
            <ScrollView
              horizontal
              contentContainerStyle={[
                tw`mx-2 h-auto `,
                { flex: 0, borderRadius: 5, marginTop: perHeight(1) },
              ]}>
              {/* <View
                style={[
                  tw`border-b border-[#FFF] pt-4 mx-2`,
                  {paddingBottom: perHeight(11)},
                ]}>
                <View style={tw` pt-2`}>
                  <Textcomp
                    text={'User Information'}
                    size={16}
                    lineHeight={17}
                    color={'#FFFFFF'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              </View> */}

              <FlatList
                scrollEnabled={false}
                data={[0, 1, 2]}
                renderItem={(item, index) => {
                  return (
                    <View
                      style={[
                        tw` ${index === 0 ? 'mt-0' : 'mt-4'}  mx-auto bg-[${colors.darkPurple
                          }]`,
                        {
                          height: perWidth(130),
                          width: SIZES.width * 0.95,
                          borderWidth: 0,
                          borderRadius: 5,
                          // marginLeft: index === 0 ? 10 : 3,
                          paddingHorizontal: perWidth(16),
                          paddingVertical: perWidth(14),
                        },
                      ]}>
                      <View style={tw`flex flex-row `}>
                        <View
                          style={[
                            tw``,
                            { width: perWidth(50), height: perWidth(50) },
                          ]}>
                          <FastImage
                            style={[
                              tw`mr-2`,
                              {
                                width: perWidth(50),
                                height: perWidth(50),
                                borderRadius: perWidth(50) / 2,
                              },
                            ]}
                            source={{
                              uri: 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1691626246/Assets/1691626245707-Frame%2071.png.png',
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          <View
                            style={[
                              tw`absolute bottom-0 border-2 right-1 rounded-full`,
                              {
                                width: 8,
                                height: 8,
                                backgroundColor: colors.green,
                              },
                            ]}
                          />
                        </View>
                        <View style={[tw`flex-1`, { marginLeft: perWidth(12) }]}>
                          <View style={[tw`flex flex-row justify-between`, {}]}>
                            <View style={[tw``, {}]}>
                              <Textcomp
                                text={'$15'}
                                size={14}
                                lineHeight={16}
                                color={colors.white}
                                fontFamily={'Inter-Bold'}
                              />
                            </View>
                          </View>
                          <View
                            style={[
                              tw``,
                              { width: perWidth(252), marginTop: perHeight(4) },
                            ]}>
                            <Textcomp
                              text={'description'}
                              size={12}
                              lineHeight={14}
                              color={colors.white}
                              fontFamily={'Inter-SemiBold'}
                              numberOfLines={2}
                            />
                          </View>
                        </View>
                      </View>
                      {/* <View>
                        <View
                          style={[
                            tw``,
                            { width: perWidth(105), marginTop: perWidth(4) },
                          ]}>
                          <Textcomp
                            text={'Steven W.s'}
                            size={12}
                            lineHeight={14}
                            color={colors.white}
                            fontFamily={'Inter-SemiBold'}
                          />
                        </View>
                      </View> */}
                      <View
                        style={tw`mt-auto flex flex-row items-center justify-between`}>
                        <View
                          style={[
                            tw``,
                            { width: perWidth(105), marginTop: perWidth(4) },
                          ]}>
                          <Textcomp
                            text={'Jan3, 2020'}
                            size={12}
                            lineHeight={14}
                            color={colors.white}
                            fontFamily={'Inter-SemiBold'}
                          />
                        </View>

                        <View style={[tw``, {}]}>
                          <Textcomp
                            text={'IN PROGRESS'}
                            size={12}
                            lineHeight={14}
                            color={colors.primary}
                            fontFamily={'Inter-Bold'}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
                //   keyExtractor={item => item.id}
                numColumns={1}
                contentContainerStyle={{ marginTop: 10 }}
              />

              <View style={tw`h-150`} />
            </ScrollView>
          )}
          {activeSection === 'Reviews' && (
            <ScrollView
              contentContainerStyle={[
                tw`mx-2 h-auto `,
                { flex: 0, borderRadius: 5, marginTop: perHeight(1) },
              ]}>
              <View
                style={[
                  tw`border-b border-[#000000] pb-2 mt-4  p-4 mx-1 mx-auto`,
                  {
                    paddingBottom: perHeight(11),
                    width: perWidth(357),
                    height: perHeight(130),
                    backgroundColor: colors.darkPurple,
                    borderRadius: 5,
                  },
                ]}>
                <View style={tw`flex flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Overall rating'}
                      size={16}
                      lineHeight={17}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review value={2} editable={false} />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Seller Communication'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review value={3} editable={false} />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Woul recommend'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review value={4} editable={false} />
                  </View>
                </View>
                <View style={tw`flex mt-auto flex-row justify-between`}>
                  <View style={tw` pt-2`}>
                    <Textcomp
                      text={'Service as described'}
                      size={12}
                      lineHeight={14}
                      color={'#FFFFFF'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                  <View style={tw` pt-2`}>
                    <Review value={2} editable={false} />
                  </View>
                </View>
              </View>

              <FlatList
                scrollEnabled={true}
                data={[0, 1, 2, 3, 4, 5, 6]}
                renderItem={(item, index) => {
                  return (
                    <View
                      style={[
                        tw` ${index === 0 ? 'mt-0' : 'mt-4'}  mx-auto bg-[${colors.darkPurple
                          }]`,
                        {
                          height: perWidth(157),
                          width: SIZES.width * 0.95,
                          borderWidth: 0,
                          borderRadius: 5,
                          // marginLeft: index === 0 ? 10 : 3,
                          paddingHorizontal: perWidth(16),
                          paddingVertical: perWidth(14),
                        },
                      ]}>
                      <View style={tw`flex flex-row `}>
                        <View
                          style={[
                            tw``,
                            { width: perWidth(50), height: perWidth(50) },
                          ]}>
                          <FastImage
                            style={[
                              tw`mr-2`,
                              {
                                width: perWidth(50),
                                height: perWidth(50),
                                borderRadius: perWidth(50) / 2,
                              },
                            ]}
                            source={{
                              uri: 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1691626246/Assets/1691626245707-Frame%2071.png.png',
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          <View
                            style={[
                              tw`absolute bottom-0 border-2 right-1 rounded-full`,
                              {
                                width: 8,
                                height: 8,
                                backgroundColor: colors.green,
                              },
                            ]}
                          />
                        </View>
                        <View style={[tw`flex-1`, { marginLeft: perWidth(12) }]}>
                          <View style={[tw`flex flex-row justify-between`, {}]}>
                            <View style={[tw``, {}]}>
                              <Textcomp
                                text={'Stacy  W.'}
                                size={14}
                                lineHeight={16}
                                color={colors.white}
                                fontFamily={'Inter-Bold'}
                              />
                            </View>
                            <View style={tw` pt-2`}>
                              <Review value={2} editable={false} />
                            </View>
                          </View>
                          <View
                            style={[
                              tw``,
                              { width: perWidth(252), marginTop: perHeight(4) },
                            ]}>
                            <Textcomp
                              text={'Lagos'}
                              size={12}
                              lineHeight={14}
                              color={'#FFFFFF80'}
                              fontFamily={'Inter-SemiBold'}
                              numberOfLines={2}
                            />
                            <View style={[tw`ml-auto`, {}]}>
                              <Textcomp
                                text={'4 days ago'}
                                size={12}
                                lineHeight={16}
                                color={'#FFFFFF80'}
                                fontFamily={'Inter-Bold'}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View>
                      <View
                          style={[
                            tw` ml-auto mr-2`,
                            {width: perWidth(252), marginTop: perWidth(5)},
                          ]}>
                          <Textcomp
                            text={'He is very good plumber with years of experience as stated in his profile. His job was quick and delivered as discussed, I will recommend him for any job here.'}
                            size={12}
                            lineHeight={14}
                            color={colors.white}
                            fontFamily={'Inter-SemiBold'}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
                //   keyExtractor={item => item.id}
                numColumns={1}
                contentContainerStyle={{ marginTop: 10 }}
                ListFooterComponent={<View style={tw`h-40`} />}
              />

              <View style={tw`h-150`} />
            </ScrollView>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('OrderDetails', { data: null });
        }}
        style={[
          tw`bg-[#FFF] absolute bottom-[11%] right-[5%] rounded-full items-center justify-center`,
          { width: perWidth(52), aspectRatio: 1 },
        ]}>
        <Textcomp
          text={'HIRE'}
          size={14}
          lineHeight={16.5}
          color={'#000413'}
          fontFamily={'Inter-SemiBold'}
        />
      </TouchableOpacity>
      <Modal
        isVisible={imageModal}
        onBackButtonPress={() => setimageModal(false)}
        onBackdropPress={() => setimageModal(false)}
        swipeThreshold={200}
        // swipeDirection={['down']}
        style={{
          width: SIZES.width,
          padding: 0,
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onSwipeComplete={() => setimageModal(false)}>
        <View
          style={[
            tw`bg-white mt-auto mb-[25%] items-center  rounded-lg `,
            {width: perWidth(310), height: perHeight(315), borderRadius: 15},
          ]}>
          <FastImage
            style={[
              tw``,
              {
                width: perWidth(310),
                height: perHeight(315),
                borderRadius: 15,
              },
            ]}
            source={{
              uri: 'https://res.cloudinary.com/dr0pef3mn/image/upload/v1691626246/Assets/1691626245707-Frame%2071.png.png',
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ServiceProviderProfile;
