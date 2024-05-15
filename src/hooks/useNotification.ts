import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {GLOBAL_DEV_API_BASE_URL} from '../constants/api';
import axios from 'axios';
import {updateUnreadNotification} from '../store/reducer/mainSlice';
import {useDispatch} from 'react-redux';

function useNotification() {
  const dispatch = useDispatch();

  const getUnreadNotification = async (): Promise<number> => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    // unread-chats
    const response = await axios.patch(`${GLOBAL_DEV_API_BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    console.log(
      response?.data?.chats?.[0]?.chatsWithUnreadMessages,
      '            -----------------',
    );

    // dispatch(
    //   updateUnreadNotification(
    //     response?.data?.chats?.[0]?.chatsWithUnreadMessages,
    //   ),
    // );
    return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
    //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
  };

  const markNotificationAsRead = async (
    notificationId: string,
  ): Promise<number> => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    // unread-chats
    const response = await axios.patch(
      `${GLOBAL_DEV_API_BASE_URL}/mark-notification-as-read/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      },
    );

    console.log(
      response?.data?.chats?.[0]?.chatsWithUnreadMessages,
      '            -----------------',
    );

    dispatch(
      updateUnreadNotification(
        response?.data?.chats?.[0]?.chatsWithUnreadMessages,
      ),
    );
    return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
    //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
  };

  return {getUnreadNotification, markNotificationAsRead};
}

export default useNotification;
