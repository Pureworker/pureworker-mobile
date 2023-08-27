import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'https://pureworker.onrender.com';

//
export const verifyLogin = async (param: any) => {
  console.log('verifyLogin func started', param);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/auth/verify-signin-otp`,
      data: param,
    });
    const storeTokenData = async (res: any) => {
      console.log('responsetoken here lets destructure:', res?.data.token);
      try {
        await AsyncStorage.setItem('AuthToken', res?.data?.token);
        await AsyncStorage.setItem('Role', res?.data?.user.accountType);
      } catch (e) {
        // saving error
        console.log('Error Saving Token data.');
      }
    };
    await storeTokenData(response);
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

export const Signup = async (param: any) => {
  console.log('Signup func started', param);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/auth/sign-up`,
      data: param,
    });

    if (response.status === 201 || response.status === 200) {
      console.log('signUp_success data:', response?.data);
      const storeTokenData = async (res: any) => {
        console.log('responsetoken here lets destructure:', res?.data.token);
        try {
          await AsyncStorage.setItem('AuthToken2', res?.data?.token);
        } catch (e) {
          // saving error
          console.log('Error Saving Token data.');
        }
      };
      await storeTokenData(response);
    }
    console.log('response', response);
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

export const verifyUser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken2');
  console.log('verifyUser func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'post',
      headers: {Authorization: `Bearer ${AuthToken}`},
      url: `${API_BASE_URL}/auth/verify-signup-otp`,
      data: {
        token: param,
      },
    });
    const storeTokenData = async (res: any) => {
      console.log('responsetoken here lets destructure:', res?.data.token);
      try {
        await AsyncStorage.setItem('AuthToken', res?.data?.message?.token);
        await AsyncStorage.setItem('Role', res?.data?.message?.user.accountType);
      } catch (e) {
        // saving error
        console.log('Error Saving Token data.');
      }
    };
    await storeTokenData(response);
    if (response?.status === 201) {
      console.log('otp response data:', response?.data);
    }
    // console.log(response);
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
export const resendOtp = async (param: any) => {
  //param either be verification or reset
  console.log('resendOtp func started');
  const url = `${API_BASE_URL}/auth/resend-otp?type=${param}`;

  const AuthToken = await AsyncStorage.getItem('AuthTokentemp');
  console.log(url, AuthToken);
  try {
    const response = await axios({
      method: 'post',
      // url: 'https://crestbase-be.herokuapp.com/users/verify-user',
      headers: {Authorization: `Bearer ${AuthToken}`},
      url: `${API_BASE_URL}/auth/resend-otp?type=${param}`,
    });

    if (response.status === 201) {
      console.log('otp response data:', response?.data);
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

export const signIn = async (param: any) => {
  console.log('signIn func started');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/auth/log-in`,
      data: {
        email: param.email,
      },
    });
    // const storeTokenData = async (res: any) => {
    //   console.log('responsetoken here lets destructure:', res?.data.token);
    //   try {
    //     await AsyncStorage.setItem('AuthToken', res?.data?.token);
    //     await AsyncStorage.setItem('Role', res?.data?.user.accountType);
    //   } catch (e) {
    //     // saving error
    //     console.log('Error Saving Token data.');
    //   }
    // };
    // await storeTokenData(response);

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

export const forgotPassword = async (param: any) => {
  console.log('forgotpassword func started', param);

  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/auth/forgot-password`,
      data: {
        email: param,
      },
    });

    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response);
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

export const resetPassword = async (param: any) => {
  console.log('forgotpassword func started');

  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/auth/reset-password`,
      data: {
        token: param.token,
        email: param.email,
        password: param.password,
        confirmPassword: param.confirmPassword,
      },
    });

    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log(response);
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
