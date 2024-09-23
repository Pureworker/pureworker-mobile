import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {GLOBAL_API_BASE_URL} from '../../constants/api';

const API_BASE_URL = GLOBAL_API_BASE_URL;
export const getPurecoinStatus = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getPopularService func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/coin/get-coin-status`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
    }
    console.log(response?.data);
    return response;
  } catch (error: any) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const getPurecoinHistory = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getPurecoinHistory func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/coin/get-coin-history`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
    }
    console.log(response?.data);
    return response;
  } catch (error: any) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const claimCoins = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('claimCoins func started', param);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/coin/add-coins`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });
    if (response?.status === 201 || response?.status === 200) {
    }
    console.log(response?.data);
    return response;
  } catch (error: any) {
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
