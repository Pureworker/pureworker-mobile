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
  chatList: [],
  unreadChats: 0,
  unreadNotification: 0,
  chatData: [],
  notifications: [],
  viewedNotifications: [],
  faq: [],
  closeProvider: [],
  portfolio: {},
  portfolio2: [],
  portfolio3: {},
  supportUser: null,
  banks: [],
  welcomeModal: false,
  serviceProviderData: {},
  liveTest: false,
  providerLocation: {},
  privacyPolicy: [],
  anyratings: [],
  spratings: [],
  providerintrackOrders: [],
  viewOrder: {},

  //provider-profileID
  provider_id: null,

  //purecoins
  purecoins: null,
  purecoinsHistory: [],

  allJobPosts: [],
  allservices: [],
  viewJobPost: null,

  formStage: 1,
  referralDetails: null,
  language: null,
  country: null,
  interOrder: null,
  chatPageUser: null,
  idcheckModal: false,
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
      state.profileData = null;
      state.completeProfileData = {
        services: [],
      };
      state.pickedServices = [];
      state.chatData = [];
      state.unreadChats = 0;
      state.unreadNotification = 0;
      state.chatList = [];
      state.notifications = [];
      state.pickedServicesId = [];
      state.subcategory = [];
      state.popularServices = [];
      state.transactions = [];
      state.providerOrders = [];
      state.formStage = 1;
      state.serviceView = null;
      state.banks = [];
      state.providerintrackOrders = [];
      state.interOrder = null;
    },

    logout: state => {
      state.isLoggedIn = null;
      state.userData = null;
      state.profileData = null;
      state.completeProfileData = {
        services: [],
      };
      state.pickedServices = [];
      state.chatData = [];
      state.chatList = [];
      state.notifications = [];
      state.pickedServicesId = [];
      state.subcategory = [];
      state.popularServices = [];
      state.transactions = [];
      state.providerOrders = [];
      state.formStage = 1;
      state.serviceView = null;
      state.banks = [];
      state.bookMarkedProviders = [];
      state.privacyPolicy = [];
      state.anyratings = [];
      state.providerintrackOrders = [];
      state.isNetwork = true;
      state.language = null;
      state.country = null;
      state.interOrder = null;
    },

    addCategory: (state, action) => {
      let text = [];
      let text2 = [];
      text.push(...state.pickedServices, action.payload);
      text2.push(...state.pickedServicesId, action.payload._id);
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
      const idToRemove = action.payload._id;

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
    setallServices: (state, action) => {
      state.allservices = action.payload;
    },
    addProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    updateUnreadChat: (state, action) => {
      state.unreadChats = action.payload;
    },
    updateUnreadNotification: (state, action) => {
      state.unreadNotification = action.payload;
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
    addchatList: (state, action) => {
      state.chatList = action.payload;
    },
    addchatData: (state, action) => {
      state.chatData = action.payload;
    },
    addnotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addviewedNotifications: (state, action) => {
      state.viewedNotifications = action.payload;
    },
    addfaq: (state, action) => {
      state.faq = action.payload;
    },
    addcloseProvider: (state, action) => {
      state.closeProvider = action.payload;
    },
    addprovider_id: (state, action) => {
      state.provider_id = action.payload;
    },
    addportfolio: (state, action) => {
      state.portfolio3 = action.payload;
    },
    addformStage: (state, action) => {
      state.formStage = action.payload;
    },
    addReferralDetails: (state, action) => {
      state.referralDetails = action.payload;
    },
    addsupportUser: (state, action) => {
      // console.log('addsupportUser', action.payload);
      state.supportUser = action.payload;
    },
    addbanks: (state, action) => {
      console.log('addbanks', action.payload);
      state.banks = action.payload;
    },
    setwelcomeModal: (state, action) => {
      state.welcomeModal = action.payload;
    },
    setserviceProviderData: (state, action) => {
      state.serviceProviderData = action.payload;
    },
    setliveTest: (state, action) => {
      state.liveTest = action.payload;
    },
    setbookMarkedProviders: (state, action) => {
      state.bookMarkedProviders = action.payload;
    },
    setProviderLocation: (state, action) => {
      state.providerLocation = action.payload;
    },

    addPrivacyPolicy: (state, action) => {
      state.privacyPolicy = action.payload;
    },
    addContentRating: (state, action) => {
      state.anyratings = action.payload;
    },
    addSPRating: (state, action) => {
      state.spratings = action.payload;
    },
    addProviderInTrackOrder: (state, action) => {
      state.providerintrackOrders = action.payload;
    },
    addViewOrder: (state, action) => {
      state.viewOrder = action.payload;
    },
    addIsNetwork: (state, action) => {
      state.isNetwork = action.payload;
    },

    addlanguage: (state, action) => {
      state.language = action.payload;
    },
    addCountry: (state, action) => {
      state.country = action.payload;
    },

    addIntermediateOrder: (state, action) => {
      state.interOrder = action.payload;
    },
    addchatPageUser: (state, action) => {
      state.chatPageUser = action.payload;
    },
    setidCheckModal: (state, action) => {
      state.idcheckModal = action.payload;
    },

    //pureworker coins
    setPurecoins: (state, action) => {
      state.purecoins = action.payload;
    },
    setPurecoinsHistory: (state, action) => {
      state.purecoinsHistory = action.payload;
    },
    setallJobPosts: (state, action) => {
      state.allJobPosts = action.payload;
    },
    setviewJobPost: (state, action) => {
      state.viewJobPost = action.payload;
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
  addchatList,
  addchatData,
  addnotifications,
  addviewedNotifications,
  addfaq,
  addcloseProvider,
  addprovider_id,
  addportfolio,
  addformStage,
  addReferralDetails,
  addsupportUser,
  addbanks,
  setwelcomeModal,
  setserviceProviderData,
  setbookMarkedProviders,
  updateUnreadChat,
  updateUnreadNotification,
  setProviderLocation,
  addPrivacyPolicy,
  addContentRating,
  addSPRating,
  addProviderInTrackOrder,
  addViewOrder,
  addIsNetwork,
  addlanguage,
  addCountry,
  addIntermediateOrder,
  addchatPageUser,
  setidCheckModal,
  setPurecoins,
  setPurecoinsHistory,
  setallJobPosts,
  setallServices,
  setviewJobPost
} = mainSlice.actions;

export default mainReducer = persistReducer(persistConfig, mainSlice.reducer);
