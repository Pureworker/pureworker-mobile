import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'https://pureworker.onrender.com';

//
export const getUser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('verifyUser func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/user/me`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response?.data);
    return response;
  } catch (error) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const getCategory = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getCategory func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-all-categories`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response?.data);
    return response;
  } catch (error) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const getSubCategory = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getSubCategory func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-category/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response?.data);
    return response;
  } catch (error) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const getPopularService = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getPopularService func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-popular-services`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response?.data);
    return response;
  } catch (error) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
