import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {addchatList, updateUnreadChat} from '../store/reducer/mainSlice';
import {getChatsbyuser} from '../utils/api/func';

const API_BASE_URL = 'https://api.pureworker.com/api';

const useChat = () => {
  const dispatch = useDispatch();

  const getUnreadMessages = async (): Promise<number> => {
    console.log('---qewrt');
    
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    // unread-chats
    const response = await axios.get(`${API_BASE_URL}/unread-chats`, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    dispatch(
      updateUnreadChat(response?.data?.chats?.[0]?.chatsWithUnreadMessages),
    );
    return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  };

  const markAsRead = async (messageId: string) => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    // unread-chats
    await axios.patch(
      `${API_BASE_URL}/mark-messages-as-read`,
      {messageIDs: [messageId]},
      {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      },
    );

    getUnreadMessages();
  };

  const getChatList = async () => {
    const res: any = await getChatsbyuser('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addchatList(res?.data.chats));
    }
    // setloading(false);
  };

  return {getChatList, getUnreadMessages, markAsRead};
};

export default useChat;
