import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import tw from 'twrnc';
// import {, FONTS, icons, images, } from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {perHeight, perWidth} from '../../../utils/position/sizes';
import Chatcomp from './chatcomp';
import socket from '../../../utils/socket';

import {addchatData} from '../../../store/reducer/mainSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getMessagesbyuser} from '../../../utils/api/func';
import colors from '../../../constants/colors';
import images from '../../../constants/images';
import {HEIGHT_SCREEN, HEIGHT_WINDOW} from '../../../constants/generalStyles';
import Textcomp from '../../../components/Textcomp';
import {ToastShort} from '../../../utils/utils';

export default function Inbox({navigation, route}: any) {
  const userId = route.params?.id;
  const userName = route.params?.name;
  console.log('userID', userId);
  const agentData = useSelector((state: any) => state.user.userData);
  const chatData = useSelector((store: any) => store.user.chatData);
  // console.log('datahere', agentData?._id);
  console.log('passed:',route.params);
  useEffect(() => {
    socket.connect();
    console.log('-idid', socket.id);
    socket.emit('authentication', agentData);
    console.log('got here');
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleFetch = async () => {
      // setloading(true);
      // console.log(agentData?._id);
      const res: any = await getMessagesbyuser(`${userId}`);
      // const res: any = await getMessagesbyuser();
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addchatData(res?.data.messages));
        // console.log('here_', res?.data.messages);
      }
      // setloading(false);
    };
    handleFetch();
  }, []);
  const [message, setmessage] = useState('');
  function onSubmit() {
    if (message?.length < 1) {
      return;
    }
    const data = {
      from: agentData?._id,
      to: `${userId}`,
      body: message,
      // isNewChat: chatData?.length === 0 ? true : false,
    };
    setmessage('');
    console.log(data);
    const currentDate = new Date();
    const createdAt = currentDate.toISOString();
    const _data = [...chatData, {...data, createdAt: createdAt}];
    dispatch(addchatData(_data));
    socket.emit('message', data, async () => {
      console.log('message sent', data);
      ToastShort('Message sent');
      // const _data = [...chatData, data];
      // dispatch(addchatData(_data));
    });
  }
  socket.on('message', data => {
    console.log('message received', data);
    const _data = [...chatData, data];
    dispatch(addchatData(_data));
  });

  const [boxFocuss, setboxFocuss] = useState(false);
  function groupMessagesByDate(messages) {
    const groupedMessages = {};

    for (const message of messages) {
      const createdAt = new Date(message.createdAt);
      const dateKey = createdAt.toDateString();

      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(message);
    }
    return groupedMessages;
  }
  const groupedMessages = groupMessagesByDate(chatData);

  return (
    <SafeAreaView style={[tw`h-full bg-[#EBEBEB]  w-full`, styles.container]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use "padding" for iOS, "height" for Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50} // Adjust as needed
      >
        <View style={tw`w-full h-full `}>
          <View
            style={[
              tw`px-[3%]   border-b justify-center border-[#262C550F]`,
              {height: perHeight(40)},
              Platform.OS === 'ios' && styles.shadowProp,
            ]}>
            <View
              style={tw`px-2  my-auto mb-3 flex flex-row justify-between items-center`}>
              <View style={tw`flex flex-row`}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    resizeMode="cover"
                    source={images.back}
                    style={[
                      tw`w-full ml-0`,
                      {
                        height: 25,
                        width: 25,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
              <Text
                onPress={() => {}}
                style={[
                  tw`text-center font-bold text-[${colors.black}]`,
                  {
                    fontSize: 14,
                    fontFamily: 'Inter-SemiBold',
                    lineHeight: 14,
                  },
                ]}>
                {(userName === 'Support Support' || userName === 'Support')  ? 'Support' : userName}
              </Text>
              <View style={tw`flex flex-row`}>
                <Text
                  onPress={() => {}}
                  style={[
                    tw`text-center font-bold text-[${colors.black}]`,
                    {
                      fontSize: 14,
                      fontFamily: 'Inter-SemiBold',
                      lineHeight: 14,
                    },
                  ]}>
                  {(userName === 'Support Support' || userName === 'Support') ? '' : 'Xd ago'}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              tw` mt-1 bg-[#EBEBEB]`,
              {paddingHorizontal: perWidth(26), height: HEIGHT_WINDOW * 0.725},
            ]}>
            {/* <ScrollView showsVerticalScrollIndicator={false}>
              {[...chatData, ...chatData].map((item, index) => {
                if (item?.from?._id === agentData?._id) {
                  return (
                    <Chatcomp key={index} text={item?.body} type={'other'} />
                  );
                } else if (item?.to?._id === agentData?._id) {
                  return <Chatcomp key={index} text={item?.body} type={'me'} />;
                } else if (item?.from === agentData?._id) {
                  return (
                    <Chatcomp key={index} text={item?.body} type={'other'} />
                  );
                } else if (item?.to === agentData?._id) {
                  return <Chatcomp key={index} text={item?.body} type={'me'} />;
                }
              })}
              <View style={tw`h-20`} />
            </ScrollView> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(groupedMessages).map((date, i) => (
                <View key={date} style={tw`${i === 0 ? 'pt-5' : 'pt-2.5'}`}>
                  <View style={tw`flex flex-row items-center`}>
                    <View style={[tw`bg-black flex-1`, {height: 1}]} />
                    <Text
                      onPress={() => {}}
                      style={[
                        tw`text-center px-4 font-bold text-[${colors.black}]`,
                        {
                          fontSize: 14,
                          fontFamily: 'Inter-SemiBold',
                          lineHeight: 14,
                        },
                      ]}>
                      {date}
                    </Text>
                    <View style={[tw`bg-black flex-1`, {height: 1}]} />
                  </View>

                  {groupedMessages[date].map((message, index) => {
                    let item = message;
                    if (item?.from?._id === agentData?._id) {
                      return (
                        <Chatcomp
                          key={index}
                          text={item?.body}
                          type={'other'}
                        />
                      );
                    } else if (item?.to?._id === agentData?._id) {
                      return (
                        <Chatcomp key={index} text={item?.body} type={'me'} />
                      );
                    } else if (item?.from === agentData?._id) {
                      return (
                        <Chatcomp
                          key={index}
                          text={item?.body}
                          type={'other'}
                        />
                      );
                    } else if (item?.to === agentData?._id) {
                      return (
                        <Chatcomp key={index} text={item?.body} type={'me'} />
                      );
                    }
                  })}
                </View> 
              ))}
            </ScrollView>
          </View>

          {(userName === 'Support Support' || userName === 'Support') ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OrderDetails', {data: agentData});
              }}
              style={[
                tw`bg-[#2D303C] absolute bottom-[11%] rounded-lg right-[5%]  items-center justify-center`,
                {width: perWidth(90), aspectRatio: 1, height: perHeight(35)},
              ]}>
              <Textcomp
                text={'Tap to Hire'}
                size={14}
                lineHeight={16.5}
                color={'#FFC727'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          )}
          <View
            style={[
              tw` w-full mx-auto mt-auto  px-[4%] border-t-4 border-black `,
              {
                height: HEIGHT_SCREEN * 0.085,
                marginBottom: Platform.OS === 'ios' ? 0 : 5,
              },
            ]}>
            <View style={tw`flex flex-row mt-3 py-2 px-2 bg-[#D9D9D9]`}>
              <TextInput
                style={[
                  tw`${
                    Platform.OS === 'ios' ? 'py-2' : 'py-0'
                  }  flex-1 text-black`,
                  {},
                ]}
                placeholder={'Write a message...'}
                placeholderTextColor={'#000000'}
                onChangeText={text => {
                  setmessage(text);
                }}
                onFocus={() => {
                  setboxFocuss(true);
                }}
                onBlur={() => {
                  setboxFocuss(false);
                }}
                value={message}
              />
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                }}>
                <Image
                  resizeMode="contain"
                  source={images.send2}
                  style={[
                    tw`w-full `,
                    {
                      height: 30,
                      width: 30,
                    },
                  ]}
                />
              </TouchableOpacity>
              {/* {boxFocuss || message?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    onSubmit();
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.send2}
                    style={[
                      tw`w-full `,
                      {
                        height: 30,
                        width: 30,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    onSubmit();
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.camera}
                    style={[
                      tw`w-full `,
                      {
                        height: 30,
                        width: 30,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* <View
          style={[
            tw` w-full mx-auto absolute  `,
            {height: SIZES.height * 0.085},
            {
              bottom: SIZES.height * 0.05,
            },
          ]}>
          <View
            style={[
              tw`mx-[2.5%] flex flex-row items-center px-4 justify-center  flex-1 bg-[#F2F2F2]`,
              {borderRadius: SIZES.height * 0.085 * 0.45},
            ]}>
            <TextInput
              style={[
                tw` flex-1`,
                {
                  height:
                    (SIZES.height * 0.085 - SIZES.height * 0.085 * 0.025) * 0.75,
                },
              ]}
              placeholderTextColor={'#989898'}
              placeholder="Type here"
              value={message}
              onChangeText={text => setmessage(text)}
            />
            <TouchableOpacity
              onPress={() => setmessage('')}
              style={[
                tw`bg-[#E3FFE4] my-auto items-center justify-center`,
                {
                  height:
                    (SIZES.height * 0.085 - SIZES.height * 0.085 * 0.025) * 0.75,
                  aspectRatio: 1,
                  borderRadius:
                    (SIZES.height * 0.085 - SIZES.height * 0.085 * 0.025) *
                    0.75 *
                    0.5,
                },
              ]}>
              <FontAwesome name={'send'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight * 0.5
        : StatusBar.currentHeight,
  },
  shadowProp: {
    shadowColor: '#263238',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.5,
    shadowRadius: 3,
    elevation: Platform.OS === 'ios' ? 8 : 2,
  },
});
