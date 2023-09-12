import {createSlice} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../services/api';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: [''],
};

const initialState = {
  isLoggedIn: null,
  category: [],
  pickedServices: [],
  pickedServicesId: [],
  subcategory: [],
  popularServices: [],
  completeProfileData: {
    services: [],
  },

  //frontend Temporary data
  serviceView: null,
  //
  userData: null,
  profileData: null,
  editServiceView: null,
  transactions: [],
  categorizedTransdata: {},
  providersByService: [],
  providersByCateegory: [],
  providersReviews: [],
  customerOrders: [],
  providerOrders: [],
};

export const mainSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isLoggedIn = {
        token: action.payload.token,
        userType: action.payload.type,
      };
      state.userData = null;
      state.completeProfileData = {
        services: [],
      };
      state.pickedServices = [];
      state.pickedServicesId = [];
      state.subcategory = [];
      state.popularServices = [];
      state.transactions = [];
      state.providerOrders = [];
    },

    logout: state => {
      state.isLoggedIn = null;
    },

    addCategory: (state, action) => {
      let text = [];
      let text2 = [];
      text.push(...state.pickedServices, action.payload);
      text2.push(...state.pickedServicesId, action.payload.id);
      state.pickedServices = [...text];
      state.pickedServicesId = [...text2];
    },

    emptyCategory: state => {
      state.pickedServices = [];
      state.pickedServicesId = [];
    },

    removeCategory: (state, action) => {
      console.log(action.payload);
      // var arr = state.pickedServices.filter(
      //   text => text !== action.payload,
      // );
      // var arr2 = state.pickedServicesId.filter(
      //   text => text !== action.payload.id,
      // );
      // console.log(action.payload, arr);

      const nameToRemove = action.payload.name;
      const idToRemove = action.payload.id;

      const updatedPickedServices = state.pickedServices.filter(
        text => text.name !== nameToRemove,
      );

      const updatedPickedServicesId = state.pickedServicesId.filter(
        text => text !== idToRemove,
      );

      state.pickedServices = updatedPickedServices;
      state.pickedServicesId = updatedPickedServicesId;
    },
    addserviceView: (state, action) => {
      var arr = state.category.filter(text => text !== action.payload);
      state.category = arr;
    },
    addUserData: (state, action) => {
      state.userData = action.payload;
    },
    addSCategory: (state, action) => {
      state.category = action.payload;
    },
    addSubcategory: (state, action) => {
      state.subcategory = action.payload;
    },
    addPopularServices: (state, action) => {
      state.popularServices = action.payload;
    },
    addProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    // addcompleteProfile: (state, action) => {
    //   var list = {...state.completeProfileData, ...action.payload};
    //   state.completeProfileData = list;
    // },
    addcompleteProfile: (state, action) => {
      const newFields = action.payload;
      state.completeProfileData = {
        ...state.completeProfileData,
        ...newFields,
      };
      console.log('Done', state.completeProfileData);
    },
    addEditServiceView: (state, action) => {
      state.editServiceView = action.payload;
    },
    addTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addcategorizedTransdata: (state, action) => {
      state.categorizedTransdata = action.payload;
    },
    addprovidersByService: (state, action) => {
      state.providersByService = action.payload;
    },
    addprovidersByCateegory: (state, action) => {
      state.providersByCateegory = action.payload;
    },
    addprovidersReviews: (state, action) => {
      state.providersReviews = action.payload;
    },
    addcustomerOrders: (state, action) => {
      state.customerOrders = action.payload;
    },
    addproviderOrders: (state, action) => {
      state.providerOrders = action.payload;
    },
  },
});

export const {
  loggedIn,
  logout,
  addCategory,
  removeCategory,
  emptyCategory,
  addUserData,
  addSCategory,
  addSubcategory,
  addPopularServices,
  addcompleteProfile,
  addProfileData,
  addEditServiceView,
  addTransactions,
  addcategorizedTransdata,
  addprovidersByService,
  addprovidersByCateegory,
  addprovidersReviews,
  addcustomerOrders,
  addproviderOrders,
} = mainSlice.actions;

export default mainReducer = persistReducer(persistConfig, mainSlice.reducer);
