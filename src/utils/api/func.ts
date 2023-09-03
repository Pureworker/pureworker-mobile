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
export const getProfile = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProfile func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/profile/get-profile/${param}`,
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

export const uploadAssetsDOCorIMG = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  const formData = new FormData();
  formData.append('profile-picture', {
    uri: param.uri,
    type: param.type, // Adjust the MIME type based on your image type
    name: 'profile-picture',
    fieldname: 'profile-picture',
    // name: param.name || param?.fileName, // Adjust the filename as needed
  });
  console.log('uploadAssetsDOCorIMG started', param, formData);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
        'Content-Type': 'multipart/form-data',
        
      },
    });

    if (response.status === 201) {
      console.log('uploadAssetsDOCorIMG', response?.data);
    }
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

export const completeProfile = async (param: any) => {
  console.log('completeProfile func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/profile/create-profile`,
      data: param,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response?.data);
    return response;
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const getTransactions = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getTransactions func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/transaction/get-transactions/${param}`,
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