import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root-reducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * TODO:
 * LOGGER IN PROD FOR DEMOS ONLY!
 * REMOVE THIS IMPORT AND THE MIDDLEWARE BEFORE GOING LIVE!
 */
// import logger from 'redux-logger';

/**
 * Production Redux store
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
    applyMiddleware(thunk) // USE ME FOR PROD!
    // applyMiddleware(thunk, logger) // DON'T USE ME FOR PROD!
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
