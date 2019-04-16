import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStateSyncMiddleware } from 'redux-state-sync';

import rootReducer from '../reducers/root-reducer';
import { authActionTypes, materialCartActionTypes } from "Redux/_types";

/**
 * Development Redux store
 * @param  {object} initialState    Initial state of the Redux store
 * @return {object}                 Redux store
 */
export default function configureStore (initialState) {

  const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['materialCart'],
  };

  const pReducer = persistReducer(persistConfig, rootReducer);

  const stateSync = createStateSyncMiddleware({
    whitelist: [
      ...Object.values(authActionTypes),
      ...Object.values(materialCartActionTypes),
    ],
  });

  const store = createStore(
    pReducer,
    initialState,
    applyMiddleware(thunk, logger, stateSync)
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
