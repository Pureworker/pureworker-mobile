import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

  return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
};

export const markAsRead = async (messageId: string): Promise<number> => {
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

  console.log(response.data);
  //   return response?.data?.chats?.[0]?.chatsWithUnreadMessages;
  //   {"chats": [{"chatsWithUnreadMessages": 3}], "status": "success"}
};
