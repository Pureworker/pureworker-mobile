import {Image, View, TouchableOpacity} from 'react-native';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import React, {useEffect, useState} from 'react';

import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';

import Review from '../Review';
import FastImage from 'react-native-fast-image';
import {
  bookMarkServiceProvide,
  deletebookMarkServiceProvide,
  getBookMarkedProviders,
  getUser,
} from '../../utils/api/func';
import {ToastShort} from '../../utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  addUserData,
  setbookMarkedProviders,
} from '../../store/reducer/mainSlice';

const ServiceCard2 = ({
  item,
  // index,
  navigation,
  id,
  serviceName,
  save,
  savedProviders,
}: any) => {
  const [saved, setsaved] = useState(save);
  // const portfolio = item?.portfolio?.filter(_item => _item?.service === id);
  const price = item?.priceRange?.filter(
    (_item: {service: any}) => _item?.service === id,
  );
  console.log('pased', price, item?.description, item?.distance, 'item:', item);
  // console.log('lllll---');
  function metersToKilometers(meters: any) {
    const kilometers = Number(meters) / 1000; // Convert meters to kilometers
    const roundedKilometers = Math.round(kilometers); // Round to the nearest whole number
    return `${roundedKilometers}km`;
  }
  const bookMarkedProviders = useSelector(
    (state: any) => state.user.bookMarkedProviders,
  );
  // const handleBookmark = async () => {
  //   const res: any = await bookMarkServiceProvide({
  //     service: id,
  //     serviceProvider: item?._id,
  //   });
  //   if (res?.status === 200 || res?.status === 201) {
  //     ToastShort('Service Provider bookmarked!.');
  //     setsaved(!saved);
  //   } else {
  //     ToastShort(
  //       `${
  //         res?.error?.message
  //           ? res?.error?.message
  //           : res?.error?.data?.message
  //           ? res?.error?.data?.message
  //           : 'Oops!, an error occured'
  //       }`,
  //     );
  //   }
  // };

  const handleBookmark = async () => {
    try {
      const res: any = await bookMarkServiceProvide({
        service: id,
        serviceProvider: item?._id,
      });
      // const res: any = await bookMarkServiceProvide(data);
      if (res?.status === 200 || res?.status === 201) {
        ToastShort('Service Provider bookmarked!.');
        setsaved(!saved);
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

          const query = res?.data?.user?.bookmarks?.filter(
            (item: {service: any}) => item?.service === id,
          );
          // setsavedProviders(query);
        }
      };
      initBookmarked();
      initGetUsers();
    }
  };
  const dispatch = useDispatch();
  const ch = savedProviders?.filter(
    (d: {service: any}) => d?.serviceProvider === item?._id,
  );
  const initBookmarked = async () => {
    const res: any = await getBookMarkedProviders(id);
    console.log('bbbbbmmm', res?.data?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setbookMarkedProviders(res?.data?.data));
      // dispatch(addprovidersByCateegory(res?.data?.data));
    }
  };

  useEffect(() => {
    const _initBookmarked = async () => {
      const res: any = await getBookMarkedProviders(id);
      console.log('bbbbbmmm', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setbookMarkedProviders(res?.data?.data));
        // dispatch(addprovidersByCateegory(res?.data?.data));
      }
    };
    _initBookmarked();
  }, []);

  console.log('====================================');
  console.log(bookMarkedProviders);
  console.log('====================================');
  const handleRemoveBookmark = async () => {
    try {
      const ch = savedProviders?.filter(
        (d: {service: any}) => d?.serviceProvider === item?._id,
      );
      const __id = ch?.[0]?._id;
      const res: any = await deletebookMarkServiceProvide(__id);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastShort('Unboomarked!.');
        setsaved(!saved);
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
          // setsavedProviders(query);
        }
      };
      initGetUsers();
      initBookmarked();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ServiceProviderProfile', {
          item: item,
          serviceName: serviceName,
          id: id,
        });
      }}
      style={[
        tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
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
        <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
          {/*  */}

          {item?.profilePic ? (
            <>
              <FastImage
                style={{
                  width: perWidth(50),
                  height: perWidth(50),
                  borderRadius: perWidth(50) / 2,
                }}
                source={{
                  uri: item?.profilePic,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View
                style={[
                  tw`absolute bottom-0 border-2 right-1 rounded-full`,
                  {width: 8, height: 8, backgroundColor: colors.green},
                ]}
              />
            </>
          ) : (
            <Image
              resizeMode="cover"
              style={{
                width: perWidth(50),
                height: perWidth(50),
                borderRadius: perWidth(50) / 2,
              }}
              source={images.welcome}
            />
          )}
        </View>
        <View style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
          <View style={[tw`flex flex-row justify-between`, {}]}>
            <View style={[tw``, {}]}>
              <Textcomp
                text={`₦ ${item?.portfolio?.minPrice}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (ch?.length > 0) {
                  handleRemoveBookmark();
                } else {
                  handleBookmark();
                }
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: perWidth(20),
                  height: perWidth(20),
                }}
                source={saved ? images.saved : images.save}
              />
            </TouchableOpacity>
          </View>
          <View style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
            <Textcomp
              text={`${item?.portfolio?.description}`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={2}
            />
          </View>
          {/* <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={'$20/hr'}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View> */}
        </View>
      </View>
      <View>
        <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={
              item?.businessName
                ? `${item?.businessName}`
                : `${item?.firstName} ${item?.lastName}`
            }
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>

      <View
        style={[
          tw`flex flex-row justify-between items-center `,
          {marginTop: perHeight(3)},
        ]}>
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
            style={[tw`ml-1`, {width: perWidth(80), marginTop: perWidth(1)}]}>
            <Textcomp
              text={`${
                item?.distance ? metersToKilometers(item?.distance) : '0Km'
              } away`}
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
            {width: perWidth(80), marginTop: perWidth(1)},
          ]}>
          {/* <Rating
            type="custom"
            ratingImage={images.star2}
            ratingColor="white"
            ratingBackgroundColor="transparent"
            ratingCount={5}
            imageSize={10}
            onFinishRating={() => {}}
            style={{paddingVertical: 10}}
            showRating={false}
            readonly={true}
            startingValue={2}
          /> */}
          <Review value={item?.averageRating} editable={false} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ServiceCard2;
