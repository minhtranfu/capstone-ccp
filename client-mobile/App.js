import React from "react";
import AppNavigator from "./src/config/navigator";
import { Provider } from "react-redux";
import configureStorage from "./src/config/store";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./src/components/Loading";
import configAPI from "./src/config/api";
import { Permissions, Notifications } from "expo";
import * as firebase from "firebase";
import { firebaseConfig } from "./src/config/apiKey";

const config = configureStorage();
configAPI(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(firebaseConfig);
    this.onLogin();
    this.registerForPushNotificationsAsync();
  }

  onLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword("namlh@gmail.com", "123456")
      .then(
        (() => {},
        error => {
          console.log(error);
        })
      );
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let uid = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref(`users/${uid}`)
          .update({
            expoPushToken: token
          });
      } else {
        console.log("error");
      }
    });
  };

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
