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
import ShowAlert from "./src/Utils/Alert";
import ShowToast from "./src/components/Toast";

const config = configureStorage();
configAPI(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: {}
    };
    firebase.initializeApp(firebaseConfig);
    this.onLogin();
  }
  componentDidMount() {
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

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
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
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
    console.log(this.state.notification.origin);
    console.log(JSON.stringify(this.state.notification.data));

    return (
      <Provider store={config.store}>
        <PersistGate loading={<Loading />} persistor={config.persistor}>
          <AppNavigator />
          {this.state.notification.data ? (
            <ShowToast message={this.state.notification.data.content} />
          ) : null}
          <ShowAlert />
        </PersistGate>
      </Provider>
    );
  }
}
