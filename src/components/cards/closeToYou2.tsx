import {Image, View, TouchableOpacity} from 'react-native';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import React, {useEffect, useState} from 'react';

import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';

import {Rating} from 'react-native-ratings';
import {useMakeFavoriteProductMutation} from '../../store/slice/api';
import Snackbar from 'react-native-snackbar';
import Review from '../Review';
import FastImage from 'react-native-fast-image';
import {ToastShort, metersToKilometers} from '../../utils/utils';
import {
  bookMarkServiceProvide,
  deletebookMarkServiceProvide,
  getUser,
} from '../../utils/api/func';
import {useDispatch, useSelector} from 'react-redux';
import {addUserData} from '../../store/reducer/mainSlice';

const CloseToYouCard2 = ({item, index, navigation}: any) => {
  const [makeFavoriteProduct] = useMakeFavoriteProductMutation();
  const dispatch = useDispatch();
  // const userData = useSelector((state: any) => state.user.userData);
  // console.log('close----k', item);
  // const [savedProviders, setsavedProviders] = useState([]);
  // useEffect(() => {
  //   const query = userData?.bookmarks?.filter(
  //     (item: {service: any}) => item?.service === id,
  //   );
  //   setsavedProviders(query);
  // }, [id, userData?.bookmarks]);

  // const handleFavoriteProduct = async (
  //   serviceId: number,
  //   isFavorite: boolean,
  // ) => {
  //   if (serviceId) {
  //     const addFavoriteData = {
  //       favorite: !isFavorite,
  //       serviceId: serviceId,
  //     };
  //     makeFavoriteProduct(addFavoriteData)
  //       .unwrap()
  //       .then(data => {
  //         // Snackbar.show({
  //         //   text: data. ? "Service provider has been favorite" : "Product has been remove favorite", duration: Snackbar.LENGTH_SHORT, textColor: '#fff', backgroundColor: '#88087B',
  //         // });
  //       })
  //       .catch(error => {
  //         console.log('err', error);
  //         Snackbar.show({
  //           text: error.data.message,
  //           duration: Snackbar.LENGTH_SHORT,
  //           textColor: '#fff',
  //           backgroundColor: '#88087B',
  //         });
  //       });
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
        // setsaved(!saved);
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
      initGetUsers();
    }
  };

  // const ch = savedProviders?.filter(
  //   (d: {service: any}) => d?.serviceProvider === item?._id,
  // );
  const handleRemoveBookmark = async () => {
    try {
      const ch = savedProviders?.filter(
        (d: {service: any}) => d?.serviceProvider === item?._id,
      );
      const __id = ch?.[0]?._id;
      const res: any = await deletebookMarkServiceProvide(__id);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastShort('Unboomarked!.');
        // setsaved(!saved);
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
          const query = res?.data?.user?.bookmarks?.filter(
            (item: {service: any}) => item?.service === id,
          );
          // setsavedProviders(query);
        }
      };
      initGetUsers();
    }
  };
  return (
    <View
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
          {/* <Image
            resizeMode="cover"
            style={{
              width: perWidth(50),
              height: perWidth(50),
              borderRadius: perWidth(50) / 2,
            }}
            source={{uri: item?.profilePicture}}
          /> */}
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
                item?.profilePicture ||
                'https://res.cloudinary.com/dr0pef3mn/image/upload/v1694275934/Assets/1694275933654-Ellipse%2014.png.png',
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
        </View>
        <View style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
          <View style={[tw`flex flex-row justify-between`, {}]}>
            <View style={[tw``, {}]}>
              <Textcomp
                text={`${item?.services?.[0]?.name}`}
                size={14}
                lineHeight={16}
                color={colors.white}
                fontFamily={'Inter-Bold'}
              />
            </View>
            {/* <TouchableOpacity
              onPress={() => {
                // if (ch?.length > 0) {
                //   handleRemoveBookmark();
                // } else {
                //   handleBookmark();
                // }
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: perWidth(20),
                  height: perWidth(20),
                }}
                source={true ? images.saved : images.save}
              />
            </TouchableOpacity> */}
          </View>
          <View style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
            <Textcomp
              text={item?.description}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={2}
            />
          </View>
        </View>
      </View>
      <View>
        <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={
              item?.businessName
                ? `${item?.businessName}`
                : `${item?.firstName} ${item?.lastName?.charAt(0)}.`
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
              text={`${metersToKilometers(item?.distance)}`}
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
          <Review value={1} editable={false} />
        </View>
      </View>
    </View>
  );
};
export default CloseToYouCard2;
