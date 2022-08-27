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
  0: (state) => {
    return {
      ...state,
      userName: 'UserName'
    }
  }
}

const persistConfig = {
  key: 'root',
  storage,
  migrate: createMigrate(migrations, {debug: true})
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
 
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          serializableCheck: false,
      }),
});