import React, {useEffect, useState, useCallback} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import images from '../../constants/images';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import Review from '../Review';
import {
  bookMarkServiceProvide,
  deletebookMarkServiceProvide,
  getBookMarkedProviders,
  getUser,
} from '../../utils/api/func';
import {ToastShort} from '../../utils/utils';
import {
  addUserData,
  setbookMarkedProviders,
} from '../../store/reducer/mainSlice';
import VerifiedTag from '../../assets/svg/verifiedtag';

interface Data {
  item: any;
  navigation: any;
  id: any;
  serviceName: string;
  save: boolean;
  savedProviders: any[];
  noBookmark?: boolean;
}

const metersToKilometers = (meters: number): string => {
  const kilometers = meters / 1000;
  return `${Math.round(kilometers)}km`;
};

const ServiceCard2: React.FC<Data> = React.memo(
  ({item, navigation, id, serviceName, save, savedProviders, noBookmark}) => {
    const [saved, setSaved] = useState<boolean>(save);
    const dispatch = useDispatch();
    const bookMarkedProviders = useSelector(
      (state: any) => state.user.bookMarkedProviders,
    );

    const handleBookmark = useCallback(async () => {
      try {
        const res = await bookMarkServiceProvide({
          service: id,
          serviceProvider: item?._id,
        });

        if (res?.status === 200 || res?.status === 201) {
          ToastShort('Service Provider bookmarked!.');
          setSaved(!saved);
        } else {
          ToastShort(
            res?.error?.message ||
              res?.error?.data?.message ||
              'Oops!, an error occured',
          );
        }
      } finally {
        const res = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
        }
        initBookmarked();
      }
    }, [saved, item, id, dispatch]);

    const handleRemoveBookmark = useCallback(async () => {
      try {
        const ch = savedProviders?.filter(
          provider => provider?.serviceProvider === item?._id,
        );
        const __id = ch?.[0]?._id;
        const res = await deletebookMarkServiceProvide(__id);

        if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
          ToastShort('Unbookmarked!');
          setSaved(!saved);
        } else {
          ToastShort(
            res?.error?.message ||
              res?.error?.data?.message ||
              'Oops!, an error occured',
          );
        }
      } finally {
        const res = await getUser('');
        if (res?.status === 201 || res?.status === 200) {
          dispatch(addUserData(res?.data?.user));
        }
        initBookmarked();
      }
    }, [saved, item, id, savedProviders, dispatch]);

    const initBookmarked = useCallback(async () => {
      const res = await getBookMarkedProviders(id);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setbookMarkedProviders(res?.data?.data));
      }
    }, []);

    useEffect(() => {
      // initBookmarked();
    }, []);

    useEffect(() => {
      if (noBookmark) {
      }
    }, [noBookmark]);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ServiceProviderProfile', {
            item,
            serviceName,
            id,
          });
        }}
        style={[
          tw`mt-4 mx-auto bg-[${colors.darkPurple}]`,
          {
            height: perWidth(130),
            width: SIZES.width * 0.95,
            borderRadius: 5,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-row`}>
          <FastImage
            style={{
              width: perWidth(50),
              height: perWidth(50),
              borderRadius: perWidth(50) / 2,
            }}
            source={{
              uri:
                item?.profilePic ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.high,
              // cache: FastImage.cacheControl.cacheOnly,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={tw`absolute bottom-0 border-2 right-1 rounded-full bg-green-500`}
          />
          <View style={[tw`flex-1 ml-3`]}>
            <View style={tw`flex flex-row justify-between`}>
              <Textcomp
                text={`₦ ${item?.portfolio?.minPrice}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily="Inter-SemiBold"
              />
              {noBookmark === false && (
                <TouchableOpacity
                  onPress={() =>
                    saved ? handleRemoveBookmark() : handleBookmark()
                  }>
                  <Image
                    resizeMode="contain"
                    style={{width: perWidth(20), height: perWidth(20)}}
                    source={saved ? images.saved : images.save}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Textcomp
              text={`${item?.portfolio?.description}`}
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily="Inter-SemiBold"
              numberOfLines={2}
              style={{width: perWidth(252), marginTop: perHeight(4)}}
            />
          </View>
        </View>
        <View
          style={[
            tw`flex flex-row items-center`,
            {width: perWidth(105), marginTop: perWidth(4)},
          ]}>
          {item?.isIdentityVerified && <VerifiedTag />}
          <Textcomp
            text={item?.businessName || `${item?.firstName} ${item?.lastName}`}
            size={12}
            lineHeight={14}
            numberOfLines={1}
            color={colors.white}
            fontFamily="Inter-SemiBold"
          />
        </View>
        <View style={tw`flex flex-row justify-between items-center mt-3`}>
          <View style={tw`flex flex-row items-center`}>
            <Image
              resizeMode="cover"
              style={{
                width: perWidth(26),
                height: perWidth(26),
                borderRadius: perWidth(25) / 2,
              }}
              source={images.location}
            />
            <Textcomp
              text={`${
                item?.distance ? metersToKilometers(item?.distance) : '0Km'
              } away`}
              size={12}
              lineHeight={14}
              color={colors.primary}
              fontFamily="Inter-SemiBold"
              style={{
                marginLeft: perWidth(1),
                width: perWidth(80),
                marginTop: perWidth(1),
              }}
            />
          </View>
          <Review
            value={item?.averageRating}
            editable={false}
            style={{width: perWidth(80), marginTop: perWidth(1)}}
          />
        </View>
      </TouchableOpacity>
    );
  },
);

export default ServiceCard2;
