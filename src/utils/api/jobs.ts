import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {GLOBAL_API_BASE_URL} from '../../constants/api';

const API_BASE_URL = GLOBAL_API_BASE_URL;
export const getAlljobs = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getAlljobs func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/jobs`,
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

export const getSingleJob = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getSingleJob func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/jobs/${param}`,
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

export const createJobs = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('createJobs func started', param);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/ordern/jobs`,
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

export const deleteJob = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('deleteJob func started', param);
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/ordern/jobs/${param}`,
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

export const updateJob = async (id: any, param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('updateJob func started', param);
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/jobs/${id}`,
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
