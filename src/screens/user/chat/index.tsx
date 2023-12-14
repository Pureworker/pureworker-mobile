import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../../constants/navigation';
import images from '../../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight, perWidth} from '../../../utils/position/sizes';
import {getChatsbyuser} from '../../../utils/api/func';
import {addchatList} from '../../../store/reducer/mainSlice';
import socket from '../../../utils/socket';
import ListComp from './ListComp';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../../components/customLoading';

const Index = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);

  const chatList = useSelector((store: any) => store.user.chatList);
  const userData = useSelector((state: any) => state.user.userData);
  // const agentData = useSelector((store: any) => store.agent.agentData);

  useEffect(() => {
    const handleFetch = async () => {
      // setloading(true);
      setisLoading(true);
      const res: any = await getChatsbyuser('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addchatList(res?.data.chats));
        console.log(chatList);
      }
      setisLoading(false);
      // setloading(false);
    };
    handleFetch();
  }, []);
  function formatDate(dateString) {
    const options = {year: 'numeric', month: 'short', day: '2-digit'};
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={tw``}>
            <Textcomp
              text={'Edit'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </TouchableOpacity>
        <View style={tw`mx-auto mt-3`}>
          <Textcomp
            text={'Inbox'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={images.back}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={[tw` w-full pt-5`, {}]}>
          {chatList?.length < 1 ? (
            <View style={[tw`flex-1 items-center`, {}]}>
              <View style={[tw``, {marginTop: perHeight(90)}]}>
                <Image
                  source={images.profile}
                  style={{height: 120, width: 120}}
                  resizeMode="contain"
                />
              </View>
              <View style={tw`mx-auto mt-8`}>
                <Textcomp
                  text={'No Chats'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              {/* <View style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
                <Textcomp
                  text={'Every successful something starts with nothing'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                  style={{textAlign: 'center'}}
                />
              </View> */}
              {/* <View style={tw`mx-auto mt-3`}>
                <Textcomp
                  text={'Your next big idea starts here'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                  style={{textAlign: 'center'}}
                />
              </View> */}
              {/* <TouchableOpacity
                onPress={() => {}}
                style={[tw`mx-auto `, {marginTop: perHeight(29)}]}>
                <Textcomp
                  text={'Explore services'}
                  size={14.5}
                  lineHeight={16.5}
                  color={'#88087B'}
                  fontFamily={'Inter-Bold'}
                  style={{textAlign: 'center'}}
                />
              </TouchableOpacity> */}
            </View>
          ) : (
            <>
              {chatList.map((item: any, index: any) => {
                return (
                  <ListComp item={item} key={index} navigation={navigation}/>
                  // <TouchableOpacity
                  //   onPress={() => {
                  //     socket.connect();
                  //     navigation.navigate('Inbox', {
                  //       id:
                  //         item?.userA?._id === userData?._id
                  //           ? item?.userB?._id
                  //           : item?.userA?._id,
                  //       name:
                  //         item?.userA?._id === userData?._id
                  //           ? item?.userB?.fullName
                  //           : item?.userA?.fullName,
                  //     });
                  //   }}
                  //   style={tw`flex flex-row mt-2 py-2 mx-1 rounded justify-between bg-[#2D303C]`}>
                  //   <View style={[tw`flex flex-row items-center px-2`, {}]}>
                  //     <Image
                  //       source={images.profile}
                  //       style={{height: 50, width: 50}}
                  //       resizeMode="contain"
                  //     />
                  //     <View style={[tw`flex flex-col  ml-2`, {}]}>
                  //       <View style={[tw``, {}]}>
                  //         <Textcomp
                  //           text={
                  //             item?.userA?._id === userData?._id
                  //               ? item?.userB.fullName
                  //               : item?.userB?._id === userData?._id
                  //               ? item?.userA.fullName
                  //               : null
                  //           }
                  //           size={17}
                  //           lineHeight={17}
                  //           color={'#FFFFFF'}
                  //           fontFamily={'Inter-SemiBold'}
                  //         />
                  //       </View>
                  //       <View style={[tw`mt-1`, {}]}>
                  //         <Textcomp
                  //           text={'...'}
                  //           size={13}
                  //           lineHeight={13}
                  //           color={'#FFFFFF'}
                  //           fontFamily={'Inter'}
                  //         />
                  //       </View>
                  //     </View>
                  //   </View>
                  //   <View style={[tw`mr-3 `, {}]}>
                  //     <Textcomp
                  //       text={formatDate(item?.updatedAt)}
                  //       size={13}
                  //       lineHeight={15}
                  //       color={'#FFFFFF80'}
                  //       fontFamily={'Inter-SemiBold'}
                  //     />
                  //   </View>
                  // </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading/>}/>
    </View>
  );
};

export default Index;
