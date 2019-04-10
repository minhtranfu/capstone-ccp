import axios from "axios";
import StatusAction from "../redux/actions/status";
import { logOut } from "../redux/actions/auth";
import { AsyncStorage } from "react-native";
import { goToLogin } from "../Utils/Helpers";

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
        if (token !== null && token) {
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
    error => {
      // Do something with response error
      const originalRequest = error.config;
      if (error.response) {
        switch (error.response.status) {
          case 401:
            config.store.dispatch(
              StatusAction.error(401, error.response.data.message, Date.now())
            );
            config.store.dispatch(logOut());
            //goToLogin();
            break;
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
          StatusAction.error("Eror", "Network timeout", Date.now())
        );
      } else {
        console.log("Error", error.message);
      }
      return Promise.reject(error);
    }
  );
}
