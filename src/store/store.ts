import { configureStore } from '@reduxjs/toolkit'
import { api } from './slice/api'
import mainReducer from './reducer/mainSlice'
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'

export const store = configureStore({
    
    reducer : {
        user: mainReducer,
        [api.reducerPath]: api.reducer
    },
    middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
        
    })
    .concat(api.middleware),
})

export const persistor = persistStore(store)