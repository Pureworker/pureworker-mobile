import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from '../reducer/mainSlice';
import { store } from '../store'
import { BASE_URL } from './baseurl'
import { isJwtExpired } from 'jwt-check-expiration';
import Snackbar from 'react-native-snackbar';

// console.log('url', BASE_URL);

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    //prepare headers work need to be done
    prepareHeaders : async (headers, {getState}) => {
      try{
        const user = store.getState().user.isLoggedIn
        const isLogin = isJwtExpired(user && user?.token)
        // store.dispatch(createApi.util.resetApiState())
        if (!isLogin) {
          headers.set('Authorization', `Bearer ${user?.token}`)
        } else {
          store.dispatch(logout())
          Snackbar.show({
            text: 'Token has expried please login again', duration: Snackbar.LENGTH_LONG, backgroundColor: '#88087B',
          });
          headers.set('authorization', '')
        }
      } catch(err) {
        headers.set('authorization', '')
      }
      return headers
    },
   }),
  endpoints: () => ({}),
  tagTypes: [
    'User',
    'Favorite'
  ],
})