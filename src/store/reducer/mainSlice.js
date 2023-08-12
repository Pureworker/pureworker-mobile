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

  //frontend Temporary data
  serviceView: null,
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
    },

    logout: state => {
      state.isLoggedIn = null;
    },

    addCategory: (state, action) => {
      let text = [];
      text.push(...state.category, action.payload);
      state.category = [...text];
    },

    emptyCategory: state => {
      state.category = [];
    },

    removeCategory: (state, action) => {
      var arr = state.category.filter(text => text !== action.payload);
      state.category = arr;
    },
    addserviceView: (state, action) => {
      var arr = state.category.filter(text => text !== action.payload);
      state.category = arr;
    },
  },
});

export const {loggedIn, logout, addCategory, removeCategory, emptyCategory} =
  mainSlice.actions;

export default mainReducer = persistReducer(persistConfig, mainSlice.reducer);
