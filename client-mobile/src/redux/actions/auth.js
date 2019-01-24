import * as Actions from "../types";
import { AsyncStorage } from "react-native";

const user = {
  email: "a@gmail.com",
  password: "a"
};

export function logIn() {
  return async dispatch => {
    await AsyncStorage.setItem("userToken", user.email);
    dispatch({
      type: Actions.LOGIN_SUCCESS,
      payload: true
    });
  };
}

export function logOut() {
  return async dispatch => {
    await AsyncStorage.removeItem("userToken");
    dispatch({
      type: Actions.LOGOUT_SUCCESS,
      payload: false
    });
  };
}

export function isSignedIn() {
  return async dispatch => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: true
      });
    } else {
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: false
      });
    }
  };
}
