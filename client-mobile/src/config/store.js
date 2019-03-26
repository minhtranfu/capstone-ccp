import { createStore, applyMiddleware, compose } from "redux";
import { AsyncStorage } from "react-native";
import rootReducer from "../redux/reducers";
import thunkMiddleWare from "redux-thunk";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["status", "transaction", "equipment", "upload", "debris"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState, reducer = rootReducer) {
  let store = applyMiddleware(thunkMiddleWare, logger)(createStore)(
    persistedReducer,
    initialState
  );
  let persistor = persistStore(store);

  return { store, persistor };
}
