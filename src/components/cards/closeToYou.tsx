import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import React, {useState} from 'react';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import Review from '../Review';
import FastImage from 'react-native-fast-image';
import {metersToKilometers} from '../../utils/utils';
import Modal from 'react-native-modal/dist/modal';

const ClosetoYou = ({item, index, navigation}: any) => {
  console.log('close-order', item);
  const [showModal, setshowModal] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('ServiceProviderProfile', {
          //   item: item,
          //   serviceName: item?.services?.[0]?.name,
          //   id: item?._id,
          // })
          setshowModal(true);
        }}
        style={[
          tw` mt-4 border-[#FFC727] justify-between bg-[${colors.darkPurple}]`,
          {
            height: perWidth(130),
            width: perWidth(200),
            borderWidth: 3,
            borderRadius: 20,
            marginLeft: index === 0 ? 10 : 3,
            paddingHorizontal: perWidth(16),
            paddingVertical: perWidth(14),
          },
        ]}>
        <View style={tw`flex flex-row `}>
          <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
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
          <View style={[tw``, {marginLeft: perWidth(12)}]}>
            <View style={[tw``, {}]}>
              <Textcomp
                text={
                  item?.businessName
                    ? `${item?.businessName}`
                    : item?.firstName
                    ? `${item?.firstName} ${item?.lastName?.charAt(0)}.`
                    : `${item?.fullName}`
                }
                size={12}
                lineHeight={14}
                color={colors.primary}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View
              style={[tw``, {width: perWidth(105), marginTop: perHeight(4)}]}>
              <Textcomp
                text={item?.description}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
                numberOfLines={2}
              />
            </View>
            <View
              style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
              <Textcomp
                // text={`$${price[0]?.priceMax ? price[0]?.priceMax : 0}/hr`}
                // text={'₦000'}
                text={''}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>
        </View>
        <View
          style={[
            tw`flex flex-row justify-between items-center `,
            {marginTop: perHeight(3)},
          ]}>
          <View style={tw`flex flex-row items-center`}>
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
              style={[tw`ml-1`, {width: perWidth(70), marginTop: perWidth(1)}]}>
              <Textcomp
                text={`${metersToKilometers(item?.distance)}`}
                size={12}
                lineHeight={14}
                color={colors.white}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View style={[tw``, {width: perWidth(80), marginTop: perWidth(1)}]}>
            <Review value={Number(item?.averageRating) || 0} editable={false} />
          </View>
          {/*  <StarRating
          style={{width: perWidth(40)}}
          starStyle={{marginHorizontal: 0}}
          maxStars={5}
          starSize={10}
          rating={4}
          onChange={() => {}}
        /> */}
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={showModal}
        onModalHide={() => {
          setshowModal(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
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
          <View style={[tw` mt-auto bg-[#D9D9D9]`, {minHeight: '40%'}]}>
            <TouchableOpacity
              onPress={() => {}}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <ScrollView contentContainerStyle={tw` flex-1`}>
              <View>
                <View style={[tw` py-4 mt-4`, {marginLeft: perWidth(30)}]}>
                  <Textcomp
                    text={'Select service you need'}
                    size={17}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>

                <View style={tw`px-[7.5%]`}>
                  {item?.services?.map(service => {
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
                        <Image resizeMode="contain" style={{width: 12}} source={images.polygonForward} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: SIZES.width * 0.95},
                ]}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClosetoYou;
