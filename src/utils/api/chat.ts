import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../../store/store';
import { updateUnreadChat } from '../../store/reducer/mainSlice';
import { GLOBAL_API_BASE_URL } from '../../constants/api';

const API_BASE_URL = GLOBAL_API_BASE_URL;

export const getUnreadMessages = async (): Promise<number> => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  // unread-chats
  const response = await axios.get(`${API_BASE_URL}/unread-chats`, {
    headers: {
      Authorization: `Bearer ${AuthToken}`,
    },
  });
  store.dispatch(
    // updateUnreadChat(response?.data?.chats?.[0]?.chatsWithUnreadMessages),
    updateUnreadChat(response?.data?.number),
  );
  return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
};

export const _getUnreadMessages = async (): Promise<number> => {
  console.log('testinggg');
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  // unread-chats
  const response = await axios.get(`${API_BASE_URL}/unread-chats`, {
    headers: {
      Authorization: `Bearer ${AuthToken}`,
    },
  });
  console.log('ehn:', response?.data);
  store.dispatch(
    // updateUnreadChat(response?.data?.chats?.[0]?.chatsWithUnreadMessages),
    updateUnreadChat(response?.data?.number),
  );
  return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
};

export const markAsRead = async (messageId: string) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  // unread-chats
  const response = await axios.patch(
    `${API_BASE_URL}/mark-messages-as-read`,
    {messageIDs: [messageId]},
    {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    },
  );

  console.log(response.data, ' ..............................., unread');
  //   return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
};

export const markAsReaArray = async (messageId: string) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  // unread-chats
  const response = await axios.patch(
    `${API_BASE_URL}/mark-messages-as-read`,
    {messageIDs: messageId},
    {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    },
  );

  console.log(response.data, ' ...............................,Array unread');
  //   return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
};
