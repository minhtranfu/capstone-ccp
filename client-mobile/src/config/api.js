import axios from "axios";
import StatusAction from "../redux/actions/status";
import { logOut, updateToken } from "../redux/actions/auth";
import { AsyncStorage } from "react-native";
import { goToLogin } from "../Utils/Helpers";
import i18n from "i18n-js";
import { en, vn } from "./translation";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

const refresh = axios.create();
let isRefreshing = false;
let requestQueue = [];

export default async function configAPI(config) {
  axios.defaults.baseURL = "http://35.198.233.204:8080/api/";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  const processQueue = (error, token = null) => {
    requestQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    requestQueue = [];
  };

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
            if (!originalRequest._retry) {
              if (isRefreshing) {
                console.log("test");
                return new Promise((resolve, reject) => {
                  requestQueue.push({ resolve, reject });
                })
                  .then(token => {
                    axios.defaults.headers.common[
                      "Authorization"
                    ] = `Bearer ${token}`;
                    originalRequest.headers[
                      "Authorization"
                    ] = `Bearer ${token}`;
                    return axios(originalRequest);
                  })
                  .catch(err => err);
              }
              originalRequest._retry = true;
              isRefreshing = true;
              const refreshToken = await AsyncStorage.getItem(
                "userRefreshToken"
              );
              console.log(refreshToken);
              return new Promise((resolve, reject) => {
                fetch(`http://35.198.233.204:8080/api/authen/refresh`, {
                  headers: {
                    "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({ refreshToken })
                })
                  .then(res => res.json())
                  .then(async data => {
                    console.log(data);
                    const userToken = data.tokenWrapper.accessToken;
                    await AsyncStorage.setItem("userToken", userToken);
                    axios.defaults.headers.common[
                      "Authorization"
                    ] = `Bearer ${userToken}`;
                    originalRequest.headers[
                      "Authorization"
                    ] = `Bearer ${userToken}`;
                    resolve(axios(originalRequest));
                    processQueue(null, userToken);
                  })
                  .catch(async error => {
                    console.log("foacker", error);
                    config.store.dispatch(
                      StatusAction.error(
                        401,
                        "Session has expired. Please login again!!",
                        Date.now()
                      )
                    );
                    delete config.headers.Authorization;
                    config.store.dispatch(logOut());
                    processQueue(err, null);
                    reject(err);
                  })
                  .then(() => {
                    isRefreshing = false;
                  });
              });
            }
            return Promise.reject(error);
          //break;
          case 403:
            config.store.dispatch(
              StatusAction.error(403, "Wrong username or password", Date.now())
            );
            //config.store.dispatch(logOut());
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
