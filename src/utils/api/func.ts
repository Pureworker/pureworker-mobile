import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../../store/store';
import {
  addUserData,
  addbanks,
  addprovidersByCateegory,
  addsupportUser,
} from '../../store/reducer/mainSlice';
// const API_BASE_URL = 'https://pureworker.onrender.com';
// const API_BASE_URL = 'http://167.86.66.12/api';
// const API_BASE_URL = 'https://pureworker-3482.onrender.com/api';
const API_BASE_URL = 'https://api.pureworker.com/api';
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
      url: `${API_BASE_URL}/provider/get-profile/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
      if (response?.data?.user) {
        store.dispatch(addUserData(response?.data?.user));
      }
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
      url: `${API_BASE_URL}/service/get-all-categories`,
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
      url: `${API_BASE_URL}/service/get-category/${param}`,
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
      url: `${API_BASE_URL}/service/get-popular-services`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      // console.log('response data:', response?.data);
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
  formData.append('folder', 'profile');
  console.log('uploadAssetsDOCorIMG started', param, formData, AuthToken);
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
    console.log(error, error?.response, error?.response?.data);
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
  console.log(AuthToken);

  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/provider/create-profile`,
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
    console.log(error, error?.response?.data, param);
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

export const getProviderByService = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderByService func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-provider-by-service/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
      store.dispatch(addprovidersByCateegory(response?.data?.data));
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

export const getProviderByCategory = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderByCategory func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-provider-by-category/${param}`,
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
export const getProviderAllReview = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderAllReview func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-all-reviews/${param}`,
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

export const createOrder = async (param: any) => {
  console.log('createOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/ordern/create`,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const acceptOrder = async (param: any) => {
  console.log('acceptOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/accept-order/${param}`,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const onMYOrder = async (param: any) => {
  console.log('onMYOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/track-order/${param}`,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const startOrder = async (param: any) => {
  console.log('startOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/inprogress-order/${param}`,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

// export const acceptOrder = async (param: any, data: any) => {
//   console.log('acceptOrder func started', param);
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   try {
//     const response = await axios({
//       method: 'patch',
//       url: `${API_BASE_URL}/ordern/accept-order/${param}`,
//       data: data,
//       headers: {
//         Authorization: `Bearer ${AuthToken}`,
//       },
//     });
//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response?.data);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };

export const cancelOrder = async (param: any, data: any) => {
  console.log('cancelOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/cancel-order/${param}`,
      data: data,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const completedOrder = async (param: any, data: any) => {
  console.log('completedOrder func started', param, data);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/complete-order/${param}`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
      data: data,
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

export const completedOrderProvider = async (param: any, data: any) => {
  console.log('completedOrderProvider func started', param, data);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/complete-order/${param}`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
      data: data,
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

// export const updateOrder = async (param: any, data: any) => {
//   console.log('updateOrder func started', param);
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   try {
//     const response = await axios({
//       method: 'patch',
//       url: `${API_BASE_URL}/order/${param}`,
//       data: data,
//       headers: {
//         Authorization: `Bearer ${AuthToken}`,
//       },
//     });

//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response?.data);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };
// export const updateStatusOrder = async (param: any, data: any) => {
//   console.log('updateStatusOrder func started', param, data);
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   try {
//     const response = await axios({
//       method: 'patch',
//       url: `${API_BASE_URL}/order/status/${param}/${data}`,
//       headers: {
//         Authorization: `Bearer ${AuthToken}`,
//       },
//     });

//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response?.data);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };
export const addFeedbackOrder = async (param: any, data: any) => {
  console.log('addFeedbackOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/ordern/add-feedback/${param}`,
      data: data,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const addRatingOrder = async (param: any, data: any) => {
  console.log('addRatingOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/add-Rating/${param}`,
      data: data,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const getUserOrders = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getUserOrders func started', param, AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/customer-orders`,
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
export const getProviderOrders = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderOrders func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/provider-orders`,
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

// export const getProviderJobs = async (param: any) => {
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   console.log('getProviderJobs func started', param);
//   try {
//     const response = await axios({
//       method: 'get',
//       url: `${API_BASE_URL}/order/provider-orders/${param}/?status=COMPLETED`,
//       headers: {Authorization: `Bearer ${AuthToken}`},
//     });
//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response?.data);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };

export const addPushToken = async (param: any) => {
  console.log('addPushToken func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');

  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/user/me`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });

    if (response.status === 200) {
      console.log('response data:', response?.data);
    }
    console.log('response', response);
    return response;
  } catch (error) {
    console.log('addPushToken', error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};
export const updateProfilePic2 = async (param: any) => {
  console.log('updateProfilePic2 started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/user/profile-picture`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
      data: {uri: `${param}`},
    });

    if (response.status === 201) {
      console.log('updateAssets res data:', response?.data);
    }
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
export const updateUserData = async (param: any) => {
  console.log('updateUserData started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/user/me`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
      data: param,
      // {uri: `${param}`},
    });

    if (response.status === 201) {
      console.log('updateUserData res data:', response?.data);
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
//chats
export const getChatsbyuser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getChatsbyuser func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/chats`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log('res', response);
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

export const getMessagesbyuser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getMessagesbyuser func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/messages/${param}`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (response.status === 201) {
      console.log('response data:', response?.data, response?.data[0]);
    }
    console.log('res', response, response?.data);
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

export const getUserNotification = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getUserNotification func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-all-notifications`,
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

//orders
export const sendPrivateFeedback = async (param: any, data: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('sendPrivateFeedback func started', param, data);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/ordern/add-feedback/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: data,
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
// export const sendRatings = async (param: any, data: any) => {
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   console.log('sendRatings func started', param, data);
//   try {
//     const response = await axios({
//       method: 'patch',
//       url: `${API_BASE_URL}/order/add-rating/${param}`,
//       headers: {Authorization: `Bearer ${AuthToken}`},
//       data: data,
//     });
//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response?.data);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };

export const getFAQ = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getFAQ func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-faq`,
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

export const getProviderByProximity = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderByProximity func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-provider-by-proximity`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response.status === 201) {
      console.log('response data:', response?.data);
    }
    console.log('GETPROVIDERBYPROXIMITY', response?.data);
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
export const tipProvider = async (data: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('tipProvider func started', data);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/ordern/tip-provider`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: data,
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

export const f_deactivateAccount = async (data: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('f_deactivateAccount func started', data);
  try {
    const response = await axios({
      method: 'post',
      // url: `${API_BASE_URL}/admin/change-active-status`,
      url: `${API_BASE_URL}/admin/change-active-status`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: data,
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

export const _verifyID = async (data: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('verifyID func started', data);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/provider/verify-business-identity`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: data,
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

export const getReferralDetails = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getReferralDetails func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/user/referral`,
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

export const deleteAccount = async () => {
  // console.log('deleteAccount func started');
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/user/delete-account`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (
      response.status === 201 ||
      response.status === 200 ||
      response.status === 204
    ) {
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

export const _deactivateAccount = async (data: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('f_deactivateAccount func started', data);
  try {
    const response = await axios({
      method: 'patch',
      // url: `${API_BASE_URL}/admin/change-active-status`,
      url: `${API_BASE_URL}/user/deactivate-account`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      // data: data,
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
export const getSupportUser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getSupportUser func started', AuthToken);

  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-support-user`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response.status === 201 || response.status === 200) {
      console.log('response data:', response?.data);
      store.dispatch(addsupportUser(response?.data?.data));
    }
    //   console.log("res", response);
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

export const getBanks = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getBanks func started', AuthToken);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/transaction/get-banks-from-flutterwave`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response.status === 201 || response.status === 200) {
      // console.log('Banks data:', response?.data);

      store.dispatch(addbanks(response?.data?.data));
    }
    //   console.log("res", response);
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

export const withdraw = async (param: any) => {
  console.log('withdraw func started');
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      // url: `${API_BASE_URL}/transaction/pay-provider`,
      url: `${API_BASE_URL}/transaction/flutterwave-withdrawal`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
      data: param,
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

export const getSearchQuery = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getSearchQuery func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/service/get-all-services?name=${param}`,
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

export const getSearchProvider = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log(
    'getSearchQuery func started',
    param,
    `provider/get-providers?name=${param}`,
  );
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-providers?name=${param}`,
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

export const addPortfolio = async (param: any) => {
  console.log('addPortfolio func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log(AuthToken);

  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/provider/add-portfolio`,
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
    console.log(error, error?.response?.data, param);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const getProviderNew = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderNew func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-profile/${param}`,
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

export const fetchAccountDetails = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('fetchAccountDetails func started', param);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/transaction/fetch-account-details`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });
    if (response.status === 201 || response.status === 200) {
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

// export const fetchAccountDetails = async (param: any) => {
//   console.log('fetchAccountDetails func started', param);
//   const AuthToken = await AsyncStorage.getItem('AuthToken');
//   console.log(AuthToken);
//   try {
//     const response = await axios({
//       method: 'get',
//       url: `${API_BASE_URL}/transaction/fetch-account-details`,
//       data: param,
//       headers: {Authorization: `Bearer ${AuthToken}`},
//     });

//     if (response.status === 201) {
//       console.log('response data:', response?.data);
//     }
//     console.log(response?.data);
//     return response;
//   } catch (error) {
//     console.log(error, error?.response, error?.response?.data, param);
//     return {
//       status: 400,
//       err: error,
//       error: error?.response?.data,
//     };
//   }
// };

export const getProviderDataAll = async (param: any) => {
  console.log('getProviderDataAll func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-provider-detail-by-service/${param?.providerID}/${param?.serviceID}`,
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
    console.log(error, error?.response?.data);
    return {
      status: 400,
      err: error,
      error: error?.response?.data,
    };
  }
};

export const bookMarkServiceProvide = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('bookMarkServiceProvide func started', param);
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/user/bookmark`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });
    if (response.status === 201 || response.status === 200) {
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
