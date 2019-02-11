import React from "react";
import AppNavigator from "./src/config/navigator";
import { Provider } from "react-redux";
import configureStorage from "./src/config/store";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./src/components/Loading";
import "./src/config/api";

const config = configureStorage();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={config.store}>
        <PersistGate loading={<Loading />} persistor={config.persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
