import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root-reducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * Development Redux store
 * @param  {object} initialState    Initial state of the Redux store
 * @return {object}                 Redux store
 */
export default function configureStore (initialState) {

  const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['materialCart']
  };

  const pReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    pReducer,
    initialState,
    applyMiddleware(thunk, logger)
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
