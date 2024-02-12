import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import socket from '../../../utils/socket';
import Modal from 'react-native-modal/dist/modal';
import {SIZES, perWidth} from '../../../utils/position/sizes';
import colors from '../../../constants/colors';
import {WIDTH_WINDOW} from '../../../constants/generalStyles';
import {timeAgo} from '../../../utils/utils';
import {getUnreadMessages} from '../../../utils/api/chat';
import FastImage from 'react-native-fast-image';
import {getChatsbyuser} from '../../../utils/api/func';
import {addchatList} from '../../../store/reducer/mainSlice';

export default function ListComp({navigation, item}: any) {
  function formatDate(dateString) {
    const options = {year: 'numeric', month: 'short', day: '2-digit'};
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  const userData = useSelector((state: any) => state.user.userData);
  const [visible, setvisible] = useState(false);

  const dispatch = useDispatch();
  const handleFetch = async () => {
    const res: any = await getChatsbyuser('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addchatList(res?.data.chats));
    }
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={() => setvisible(true)}
        onPress={() => {
          socket.connect();
          navigation.navigate('Inbox', {
            id:
              item?.userA?._id === userData?._id
                ? item?.userB?._id
                : item?.userA?._id,
            name:
              item?.userA?._id === userData?._id
                ? item?.userB?.fullName
                  ? item?.userB?.fullName
                  : item?.userB?.firstName
                  ? `${item?.userB?.firstName} ${item?.userB?.lastName}`
                  : `${item?.userB?.businessName}`
                : item?.userA?.fullName
                ? item?.userA?.fullName
                : item?.userA?.firstName
                ? `${item?.userA?.firstName} ${item?.userB?.lastName}`
                : `${item?.userA?.businessName}`,
            // item?.userA?.fullName,
            lastOnline:
              item?.userA?._id === userData?._id
                ? item?.userB?.lastOnline
                : item?.userA?.lastOnline,
          });
          handleFetch();
        }}
        style={tw`flex flex-row mt-2 py-2 mx-1 rounded justify-between bg-[#2D303C]`}>
        <View style={[tw`flex flex-row items-center px-2`, {}]}>
          {/* <Image
            source={images.profile}
            style={{height: 50, width: 50}}
            resizeMode="contain"
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
                item?.userA?._id === userData?._id
                  ? item?.userB?.profilePic
                    ? item?.userB?.profilePic
                    : 'https://res.cloudinary.com/dpdytuqlf/image/upload/v1707651780/category/k17kfdlowt9qnflorody.jpg'
                  : item?.userA?.profilePic
                  ? item?.userA?.profilePic
                  : 'https://res.cloudinary.com/dpdytuqlf/image/upload/v1707651780/category/k17kfdlowt9qnflorody.jpg',

              // item?.profilePicture ||
              // 'https://res.cloudinary.com/dpdytuqlf/image/upload/v1707651780/category/k17kfdlowt9qnflorody.jpg',
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[tw`flex flex-col  ml-2`, {}]}>
            <View style={[tw``, {}]}>
              <Textcomp
                text={
                  // item?.userA?._id === userData?._id ?
                  item?.userA?._id === userData?._id
                    ? item?.userB?.fullName
                      ? item?.userB?.fullName
                      : item?.userB?.firstName
                      ? `${item?.userB?.firstName} ${item?.userB?.lastName}`
                      : `${item?.userB?.businessName}`
                    : item?.userA?.fullName
                    ? item?.userA?.fullName
                    : item?.userA?.firstName
                    ? `${item?.userA?.firstName} ${item?.userB?.lastName}`
                    : `${item?.userA?.businessName}`
                  // ? item?.userB?.fullName
                  // : item?.userB?._id === userData?._id
                  // ? item?.userA?.fullName
                  // : null
                }
                size={17}
                lineHeight={17}
                color={'#FFFFFF'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={[tw`mt-1`, {}]}>
              <Textcomp
                text={
                  item?.userB?.lastOnline
                    ? timeAgo(item?.userB?.lastOnline)
                    : ''
                }
                size={13}
                lineHeight={13}
                color={'#FFFFFF'}
                fontFamily={'Inter'}
              />
            </View>
          </View>
        </View>
        <View style={[tw`flex flex-col `, {}]}>
          <View style={[tw`mr-3 `, {}]}>
            <Textcomp
              text={formatDate(item?.updatedAt)}
              size={13}
              lineHeight={15}
              color={'#FFFFFF80'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
          {/* <View
            style={[
              tw`mt-auto bg-[${colors.parpal}] ml-auto mr-4 rounded-full`,
              {},
            ]}>
            <Textcomp
              text={`${item?.unreadMessagesCount}`}
              size={15}
              lineHeight={15}
              color={'#FFFFFF'}
              fontFamily={'Inter-SemiBold'}
              style={tw``}
            />
          </View> */}
          <View style={styles.circle}>
            <Text style={styles.countText}>{item?.unreadMessagesCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={visible}
        onModalHide={() => {
          setvisible(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setvisible(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setvisible(false)}
        onBackButtonPress={() => setvisible(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setvisible(false)}
            style={tw`flex-1`}
          />
          <View style={tw`h-[35.5%] mt-auto bg-[#D9D9D9]`}>
            <TouchableOpacity
              onPress={() => {
                setvisible(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View>
              <View
                style={[
                  tw` py-4 flex flex-row items-center`,
                  {marginLeft: perWidth(30)},
                ]}>
                <Image
                  source={images.profile}
                  style={{height: 50, width: 50}}
                  resizeMode="contain"
                />
                <Textcomp
                  text={
                    item?.userA?._id === userData?._id
                      ? item?.userB?.fullName
                      : item?.userB?._id === userData?._id
                      ? item?.userA?.fullName
                      : null
                  }
                  size={17}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              {/* <View style={[tw`px-[7.5%] mt-1`, {}]}>
                <Textcomp
                  text={
                    'We hope you enjoyed the work with lambuja? Awesome seller deserves a tip. '
                  }
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View
                style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
                <View style={tw`mb-2`}>
                  <Textcomp
                    text={
                      'Pay attention, the service provider gets 100% of the tip.'
                    }
                    size={12}
                    lineHeight={14}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View> */}

              {/* <View style={tw`flex mt-5 flex-row justify-between`}>
                <TouchableOpacity
                  onPress={() => {
                    setvisible(false);
                    navigation.navigate('TipServiceProvider');
                    setvisible(false);
                  }}
                  style={[
                    {
                      width: perWidth(160),
                      height: perHeight(40),
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.darkPurple,
                      marginTop: 20,
                    },
                    tw`mx-auto`,
                  ]}>
                  <Textcomp
                    text={'Tip Service Provider'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-Bold'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setvisible(false);
                  }}
                  style={[
                    {
                      width: perWidth(165),
                      height: perHeight(40),
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.darkPurple,
                      marginTop: 20,
                    },
                    tw`mx-auto`,
                  ]}>
                  <Textcomp
                    text={'Next'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-Bold'}
                  />
                </TouchableOpacity>
              </View> */}
            </View>
            <View
              style={[
                tw`bg-black mt-auto mb-4`,
                {height: 2, width: WIDTH_WINDOW * 0.95},
              ]}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 20, // Adjust as needed for your layout
    height: 20, // Adjust as needed for your layout
    borderRadius: 15, // Half of width and height to make it a perfect circle
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 10,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
});
