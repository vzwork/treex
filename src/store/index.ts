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
import createMigrate from 'redux-persist/es/createMigrate'

const rootReducer = combineReducers({
  treeReducer,
  profileReducer
})

const migrations = {
  2: state => {
    return {
      ...state,
      treeReducer: {
        file: ''
      }
    }
  }
}

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  migrate: createMigrate(migrations)
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