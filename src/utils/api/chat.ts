import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../../store/store';
import { updateUnreadChat } from '../../store/reducer/mainSlice';

const API_BASE_URL = 'https://api.pureworker.com/api';

export const getUnreadMessages = async (): Promise<number> => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  // unread-chats
  const response = await axios.get(`${API_BASE_URL}/unread-chats`, {
    headers: {
      Authorization: `Bearer ${AuthToken}`,
    },
  });

  console.log(response?.data?.chats?.[0]?.chatsWithUnreadMessages);

  store.dispatch(
    updateUnreadChat(response?.data?.chats?.[0]?.chatsWithUnreadMessages),
  );
  return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
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
