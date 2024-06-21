import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../../store/store';
import {
  addProviderInTrackOrder,
  addReferralDetails,
  addUserData,
  addbanks,
  addchatList,
  addcustomerOrders,
  addprovidersByCateegory,
  addsupportUser,
  logout,
} from '../../store/reducer/mainSlice';
import {GLOBAL_API_BASE_URL} from '../../constants/api';
const API_BASE_URL = GLOBAL_API_BASE_URL;
export const getUser = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getUser func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/user/me`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('GET_USER', response?.status);
    }
    if (response?.status === 401) {
      store.dispatch(logout());
    }
    console.log('GET_USER:', response?.data);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProfile', response?.status);
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
  console.log('getCategory func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/service/get-all-categories`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getCategory:', response?.status);
    }
    console.log('getCategory:', response?.status);
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
  // console.log('getSubCategory func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/service/get-category/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getSubCategory', response?.status);
    }

    console.log('getSubCategory:', response?.status);
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
  console.log('getPopularService func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/service/get-popular-services`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
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
export const uploadAssetsDOCorIMG = async (
  param: any,
  formDataKey = 'profile-picture',
) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  const formData = new FormData();
  formData.append(formDataKey, {
    uri: param.uri,
    type: param.type, // Adjust the MIME type based on your image type
    name: param?.name ? param?.name : 'profile-picture',
    fieldname: formDataKey,
  });
  formData.append('folder', 'profile');
  if (param.section && param.section === 'chat') {
    formData.append('chat', true);
  }
  console.log('uploadAssetsDOCorIMG started', param, formData);
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('uploadAssetsDOCorIMG', response?.data);
    }
    return response;
  } catch (error) {
    console.log(error, error?.response, error?.response?.data);
    console.log(error?.message);
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

    if (response?.status === 201 || response?.status === 200) {
      console.log('completeProfile', response?.status);
    }

    console.log('completeProfile:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('response data:', response?.status, response?.data?.length);
    }
    console.log('getTransactions:', response?.status);
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
  console.log('getProviderByService func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/get-provider-by-service/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderByService', response?.status);
      store.dispatch(addprovidersByCateegory(response?.data?.data));
    }

    console.log('getProviderByService:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderByCategory', response?.status);
    }

    console.log('getProviderByCategory:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderAllReview', response?.status);
    }

    console.log('getProviderAllReview:', response?.status);
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

    if (response?.status === 201 || response?.status === 200) {
      console.log('createOrder', response?.status);
    }

    console.log('createOrder:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('acceptOrder:', response?.status);
    }

    console.log('acceptOrder:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('response data:', response?.data);
    }
    console.log('onMYOrder:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('response data:', response?.data);
    }
    console.log('startOrder:', response?.status);
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
//     if (response?.status === 201 || response?.status === 200) {
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

    if (
      response?.status === 201 ||
      response?.status === 200 ||
      response?.status === 204
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

export const rescheduleOrder = async (param: any, data: any) => {
  console.log('rescheduleOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/update-scheduled-date/${param}`,
      data: data,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201 || response?.status === 200) {
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

export const orderDispute = async (param: any, data: any) => {
  console.log('orderDispute func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/dispute-order/${param}`,
      data: data,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201 || response?.status === 200) {
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

export const declineOrder = async (param: any) => {
  console.log('declineOrder func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/ordern/decline-order/${param}`,
      // data: data,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201 || response?.status === 200) {
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

    if (response?.status === 201 || response?.status === 200) {
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

    if (response?.status === 201 || response?.status === 200) {
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

//     if (response?.status === 201 || response?.status === 200) {
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

//     if (response?.status === 201 || response?.status === 200) {
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

    if (response?.status === 201 || response?.status === 200) {
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
      method: 'post',
      url: `${API_BASE_URL}/ordern/add-Rating/${param}`,
      data: data,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (response?.status === 201 || response?.status === 200) {
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
  console.log('getUserOrders func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/customer-orders`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getUserOrders:', response?.status, response?.data?.length);
      store.dispatch(addcustomerOrders(response?.data?.data));
    }

    console.log('getUserOrders:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log(
        'getProviderOrders',
        response?.status,
        response?.data?.order?.length,
      );
    }

    console.log('getProviderOrders:', response?.status);
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
//     if (response?.status === 201 || response?.status === 200) {
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
  // console.log('addPushToken func started', param);
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
    // console.log('response', response);
    return response;
  } catch (error) {
    // console.log('addPushToken', error, error?.response?.data);
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

    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('updateUserData res data:', response?.data);
    }
    if (response?.status === 401) {
      store.dispatch(logout());
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
      console.log(
        'getChatsbyuser',
        response?.status,
        response?.data?.chats?.length,
      );
    }
    // console.log('res', response);
    console.log('getChatsbyuser:', response?.status);
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
export const getChatsbyuser2 = async (param: any) => {
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
    if (response?.status === 201 || response?.status === 200) {
      store.dispatch(addchatList(response.data.chats));
    }
    // console.log('res', response);
    console.log('getChatsbyuser:', response?.status);
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

    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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
//     if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getFAQ', response?.status);
    }

    console.log('getFAQ', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderByProximity', response?.status);
    }
    console.log(
      'GETPROVIDERBYPROXIMITY:',
      response?.status,
      response?.data?.length,
    );
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
    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('response data:', response?.data);
      store.dispatch(addReferralDetails(response?.data?.data));
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
    if (response?.status === 201 || response?.status === 200) {
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
  console.log('getSupportUser func started');

  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-support-user`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getSupportUser:', response?.status);
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
  console.log('getBanks func started');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/transaction/get-banks-from-flutterwave`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
    if (response?.status === 201 || response?.status === 200) {
      // console.log('Banks data:', response?.data);
      console.log('getBanks', response?.status);

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

    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
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

    if (response?.status === 201 || response?.status === 200) {
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

export const addPortfolio2 = async (param: any) => {
  console.log('addPortfolio2 func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log(AuthToken);

  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/provider/portfolio`,
      data: param,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (response?.status === 201 || response?.status === 200) {
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
    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderNew', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
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

//     if (response?.status === 201 || response?.status === 200) {
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

    if (response?.status === 201 || response?.status === 200) {
      console.log('getProviderDataAll:', response?.status);
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
    if (response?.status === 201 || response?.status === 200) {
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

export const deletebookMarkServiceProvide = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('deletebookMarkServiceProvide func started', param);
  try {
    const response = await axios({
      method: 'patch',
      url: `${API_BASE_URL}/user/delete-bookmark/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      // data: param,
    });
    if (response?.status === 201 || response?.status === 200) {
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

export const getBookMarkedProviders = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getBookMarkedProviders func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/user/bookmarks/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
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

export const deletePortfolio = async (param: any) => {
  console.log('delete Portfolio func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log(AuthToken);

  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/provider/delete-portfolio/${param.portfolioID}/${param.serviceID}`,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (
      response?.status === 201 ||
      response?.status === 200 ||
      response?.status === 204
    ) {
      console.log('deletePortfolio', response?.status);
    }
    console.log('deletePortfolio:', response?.status);
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

export const getProviderLocation = async param => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getProviderLocation func started');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/location/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
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

export const addToWait = async (param: any) => {
  console.log('addToWait func started', param);
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/join-waiting-list`,
      data: param,
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });

    if (response?.status === 201 || response?.status === 200) {
      console.log('addToWait', response?.status);
    }

    console.log('addToWait:', response?.status);
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

export const getContent = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getContent func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/get-content/${param}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getContent', response?.status);
    }
    console.log('getContent:', response?.status);
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

export const InTrackOrders = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('InTrackOrders func started', param);
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/provider-orders/?status=TRACK`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('InTrackOrders', response?.status, response?.data?.data);
      if (response?.data?.data) {
        store.dispatch(addProviderInTrackOrder(response?.data?.data));
      }
    }
    console.log('InTrackOrders:', response?.status);
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

export const triggerComplete = async () => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('triggerComplete func started');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/provider/complete-profile`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('triggerComplete:', response?.status);
    }
    console.log('triggerComplete:', response?.status);
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

export const getOrderDetailbyID = async id => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('getOrderDetailbyID func started');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/ordern/order/${id}`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('getOrderDetailbyID:', response?.status);
    }
    console.log('getOrderDetailbyID:', response?.status);
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

export const triggerPhoneVerification = async id => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('triggerPhoneVerification func started');
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/user/init-phone-verification`,
      headers: {Authorization: `Bearer ${AuthToken}`},
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('triggerPhoneVerification:', response?.status);
    }
    console.log('triggerPhoneVerification:', response?.status);
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

export const verifyPhoneNumber = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('verifyPhoneNumber func started');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/user/verify-phone`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('verifyPhoneNumber:', response?.status);
    }
    console.log('verifyPhoneNumber:', response?.status);
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

export const CreatePin = async (param: any) => {
  const AuthToken = await AsyncStorage.getItem('AuthToken');
  console.log('CreatePin func started');
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/user/create-pin`,
      headers: {Authorization: `Bearer ${AuthToken}`},
      data: param,
    });
    if (response?.status === 201 || response?.status === 200) {
      console.log('CreatePin:', response?.status);
    }
    console.log('CreatePin:', response?.status);
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
