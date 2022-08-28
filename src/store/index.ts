import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
import treeReducer from './reducers/TreeReducer'
import profileReducer from './reducers/ProfileReducer'

const rootReducer = combineReducers({
  treeReducer,
  profileReducer
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

 
const persistedReducer = persistReducer(persistConfig, rootReducer)
 
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});