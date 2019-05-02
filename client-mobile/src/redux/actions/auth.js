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
      await AsyncStorage.setItem(
        "userRefreshToken",
        res.data.tokenWrapper.refreshToken
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
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRefreshToken");
    dispatch({
      type: Actions.LOGOUT_SUCCESS,
      payload: { signIn: false }
    });
  };
}

export function register(user) {
  return async dispatch => {
    const res = await axios.post("authen/register", user);

    dispatch({
      type: Actions.REGISTER.SUCCESS,
      payload: res
    });
  };
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
