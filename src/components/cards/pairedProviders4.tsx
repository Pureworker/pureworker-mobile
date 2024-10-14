import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SIZES, perHeight, perWidth } from '../../utils/position/sizes';
import React, { useState } from 'react';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import Review from '../Review';
import FastImage from 'react-native-fast-image';
import { metersToKilometers, ToastShort } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal/dist/modal';
import VerifiedTag from '../../assets/svg/verifiedtag';
import { bookMarkServiceProvide, deletebookMarkServiceProvide, getUser } from '../../utils/api/func';
import { addUserData } from '../../store/reducer/mainSlice';

const PairedProviders4 = ({ item, index, navigation }: any) => {
  const [showModal, setshowModal] = useState(false);
  const [savedProvider, setSavedProvider] = useState(false);
  const dispatch = useDispatch();

  const handleBookmark = async () => {
    try {
      const data = {
        service: item.service._id,
        serviceProvider: item.serviceProvider._id,
      };
      const res: any = await bookMarkServiceProvide(data);
      if (res?.status === 200 || res?.status === 201) {
        ToastShort('Service Provider bookmarked!.');
        setSavedProvider(true);
      } else {
        ToastShort(
          `${
            res?.error?.message
              ? res?.error?.message
              : res?.error?.data?.message
              ? res?.error?.data?.message
              : 'Oops!, an error occured'
          }`,
        );
      }
    } catch (error) {
    } finally {
      const initGetUsers = async () => {
        const res: any = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
          // const query = res?.data?.user?.bookmarks?.filter(
          //   (item: {service: any}) => item?.service === id,
          // );
          // setsavedProviders(query);
        }
      };
      // initBookmarked();
      initGetUsers();
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      // const ch = savedProviders?.filter(
      //   (d: {service: any}) => d?.serviceProvider === profileData?._id,
      // );
      const __id = item.serviceProvider._id;
      const res: any = await deletebookMarkServiceProvide(__id);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastShort('Unboomarked!');
        setSavedProvider(false);
      } else {
        console.log(res?.status);

        ToastShort(
          `${
            res?.error?.message
              ? res?.error?.message
              : res?.error?.data?.message
              ? res?.error?.data?.message
              : 'Oops!, an error occured'
          }`,
        );
      }
    } catch (error) {
    } finally {
      const initGetUsers = async () => {
        const res: any = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
          // const query = res?.data?.user?.bookmarks?.filter(
          //   (item: {service: any}) => item?.service === id,
          // );
          // setsavedProviders(query);
        }
      };
      // initBookmarked();
      initGetUsers();
    }
  };


  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setshowModal(true);
        }}
        style={[
          tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
          {
            height: perWidth(135),
            width: SIZES.width * 0.95,
            borderWidth: 0,
            borderRadius: 5,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-row `}>
          <View style={[tw``, { width: perWidth(50), height: perWidth(50) }]}>
            <FastImage
              style={[
                tw``,
                {
                  width: perWidth(50),
                  height: perWidth(50),
                  borderRadius: perWidth(50) / 2,
                },
              ]}
              source={{
                uri:
                  item?.serviceProvider.profilePic ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.high,
                // cache: FastImage.cacheControl.cacheOnly
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              style={[tw` my-2`]}
            >
              <Textcomp
                text={
                  item?.serviceProvider.name
                    ? `${item?.serviceProvider.name}`
                    : `${item?.serviceProvider.firstName} ${item?.serviceProvider.lastName?.charAt(0)}.`
                }
                size={12}
                lineHeight={16}
                color={colors.white}
                fontFamily={'Inter-Bold'}
              />

            </View>
            <View
              style={[
                tw`absolute bottom-0 border-2 right-1 rounded-full`,
                { width: 8, height: 8, backgroundColor: colors.green },
              ]}
            />
          </View>
          <View style={[tw`flex-1`, { marginLeft: perWidth(12) }]}>
            <View style={[tw`flex flex-row justify-between`, {}]}>
              <View style={[tw`flex flex-row items-center`, {}]}>
                {item?.isIdentityVerified && <VerifiedTag />}
                <Textcomp
                  //   text={`${item?.services?.[0]?.name}`}
                  text={
                    item?.service.name
                      ? `${item?.service.name}`
                      : `${item?.firstName} ${item?.lastName?.charAt(0)}.`
                  }
                  size={14}
                  lineHeight={16}
                  color={colors.white}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <TouchableOpacity
              style={tw` p-1.5 rounded-full items-center justify-center`}
              onPress={() => {
                  if (savedProvider) {
                    handleRemoveBookmark();
                  } else {
                    handleBookmark();
                  }
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
                source={savedProvider ? images.saved : images.save}
              />
              </TouchableOpacity>
            </View>
            <View
              style={[tw``, { width: perWidth(252), marginTop: perHeight(4) }]}>
              <Textcomp
                text={`${item?.details}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
            </View>
            {/* <View
              style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
              <Textcomp
                text={`${item?.services?.[0]?.name}`}
                size={10}
                lineHeight={14}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
            </View> */}
          </View>
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <Textcomp
            text={`$${item?.service?.maxPrice ? item.service.maxPrice : 0}/hr`}
            // text={'₦000'}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
        <View style={[tw`flex flex-row justify-between items-center mt-auto `]}>
          <View style={tw`flex flex-row justify-between items-center`}>
            <View style={[tw``, {}]}>
              <Image
                resizeMode="cover"
                style={{
                  width: perWidth(26),
                  height: perWidth(26),
                  borderRadius: perWidth(25) / 2,
                }}
                source={images.location}
              />
            </View>

            <View
              style={[tw`ml-1`, { width: perWidth(80), marginTop: perWidth(1) }]}>
              <Textcomp
                text={`${item.serviceProvider.state}`}
                size={12}
                lineHeight={14}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View
            style={[
              tw`ml-auto  items-end`,
              { width: perWidth(80), marginTop: perWidth(1) },
            ]}>
            <Review value={item?.averageRating} editable={false} />
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={showModal}
        onModalHide={() => {
          setshowModal(false);
        }}
        style={{ width: SIZES.width, marginHorizontal: 0 }}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setshowModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setshowModal(false)}
        onBackButtonPress={() => setshowModal(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setshowModal(false)}
            style={tw`flex-1`}
          />
          <View style={[tw` mt-auto bg-[#D9D9D9]`, { minHeight: '40%' }]}>
            <TouchableOpacity
              onPress={() => { }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <ScrollView contentContainerStyle={tw` flex-1`}>
              <View>
                <View style={[tw` py-4 mt-4`, { marginLeft: perWidth(30) }]}>
                  <Textcomp
                    text={'Select service you need'}
                    size={17}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>

                <View style={tw`px-[7.5%]`}>
                  {item?.services?.map((service: { name: any; _id: any }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ServiceProviderProfile', {
                            item: item,
                            serviceName: service?.name,
                            id: service?._id,
                          });
                          setshowModal(false);
                        }}
                        style={[
                          tw` mt-2.5 py-1.5 flex flex-row items-center justify-between px-3 border-2 border-[${colors.primary}] bg-[${colors.darkPurple}] `,
                          {},
                        ]}>
                        <Textcomp
                          text={`${service?.name}`}
                          size={14}
                          lineHeight={14}
                          color={'white'}
                          fontFamily={'Inter-Regular'}
                        />
                        <Image
                          resizeMode="contain"
                          style={{ width: 12 }}
                          source={images.polygonForward}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  { height: 2, width: SIZES.width * 0.95 },
                ]}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default PairedProviders4;
