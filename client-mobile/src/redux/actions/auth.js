import * as Actions from "../types";
import { AsyncStorage } from "react-native";
import axios from "axios";

export function logIn(user) {
  return async dispatch => {
    // await AsyncStorage.setItem("userToken", user.email);
    const res = await axios.post("authen", user);
    if (res) {
      await AsyncStorage.setItem(
        "userToken",
        res.data.tokenWrapper.accessToken
      );
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: {
          signIn: true,
          data: res,
          token: res.data.tokenWrapper.accessToken
        }
      });
    } else {
      console.log("error");
    }
  };
}

export function logOut() {
  return async dispatch => {
    AsyncStorage.removeItem("userToken");
    dispatch({
      type: Actions.LOGOUT_SUCCESS,
      payload: { signIn: false }
    });
  };
}

export function register(user) {
  return axios.post("register", user);
}

export function isSignedIn() {
  return async dispatch => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: { signIn: true }
      });
    } else {
      dispatch({
        type: Actions.LOGIN_SUCCESS,
        payload: { signIn: false }
      });
    }
  };
}
