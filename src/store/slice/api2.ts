import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import { BASE_URL } from './baseurl';
const BASE_URL = 'https://pureworker.onrender.com';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = createApi({
  baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
  endpoints: builder => ({
    getUserData: builder.query({
      query: () => ({
        url: '/user/me', // Update with the actual endpoint to fetch user data
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AsyncStorage.getItem('AuthToken')}`, // Replace with your token source
        },
      }),
    }),
    updateUserData: builder.mutation({
      query: updatedUserData => ({
        url: '/user', // Update with the actual endpoint to update user data
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AsyncStorage.getItem('AuthToken')}`, // Replace with your token source
        },
        body: updatedUserData,
      }),
    }),
    // ... other endpoints ...
  }),
});
export const {useGetUserDataQuery, useUpdateUserDataMutation} = api;
