import axios from "axios";
import StatusAction from "../redux/actions/status";
import { logOut } from "../redux/actions/auth";
import { AsyncStorage } from "react-native";
import { goToLogin } from "../Utils/Helpers";
import i18n from "i18n-js";
import { en, vn } from "./translation";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

let isAlreadyFetchingAccessToken = false;
const refresh = axios.create();

export default async function configAPI(config) {
  axios.defaults.baseURL = "http://35.198.233.204:8080/api/";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.request.use(
    async config => {
      if (
        config.baseURL === "http://35.198.233.204:8080/api/" &&
        !config.headers.Authorization
      ) {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }
      }

      return config;
    },
    error => Promise.reject(error)
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      // Do something with response error
      const originalRequest = error.config;
      //console.log("origin", originalRequest._retry);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            if (!isAlreadyFetchingAccessToken) {
              isAlreadyFetchingAccessToken = true;
              const refreshToken = await AsyncStorage.getItem(
                "userRefreshToken"
              );
              return refresh
                .post(`authen/refresh`, { refreshToken })
                .then(async response => {
                  await AsyncStorage.setItem(
                    "userToken",
                    response.data.tokenWrapper.accessToken
                  );
                  axios.defaults.headers.common["Authorization"] = `Bearer ${
                    response.data.tokenWrapper.accessToken
                  }`;
                  originalRequest.headers["Authorization"] = `Bearer ${
                    response.data.tokenWrapper.accessToken
                  }`;
                  isAlreadyFetchingAccessToken = false;
                  return axios(originalRequest);
                })
                .catch(error => {
                  console.log("foacker", error);
                  config.store.dispatch(
                    StatusAction.error(
                      401,
                      "Session has expired. Please login again!!",
                      Date.now()
                    )
                  );
                  config.store.dispatch(logOut());
                });
            }
            return Promise.reject(error);
          // break;
          case 403:
            config.store.dispatch(
              StatusAction.error(401, "Wrong username or password", Date.now())
            );
            config.store.dispatch(logOut());
            //goToLogin();
            break;
          case 400:
            console.log(error.response);
            config.store.dispatch(
              StatusAction.error(400, error.response.data.message, Date.now())
            );
            break;
          case 404:
            console.log(error.response.data.message);
            config.store.dispatch(
              StatusAction.error(404, "404 nono", Date.now())
            );
            break;
          case 500:
            console.log(error.response.data);
            config.store.dispatch(
              StatusAction.error(500, "500 error", Date.now())
            );
            break;
          default:
            return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Network timeout");
        config.store.dispatch(
          StatusAction.error("Error", "Network timeout", Date.now())
        );
      } else {
        console.log("Error", error.message);
      }
      return Promise.reject(error);
    }
  );

  //Config for i18n
  i18n.fallbacks = true;
  i18n.defaultLocale = "en";
  // i18n.locale = "vn";
  i18n.translations = { en, vn };
}
